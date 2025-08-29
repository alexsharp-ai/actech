import { loadStripe } from '@stripe/stripe-js';

// Single shared promise instance per Stripe docs.
// Returns Promise<Stripe | null>
const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();

if (process.env.NODE_ENV !== 'production') {
  if (!pk) console.warn('[Stripe] Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  else if (!/^pk_(test|live)_/.test(pk)) console.warn('[Stripe] Publishable key format unexpected:', pk.slice(0,10)+'…');
}

export const stripePromise = pk ? loadStripe(pk) : Promise.resolve(null);
