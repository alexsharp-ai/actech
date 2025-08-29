import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getProductBySlug } from '@/data/products';

// Ensure STRIPE_SECRET_KEY is set
const stripeKey = process.env.STRIPE_SECRET_KEY;
let stripe: Stripe | null = null;
if (stripeKey) {
  stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' as any });
}

export async function POST(req: NextRequest) {
  try {
    if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    const body = await req.json();
    const { items } = body as { items: { slug: string; quantity: number }[] };
    if (!Array.isArray(items) || !items.length) return NextResponse.json({ error: 'No items' }, { status: 400 });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(it => {
      const product = getProductBySlug(it.slug);
      if(!product) throw new Error('Invalid product: '+it.slug);
      return {
        quantity: it.quantity || 1,
        price_data: {
          currency: 'eur',
            unit_amount: Math.round(product.basePrice * 100),
          product_data: { name: product.title },
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${req.nextUrl.origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/?checkout=cancel`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (e: any) {
    console.error('Checkout error', e);
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
