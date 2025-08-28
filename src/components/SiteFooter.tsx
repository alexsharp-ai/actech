import React from 'react';
import Image from 'next/image';

export default function SiteFooter({ compact = false }: { compact?: boolean }){
  return (
    <footer className={`bg-black text-gray-300 ${compact ? 'mt-0' : 'mt-24'} border-t border-white/10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid gap-12 md:gap-8 md:grid-cols-5">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <Image src="/adamcotech-logo.png" alt="AdamCoTech Logo" width={48} height={48} className="invert" />
            <span className="text-white font-semibold text-2xl tracking-wide">AdamCoTech</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400 max-w-md">High-performance tech accessories engineered for riders, runners, and creators. Designed in Amsterdam. Built for the world.</p>
          <div className="flex gap-3 pt-2">
            {['/visa.svg','/mastercard.svg','/paypal.svg','/applepay.svg','/googlepay.svg'].map(src => (
              <Image key={src} src={src} alt="payment" width={40} height={24} className="object-contain invert" />
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Products</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'MagSafe Bike', href: '/product/bike-phone-mount' },
              { label: 'MagSafe Desk', href: '/product/magsafe-desk-stand' },
              { label: 'Hagsafe Gym & Stream', href: '/product/magsafe-gym-stream' }
            ].map(item => (
              <li key={item.label}><a href={item.href} className="hover:text-white transition">{item.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              {[{label:'FAQ',href:'/faq'},{label:'Warranty',href:'/warranty'},{label:'Returns',href:'/returns'},{label:'Contact',href:'/contact'}].map(i => (
                <li key={i.label}><a href={i.href} className="hover:text-white transition">{i.label}</a></li>
              ))}
            </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {[{label:'About Us',href:'/about'},{label:'Sustainability',href:'/sustainability'}].map(i => <li key={i.label}><a href={i.href} className="hover:text-white transition">{i.label}</a></li>)}
            </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} AdamCoTech. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="/privacy-policy" className="hover:text-gray-300">Privacy</a>
            <a href="/terms" className="hover:text-gray-300">Terms</a>
            <a href="/cookies" className="hover:text-gray-300">Cookies</a>
            <a href="/imprint" className="hover:text-gray-300">Imprint</a>
          </div>
        </div>
      </div>
    </footer>
  );
}