
"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useIsMobile";
import LazyVideo from "@/components/LazyVideo";


export default function Home() {
  const isMobile = useIsMobile();
  // legacy mobile menu removed; ensure body scroll always enabled
  useEffect(()=>{ document.body.style.overflow = ''; },[]);
  return (
    <div className="font-sans bg-black text-white min-h-screen flex flex-col">
  {/* Main site content */}
      {/* Top Bar */}
      <div className="w-full bg-[#181c1c] text-xs py-1 px-2 flex justify-center items-center border-b border-[#222]">
        <span className="text-gray-200">Free delivery from €49, dispatch within 24-48 hours. Customer service available.</span>
      </div>

      {/* Header */}
  <header className="w-full flex items-center justify-between px-4 sm:px-8 py-4 bg-black/90 z-20 relative backdrop-blur supports-[backdrop-filter]:bg-black/70">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/adamcotech-logo.png" alt="AdamCoTech Logo" width={42} height={42} priority className="invert drop-shadow" />
            <span className="text-white font-semibold text-xl tracking-wide group-hover:text-red-500 transition-colors">AdamCoTech</span>
          </Link>
        </div>
  {/* Desktop Menu */}
  <nav className="hidden lg:flex gap-6 text-sm font-medium">
          {['Motorcycle / Scooter','Bike','Car','Run','Accessories'].map(i => (
            <a key={i} href="#" className="hover:text-red-500 transition">{i}</a>
          ))}
        </nav>
        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {['Retailers','Warranty','FAQ'].map(i => (
            <a key={i} href="#" className="hover:text-red-500 transition">{i}</a>
          ))}
          <button className="hover:text-red-500 transition" aria-label="Search">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button className="hover:text-red-500 transition relative" aria-label="Basket">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">0</span>
          </button>
        </div>
        {/* Mobile compact icons */}
        <div className="flex md:hidden items-center gap-4">
          <button aria-label="Search" className="hover:text-red-500 transition">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button aria-label="Basket" className="hover:text-red-500 transition relative">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">0</span>
          </button>
        </div>
      </header>
      {/* Mobile horizontal (landscape) nav bar */}
      {isMobile && (
        <div className="lg:hidden flex gap-4 overflow-x-auto no-scrollbar px-4 py-2 bg-black/80 border-b border-white/10">
          {['Motorcycle / Scooter','Bike','Car','Run','Accessories','Retailers','Warranty','FAQ'].map(item => (
            <a key={item} href="#" className="flex-shrink-0 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 text-xs font-medium whitespace-nowrap">
              {item}
            </a>
          ))}
          <style jsx>{`
            .no-scrollbar::-webkit-scrollbar{display:none}
            .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
          `}</style>
        </div>
      )}

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
          {/* Mobile: single horizontal row of 4 category boxes */}
          <div className="mt-6 flex md:hidden gap-3 w-full max-w-5xl px-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
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
            <style jsx>{`
              .no-scrollbar::-webkit-scrollbar{display:none}
              .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
            `}</style>
          </div>
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
              <button className="w-full bg-black text-white py-3 rounded font-semibold text-lg hover:bg-gray-900 transition">Add 39,95 €</button>
            </div>
            {/* Product 2 */}
            <div className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
              <div className="relative w-full h-56 mb-4">
                <Image src="/p2.png" alt="Bike phone mount (with steel plate)" width={600} height={336} className="w-full h-full object-contain p-2 rounded bg-gray-50" />
              </div>
              <div className="flex-1 flex flex-col items-center text-center">
                <div className="font-semibold text-lg min-h-[48px] flex items-start justify-center">Bike phone mount (with steel plate)</div>
                <div className="text-sm text-gray-600 mt-1 mb-2 px-2 min-h-[72px] flex items-end">Magnetic system with elastic silicone fixation, metal plate included.</div>
                <div className="mt-auto flex items-center justify-center mb-4">
                  <span className="text-red-500 text-xl mr-2">★★★★★</span>
                  <span className="font-semibold">3315</span> <span className="text-gray-600 ml-1">reviews</span>
                </div>
              </div>
              <button className="w-full bg-black text-white py-3 rounded font-semibold text-lg hover:bg-gray-900 transition">Add 29,95 €</button>
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
              <button className="w-full bg-black text-white py-3 rounded font-semibold text-lg hover:bg-gray-900 transition">Add 49,95 €</button>
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
              poster="/head.png"
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

      {/* Footer Section (Enhanced) */}
      <footer className="bg-[#0f0f0f] text-gray-300 mt-auto border-t border-[#1e1e1e]">
        <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 lg:grid-cols-3">
          {/* Left: Logo & Social */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Image src="/adamcotech-logo.png" alt="AdamCoTech Logo" width={140} height={40} className="invert" />
            </div>
            <div>
              <h5 className="uppercase tracking-wide text-xs font-semibold text-gray-400 mb-3">Social Media</h5>
              <div className="flex items-center gap-5 text-white text-xl">
                <a aria-label="YouTube" href="https://www.youtube.com/channel/UCcgUDNaKI14ETJRonwaiPPQ" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2s-.2-1.7-.9-2.4c-.9-.9-1.9-.9-2.4-1C16.6 2.4 12 2.4 12 2.4h0s-4.6 0-8.2.4c-.5.1-1.5.1-2.4 1C.7 4.5.5 6.2.5 6.2S.3 8.3.3 10.5v1.9c0 2.2.2 4.3.2 4.3s.2 1.7.9 2.4c.9.9 2.1.9 2.7 1 2 .2 8 .4 8 .4s4.6 0 8.2-.4c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.4.9-2.4s.2-2.2.2-4.3v-1.9c0-2.2-.2-4.3-.2-4.3ZM9.8 14.9V8.1l6.4 3.4-6.4 3.4Z"/></svg>
                </a>
                <a aria-label="Facebook" href="https://www.facebook.com/weareshapeheart/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 4.98 3.63 9.11 8.38 9.93v-7.03H7.9v-2.9h2.34V9.89c0-2.31 1.37-3.58 3.47-3.58.99 0 2.02.18 2.02.18v2.22h-1.14c-1.12 0-1.47.7-1.47 1.42v1.7h2.5l-.4 2.9h-2.1V22c4.75-.82 8.38-4.95 8.38-9.93Z"/></svg>
                </a>
                <a aria-label="Instagram" href="https://www.instagram.com/adamcotech" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7Zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10Zm-5 3.5A5.5 5.5 0 1 0 17.5 13 5.51 5.51 0 0 0 12 7.5Zm0 2a3.5 3.5 0 1 1-3.5 3.5A3.5 3.5 0 0 1 12 9.5Zm5.75-4.25a1.25 1.25 0 1 0 1.25 1.25 1.25 1.25 0 0 0-1.25-1.25Z"/></svg>
                </a>
                <a aria-label="TikTok" href="https://www.tiktok.com/@adamcotech" target="_blank" rel="noopener noreferrer" className="hover:text-fuchsia-400 transition">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 3c.3 2 1.6 3.6 3.6 3.7v2.2c-1.3 0-2.5-.4-3.6-1.1l.1 6.6c0 2.9-2.3 5.3-5.2 5.4H8c-2.9 0-5.3-2.3-5.4-5.2v-.2c0-2.9 2.3-5.3 5.2-5.4h.2c.6 0 1.1.1 1.6.3v2.4c-.5-.3-1-.4-1.6-.4-1.6 0-2.9 1.3-2.9 2.9S7.4 19 9 19s2.9-1.3 2.9-2.9l-.1-13.1h1.7Z"/></svg>
                </a>
                <a aria-label="Vimeo" href="https://vimeo.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.8 6.7c-.1 1.6-1.2 3.9-3.4 6.9-2.3 3.2-4.2 4.8-5.9 4.8-.99 0-1.84-.91-2.53-2.72l-1.38-5.01c-.51-1.85-1.06-2.78-1.66-2.78-.13 0-.59.28-1.39.84L6 8.3c.87-.76 1.73-1.53 2.6-2.29 1.17-1.02 2.05-1.56 2.64-1.62 1.38-.13 2.23.81 2.57 2.81.35 2.17.6 3.51.74 4.01.41 1.86.86 2.79 1.36 2.79.38 0 .97-.61 1.78-1.83.81-1.22 1.25-2.15 1.32-2.79.12-1.06-.31-1.6-1.29-1.6-.46 0-.93.1-1.41.29 0-1.47.85-2.18 2.55-2.13 1.75-.05 2.57 1.09 2.46 3.22Z"/></svg>
                </a>
              </div>
              <p className="mt-4 text-xs text-gray-500">Tag @AdamCoTech / #AdamCoTech to appear in our stories</p>
            </div>
          </div>

          {/* Middle: Menu Links */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
            <div className="flex flex-col gap-3">
              <h6 className="uppercase tracking-wide text-xs font-semibold text-gray-400">Menu</h6>
              <a href="#" className="hover:text-white transition">Our Story</a>
              <a href="#" className="hover:text-white transition">Press</a>
              <a href="#" className="hover:text-white transition">Warranty</a>
              <a href="#" className="hover:text-white transition">Choose Your Mount</a>
              <a href="#" className="hover:text-white transition">Retailers</a>
              <a href="#" className="hover:text-white transition">Our Policies</a>
            </div>
            <div className="flex flex-col gap-3 pt-8 md:pt-7">
              <a href="#" className="hover:text-white transition">Our Commitments</a>
              <a href="#" className="hover:text-white transition">FAQ</a>
              <a href="#" className="hover:text-white transition">User Manuals</a>
              <a href="#" className="hover:text-white transition">Blog</a>
              <a href="#" className="hover:text-white transition">Become a Reseller</a>
            </div>
          </div>

          {/* Right: Newsletter */}
            <div className="flex flex-col gap-6 max-w-md">
              <div>
                <h5 className="uppercase tracking-wide text-xs font-semibold text-gray-400 mb-4">Newsletter</h5>
                <form onSubmit={(e)=>{e.preventDefault(); const f=e.currentTarget; const email=(f.elements.namedItem('email') as HTMLInputElement).value; alert(`Subscribed: ${email}`); f.reset();}} className="flex w-full">
                  <input name="email" required type="email" placeholder="Email address" className="flex-1 bg-black/60 border border-black focus:border-gray-600 outline-none px-4 text-sm py-3 rounded-l" />
                  <button type="submit" className="px-5 bg-[#2b2b2b] hover:bg-[#3a3a3a] text-xs font-semibold tracking-wide rounded-r">REGISTER</button>
                </form>
                <p className="text-[11px] text-gray-500 mt-4 leading-relaxed">Subscribe to our newsletter*, get 10% off your next order and stay informed about the latest offers.</p>
                <p className="text-[11px] text-gray-500 mt-4 leading-relaxed">*By providing your email address, you acknowledge and accept our privacy policy. You can update your preferences or unsubscribe at any time.</p>
              </div>
            </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-[#1e1e1e] px-6 py-6 text-[11px] text-gray-500 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-4">
          <div>Copyright © 2025 AdamCoTech</div>
          <div>e-commerce développé par MOON MOON (Agence Shopify)</div>
        </div>
      </footer>
    </div>
  );
}
