import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Admin client - bypasses RLS for server-to-server webhook
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const WEBHOOK_SECRET = process.env.ASAAS_WEBHOOK_SECRET

export async function POST(request: Request) {
    try {
        // A1 SECURITY: Validate Asaas webhook token
        const token = request.headers.get('asaas-access-token')
        if (WEBHOOK_SECRET && token !== WEBHOOK_SECRET) {
            console.error('[ASAAS WEBHOOK] ⛔ Token inválido ou ausente.')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = await request.json();
        const evento = payload.event;
        const paymentId = payload.payment?.id;
        const netValue = payload.payment?.netValue || payload.payment?.value || 0.00;
        const customerEmail = payload.payment?.customerEmail;

        console.log(`[ASAAS WEBHOOK] Evento: ${evento} | Payment: ${paymentId} | R$${netValue}`)

        if (!paymentId) {
            return NextResponse.json({ error: "No Payment ID provided" }, { status: 400 });
        }

        if (evento === 'PAYMENT_RECEIVED' || evento === 'PAYMENT_CONFIRMED') {
            console.log(`[ASAAS] 🤑 Pagamento Confirmado: ${paymentId} | R$${netValue}`);

            // [MARKETING] Meta Conversions API (CAPI) Server-Side Tracking
            try {
                if (process.env.META_ACCESS_TOKEN && process.env.META_PIXEL_ID) {
                    await sendMetaPurchaseCAPI(customerEmail, netValue);
                    console.log(`[CAPI] ✅ Evento Purchase enviado ao Meta Ads!`);
                }
            } catch (e) {
                console.log(`[CAPI] ⚠️ Falha não-critica ao enviar tracking CAPI`, e);
            }

            // [BACKEND] Find pending transaction and confirm it
            const { data: transaction, error: txError } = await supabaseAdmin
                .from('transactions')
                .select('id, user_id, course_id, status')
                .eq('asaas_payment_id', paymentId)
                .single()

            if (txError || !transaction) {
                console.error('[ASAAS WEBHOOK] Transaction não encontrada:', paymentId, txError)
                // Still return 200 to prevent Asaas from retrying
                return NextResponse.json({ message: "Transaction not found, acknowledged" });
            }

            if (transaction.status === 'confirmed') {
                console.log('[ASAAS WEBHOOK] Transaction já confirmada, ignorando duplicata.')
                return NextResponse.json({ received: true, duplicate: true });
            }

            // Update transaction status
            await supabaseAdmin
                .from('transactions')
                .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
                .eq('id', transaction.id)

            // Create enrollment - give student access to the course
            const { error: enrollError } = await supabaseAdmin
                .from('enrollments')
                .upsert({
                    user_id: transaction.user_id,
                    course_id: transaction.course_id,
                    status: 'active',
                    enrolled_at: new Date().toISOString(),
                }, { onConflict: 'user_id,course_id' })

            if (enrollError) {
                console.error('[ASAAS WEBHOOK] Erro ao criar enrollment:', enrollError)
            } else {
                console.log(`[ASAAS WEBHOOK] ✅ Enrollment criado: user=${transaction.user_id} course=${transaction.course_id}`)

                // [RESEND] Disparar E-mail de Transação Premium c/ Magic Link (se env var existir)
                if (process.env.RESEND_API_KEY && customerEmail) {
                    try {
                        const { Resend } = await import('resend');
                        const resend = new Resend(process.env.RESEND_API_KEY);
                        const { renderWelcomeEmail } = await import('@/utils/marketing/EmailTemplates');

                        // Busca nome do curso pra formatar bonito
                        const { data: courseData } = await supabaseAdmin.from('courses').select('title').eq('id', transaction.course_id).single();
                        // Busca nome do usuario
                        const { data: userData } = await supabaseAdmin.from('users').select('full_name').eq('id', transaction.user_id).single();

                        // Generate Magic Link for frictionless login
                        const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
                            type: 'magiclink',
                            email: customerEmail,
                            options: { redirectTo: 'https://xtage.app/dashboard' }
                        });

                        const htmlBody = await renderWelcomeEmail({
                            studentName: userData?.full_name?.split(' ')[0] || 'Aluno',
                            courseName: courseData?.title || 'Seu novo curso',
                            loginEmail: customerEmail,
                            magicLinkUrl: linkData?.properties?.action_link
                        });

                        await resend.emails.send({
                            from: 'XTAGE <contato@xtage.app>',
                            to: [customerEmail],
                            subject: `✅ Acesso Liberado: ${courseData?.title || 'XTAGE'}`,
                            html: htmlBody
                        });
                        console.log(`[RESEND] E-mail de Acesso enviado com sucesso para ${customerEmail}`);
                    } catch (emailErr) {
                        console.error('[RESEND] Falha não critica ao enviar Email de Acesso', emailErr);
                    }
                }
            }

            return NextResponse.json({ message: "Venda Processada com Sucesso - Acesso Liberado", enrolled: !enrollError });

        } else if (evento === 'PAYMENT_OVERDUE' || evento === 'PAYMENT_DUNNING_RECEIVED') {
            console.log(`[ASAAS] 🟡 Fatura Vencida/Abandonada: ${paymentId}`);

            // Update transaction to overdue
            await supabaseAdmin
                .from('transactions')
                .update({ status: 'overdue' })
                .eq('asaas_payment_id', paymentId)

            // Cart Recovery Email via Resend
            if (customerEmail) {
                try {
                    const { sendCartRecoveryEmail } = await import("@/utils/marketing/CartRecovery");
                    const checkoutBackUrl = payload.payment?.invoiceUrl || 'https://xtage.app/checkout';
                    await sendCartRecoveryEmail(customerEmail, "Dancer", checkoutBackUrl);
                } catch (e) {
                    console.log('[ASAAS WEBHOOK] ⚠️ Cart recovery email fail (non-critical)', e);
                }
            }
            return NextResponse.json({ message: "Lead processado para Recuperação de Carrinho" });

        } else {
            return NextResponse.json({ message: "Evento Ignorado", event: evento });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("🔴 ERRO NO WEBHOOK:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * Meta Conversions API (CAPI) Server-Side Purchase Tracking
 */
async function sendMetaPurchaseCAPI(email: string | undefined, value: number) {
    if (!email) return;

    const crypto = await import('crypto');
    const hashedEmail = crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex');

    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;
    const url = `https://graph.facebook.com/v19.0/${pixelId}/events`;

    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            data: [{
                event_name: 'Purchase',
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                user_data: { em: [hashedEmail] },
                custom_data: { currency: 'BRL', value },
            }],
            access_token: accessToken,
        }),
    });
}
