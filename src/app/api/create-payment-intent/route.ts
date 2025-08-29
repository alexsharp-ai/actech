import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getProductBySlug } from '@/data/products';

const stripeKey = process.env.STRIPE_SECRET_KEY;
let stripe: Stripe | null = null;
if (stripeKey) stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' as any });

export async function POST(req: NextRequest){
  try {
    if(!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    const body = await req.json();
    const { slug, quantity = 1 } = body as { slug: string; quantity?: number };
    const product = getProductBySlug(slug);
    if(!product) return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
    const amount = Math.round(product.basePrice * 100) * quantity;
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: { slug, quantity: String(quantity) }
    });
    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (e:any){
    console.error(e);
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
