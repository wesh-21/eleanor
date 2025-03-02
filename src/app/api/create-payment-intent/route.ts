// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16", // Use the latest API version
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, amount } = body;

    // Ensure amount is valid
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      // Add any additional data you want to associate with the payment
      metadata: {
        itemCount: items.length,
        items: JSON.stringify(items.map((item: any) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity
        })))
      }
    });

    // Return the client secret to the client
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: "Error creating payment intent" },
      { status: 500 }
    );
  }
}