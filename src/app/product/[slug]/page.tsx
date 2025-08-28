"use client";
import React from 'react';
import Image from 'next/image';
import { getProductBySlug } from '@/data/products';

interface Props { params: { slug: string } }

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if(!product) return <div className='p-10 text-white'>Product not found.</div>;
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          {/* Media Gallery */}
          <Gallery productSlug={product.slug} media={product.media} />
        </div>
        <div className="flex flex-col gap-6">
          <ReviewsLine rating={product.rating} count={product.reviewCount} />
          <h1 className="text-2xl md:text-4xl font-semibold leading-tight">{product.title}</h1>
          <p className="text-gray-600 text-sm md:text-base max-w-xl">{product.subtitle}</p>
          <VariantSelectors productSlug={product.slug} />
          <AddToCartBlock slug={product.slug} />
          <UpsellSection slug={product.slug} />
        </div>
      </div>
    </div>
  );
}

// --- Components ---
import { useState, useMemo } from 'react';
import { Product } from '@/data/products';

function useProduct(slug: string): Product {
  const p = getProductBySlug(slug);
  if(!p) throw new Error('Product not found');
  return p;
}

function ReviewsLine({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-red-500 text-lg">{'★★★★★'.slice(0, Math.round(rating))}</span>
      <span className="font-semibold">{count}</span>
      <span className="text-gray-500">reviews</span>
    </div>
  );
}

function Gallery({ media, productSlug }: { media: Product['media']; productSlug: string }) {
  const [index, setIndex] = useState(0);
  const current = media[index];
  const next = () => setIndex(i => (i + 1) % media.length);
  const prev = () => setIndex(i => (i - 1 + media.length) % media.length);
  return (
    <div className="relative group">
      <div className="relative w-full aspect-[4/3] bg-gray-100 rounded overflow-hidden flex items-center justify-center">
        {current.type === 'video' ? (
          <video key={current.src} src={current.src} poster={current.poster} className="w-full h-full object-cover" autoPlay muted loop playsInline />
        ) : (
          <Image src={current.src} alt={productSlug} width={900} height={675} className="object-contain w-full h-full" />
        )}
      </div>
      <button onClick={prev} aria-label="Previous" className="opacity-0 group-hover:opacity-100 transition absolute top-1/2 -translate-y-1/2 left-2 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow">‹</button>
      <button onClick={next} aria-label="Next" className="opacity-0 group-hover:opacity-100 transition absolute top-1/2 -translate-y-1/2 right-2 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow">›</button>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 snap-x">
        {media.map((m,i) => (
          <button key={i} onClick={()=>setIndex(i)} className={`relative flex-shrink-0 w-20 h-20 rounded border ${i===index? 'border-black':'border-transparent'} overflow-hidden bg-gray-50`}> 
            {m.type==='video'? <video src={m.src} poster={m.poster} className="w-full h-full object-cover" muted /> : <Image src={m.src} alt={productSlug+ i} width={80} height={80} className="object-cover w-full h-full" />} 
          </button>
        ))}
      </div>
    </div>
  );
}

function VariantSelectors({ productSlug }: { productSlug: string }) {
  const product = useProduct(productSlug);
  const [selected, setSelected] = useState<Record<string,string>>(()=>({}));
  return (
    <div className="flex flex-col gap-6">
      {product.variantGroups.map(group => (
        <div key={group.id} className="flex flex-col gap-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{group.name}</div>
          <div className="flex gap-3 flex-wrap">
            {group.options.map(opt => {
              const active = selected[group.id] === opt.id;
              return (
                <button key={opt.id} onClick={()=>setSelected(s=>({...s,[group.id]:opt.id}))} className={`flex flex-col items-center justify-center gap-2 border rounded p-3 w-28 h-28 text-xs font-medium transition ${active? 'border-black shadow':'border-gray-200 hover:border-black'}`}> 
                  {opt.image && <Image src={opt.image} alt={opt.label} width={80} height={80} className="object-contain w-16 h-16" />}
                  <span className="text-center leading-tight">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function AddToCartBlock({ slug }: { slug: string }) {
  const product = useProduct(slug);
  const [qty,setQty]=useState(1);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center border rounded">
          <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="w-10 h-10 flex items-center justify-center text-xl">-</button>
          <div className="w-10 text-center font-semibold">{qty}</div>
          <button onClick={()=>setQty(q=>q+1)} className="w-10 h-10 flex items-center justify-center text-xl">+</button>
        </div>
        <button className="flex-1 bg-black text-white py-4 rounded font-semibold hover:bg-gray-800 transition text-sm">Add to cart - {product.basePrice.toFixed(2).replace('.',',')}€</button>
      </div>
    </div>
  );
}

function UpsellSection({ slug }: { slug: string }) {
  const product = useProduct(slug);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const subtotal = useMemo(()=> product.basePrice + product.upsells.filter(u=>selected[u.id]).reduce((s,u)=>s+u.price,0), [selected, product]);
  const maxThreshold = product.thresholds[product.thresholds.length-1].amount;
  const progress = Math.min(1, subtotal / maxThreshold);
  return (
    <div className="flex flex-col gap-4">
      <div className="font-semibold text-sm">Frequently purchased together.</div>
      <div className="text-xs text-gray-500">Complete your cart to unlock your exclusive benefits.</div>
      <div className="w-full h-1 bg-gray-200 rounded relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-black" style={{width: `${progress*100}%`}} />
        {product.thresholds.map(t => (
          <div key={t.amount} className="absolute -top-2" style={{left: `${(t.amount/maxThreshold)*100}%`}}>
            <div className="w-[2px] h-3 bg-black mx-auto" />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-gray-600">{product.thresholds.map(t => (
        <div key={t.amount} className="flex flex-col items-center w-1/3 text-center">
          <span className={`font-medium ${subtotal>=t.amount ? 'text-black':'text-gray-400'}`}>{t.label}</span>
        </div>
      ))}</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {product.upsells.map(u => {
          const active = !!selected[u.id];
          return (
            <button key={u.id} onClick={()=>setSelected(s=>({...s,[u.id]: !s[u.id]}))} className={`flex flex-col gap-2 border rounded p-3 text-left text-xs hover:border-black transition ${active? 'border-black shadow':''}`}>
              <Image src={u.image} alt={u.name} width={200} height={120} className="w-full h-24 object-contain" />
              <div className="font-semibold leading-tight">{u.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{u.price.toFixed(2).replace('.',',')}€</span>
                {u.originalPrice && <span className="line-through text-[10px] text-gray-400">{u.originalPrice.toFixed(2).replace('.',',')}€</span>}
              </div>
              <div className={`mt-auto text-[10px] uppercase tracking-wide font-medium ${active? 'text-black':'text-gray-400'}`}>{active? 'ADDED':'ADD'}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
