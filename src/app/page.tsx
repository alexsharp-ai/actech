
"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import LazyVideo from "@/components/LazyVideo";


export default function Home() {
  // legacy mobile menu removed; ensure body scroll always enabled
  useEffect(()=>{ document.body.style.overflow = ''; },[]);
  return (
  <div className="font-sans bg-black text-white min-h-screen flex flex-col">

      {/* Hero Section with video on all devices (optimized) */}
      <section className="relative flex flex-col items-center justify-center min-h-[60vh] md:min-h-[70vh] w-full overflow-hidden">
  <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
          poster="/head.png"
          preload="metadata"
        >
          <source src="/v2.mp4" type="video/mp4" />
        </video>
  {/* Lightened overlay for higher video visibility */}
  <div className="absolute inset-0 bg-black/25 z-10" />
        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full pt-24 pb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-center px-4">
            MagSafe on <span className="bg-red-500 px-2 rounded text-white inline-block">STEROIDS</span>
          </h1>
          <h2 className="text-base sm:text-xl md:text-2xl font-light mb-8 text-center px-4 max-w-3xl">the most strong, safe and universal magnetic holder is here!</h2>
          {/* Product Boxes */}
          {/* Mobile category boxes moved below hero to keep hero clean */}
          {/* Desktop / tablet: grid */}
          <div className="mt-8 hidden md:grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl px-4">
            {/* Box 1 */}
            <a href="#" className="relative rounded-lg overflow-hidden shadow-lg group">
              <Image src="/IMG_8007.webp" alt="E-Bikes & Scooters" width={400} height={160} className="w-full h-40 object-cover group-hover:scale-105 transition" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                <span className="text-lg font-bold text-white">E-Bikes &amp; Scooters</span>
              </div>
            </a>
            {/* Box 2 */}
            <a href="#" className="relative rounded-lg overflow-hidden shadow-lg group">
              <Image src="/b1.webp" alt="Bikes & Strollers" width={400} height={160} className="w-full h-40 object-cover group-hover:scale-105 transition" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                <span className="text-lg font-bold text-white">Bikes &amp; Strollers</span>
              </div>
            </a>
            {/* Box 3 */}
            <a href="#" className="relative rounded-lg overflow-hidden shadow-lg group">
              <Image src="/IMG_7742-2.webp" alt="Gym & Lifestyle" width={400} height={160} className="w-full h-40 object-cover group-hover:scale-105 transition" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                <span className="text-lg font-bold text-white">Gym &amp; Lifestyle</span>
              </div>
            </a>
            {/* Box 4 */}
            <a href="#" className="relative rounded-lg overflow-hidden shadow-lg group">
              <Image src="/l1.webp" alt="Endless possibilities" width={400} height={160} className="w-full h-40 object-cover group-hover:scale-105 transition" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                <span className="text-lg font-bold text-white">Endless possibilities</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Mobile Categories (moved from hero) */}
      <section className="md:hidden w-full bg-black pb-4 pt-2">
        <div className="mt-2 flex gap-3 w-full max-w-5xl px-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
          {[
            {src:'/IMG_8007.webp', label:'E-Bikes & Scooters'},
            {src:'/b1.webp', label:'Bikes & Strollers'},
            {src:'/IMG_7742-2.webp', label:'Gym & Lifestyle'},
            {src:'/l1.webp', label:'Endless possibilities'}
          ].map(cat => (
            <a key={cat.src} href="#" className="relative rounded-lg overflow-hidden shadow-lg group flex-shrink-0 w-48 h-32 snap-start">
              <Image src={cat.src} alt={cat.label} width={192} height={128} className="w-full h-full object-cover group-hover:scale-105 transition" />
              <div className="absolute inset-0 bg-black/35 flex items-end p-2">
                <span className="text-[11px] font-semibold text-white leading-snug">{cat.label}</span>
              </div>
            </a>
          ))}
        </div>
        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar{display:none}
          .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
        `}</style>
      </section>

      {/* Info Icons Section */}
      <section className="w-full bg-[#f5f5f5] py-8 px-2 flex flex-col items-center">
        <div className="max-w-6xl w-full grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Universal */}
          <div className="flex flex-col items-center text-center">
            <svg width="40" height="40" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24" className="mb-2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <div className="font-semibold text-lg text-black">Universal</div>
            <div className="text-sm text-gray-600">any telephone, any assembly</div>
          </div>
          {/* Reviews */}
          <div className="flex flex-col items-center text-center">
            <svg width="40" height="40" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24" className="mb-2"><polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2"/></svg>
            <div className="font-semibold text-lg text-black">4,8 / 5</div>
            <div className="text-sm text-gray-600">on average over 6,037 reviews</div>
          </div>
          {/* Retailers */}
          <div className="flex flex-col items-center text-center">
            <svg width="40" height="40" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24" className="mb-2"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
            <div className="font-semibold text-lg text-black">5000 retailers</div>
            <div className="text-sm text-gray-600">in the world</div>
          </div>
          {/* Warranty */}
          <div className="flex flex-col items-center text-center">
            <svg width="40" height="40" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24" className="mb-2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            <div className="font-semibold text-lg text-black">10 year warranty</div>
            <div className="text-sm text-gray-600">on magnetic mounts</div>
          </div>
        </div>
      </section>

      {/* Top of the moment Products Section */}
    <section className="w-full bg-white py-12 px-2 flex flex-col items-center">
        <div className="max-w-6xl w-full">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-left px-2 sm:px-0">Top of the moment</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2 sm:px-0">
            {/* Product 1 */}
            <div className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
              <div className="relative w-full h-56 mb-4">
                <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">New</span>
                <Image src="/p1.png" alt="Professional motorcycle phone holder with metal plate" width={600} height={336} className="w-full h-full object-contain p-2 rounded bg-gray-50" />
              </div>
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="font-semibold text-lg min-h-[48px] flex items-start justify-center">Professional motorcycle phone holder with metal plate</div>
                <div className="text-sm text-gray-600 mt-1 mb-2 px-2 min-h-[72px] flex items-end">Magnetic system with screwed fixing for motorcycle handlebars, steel plate included.</div>
                <div className="mt-auto flex items-center justify-center mb-4">
                  <span className="text-red-500 text-xl mr-2">★★★★★</span>
                  <span className="font-semibold">3769</span> <span className="text-gray-600 ml-1">reviews</span>
                </div>
              </div>
              <Link href="/product/pro-moto-holder" className="w-full bg-black text-white py-3 rounded font-semibold text-lg hover:bg-gray-900 transition text-center">View product 39,95 €</Link>
            </div>
            {/* Product 2 (MagSafe Desk Stand) */}
            <div className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
              <div className="relative w-full h-56 mb-4">
                <Image src="/a3.png" alt="MagSafe Desk Stand" width={600} height={336} className="w-full h-full object-contain p-6 rounded bg-gray-50" />
              </div>
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="font-semibold text-lg min-h-[48px] flex items-start justify-center">MagSafe Desk Stand – Adjustable</div>
                <div className="text-sm text-gray-600 mt-1 mb-2 px-2 min-h-[72px] flex items-end">Stable adjustable metal stand for MagSafe phones. Perfect for calls, streaming & charging.</div>
                <div className="mt-auto flex items-center justify-center mb-4">
                  <span className="text-red-500 text-xl mr-2">★★★★★</span>
                  <span className="font-semibold">128</span> <span className="text-gray-600 ml-1">reviews</span>
                </div>
              </div>
              <Link href="/product/magsafe-desk-stand" className="w-full bg-black text-white py-3 rounded font-semibold text-lg hover:bg-gray-900 transition text-center">View product 34,95 €</Link>
            </div>
            {/* Product 3 */}
            <div className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
              <div className="relative w-full h-56 mb-4">
                <Image src="/p3.png" alt="PRO BOOST motorcycle phone holder with metal plate" width={600} height={336} className="w-full h-full object-contain p-2 rounded bg-gray-50" />
              </div>
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="font-semibold text-lg min-h-[48px] flex items-start justify-center">PRO BOOST motorcycle phone holder with metal plate</div>
                <div className="text-sm text-gray-600 mt-1 mb-2 px-2 min-h-[72px] flex items-end">Magnetic system with screwed handlebar attachment and 360° arm, metal plate included.</div>
                <div className="mt-auto flex items-center justify-center mb-4">
                  <span className="text-red-500 text-xl mr-2">★★★★★</span>
                  <span className="font-semibold">3235</span> <span className="text-gray-600 ml-1">reviews</span>
                </div>
              </div>
              <Link href="/product/pro-moto-holder" className="w-full bg-black text-white py-3 rounded font-semibold text-lg hover:bg-gray-900 transition text-center">View product 49,95 €</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Carousel Section (moved BELOW products) */}
    <section className="w-full bg-white py-12 px-2 flex flex-col items-center">
        <div className="max-w-7xl w-full">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center px-2">Let customers speak for us</h2>
          <div className="text-center text-gray-600 mb-8">from 6590 reviews <span className="inline-block align-middle text-green-500">✔️</span></div>
          <div className="relative overflow-hidden">
            <div className="flex gap-8 animate-scroll-x whitespace-nowrap will-change-transform min-w-max" style={{ width: 'max-content' }}>
              {[1,2].map((_,i) => (
                <React.Fragment key={i}>
                  <div className="bg-white rounded-xl shadow p-6 min-w-[320px] max-w-xs flex flex-col items-center mx-2">
                    <Image src="/IMG_8007.webp" alt="E-Bikes & Scooters use case" width={400} height={160} className="w-full h-40 object-cover rounded mb-4" />
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-red-500 text-xl mr-2">★★★★★</span>
                    </div>
                    <div className="font-semibold">David Bass <span className="bg-black text-white text-xs px-2 py-0.5 rounded ml-1 align-middle">Verified</span></div>
                    <div className="text-sm text-gray-700">iPhone 13 cb125r</div>
                    <div className="text-base mb-2">Très solide</div>
                    <div className="text-xs text-gray-400 mt-2">22/08/2025</div>
                  </div>
                  <div className="bg-white rounded-xl shadow p-6 min-w-[320px] max-w-xs flex flex-col items-center mx-2">
                    <Image src="/b1.webp" alt="Bikes & Strollers use case" width={400} height={160} className="w-full h-40 object-cover rounded mb-4" />
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-red-500 text-xl mr-2">★★★★★</span>
                    </div>
                    <div className="font-semibold">Denis TURPLIN <span className="bg-black text-white text-xs px-2 py-0.5 rounded ml-1 align-middle">Verified</span></div>
                    <div className="text-sm text-gray-700">Support téléphone voiture</div>
                    <div className="text-base mb-2"></div>
                    <div className="text-xs text-gray-400 mt-2">21/08/2025</div>
                  </div>
                  <div className="bg-white rounded-xl shadow p-6 min-w-[320px] max-w-xs flex flex-col items-center mx-2">
                    <Image src="/IMG_7742-2.webp" alt="Gym & Lifestyle use case" width={400} height={160} className="w-full h-40 object-cover rounded mb-4" />
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-red-500 text-xl mr-2">★★★★★</span>
                    </div>
                    <div className="font-semibold">Antoine Gicquel <span className="bg-black text-white text-xs px-2 py-0.5 rounded ml-1 align-middle">Verified</span></div>
                    <div className="text-sm text-gray-700">Brassard de sport magnétique</div>
                    <div className="text-base mb-2"></div>
                    <div className="text-xs text-gray-400 mt-2">20/08/2025</div>
                  </div>
                  <div className="bg-white rounded-xl shadow p-6 min-w-[320px] max-w-xs flex flex-col items-center mx-2">
                    <Image src="/l1.webp" alt="Endless possibilities use case" width={400} height={160} className="w-full h-40 object-cover rounded mb-4" />
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-red-500 text-xl mr-2">★★★★★</span>
                    </div>
                    <div className="font-semibold">Estelle Thiers <span className="bg-black text-white text-xs px-2 py-0.5 rounded ml-1 align-middle">Verified</span></div>
                    <div className="text-sm text-gray-700">iPhone 15 + Moto</div>
                    <div className="text-base mb-2">Incroyable. J&apos;ai rien à dire vraiment. C&apos;est génial, et ça tient vraiment très très bien. Merci pour ce produit</div>
                    <div className="text-xs text-gray-400 mt-2">19/08/2025</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <style jsx>{`
            @keyframes scroll-x { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .animate-scroll-x { animation: scroll-x 30s linear infinite; }
          `}</style>
        </div>
      </section>

      {/* Brand Story & Trust Section */}
      <section className="w-full bg-white">
        {/* Story Split Panel */}
        <div className="grid md:grid-cols-2 min-h-[380px]">
          <div className="relative flex items-center justify-center p-8 overflow-hidden">
            {/* Brand story media: static image on mobile, video on md+ */}
            <LazyVideo
              src="/v2.mp4"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white/15" />
            <div className="relative p-6 md:p-10 max-w-xl w-full rounded bg-white/80 shadow">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 text-black">Simple, effective, long-lasting products</h2>
              <button className="px-6 py-3 bg-black text-white font-semibold rounded shadow hover:bg-gray-800 transition">OUR STORY</button>
            </div>
          </div>
          <div className="flex flex-col items-start justify-center p-10 bg-gray-50">
            <h3 className="text-2xl sm:text-3xl font-semibold mb-6 text-black">A unique and simple concept</h3>
            <div className="w-12 h-[3px] bg-black mb-6" />
            <p className="text-gray-800 font-medium mb-6">AdamCoTech is a forward-thinking brand crafting magnetic accessories to keep your devices secure on the move.</p>
            <p className="text-gray-600 leading-relaxed">A unique patented magnetic system that holds strong, whatever your activity or phone.</p>
          </div>
        </div>
        {/* Trusted By Logos */}
        <div className="max-w-7xl mx-auto py-14 px-4">
          <h4 className="text-2xl font-semibold mb-8 text-center md:text-left">They trust us:</h4>
          <div className="flex flex-wrap gap-6 items-center justify-center">
            {[
              {file:"amaazon.webp", alt:"Amazon"},
              {file:"appleplay.webp", alt:"Apple Pay"},
              {file:"googlepay.png", alt:"Google Pay"},
              {file:"bol.png", alt:"bol.com"},
            ].map(l => (
              <div key={l.file} className="h-14 w-32 flex items-center justify-center border rounded bg-white shadow-sm p-2">
                <Image src={`/${l.file}`} alt={`${l.alt} logo`} width={120} height={40} className="object-contain w-full h-full" />
              </div>
            ))}
          </div>
        </div>
        {/* Feature Icons Row */}
        <div className="w-full border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 py-12 px-6 text-center text-black/90">
            <div className="flex flex-col items-center gap-3">
              <svg width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24"><path d="M4 4h16v12H4z"/><path d="M22 18H2"/></svg>
              <div className="font-semibold">Free delivery</div>
              <div className="text-xs text-gray-500 max-w-[180px]">from €49 and shipped within 24 to 48 hours</div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <svg width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>
              <div className="font-semibold">Secure payments</div>
              <div className="text-xs text-gray-500 max-w-[180px]">Visa, Mastercard, Paypal, Apple Pay</div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <svg width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>
              <div className="font-semibold">Available 7/7</div>
              <div className="text-xs text-gray-500 max-w-[180px]">7/7 day service: contact@adamcotech.com</div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <svg width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              <div className="font-semibold">Product warranty</div>
              <div className="text-xs text-gray-500 max-w-[180px]">10 years when you register your product!</div>
            </div>
          </div>
        </div>
      </section>

  {/* Footer removed (now global) */}
    </div>
  );
}
