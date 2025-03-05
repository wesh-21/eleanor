// Arquivo: app/api/create-payment-intent/route.ts
// (Se estiver usando Next.js 13+ com App Router)

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializar o Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, amount, shippingInfo } = body;

    // Validar a solicitação
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Carrinho inválido' },
        { status: 400 }
      );
    }
    
    // Validar informações de entrega
    if (!shippingInfo || !shippingInfo.name || !shippingInfo.address || !shippingInfo.postalCode) {
      return NextResponse.json(
        { error: 'Informações de entrega inválidas' },
        { status: 400 }
      );
    }

    // Certifique-se de que o valor seja um número válido
    const amountInCents = Math.round(amount * 100);

    // Criar um Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur', // Euro para pagamentos em Portugal
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        order_details: JSON.stringify(
          items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
          }))
        ),
        customer_name: shippingInfo.name,
        customer_email: shippingInfo.email,
        shipping_address: shippingInfo.address,
        postal_code: shippingInfo.postalCode,
        phone: shippingInfo.phone
      },
      shipping: {
        name: shippingInfo.name,
        phone: shippingInfo.phone,
        address: {
          line1: shippingInfo.address,
          postal_code: shippingInfo.postalCode,
          country: 'PT'
        }
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Erro ao criar payment intent:', error);
    return NextResponse.json(
      { error: 'Erro ao processar o pagamento' },
      { status: 500 }
    );
  }
}