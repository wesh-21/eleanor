// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

interface CartItem {
  name: string;
  quantity: number;
  price: number;
  // Add other properties your item might have
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, amount, shippingInfo } = body;

    // Inicializar Stripe com sua chave secreta
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-02-24.acacia', // Use a versão mais recente disponível
    });

    // Criar um Customer para associar com este pagamento
    const customer = await stripe.customers.create({
      email: shippingInfo.email,
      name: shippingInfo.name,
      phone: shippingInfo.phone,
      address: {
        line1: shippingInfo.address,
        postal_code: shippingInfo.postalCode,
        country: 'PT',
      },
    });

  // Criar uma lista de descrições de produtos para metadados
  const itemsDescription = items.map((item: CartItem) =>
  `${item.name} (${item.quantity}x €${item.price.toFixed(2)})`
  ).join(', ');

    // Criar um ID de pedido único
    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    // Criar um payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Converter para centavos
      currency: 'eur',
      customer: customer.id,
      description: `Pedido: ${orderId}`,
      metadata: {
        orderId: orderId,
        customerEmail: shippingInfo.email,
        customerName: shippingInfo.name,
        customerPhone: shippingInfo.phone,
        shippingAddress: shippingInfo.address,
        postalCode: shippingInfo.postalCode,
        items: itemsDescription.substring(0, 500) // Limite de caracteres para metadados
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderId: orderId
    });

  } catch (error: unknown) {
    console.error('Erro ao criar payment intent:', error);

      // Type guard to safely access error properties
      const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erro ao processar a solicitação';
    return NextResponse.json(
      { error: errorMessage || 'Erro ao processar a solicitação' },
      { status: 500 }
    );
  }
}