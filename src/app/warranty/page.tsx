"use client";
import React, { useState } from 'react';

export default function WarrantyPage(){
  const [submitted,setSubmitted]=useState(false);
  return (
    <div className="bg-white text-black min-h-screen font-sans">
      {/* Hero */}
      <section className="relative w-full h-[300px] md:h-[420px] flex items-end justify-center overflow-hidden pb-16 md:pb-20">
  <div className="absolute inset-0 bg-[url('/IMG_7742-2.webp')] bg-cover bg-center brightness-[.55]" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            <span className="inline-block mr-2">AdamCoTech</span>
            <span className="bg-red-500 px-2 md:px-3 rounded text-white inline-block">warranty</span>
          </h1>
        </div>
      </section>
      {/* Intro card */}
      <section className="max-w-5xl mx-auto -mt-8 md:-mt-12 bg-white shadow-sm border rounded-xl p-8 flex flex-col gap-6 relative z-20">
        <p className="text-sm md:text-base text-center leading-relaxed">
          For every purchase you benefit from a standard <strong>2‑year warranty</strong> on all products.
          We extend it to <strong>10 years for magnetic mounts</strong> (excluding sleeves & metal plates) when you register your product with the short form below.
        </p>
        <div className="flex justify-center">
          <a href="#register" className="bg-black text-white px-8 py-3 rounded font-semibold text-sm hover:bg-gray-800 transition">Extend my warranty</a>
        </div>
      </section>
      {/* Steps */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold mb-8">How does it work?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[{
            title:'Step 1', icon:'👉', body:'Complete the short registration form below.', foot:'10 year warranty →'
          },{
            title:'Step 2', icon:'☆', body:'Your warranty is automatically extended to 10 years for mounts.', foot:'Confirmation email'
          },{
            title:'Step 3', icon:'🛠️', body:'If an issue occurs we replace the defective part after review.', foot:'Fast support'
          }].map(card => (
            <div key={card.title} className="bg-gray-50 border rounded-lg p-6 flex flex-col gap-3">
              <div className="text-sm font-semibold">{card.title}</div>
              <div className="text-2xl" aria-hidden>{card.icon}</div>
              <div className="text-sm text-gray-700 leading-relaxed flex-1">{card.body}</div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wide">{card.foot}</div>
            </div>
          ))}
        </div>
      </section>
      {/* Registration Form */}
      <section id="register" className="max-w-4xl mx-auto px-4 pb-24">
        <h2 className="text-xl font-semibold mb-6">Extend your warranty</h2>
        {submitted ? (
          <div className="p-6 border rounded-lg bg-green-50 text-sm text-green-700">
            Thank you! Your warranty extension request has been received. Keep your proof of purchase for any future claim.
          </div>
        ) : (
          <form onSubmit={(e)=>{e.preventDefault();setSubmitted(true);}} className="grid gap-6 bg-white border rounded-xl p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide uppercase text-gray-600">First name</label>
                <input required className="border rounded px-3 py-2 text-sm" placeholder="Jane" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide uppercase text-gray-600">Last name</label>
                <input required className="border rounded px-3 py-2 text-sm" placeholder="Doe" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide uppercase text-gray-600">Email</label>
                <input required type="email" className="border rounded px-3 py-2 text-sm" placeholder="you@example.com" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide uppercase text-gray-600">Order / receipt number</label>
                <input required className="border rounded px-3 py-2 text-sm" placeholder="#A12345" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-semibold tracking-wide uppercase text-gray-600">Product</label>
                <select required className="border rounded px-3 py-2 text-sm bg-white">
                  <option value="">Select a product</option>
                  <option>Ultra‑strong universal magnetic phone mount</option>
                  <option>MagSafe Desk Stand</option>
                  <option>MagSafe GYM & STREAM Mount</option>
                  <option>Bike phone mount</option>
                  <option>PRO BOOST motorcycle phone holder</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-semibold tracking-wide uppercase text-gray-600">Message (optional)</label>
                <textarea rows={4} className="border rounded px-3 py-2 text-sm" placeholder="Extra info or feedback" />
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <input required type="checkbox" id="agree" className="mt-0.5" />
              <label htmlFor="agree">I confirm the information provided is accurate and I keep my proof of purchase.</label>
            </div>
            <button type="submit" className="bg-black text-white px-6 py-3 rounded font-semibold text-sm hover:bg-gray-800 transition w-full md:w-auto">Submit</button>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Personal data is only used to validate your warranty extension request and improve product reliability. You can request deletion at any time.
            </p>
          </form>
        )}
      </section>
      {/* FAQ short */}
      <section className="bg-gray-50 border-t border-gray-200 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-6">Warranty FAQ</h2>
          <div className="grid md:grid-cols-2 gap-8 text-sm">
            <div>
              <h3 className="font-semibold mb-2">What is covered?</h3>
              <p className="text-gray-700 leading-relaxed">Manufacturing defects in materials and magnetic components. Wear & tear, misuse, cosmetic scratches, adhesive fatigue from improper prep, and deliberate damage are excluded.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Why 10 years for mounts?</h3>
              <p className="text-gray-700 leading-relaxed">Our magnetic system is engineered for long‑term retention. Registration lets us trace batches and continuously improve durability.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How to claim?</h3>
              <p className="text-gray-700 leading-relaxed">Contact support with photos + proof of purchase. After validation we send a replacement part or equivalent product.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Transferable?</h3>
              <p className="text-gray-700 leading-relaxed">Yes if you pass the product along with the original proof of purchase and registration confirmation.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
