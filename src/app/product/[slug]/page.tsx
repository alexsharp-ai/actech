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
      <ProductFAQ />
        </div>
      </div>
  <FeaturesAndTrust />
  <ProductAssembly slug={product.slug} />
  <ProductCompatibility slug={product.slug} />
  <ProductReviews slug={product.slug} />
  <ProductMoreQuestions />
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

// FAQ Accordion
function ProductFAQ() {
  const items: { title: string; content: React.ReactNode }[] = [
    {
      title: 'What does my product contain?',
      content: (
        <ul className="list-disc ml-6 space-y-1 text-sm md:text-[15px]">
          <li>Everything is included in the pack which includes:</li>
          <li className="ml-4 list-none">- The screwed support</li>
          <li className="ml-4 list-none">- The metal plate</li>
            <li className="ml-4 list-none">- 3 adapters for different handlebar diameters</li>
            <li className="ml-4 list-none">- The Allen key</li>
            <li className="ml-4 list-none">- The carrying bag</li>
        </ul>
      )
    },
    {
      title: 'How does it work?',
      content: (
        <div className="space-y-3 text-sm md:text-[15px]">
          <p><strong>Step 1:</strong> Screw your support to the handlebars by choosing the adapter adapted to your diameter (22 to 32 mm).</p>
          <p><strong>Step 2:</strong> Stick the metal plate on your phone case.</p>
          <p><strong>Step 3:</strong> Clap the metal plate by centering them on the support. There you go, your phone won&apos;t move.</p>
        </div>
      )
    },
    {
      title: 'Does it hold?',
      content: (
        <div className="space-y-4 text-sm md:text-[15px]">
          <p><strong>Yes it holds. And it holds very strong!</strong></p>
          <div>
            <p className="mb-2">But rather than a long speech here are some important points:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Pavements, potholes, sidewalks, mountain bikes... the support holds!</li>
              <li>The magnetic system supports up to 50 times the weight of your smartphone.</li>
              <li>Tested in a wind tunnel up to 140 km/h (maximum power of the wind tunnel) Stable even at high speed (tested up to 225 km/h on a circuit)</li>
              <li>The phone does not move on the handlebars, it does not work.</li>
              <li>The system is validated by more than 5,000 stores.</li>
            </ul>
          </div>
          <p>And you can imagine that, for 5 years, if our supports did not work, we would no longer be there and the most beautiful brands would not sell to us.</p>
        </div>
      )
    },
    {
      title: 'The advantages of the product',
      content: (
        <ul className="list-disc ml-6 space-y-1 text-sm md:text-[15px]">
          <li>Avoids reflections in direct sunlight</li>
          <li>Adjustable landscape/portrait without tools</li>
          <li>Powerful adhesive</li>
        </ul>
      )
    },
    {
      title: 'Technical characteristics',
      content: (
        <ul className="list-disc ml-6 space-y-1 text-sm md:text-[15px]">
          <li>Compatible with almost all handlebars</li>
          <li>Plate 1.5 mm thick and 48 mm in diameter</li>
          <li>Universal, compatible with all brands of phones</li>
          <li>Harmless to the phone: magnets located between two iron plates cut the magnetic field at the phone (patent registered)</li>
          <li>The adhesive metal plates do not protect the phone from vibrations and are not directly compatible with induction charging</li>
          <li>Remove the case from your phone to charge it on your MagSafe charger.</li>
          <li>Do not stick to leather, textured, textile or non-slip cases</li>
        </ul>
      )
    },
    {
      title: 'Vibration incompatibility',
      content: (
        <div className="space-y-4 text-sm md:text-[15px]">
          <p><strong>Attention!</strong> Unlike our pouches, the adhesive metal plate does not completely protect against engine and road vibrations. The 2 wheels listed below can damage the optical stabilizer of your smartphone through vibration.</p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>BMW</strong> 310GS, F800 R/GS/GT, R nine T, R1200GS/RT, S1000R</li>
            <li><strong>Ducati</strong> Hypermotard, Monster, Multistrada, Supersport</li>
            <li><strong>Harley Davidson</strong> Fat Bob, Low Rider S, Street Bob, Wide Glide</li>
            <li><strong>Honda</strong> CB, CBR, CRF, Grom, Shadow</li>
            <li><strong>Kawasaki</strong> Er-6n, KLX, Ninja, Versys, Z650, Z900RS</li>
            <li><strong>KTM & Husqvarna</strong> Tous les modèles</li>
            <li><strong>MV Agusta</strong> Brutale</li>
            <li><strong>Suzuki</strong> DRZ, GSF, GSX-R, GSX-S</li>
            <li><strong>Triumph</strong> Bonneville, Rocket 3, Scrambler, Speed Triple, Speed Twin, Thruxton</li>
            <li>Non-exhaustive list</li>
          </ul>
        </div>
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
  return (
    <section className="max-w-7xl mx-auto px-4 py-24">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left text / tabs */}
        <div className="order-2 md:order-1 flex flex-col gap-6">
          <div className="text-[11px] tracking-[2px] font-medium text-red-600 uppercase">Handlebar and stem</div>
          <h2 className="text-2xl md:text-3xl font-semibold">Turnkey assembly</h2>
          <div className="flex gap-2 text-[11px] tracking-wide">
            <button onClick={()=>setTab('assembly')} className={`px-4 py-2 border text-[11px] font-semibold ${tab==='assembly'? 'bg-black text-white border-black':'bg-white text-gray-600 border-gray-300 hover:border-black'}`}>ASSEMBLY</button>
            <button onClick={()=>setTab('inside')} className={`px-4 py-2 border text-[11px] font-semibold ${tab==='inside'? 'bg-black text-white border-black':'bg-white text-gray-600 border-gray-300 hover:border-black'}`}>WHAT&apos;S INSIDE</button>
          </div>
          {tab==='assembly' && (
            <ol className="space-y-5 text-[13px] leading-relaxed max-w-md list-decimal ml-4">
              <li>Choose the adapter according to the diameter of your handlebar: 31.8mm diameter handlebar: no adapter. 28.6mm diameter handlebar: 1.7mm adapter. 25.4mm diameter handlebar: 3.5mm adapter. 22.2mm diameter handlebar: 5.1mm adapter.</li>
              <li>Position the adapter on the handlebars, then screw the support on top, using the Allen key.</li>
              <li>Stick the metal plate on your phone case, snap it onto the support (making sure to center it) and off you go!</li>
            </ol>
          )}
          {tab==='inside' && (
            <ul className="space-y-2 text-[13px] leading-relaxed max-w-md list-disc ml-4">
              <li>Screwed support</li>
              <li>Magnetic metal plate</li>
              <li>3 diameter adapters</li>
              <li>Allen key</li>
              <li>Carrying bag</li>
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
          <div className="text-[11px] tracking-[2px] font-medium text-red-600 uppercase">Adhesive metal plate</div>
          <h2 className="text-2xl md:text-3xl font-semibold">Compatible with your phone</h2>
          <div className="flex gap-2 text-[11px] tracking-wide">
            <button onClick={()=>setTab('assembly')} className={`px-4 py-2 border text-[11px] font-semibold ${tab==='assembly'? 'bg-black text-white border-black':'bg-white text-gray-600 border-gray-300 hover:border-black'}`}>ASSEMBLY</button>
            <button onClick={()=>setTab('inside')} className={`px-4 py-2 border text-[11px] font-semibold ${tab==='inside'? 'bg-black text-white border-black':'bg-white text-gray-600 border-gray-300 hover:border-black'}`}>WHAT&apos;S INSIDE</button>
          </div>
          {tab==='assembly' && (
            <div className="space-y-5 text-[13px] leading-relaxed max-w-md">
              <p>The adhesive metal plate can be installed on the protective shell of any smartphone. Thanks to the adhesive metal plate, enjoy optimal visibility to use your phone during your activities.</p>
              <p><strong>Please note:</strong> depending on the phone cases, the adhesive will stick more or less well (on textured cases), or not at all (on textile protections, anti-dust case).</p>
            </div>
          )}
          {tab==='inside' && (
            <ul className="space-y-2 text-[13px] leading-relaxed max-w-md list-disc ml-4">
              <li>1 x Adhesive metal plate</li>
              <li>Cleaning wipe</li>
              <li>Quick start guide</li>
            </ul>
          )}
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
function ProductMoreQuestions() {
  const items = [
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
