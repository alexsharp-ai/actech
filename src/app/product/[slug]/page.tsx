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
    <ProductFAQ slug={product.slug} />
        </div>
      </div>
  <FeaturesAndTrust />
  <ProductAssembly slug={product.slug} />
  <ProductCompatibility slug={product.slug} />
  <ProductReviews slug={product.slug} />
  <ProductMoreQuestions slug={product.slug} />
  <ProductBottomFeatures />
  <RelatedProducts />
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

// FAQ Accordion (dynamic per product)
function ProductFAQ({ slug }: { slug: string }) {
  const isDesk = slug === 'magsafe-desk-stand';
  const isUniversal = slug === 'pro-moto-holder';
  const isGym = slug === 'magsafe-gym-stream';
  const items: { title: string; content: React.ReactNode }[] = isDesk ? [
    {
      title: 'What does my product contain?',
      content: (
        <ul className="list-disc ml-6 space-y-1 text-sm md:text-[15px]">
          <li>Weighted anti‑slip base</li>
          <li>Adjustable aluminum arm</li>
          <li>MagSafe magnetic head</li>
          <li>Cable management clip</li>
          <li>Magnetic alignment ring (for non‑MagSafe phones)</li>
          <li>Cleaning wipe + quick start guide</li>
        </ul>
      )
    },
    {
      title: 'How does it work?',
      content: (
        <div className="space-y-3 text-sm md:text-[15px]">
          <p><strong>Step 1:</strong> Place the base on a flat surface (the silicone pad prevents slipping).</p>
          <p><strong>Step 2:</strong> Adjust arm and tilt for perfect eye level.</p>
          <p><strong>Step 3:</strong> Snap your MagSafe phone (or phone with supplied ring) onto the head – it self‑centers.</p>
          <p><strong>Optional:</strong> Route your charging cable through the rear clip for a clean setup.</p>
        </div>
      )
    },
    {
      title: 'Does it hold?',
      content: (
        <div className="space-y-4 text-sm md:text-[15px]">
          <p><strong>Yes, rock solid.</strong> The tuned magnetic array + anti‑slip pad let you tap and swipe without wobble.</p>
          <p>Rated for all MagSafe iPhones and most MagSafe compatible cases. For heavier Pro Max models a direct MagSafe case or included ring delivers optimal grip.</p>
        </div>
      )
    },
    {
      title: 'The advantages of the product',
      content: (
        <ul className="list-disc ml-6 space-y-1 text-sm md:text-[15px]">
          <li>30‑second setup, no tools</li>
          <li>One‑hand magnetic snap on/off</li>
          <li>Clean cable path, clutter free desk</li>
          <li>Optimized viewing angle for calls & content</li>
          <li>Compact & travel friendly</li>
        </ul>
      )
    },
    {
      title: 'Technical characteristics',
      content: (
        <ul className="list-disc ml-6 space-y-1 text-sm md:text-[15px]">
          <li>CNC aluminum + weighted zinc core base</li>
          <li>Silicone anti‑slip & device protection pads</li>
          <li>Full MagSafe ring alignment (works with Qi2 chargers)</li>
          <li>±45° tilt head / adjustable arm</li>
          <li>Supports phones up to 300g</li>
        </ul>
      )
    }
  ] : isUniversal ? [
    {
      title: 'What does my product contain?',
      content: (
        <ul className="list-disc ml-6 space-y-1 text-sm md:text-[15px]">
          <li>Universal magnetic mount body (5× strength)</li>
          <li>2 magnetic safety rings</li>
          <li>Silicone security band</li>
          <li>Travel pouch</li>
          <li>Quick start guide</li>
        </ul>
      )
    },
    {
      title: 'How does it work?',
      content: (
        <div className="space-y-3 text-sm md:text-[15px]">
          <p><strong>Step 1:</strong> (Optional) Apply a safety ring to non‑MagSafe phone/case for maximum grip.</p>
          <p><strong>Step 2:</strong> Stick to any ferrous metal surface OR loop the silicone band around a bar (bike, scooter, stroller, gym machine, shopping cart).</p>
          <p><strong>Step 3:</strong> Snap phone onto the magnetic face. Adjust angle. Done.</p>
        </div>
      )
    },
    {
      title: 'Does it hold?',
      content: (
        <div className="space-y-4 text-sm md:text-[15px]">
          <p><strong>Extreme retention.</strong> 5× stronger magnetic core + mechanical silicone band redundancy.</p>
          <p>Tested on rough urban commutes, cobbles, off‑path rides and gym vibration environments. With ring + band engaged accidental drops are highly unlikely.</p>
        </div>
      )
    },
    {
      title: 'The advantages of the product',
      content: (
        <ul className="list-disc ml-6 space-y-1 text-sm md:text-[15px]">
          <li>Multi‑surface: e‑bikes, scooters, strollers, gym & more</li>
          <li>Installs / removes in under 30 seconds</li>
          <li>Super compact for holidays & rentals</li>
          <li>Magnetic + silicone dual security</li>
          <li>Works with any phone via safety rings</li>
        </ul>
      )
    },
    {
      title: 'Technical characteristics',
      content: (
        <ul className="list-disc ml-6 space-y-1 text-sm md:text-[15px]">
          <li>5× strength neodymium magnet array</li>
          <li>High‑elasticity silicone security band</li>
          <li>Corrosion‑resistant alloy frame</li>
          <li>Operating temp −10°C to 55°C</li>
          <li>Compatible with MagSafe & supplied rings</li>
        </ul>
      )
    }
  ] : isGym ? [
    {
      title: 'What does my product contain?',
      content: (
        <ul className="list-disc ml-6 space-y-1 text-sm md:text-[15px]">
          <li>MagSafe gym & stream mount body</li>
          <li>Magnetic alignment ring (for non‑MagSafe phones)</li>
          <li>Low‑profile nano‑suction pad (optional extra grip)</li>
          <li>Cleaning wipe + positioning guide</li>
          <li>Quick start guide</li>
        </ul>
      )
    },
    {
      title: 'How does it work?',
      content: (
        <div className="space-y-3 text-sm md:text-[15px]">
          <p><strong>Step 1:</strong> (Optional) Apply the magnetic ring to a non‑MagSafe case for full strength.</p>
          <p><strong>Step 2:</strong> Press the mount onto any flat ferrous gym machine surface (rack upright, cable tower, treadmill frame) OR a smooth metal surface (fridge, filing cabinet, squat rack cross‑member).</p>
          <p><strong>Step 3:</strong> Snap your phone – magnets auto‑center. Tilt / rotate for front camera streaming or rear camera filming.</p>
          <p><strong>Bonus:</strong> The slim form factor lets you reposition mid‑set without tools.</p>
        </div>
      )
    },
    {
      title: 'Does it hold?',
      content: (
        <div className="space-y-4 text-sm md:text-[15px]">
          <p><strong>Yes.</strong> High‑grade neodymium array + optional nano‑suction friction layer prevent slip even on light vibration equipment.</p>
          <p>Rated for all current MagSafe iPhones (Mini to Pro Max) and most Android phones using the included ring.</p>
        </div>
      )
    },
    {
      title: 'The advantages of the product',
      content: (
        <ul className="list-disc ml-6 space-y-1 text-sm md:text-[15px]">
          <li>Instant portrait ↔ landscape rotation</li>
          <li>Ultra compact – pocket it between sets</li>
          <li>Stable filming for workouts & live streams</li>
          <li>Works on gym machines, racks, home metal surfaces</li>
          <li>MagSafe + ring universal compatibility</li>
        </ul>
      )
    },
    {
      title: 'Technical characteristics',
      content: (
        <ul className="list-disc ml-6 space-y-1 text-sm md:text-[15px]">
          <li>Precision alloy chassis + polymer contact pad</li>
          <li>High coercivity magnet array (MagSafe aligned)</li>
          <li>Nano‑suction removable pad (washable)</li>
          <li>Operating temp −10°C to 55°C</li>
          <li>Supports devices up to 320g</li>
        </ul>
      )
    }
  ] : [
    // Fallback: original generic content for remaining products
    {
      title: 'What does my product contain?',
      content: (
        <ul className="list-disc ml-6 space-y-1 text-sm md:text-[15px]">
          <li>Support / mount</li>
          <li>Adhesive metal plate</li>
          <li>Diameter adapters (if applicable)</li>
          <li>Allen key / tool</li>
          <li>Carrying bag / guide</li>
        </ul>
      )
    },
    {
      title: 'How does it work?',
      content: (
        <div className="space-y-3 text-sm md:text-[15px]">
          <p>Mount the support, apply the plate or ring, then snap the phone on – magnets auto‑center.</p>
          <p>Landscape / portrait switching takes one second.</p>
        </div>
      )
    },
    {
      title: 'Does it hold?',
      content: (
        <div className="space-y-4 text-sm md:text-[15px]">
          <p>Engineered magnetic array rated well above phone weight; validated by thousands of users.</p>
        </div>
      )
    },
    {
      title: 'The advantages of the product',
      content: (
        <ul className="list-disc ml-6 space-y-1 text-sm md:text-[15px]">
          <li>Quick magnetic mounting</li>
          <li>Portrait / landscape tilt</li>
          <li>Universal phone compatibility</li>
        </ul>
      )
    },
    {
      title: 'Technical characteristics',
      content: (
        <ul className="list-disc ml-6 space-y-1 text-sm md:text-[15px]">
          <li>Neodymium magnet array</li>
          <li>Impact & vibration tested</li>
          <li>Compatible with adhesive plates & rings</li>
        </ul>
      )
    }
  ];
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i:number) => setOpen(o => o.includes(i) ? o.filter(x=>x!==i) : [...o,i]);
  return (
    <div className="mt-10 border-t border-gray-200">
      {items.map((it,i) => {
        const expanded = open.includes(i);
        return (
          <div key={it.title} className="border-b border-gray-200">
            <button onClick={()=>toggle(i)} className="w-full flex items-center justify-between py-4 text-left group">
              <span className="font-medium text-[15px]">{it.title}</span>
              <span className="text-gray-400 group-hover:text-black transition transform" style={{transform: expanded? 'rotate(180deg)':'rotate(0deg)'}}>▾</span>
            </button>
            {expanded && (
              <div className="pb-6 -mt-2 text-gray-700 leading-relaxed animate-fadeIn">
                {it.content}
              </div>
            )}
          </div>
        );
      })}
      <style jsx>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(-4px);} to { opacity:1; transform:translateY(0);} }
        .animate-fadeIn{animation:fadeIn .25s ease;}
      `}</style>
    </div>
  );
}

// Features + Trust logos (placeholder logos if real assets missing)
function FeaturesAndTrust() {
  const features = [
    { title: 'Patented magnetic system', desc: 'Harmless for your phone', icon: (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3v6a6 6 0 0 0 12 0V3"/><path d="M6 21v-3"/><path d="M18 21v-3"/></svg>) },
    { title: 'Compatible', desc: 'Handlebars 22–32mm', icon: (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8"/><path d="M4 12h16"/></svg>) },
    { title: 'Universal support', desc: 'Works with all phones', icon: (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="2" width="10" height="20" rx="2"/></svg>) },
    { title: 'Simple use', desc: 'Optimal visibility', icon: (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M4 12a8 8 0 0 1 16 0 8 8 0 0 1-16 0Z"/></svg>) },
  ];
  const logos = [ 'Motoblouz','Dafy','Maxxess','Speedway','TeamAxe' ];
  return (
    <section className="mt-20">
      <div className="w-full bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {features.map(f => (
            <div key={f.title} className="flex flex-col items-center gap-3">
              <div className="text-black">{f.icon}</div>
              <div className="font-semibold text-sm md:text-base text-black leading-snug max-w-[180px]">{f.title}</div>
              <div className="text-[11px] md:text-xs text-gray-600">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h3 className="text-xl font-semibold mb-8 text-center md:text-left">They trust us:</h3>
        <div className="flex flex-wrap gap-6 items-center justify-center md:justify-start">
          {logos.map(name => (
            <div key={name} className="h-28 w-40 flex items-center justify-center border rounded bg-white shadow-sm p-4 text-sm font-medium text-gray-700">
              {name}
            </div>
          ))}
          <div className="h-28 w-40 flex flex-col items-center justify-center border rounded bg-gray-50 shadow-sm p-4 text-[11px] text-gray-700 text-center gap-2">
            <span>And more than 5000 resellers in Europe</span>
            <span className="text-xs">→</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Assembly / What's Inside Section
function ProductAssembly({ slug }: { slug: string }) {
  const product = getProductBySlug(slug);
  const mediaImages = (product?.media || []).filter(m => m.type === 'image').slice(0,4);
  const [tab,setTab]=useState<'assembly'|'inside'>('assembly');
  const [idx,setIdx]=useState(0);
  const next = ()=> setIdx(i => (i+1) % mediaImages.length);
  const prev = ()=> setIdx(i => (i-1+mediaImages.length) % mediaImages.length);
  const isDesk = product?.slug === 'magsafe-desk-stand';
  // Dynamic copy depending on product type
  const isUniversal = product?.slug === 'pro-moto-holder';
  const isGym = product?.slug === 'magsafe-gym-stream';
  const smallLabel = isDesk ? 'Desk setup' : isUniversal ? 'Multi‑surface mounting' : isGym ? 'Gym & home surfaces' : 'Handlebar and stem';
  const bigTitle = isDesk ? 'Ready in under 30 seconds' : isUniversal ? 'Attach anywhere in seconds' : isGym ? 'Film & stream instantly' : 'Turnkey assembly';
  const assemblySteps: string[] = isDesk ? [
    'Unbox the stand and place the weighted base on a flat surface – the non‑slip silicone keeps it stable.',
    'Insert (or unfold, depending on version) the adjustable arm and set the desired height / tilt.',
    'Bring your MagSafe iPhone (or MagSafe‑compatible case) close to the magnetic head – it auto‑aligns for secure holding and optimal charging.',
    'Manage your charging cable through the rear channel (optional) for a clean desk aesthetic.'
  ] : isUniversal ? [
    'Center one of the included safety rings on your case for maximum magnetic grip (only needed for non‑MagSafe / smooth cases).',
    'Snap the mount onto any steel or magnetic surface OR loop the silicone security band around the bar/handle (bike, e‑bike, scooter, stroller, gym machine, shopping cart).',
    'Slide your phone onto the magnetic face – the 5× strength magnets lock instantly; adjust viewing angle as needed.',
    'To move locations (holiday, gym, rental bike) just peel off and re‑attach – the compact body travels easily.'
  ] : isGym ? [
    'Clean (wipe) any dusty chalk or sweat residue from the metal surface of the machine or rack for best grip.',
    'If using a non‑MagSafe phone/case apply the magnetic ring (center, press 30s, wait 2h for full adhesive cure before intense motion).',
    'Place the mount flush against the chosen metal area (upright, cross‑member, plate); the magnetic + friction interface locks it in place.',
    'Snap on your phone. Rotate / tilt to frame your workout or live stream. Reposition between sets in seconds.'
  ] : [
    'Choose the adapter according to the diameter of your handlebar: 31.8mm diameter handlebar: no adapter. 28.6mm diameter handlebar: 1.7mm adapter. 25.4mm diameter handlebar: 3.5mm adapter. 22.2mm diameter handlebar: 5.1mm adapter.',
    'Position the adapter on the handlebars, then screw the support on top, using the Allen key.',
    'Stick the metal plate on your phone case, snap it onto the support (making sure to center it) and off you go!'
  ];
  const insideItems: string[] = isDesk ? [
    'Weighted anti‑slip base',
    'Adjustable aluminum arm',
    'MagSafe magnetic head (strong alignment ring)',
    'Cable management clip',
    'Quick start guide'
  ] : isUniversal ? [
    'Universal magnetic mount (5× strength core)',
    '2 safety magnetic rings',
    'Silicone security band',
    'Travel pouch',
    'Quick start guide'
  ] : isGym ? [
    'Gym & stream magnetic mount body',
    'Magnetic alignment ring',
    'Optional nano‑suction friction pad',
    'Cleaning wipe & guide',
    'Quick start guide'
  ] : [
    'Screwed support',
    'Magnetic metal plate',
    '3 diameter adapters',
    'Allen key',
    'Carrying bag'
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 py-24">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left text / tabs */}
        <div className="order-2 md:order-1 flex flex-col gap-6">
          <div className="text-[11px] tracking-[2px] font-medium text-red-600 uppercase">{smallLabel}</div>
          <h2 className="text-2xl md:text-3xl font-semibold">{bigTitle}</h2>
          <div className="flex gap-2 text-[11px] tracking-wide">
            <button onClick={()=>setTab('assembly')} className={`px-4 py-2 border text-[11px] font-semibold ${tab==='assembly'? 'bg-black text-white border-black':'bg-white text-gray-600 border-gray-300 hover:border-black'}`}>ASSEMBLY</button>
            <button onClick={()=>setTab('inside')} className={`px-4 py-2 border text-[11px] font-semibold ${tab==='inside'? 'bg-black text-white border-black':'bg-white text-gray-600 border-gray-300 hover:border-black'}`}>WHAT&apos;S INSIDE</button>
          </div>
          {tab==='assembly' && (
            <ol className="space-y-5 text-[13px] leading-relaxed max-w-md list-decimal ml-4">
              {assemblySteps.map((s,i)=>(<li key={i}>{s}</li>))}
            </ol>
          )}
          {tab==='inside' && (
            <ul className="space-y-2 text-[13px] leading-relaxed max-w-md list-disc ml-4">
              {insideItems.map((s,i)=>(<li key={i}>{s}</li>))}
            </ul>
          )}
        </div>
        {/* Right carousel */}
        <div className="order-1 md:order-2 relative w-full aspect-[4/3] bg-gray-100 rounded overflow-hidden">
          {mediaImages.map((m,i) => (
            <div key={m.src} className={`absolute inset-0 transition-opacity duration-500 ${i===idx? 'opacity-100':'opacity-0'}`} aria-hidden={i!==idx}>
              <Image src={m.src} alt={`${product?.title || 'product'} image ${i+1}`} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
            </div>
          ))}
          {mediaImages.length>1 && (
            <>
              <button onClick={prev} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center text-xl font-bold shadow">‹</button>
              <button onClick={next} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center text-xl font-bold shadow">›</button>
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                {mediaImages.map((_,i)=>(
                  <button key={i} onClick={()=>setIdx(i)} aria-label={`Go to image ${i+1}`} className={`w-2.5 h-2.5 rounded-full ${i===idx? 'bg-white ring-2 ring-black/50':'bg-black/30 hover:bg-black/50'}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// Compatibility Section (adhesive metal plate)
