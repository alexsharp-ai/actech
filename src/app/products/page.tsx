import React from 'react';
import { products } from '@/data/products';
import Link from 'next/link';
import Image from 'next/image';

// Simple Products listing page that leads to existing product detail (pro-moto-holder)
export default function ProductsPage(){
  const list = products.slice(0,3);
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
      </div>
    </div>
  );
}
