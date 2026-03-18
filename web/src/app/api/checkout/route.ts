import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp } from "@/utils/rate-limit";
import { validateCsrf } from "@/utils/csrf";
import { checkoutSchema } from "@/lib/validators";
import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe";

// Admin client to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Configurable via env vars, fallback to Asaas defaults
const INTEREST_RATE = Number(process.env.CHECKOUT_INTEREST_RATE || 0.0299); // 2.99% a.m
const DEFAULT_SPLIT_PERCENT = Number(process.env.PLATFORM_SPLIT_PERCENT || 10);

export async function POST(request: Request) {
    // Rate limit: max 5 checkout attempts per minute per IP
    const ip = getClientIp(request);
    const { limited } = await rateLimit(ip, 5);
    if (limited) {
        return NextResponse.json(
            { error: "Muitas tentativas. Tente novamente em 1 minuto." },
            { status: 429, headers: { 'Retry-After': '60' } }
        );
    }

    // CSRF validation
    const csrfError = validateCsrf(request);
    if (csrfError) {
        return NextResponse.json({ error: "Requisição inválida." }, { status: 403 });
    }


    try {
        let rawBody: unknown;
        try {
            rawBody = await request.json();
        } catch {
            return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
        }

        // Zod validation (creditCard and installments become optional for Stripe redirect)
        const parseResult = checkoutSchema.safeParse(rawBody);
        if (!parseResult.success) {
            return NextResponse.json(
                { error: "Dados inválidos.", details: parseResult.error.flatten().fieldErrors },
                { status: 422 }
            );
        }

        const { name, email, phone, password, courseId } = parseResult.data;

        if (!email || !name || !courseId) {
            return NextResponse.json({ error: "Nome, email e courseId são obrigatórios." }, { status: 400 });
        }

        const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";

        // Tracker de Afiliado
        const cookieStore = await cookies();
        const affiliateCode = cookieStore.get("asaas_affiliate_tracker")?.value;

        // 1. Fetch course real data from DB
        const { data: course, error: courseError } = await supabaseAdmin
            .from('courses')
            .select('*, tenants:tenants!tenant_id(name, stripe_account_id, split_percent)')
            .eq('id', courseId)
            .single();

        if (courseError || !course) {
            return NextResponse.json({ error: "Curso não encontrado." }, { status: 404 });
        }

        const tenant = (course as any).tenants;
        const stripeAccountId = tenant?.stripe_account_id;
        const splitPercent = tenant?.split_percent || 10;

        // 2. Create or find user in Supabase Auth
        let userId: string | null = null;
        let stripeCustomerId: string | null = null;

        const { data: existingUserRow } = await supabaseAdmin
            .from('users')
            .select('id, stripe_customer_id')
            .eq('email', email)
            .single();

        if (existingUserRow) {
            userId = existingUserRow.id;
            stripeCustomerId = existingUserRow.stripe_customer_id;
        } else if (password) {
            const { data: newUser, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { full_name: name },
            });
            if (signUpError) {
                return NextResponse.json({ error: "Erro ao criar conta. Tente novamente ou use outro e-mail." }, { status: 400 });
            }
            userId = newUser.user.id;
        }

        // 3. Ensure Stripe Customer exists
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email,
                name,
                metadata: { userId: userId || "" }
            });
            stripeCustomerId = customer.id;
            
            if (userId) {
                await supabaseAdmin.from('users').update({ stripe_customer_id: stripeCustomerId }).eq('id', userId);
            }
        }

        // 4. Ensure Stripe Price exists for this course
        let stripePriceId = course.stripe_price_id;
        if (!stripePriceId) {
            // Create Product and Price on the fly
            const product = await stripe.products.create({
                name: course.title,
                description: course.description || `Curso: ${course.title}`,
                metadata: { courseId: course.id }
            });

            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: Math.round(course.price * 100), // convert to cents
                currency: 'brl',
            });

            stripePriceId = price.id;
            await supabaseAdmin.from('courses').update({ 
                stripe_product_id: product.id,
                stripe_price_id: stripePriceId 
            }).eq('id', course.id);
        }

        // 5. Create PaymentIntent data for Split (if Connect account exists)
        const applicationFeeAmount = stripeAccountId ? Math.round(course.price * 100 * (splitPercent / 100)) : undefined;

        // 6. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            line_items: [
                {
                    price: stripePriceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout/${courseId}?canceled=true`,
            metadata: {
                userId: userId || "",
                courseId: courseId,
                tenantId: course.tenant_id,
                affiliateCode: affiliateCode || "",
            },
            // Connect Split logic:
            // If the teacher has a Connect Account, we transfer the funds to them and keep the fee.
            ...(stripeAccountId ? {
                payment_intent_data: {
                    application_fee_amount: applicationFeeAmount,
                    transfer_data: {
                        destination: stripeAccountId,
                    },
                },
            } : {})
        });

        // 7. Save pending transaction in DB
        if (userId) {
            await supabaseAdmin.from('transactions').insert({
                user_id: userId,
                course_id: courseId,
                amount: course.price,
                status: 'pending',
                stripe_checkout_session_id: session.id, // We'll need this in the webhook
                payment_method: 'stripe',
            });
        }

        return NextResponse.json({
            success: true,
            url: session.url,
        });

    } catch (error: any) {
        console.error("🔴 STRIPE CHECKOUT ERROR:", error);
        return NextResponse.json({ error: error.message || "Erro ao processar pagamento." }, { status: 500 });
    }
}