function ProductCompatibility({ slug }: { slug: string }) {
  // simple reuse of images (first image from product media considered compatible)
  const product = getProductBySlug(slug);
  const images = (product?.media || []).filter(m=>m.type==='image').slice(0,4);
  const [tab,setTab]=useState<'assembly'|'inside'>('assembly');
  const isDesk = product?.slug === 'magsafe-desk-stand';
  const isUniversal = product?.slug === 'pro-moto-holder';
  const isGym = product?.slug === 'magsafe-gym-stream';
  const smallLabel = isDesk ? 'Universal compatibility' : isUniversal ? 'All activities' : isGym ? 'Cross‑environment filming' : 'Adhesive metal plate';
  const bigTitle = isDesk ? 'Works with MagSafe & any phone (ring included)' : isUniversal ? 'One mount – bike, scooter, stroller, gym & more' : isGym ? 'Stream & record on racks, machines & at home' : 'Compatible with your phone';
  const assemblyCopy = isDesk ? (
    <div className="space-y-5 text-[13px] leading-relaxed max-w-md">
      <p><strong>Included in the box:</strong> a slim magnetic metal ring you can stick on a non‑MagSafe case to instantly make it MagSafe‑ready.</p>
      <p>If you already have an iPhone with MagSafe (12 and later) or a certified MagSafe case you can just snap your phone directly—no ring needed.</p>
      <p>Want to upgrade another device? Center the ring using the guide sticker, press firmly for 30 seconds, then wait 2 hours before heavy use to let the adhesive fully cure.</p>
      <p className="text-[11px] text-gray-500"><strong>Note:</strong> Adhesion is weaker on fabric / textured / anti‑dust (silicone powdery) finishes. Avoid leather grain, woven textiles and heavily rubberized coatings for best results.</p>
    </div>
  ) : isUniversal ? (
    <div className="space-y-5 text-[13px] leading-relaxed max-w-md">
      <p>Designed for <strong>e‑bikes, bikes, scooters, strollers, shopping carts, gym machines and any ferrous metal surface</strong>. Mount or remove in under 30 seconds.</p>
      <p>The reinforced magnetic core delivers <strong>5× the holding force</strong> of typical mounts. The silicone security band adds a secondary mechanical hold on rough rides or vibration‑heavy environments.</p>
      <p>Use the included rings for non‑MagSafe phones/cases to maximize magnetic contact. Ideal for holidays and rentals: compact, pocket‑friendly and fast to relocate.</p>
      <p className="text-[11px] text-gray-500"><strong>Tip:</strong> For painted or delicate bars place a thin cloth under the band to avoid marks.</p>
    </div>
  ) : isGym ? (
    <div className="space-y-5 text-[13px] leading-relaxed max-w-md">
      <p>Attaches magnetically to <strong>gym machines, squat racks, cable towers, weight storage posts, home appliances and metal frames</strong>. Clean chalk / sweat for maximum friction.</p>
      <p>For non‑MagSafe phones apply the included ring. After curing, you get snap‑on alignment for reliable filming while lifting.</p>
      <p>Low profile size makes it pocketable between sets and unobtrusive during classes or live streams.</p>
      <p className="text-[11px] text-gray-500"><strong>Note:</strong> Not suitable for rubber‑coated or thickly painted non‑ferrous surfaces (aluminum). Test hold before releasing your phone fully.</p>
    </div>
  ) : (
    <div className="space-y-5 text-[13px] leading-relaxed max-w-md">
      <p>The adhesive metal plate can be installed on the protective shell of any smartphone. Thanks to the adhesive metal plate, enjoy optimal visibility to use your phone during your activities.</p>
      <p><strong>Please note:</strong> depending on the phone cases, the adhesive will stick more or less well (on textured cases), or not at all (on textile protections, anti-dust case).</p>
    </div>
  );
  const insideCopy = isDesk ? (
    <ul className="space-y-2 text-[13px] leading-relaxed max-w-md list-disc ml-4">
      <li>MagSafe desk stand with weighted base</li>
      <li>Magnetic alignment ring (for non‑MagSafe phones)</li>
      <li>Cleaning wipe & positioning guide</li>
      <li>Quick start guide</li>
    </ul>
  ) : isUniversal ? (
    <ul className="space-y-2 text-[13px] leading-relaxed max-w-md list-disc ml-4">
      <li>Universal magnetic mount body</li>
      <li>2 magnetic safety rings</li>
      <li>Silicone security band</li>
      <li>Travel / holiday pouch</li>
      <li>Quick start guide</li>
    </ul>
  ) : isGym ? (
    <ul className="space-y-2 text-[13px] leading-relaxed max-w-md list-disc ml-4">
      <li>Gym & stream magnetic mount</li>
      <li>Magnetic alignment ring</li>
      <li>Optional nano‑suction friction pad</li>
      <li>Cleaning wipe + guide</li>
      <li>Quick start guide</li>
    </ul>
  ) : (
    <ul className="space-y-2 text-[13px] leading-relaxed max-w-md list-disc ml-4">
      <li>1 x Adhesive metal plate</li>
      <li>Cleaning wipe</li>
      <li>Quick start guide</li>
    </ul>
  );
  return (
    <section className="max-w-7xl mx-auto px-4 pt-10 pb-24">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left visuals */}
        <div className="flex items-center justify-center gap-6 flex-wrap md:flex-nowrap">
          {images.map((m,i)=>(
            <div key={i} className="relative w-32 h-56 flex items-center justify-center">
              <Image src={m.src} alt={product?.title || 'phone case'} fill sizes="128px" className="object-contain" />
            </div>
          ))}
        </div>
        {/* Right copy */}
        <div className="flex flex-col gap-6">
          <div className="text-[11px] tracking-[2px] font-medium text-red-600 uppercase">{smallLabel}</div>
          <h2 className="text-2xl md:text-3xl font-semibold">{bigTitle}</h2>
          <div className="flex gap-2 text-[11px] tracking-wide">
            <button onClick={()=>setTab('assembly')} className={`px-4 py-2 border text-[11px] font-semibold ${tab==='assembly'? 'bg-black text-white border-black':'bg-white text-gray-600 border-gray-300 hover:border-black'}`}>ASSEMBLY</button>
            <button onClick={()=>setTab('inside')} className={`px-4 py-2 border text-[11px] font-semibold ${tab==='inside'? 'bg-black text-white border-black':'bg-white text-gray-600 border-gray-300 hover:border-black'}`}>WHAT&apos;S INSIDE</button>
          </div>
          {tab==='assembly' && assemblyCopy}
          {tab==='inside' && insideCopy}
        </div>
      </div>
    </section>
  );
}

