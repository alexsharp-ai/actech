"use client";
import React, { useState } from 'react';

export default function AccessoriesComingSoon(){
  const [email,setEmail]=useState('');
  const [submitted,setSubmitted]=useState(false);
  const onSubmit=(e:React.FormEvent)=>{e.preventDefault(); if(!email) return; setSubmitted(true);};
  return (
    <div className="min-h-[70vh] bg-white text-black flex items-center justify-center px-4 py-24">
      <div className="max-w-2xl w-full flex flex-col gap-10 items-center text-center">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Our team is crafting new accessories for your hands‑free life.</h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto">Be first to know when they drop: ultra‑strong mounts, smart charging add‑ons, travel kits and more. Join the early list and get an exclusive launch offer.</p>
        </div>
        {!submitted && (
          <form onSubmit={onSubmit} className="w-full flex flex-col sm:flex-row gap-3">
            <input value={email} onChange={e=>setEmail(e.target.value)} required type="email" placeholder="you@email.com" className="flex-1 border border-gray-300 rounded-md px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
            <button type="submit" className="bg-black text-white px-8 py-4 rounded-md text-sm font-semibold hover:bg-gray-800 transition">Notify me</button>
          </form>
        )}
        {submitted && (
          <div className="text-sm bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-md w-full">Thanks! You&apos;re on the list – watch your inbox.</div>
        )}
        <div className="pt-4 text-[11px] uppercase tracking-[2px] text-gray-500">Stay MagSafe.</div>
      </div>
    </div>
  );
}