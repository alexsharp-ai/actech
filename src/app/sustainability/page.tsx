import React from 'react';

export const metadata = { title: 'Sustainability - AdamCoTech' };

export default function SustainabilityPage(){
  return (
    <div className="w-full bg-white text-gray-900 min-h-full">
      <div className="max-w-3xl mx-auto px-6 py-16 pb-12 text-sm leading-relaxed text-center">
        <h1 className="text-3xl font-bold mb-6">Sustainability</h1>
        <p className="mb-6">At Adam Co Tech, we believe innovation should never come at the planet’s expense. From the start, we’ve designed our products to be as durable as they are functional. That means recyclable materials, long product lifecycles, and a modular repair philosophy — because the most sustainable product is the one you don’t have to replace every year.</p>
        <p className="mb-4">We’re committed to full transparency. That’s why we’re working on publishing detailed lifecycle metrics and material disclosures for every product we create. Our goal is simple: empower you to make smarter choices, and keep our planet a little cleaner with every magnetic click.</p>
      </div>
    </div>
  );
}