// Reviews Section (static sample data)
interface Review { id:string; name:string; date:string; title?:string; body:string; verified?:boolean; rating:number; short?:string; }
const sampleReviews: Review[] = [
  { id:'r1', name:'Ulrich Borrmann', date:'2025-04-12', title:'', body:'Bicycle phone holder with metal plate', verified:true, rating:5 },
  { id:'r2', name:'Arnaud Petoux', date:'2025-04-12', body:'Easy installation and fast delivery, thank you', verified:true, rating:5 },
  { id:'r3', name:'Dorin Grama', date:'2025-04-09', body:'When I received it I thought the magnets could not be so strong in such a small space. I was wrong – if you are not careful and slowly bring the phone closer to the holder...', verified:true, rating:5, short:'Read more' },
];

function ProductReviews({ slug }: { slug: string }) {
  const product = getProductBySlug(slug);
  const [filter,setFilter]=useState('recent');
  return (
    <section className="max-w-7xl mx-auto px-4 py-24">
      <div className="bg-white rounded-xl shadow-sm border p-10 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-center md:text-left flex-1">
            <h2 className="text-lg font-semibold mb-1">Customer Reviews</h2>
            <div className="flex flex-col items-center md:items-start text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-red-500">★★★★★</span>
                <a href="#" className="underline decoration-dotted hover:text-black transition">4.83 out of 5</a>
              </div>
              <div>Based on {product?.reviewCount} reviews <span className="inline-block text-green-600">✔️</span></div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end w-full md:w-auto">
            <button className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8 py-3 text-sm font-semibold shadow">Write a review</button>
          </div>
        </div>
        <div className="border-t pt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm font-medium">Most Recent</div>
            <select value={filter} onChange={e=>setFilter(e.target.value)} className="border rounded px-3 py-2 text-sm bg-white">
              <option value="recent">Most Recent</option>
              <option value="high">Highest Rated</option>
              <option value="low">Lowest Rated</option>
            </select>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleReviews.map(r => (
              <div key={r.id} className="bg-white border rounded-lg shadow-sm p-5 flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-red-500">{'★★★★★'.slice(0, r.rating)}</span>
                  <span className="text-[10px] text-gray-400">{new Date(r.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.name}</span>
                  {r.verified && <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded">Verified</span>}
                </div>
                {r.title && <div className="font-semibold">{r.title}</div>}
                <div className="text-gray-700 leading-relaxed text-[13px]">{r.body}</div>
                {r.short && <button className="self-start text-[11px] underline decoration-dotted text-gray-500 hover:text-black">{r.short}</button>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Final small FAQ
function ProductMoreQuestions({ slug }: { slug: string }) {
  const isDesk = slug === 'magsafe-desk-stand';
  const isUniversal = slug === 'pro-moto-holder';
  const isGym = slug === 'magsafe-gym-stream';
  const items = isDesk ? [
    { q: 'Will my phone stay securely on the stand?', a: 'Yes. The high‑grade magnets align with the MagSafe ring and the silicone pad adds extra friction. Standard MagSafe iPhones lock with a noticeable snap and remain stable while tapping or swiping.' },
    { q: 'Does it work with Android phones?', a: 'Any phone can work if you apply the included magnetic alignment ring (or use a MagSafe‑compatible case). Without a ring, purely non‑MagSafe phones will not attach strongly.' },
    { q: 'Can I adjust height and angle?', a: 'You can tilt the head for ideal viewing and adjust the arm angle. It is optimized for desk ergonomics (video calls, notifications, charging) within a compact footprint.' },
    { q: 'Will MagSafe charging still work?', a: 'Yes. The open rear design allows airflow and cable management. Use an official MagSafe or Qi2 puck if you want active charging; route the cable through the rear channel for a clean look.' },
    { q: 'What surfaces does the base work on?', a: 'The weighted base with non‑slip silicone holds on wood, laminate, metal, and most smooth desk mats. Avoid very dusty or oily surfaces; wipe clean for best grip.' },
    { q: 'Warranty & support?', a: 'Register your stand to activate the 10‑year magnetic system warranty and contact support for replacement pads or accessories.' },
  ] : isUniversal ? [
    { q: 'Where can I use it?', a: 'On e‑bikes, bikes, scooters, strollers, shopping carts, gym equipment and any magnetic/steel surface. The silicone band secures it to non‑magnetic bars.' },
    { q: 'How strong is the magnet?', a: 'It delivers roughly five times the holding force of common mounts. With the safety ring applied and band engaged, accidental drops are extremely unlikely.' },
    { q: 'Is setup really under 30 seconds?', a: 'Yes. Loop the band or stick to metal, snap on your phone. First time only: apply the ring to non‑MagSafe phones (align, press 30s, wait 2h for full cure).' },
    { q: 'Does it affect my phone or battery?', a: 'No. The magnetic field is contained and does not harm electronics or signal. Wireless charging works normally with MagSafe phones/rings removed when needed.' },
    { q: 'Travel & holidays?', a: 'Lightweight and pocket friendly. Move it from rental bikes to gym machines to strollers without tools.' },
    { q: 'What is included?', a: 'Mount body, 2 safety rings, silicone security band, travel pouch, quick start guide.' },
  ] : isGym ? [
    { q: 'Where can I place it in a gym?', a: 'On most steel uprights, cable machine frames, squat racks, storage posts, plate trees, or any flat ferrous surface. Always test the magnetic hold before letting go fully.' },
    { q: 'Will vibration make it slip?', a: 'Normal machine vibration is fine. For intense drops or heavy rack pulls, ensure the surface is clean of chalk/sweat. Use the optional nano‑suction pad for extra friction if needed.' },
    { q: 'Is it safe for my phone filming longer sets?', a: 'Yes. Magnets are aligned for MagSafe; they do not harm your battery or camera. Avoid placing directly on hot surfaces (e.g., near heat vents).' },
    { q: 'Android compatibility?', a: 'Works with any phone using the included magnetic alignment ring. Center it once; after curing you get repeatable snap alignment.' },
    { q: 'Can I use it for live streaming?', a: 'Absolutely. Portrait or landscape orientation swaps instantly. Stable hold keeps the frame steady for workouts, classes or coaching calls.' },
    { q: 'What is included?', a: 'Mount body, magnetic ring, optional nano‑suction pad, cleaning wipe, quick start guide.' },
  ] : [
    {q: 'Does it really hold up? Can the phone fall?', a: 'The magnetic system has been wind‑tunnel tested and validated by thousands of users. Properly centered, it will not drop your phone under normal riding conditions.'},
    {q: 'Can someone steal my phone?', a: 'Like any accessory, a motivated thief could grab it. The strong magnetic hold resists casual bumps, but we recommend removing your phone when leaving the vehicle unattended.'},
    {q: 'Are magnets dangerous for my phone?', a: 'Modern smartphones are safe: magnets are placed so that they do not affect memory or signal. Wireless charging works with MagSafe-ready setups (see compatibility).'},
    {q: 'Which version to choose?', a: 'Pick the support that matches your activity (bike, moto, etc.) and the adapter or sleeve size matching your phone/case thickness.'},
    {q: 'Is there a guarantee ?', a: 'Yes, register your product to benefit from the 10 year warranty on magnetic mounts.'},
    {q: 'Is it compatible with induction charging and/or MagSafe?', a: 'With MagSafe phones you can use it directly. For adhesive plate usage, remove the plate when placing on a wireless/MagSafe charger if charging performance is reduced.'},
  ];
  const [open,setOpen]=useState<number|null>(null);
  return (
    <section className="bg-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-center text-lg font-semibold mb-10">Do you still have questions?</h2>
        <div className="divide-y divide-gray-200">
          {items.map((it,i)=>(
            <div key={i}>
              <button onClick={()=>setOpen(o=>o===i?null:i)} className="w-full flex items-center justify-between py-4 text-left group">
                <span className="flex items-center gap-3 text-sm"><span className="text-gray-400">?</span>{it.q}</span>
                <span className="text-gray-400 group-hover:text-black transition text-xs" style={{transform: open===i? 'rotate(180deg)':'rotate(0deg)'}}>▾</span>
              </button>
              {open===i && <div className="pb-6 -mt-2 text-gray-600 text-sm leading-relaxed">{it.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Bottom feature bar (mirrors site-wide icons)
function ProductBottomFeatures() {
  const feats = [
    {label:'Free delivery', sub:'from €49 and shipping within 24 to 48 hours', icon:<svg width="30" height="30" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24"><path d="M3 7h13v10H3z"/><path d="M16 10h5v7h-5z"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="18.5" cy="17" r="1.5"/></svg>},
    {label:'Secure payments', sub:'Visa, Mastercard, Paypal, Apple Pay', icon:<svg width="30" height="30" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>},
    {label:'At your service 7/7 days', sub:'After‑sales service: contact@adamcotech.com', icon:<svg width="30" height="30" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4V5a4 4 0 1 0-8 0v3c0 2.21 1.79 4 4 4Zm6 0a6 6 0 0 1-12 0H3a9 9 0 0 0 18 0h-3Z"/></svg>},
    {label:'Product warranty', sub:'10 years by registering your product!', icon:<svg width="30" height="30" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24"><path d="M12 2 3 6v6c0 5 3.6 9.4 9 10 5.4-.6 9-5 9-10V6l-9-4Z"/><path d="m9 12 2 2 4-4"/></svg>},
  ];
  return (
    <section className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {feats.map(f => (
          <div key={f.label} className="flex flex-col items-center gap-3">
            <div className="text-black">{f.icon}</div>
            <div className="font-semibold text-sm">{f.label}</div>
            <div className="text-[11px] text-gray-500 max-w-[180px] leading-snug">{f.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Related Products (reuse homepage top products)
import Link from 'next/link';
import { products } from '@/data/products';
function RelatedProducts() {
  const list = products.slice(0,3); // first three
  return (
    <section className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-semibold mb-10">You may also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map(p => (
            <div key={p.id} className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col shadow-sm">
              <div className="relative w-full aspect-[4/3] mb-4 rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                {p.media[0].type==='image' ? (
                  <Image src={p.media[0].src} alt={p.title} width={600} height={450} className="object-contain w-full h-full" />
                ) : (
                  <video src={p.media[0].src} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                )}
              </div>
              <h3 className="font-semibold text-base mb-2 leading-snug min-h-[48px]">{p.title}</h3>
              <p className="text-xs text-gray-600 mb-4 flex-1">{p.subtitle}</p>
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-red-500">{'★★★★★'.slice(0,p.rating)}</span>
                <span className="text-gray-500">{p.reviewCount} reviews</span>
              </div>
              <Link href={`/product/${p.slug}`} className="w-full bg-black text-white py-3 rounded font-semibold text-sm text-center hover:bg-gray-800 transition">View product {p.basePrice.toFixed(2).replace('.',',')} €</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
