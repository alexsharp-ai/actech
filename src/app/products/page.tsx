import React from 'react';
import { products } from '@/data/products';
import Link from 'next/link';
import Image from 'next/image';

// Simple Products listing page that leads to existing product detail (pro-moto-holder)
export default function ProductsPage(){
  const list = products.filter(p=>['pro-moto-holder','magsafe-desk-stand','pro-boost-moto-holder'].includes(p.slug));
  return (
    <div className="bg-white text-black w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 pb-28">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Products</h1>
        <p className="text-gray-600 mb-12 max-w-2xl">Explore our flagship magnetic mounting system. More products coming soon.</p>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {list.map(p => (
            <div key={p.id} className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col shadow-sm hover:shadow-md transition">
              <div className="relative w-full aspect-[4/3] mb-4 rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                {p.media[0].type==='image' ? (
                  <Image src={p.media[0].src} alt={p.title} width={600} height={450} className="object-contain w-full h-full" />
                ) : (
                  <video src={p.media[0].src} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                )}
              </div>
              <h2 className="font-semibold text-xl mb-2 leading-snug min-h-[56px]">{p.title}</h2>
              <p className="text-sm text-gray-600 mb-4 flex-1">{p.subtitle}</p>
              <Link href={`/product/${p.slug}`} className="inline-block bg-black hover:bg-gray-800 transition text-white font-semibold px-5 py-3 rounded text-center">View product {p.basePrice.toFixed(2).replace('.',',')} €</Link>
            </div>
          ))}
        </div>
        {/* Customer Reviews preview */}
        <ProductsReviewsPreview />
      </div>
    </div>
  );
}

// Lightweight reviews preview (static sample) reused from product page design
function ProductsReviewsPreview(){
  const sample = [
    { id:'r1', name:'Ulrich Borrmann', date:'2025-04-12', body:'Bicycle phone holder with metal plate', verified:true, rating:5 },
    { id:'r2', name:'Arnaud Petoux', date:'2025-04-12', body:'Easy installation and fast delivery, thank you', verified:true, rating:5 },
    { id:'r3', name:'Dorin Grama', date:'2025-04-09', body:"Ok, when I received it I thought that the magnets couldn't possibly be so strong in such a small space. I was wrong – if you're not careful and slowly bring the phone closer to the holder...", verified:true, rating:5, short:'Read more' },
  ];
  return (
    <section className="mt-24">
      <div className="bg-[#fafafa] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-10 py-12 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="text-center md:text-left flex-1">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Customer Reviews</h2>
              <div className="flex flex-col items-center md:items-start text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">★★★★★</span>
                  <Link href="/product/pro-moto-holder#reviews" className="underline decoration-dotted hover:text-black transition">4.83 out of 5</Link>
                </div>
                <div>Based on 3769 reviews <span className="inline-block text-green-600">✔️</span></div>
              </div>
            </div>
            <div className="flex justify-center md:justify-end w-full md:w-auto">
              <Link href="/product/pro-moto-holder#reviews" className="bg-red-500 hover:bg-red-600 text-white rounded-full px-10 py-4 text-sm font-semibold shadow">Write a review</Link>
            </div>
          </div>
          <div className="border-t pt-8">
            <div className="flex items-center justify-between mb-6 text-sm font-medium text-red-600">
              <div className="flex items-center gap-1 cursor-default">Most Recent <span className="text-gray-400">▾</span></div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sample.map(r => (
                <div key={r.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col gap-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-red-500">{'★★★★★'.slice(0, r.rating)}</span>
                    <span className="text-[10px] text-gray-400">{new Date(r.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{r.name}</span>
                    {r.verified && <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded">Verified</span>}
                  </div>
                  <div className="text-gray-700 leading-relaxed text-[13px]">{r.body}</div>
                  {r.short && <button className="self-start text-[11px] underline decoration-dotted text-gray-500 hover:text-black">{r.short}</button>}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm pt-4">
            {[1,2,3].map(p => (
              <Link key={p} href="/product/pro-moto-holder#reviews" className={`px-1 ${p===1? 'font-semibold text-black':'text-gray-400 hover:text-black'}`}>{p}</Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
