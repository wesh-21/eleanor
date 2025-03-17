// app/api/checkout-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
  // Obter o ID do PaymentIntent dos parâmetros da URL
  const searchParams = request.nextUrl.searchParams;
  const paymentIntentId = searchParams.get('payment_intent_id');

  if (!paymentIntentId) {
    return NextResponse.json(
      { error: 'ID do PaymentIntent não fornecido' },
      { status: 400 }
    );
  }

  try {
    // Inicializar Stripe com sua chave secreta
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-02-24.acacia', // Use a versão mais recente disponível
    });

    // Recuperar o PaymentIntent do Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Verificar o status do pagamento
    if (paymentIntent.status === 'succeeded') {
      return NextResponse.json({
        status: 'succeeded',
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        customer_email: paymentIntent.metadata.customerEmail,
        created: paymentIntent.created,
        payment_method: paymentIntent.payment_method
      });
    } else {
      return NextResponse.json({
        status: paymentIntent.status,
        message: 'O pagamento ainda não foi concluído'
      });
    }
  } catch (error: unknown) {
    console.error('Erro ao verificar o status do pagamento:', error);
    
    // Type guard to safely access error properties
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erro ao processar a solicitação';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}