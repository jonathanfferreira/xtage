import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { ticketType, amount } = await req.json(); // ticketType = 'escola' | 'ingresso'

    // Mock: Encontrar a primeira conta conectada do Stripe no banco
    // (Num cenário real, puxaremos pelo ID do Festival)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .not('stripe_account_id', 'is', null)
      .limit(1);

    const destinationAccountId = profiles?.[0]?.stripe_account_id;

    if (!destinationAccountId) {
      return NextResponse.json({ error: 'Nenhum produtor com conta Stripe conectada encontrado para testar.' }, { status: 400 });
    }

    // Configuração de taxa: 10% (pode vir de variavel de ambiente depois)
    const FEE_PERCENTAGE = 10;
    const applicationFeeAmount = Math.round((amount * FEE_PERCENTAGE) / 100);

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: ticketType === 'escola' ? 'Inscrição Escola - LID 2026' : 'Ingresso Espectador - LID 2026',
              description: 'Compra segura garantida pela XTAGE',
            },
            unit_amount: amount, // Em centavos. R$ 100,00 = 10000
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: destinationAccountId,
        },
      },
      success_url: `${protocol}://${host}/checkout/success`,
      cancel_url: `${protocol}://${host}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
