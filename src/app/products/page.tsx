import React from 'react';
import { getProductBySlug } from '@/data/products';
import Link from 'next/link';
import Image from 'next/image';

// Simple Products listing page that leads to existing product detail (pro-moto-holder)
export default function ProductsPage(){
  const featured = getProductBySlug('pro-moto-holder');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">Products</h1>
      <p className="text-gray-400 mb-12 max-w-2xl">Explore our flagship magnetic mounting system. More products coming soon.</p>
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {featured && (
          <div className="bg-white/5 rounded-lg border border-white/10 p-6 flex flex-col">
            <div className="relative w-full aspect-[4/3] mb-4 rounded overflow-hidden bg-black/40 flex items-center justify-center">
              <Image src="/p1.png" alt={featured.title} width={600} height={450} className="object-contain w-full h-full" />
            </div>
            <h2 className="font-semibold text-xl mb-2">{featured.title}</h2>
            <p className="text-sm text-gray-400 mb-4 flex-1">{featured.subtitle}</p>
            <Link href={`/product/${featured.slug}`} className="inline-block bg-red-600 hover:bg-red-500 transition text-white font-semibold px-5 py-3 rounded text-center">View product</Link>
          </div>
        )}
      </div>
    </div>
  );
}
