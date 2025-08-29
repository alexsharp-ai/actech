"use client";
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

interface WrapperProps { slug: string; quantity?: number; onClose: () => void; }

export function PaymentModalWrapper(props: WrapperProps){
  const { slug, quantity = 1 } = props;
  const [clientSecret, setClientSecret] = useState<string|undefined>();
  const [error, setError] = useState<string|undefined>();
  useEffect(()=>{
    (async()=>{
      try{
        const r = await fetch('/api/create-payment-intent', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ slug, quantity }) });
        const d = await r.json();
        if(d.clientSecret) setClientSecret(d.clientSecret); else setError(d.error || 'Unable to start payment');
      }catch{ setError('Network error'); }
    })();
  }, [slug, quantity]);

  if(error) return <div className='p-6 text-sm text-red-500'>Error: {error}</div>;
  if(!clientSecret) return <div className='p-6 text-sm text-gray-400'>Preparing payment…</div>;

  return (
    <Elements options={{ clientSecret, appearance:{ theme:'flat' } }} stripe={stripePromise as any}>
      <PaymentModal {...props} />
    </Elements>
  );
}

function PaymentModal({ onClose }: WrapperProps){
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string|undefined>();

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    if(!stripe || !elements) return;
    setLoading(true);
    const { error } = await stripe.confirmPayment({ elements, confirmParams:{ return_url: window.location.origin + '/?payment=completed' }, redirect: 'if_required' });
    if(error){
      setMessage(error.message || 'Payment failed');
    } else {
      setMessage('Payment processed. Thank you!');
      setTimeout(()=> onClose(), 1500);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-6 w-full max-w-md'>
      <PaymentElement />
      {message && <div className='text-xs text-center text-red-500'>{message}</div>}
      <div className='flex gap-3'>
        <button type='button' onClick={onClose} className='flex-1 py-3 rounded border border-gray-300 text-sm font-semibold hover:bg-gray-50'>Cancel</button>
        <button disabled={!stripe || loading} className='flex-1 py-3 rounded bg-black text-white text-sm font-semibold disabled:opacity-40'>{loading? 'Processing…':'Pay now'}</button>
      </div>
      <p className='text-[10px] text-center text-gray-400 mt-2'>Secure payment powered by Stripe.</p>
    </form>
  );
}

export default function PaymentModalContainer({ slug, onClose }: { slug: string; onClose: () => void }){
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm'>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden'>
        <div className='flex items-center justify-between px-5 py-3 border-b'>
          <h3 className='font-semibold text-sm'>Checkout</h3>
          <button onClick={onClose} className='text-gray-500 hover:text-black' aria-label='Close'>×</button>
        </div>
        <PaymentModalWrapper slug={slug} onClose={onClose} />
      </div>
    </div>
  );
}
