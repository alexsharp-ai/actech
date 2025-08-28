"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function SiteHeader(){
  const isMobile = useIsMobile();
  return (
    <>
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
        <nav className="hidden lg:flex gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-red-500 transition text-white">Home</Link>
          <Link href="/products" className="hover:text-red-500 transition text-white">Products</Link>
          <Link href="/#accessories" className="hover:text-red-500 transition text-white">Accessories</Link>
        </nav>
        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white">
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
        <div className="flex md:hidden items-center gap-4 text-white">
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
        <div className="lg:hidden flex gap-4 overflow-x-auto no-scrollbar px-4 py-2 bg-black/80 border-b border-white/10 text-white">
          {[
            {label:'Home', href:'/'},
            {label:'Products', href:'/products'},
            {label:'Accessories', href:'/#accessories'}
          ].map(item => (
            <Link key={item.label} href={item.href} className="flex-shrink-0 px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 text-xs font-medium whitespace-nowrap">
              {item.label}
            </Link>
          ))}
          <style jsx>{`
            .no-scrollbar::-webkit-scrollbar{display:none}
            .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
          `}</style>
        </div>
      )}
    </>
  );
}