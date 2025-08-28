import React from 'react';
import Image from 'next/image';
import LazyVideo from '@/components/LazyVideo';

export const metadata = { title: 'About Us - AdamCoTech' };

export default function AboutPage(){
  return (
    <div className="w-full bg-white text-gray-900">
      {/* Hero Section */}
      <div className="relative">
  {/* Full-width video header */}
  <div className="w-full relative overflow-hidden h-[40vh] md:h-[33vh] bg-black">
  <LazyVideo src="/v1.mp4" poster="/head.png" className="w-full h-full object-cover" />
    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-black/10 to-black/0" />
  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-gray-800 shadow">v1</span>
  </div>
        {/* Title & intro text */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 pt-12 pb-20">
          <h1 className="text-4xl md:text-6xl font-bold leading-[0.85] tracking-tight mb-12 text-center">
            <span className="block">The Story</span>
            <span className="block italic">of</span>
            <span className="block">Adam Co Tech</span>
          </h1>
          <div className="md:max-w-5xl">
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">Born in Amsterdam, built on bikes and driven by the belief that magnetic, modular mounting should feel invisible — just a seamless click that keeps your phone exactly where you need it.</p>
            <p className="text-gray-700 leading-relaxed font-bold italic">What started as a safer way to ride has grown into a platform that supports movement, focus and performance across every part of the day.</p>
          </div>
        </div>
      </div>

      {/* Story & Expansion */}
      {/* Story & Expansion (aligned with hero left edge) */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pb-20 text-left">
        <div className="grid lg:grid-cols-5 gap-12 text-left items-start">
          <div className="lg:col-span-2 flex flex-col">
            <div className="overflow-hidden rounded-xl shadow bg-gray-100 relative aspect-[3/4] max-h-[680px] w-full">
              <Image src="/tal.webp" alt="Product showcase" fill className="object-cover" priority />
            </div>
          </div>
          <div className="lg:col-span-3 text-left">
            <p className="mb-4 text-gray-700"><span className="font-bold text-lg md:text-xl mr-1">Our story</span>starts in the city of bikes: Amsterdam. Here, riding with one hand on the handlebars and the other gripping your phone is not just uncomfortable — it’s dangerous. Traditional phone holders didn’t help much either. They were clunky, made of cheap plastic, hard to mount, and even harder to take your phone out of.</p>
            <p className="mb-6 text-gray-700">There had to be a better way. That frustration sparked an idea: a simple, strong, and elegant solution powered by MagSafe technology. No clips, no stress, no fear of your phone flying off mid-ride. Just a secure connection that clicks into place — sleek, fast, and reliable.</p>
            <h2 className="text-2xl font-semibold mb-4">From the Streets to the Desk and the Gym</h2>
            <p className="mb-4 text-gray-700">Our first product — the MagSafe Bike Mount — quickly found its place in the cycling world. But why stop there? We realized the same principle could transform how people work and train. That’s why we expanded into two new lines:</p>
            <ul className="list-disc pl-5 mb-6 text-gray-700 space-y-2">
              <li><strong>Desk:</strong> a magnetic setup that keeps your workspace clean, minimal, and efficient.</li>
              <li><strong>Gym &amp; Stream:</strong> mounts designed to move with you, keeping your phone safe while you sweat or stream.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-black border-y border-black py-12 text-left">
        <div className="max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-10 items-start text-left">
          <div className="text-left">
            <h2 className="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
            <p className="text-white/80 leading-relaxed">At Adam Co Tech, we’re not just designing accessories. We’re creating tools that fit seamlessly into your lifestyle — whether you’re biking through the city, powering through a workout, or grinding at your desk. Everything we build comes from one belief: technology should support you, not slow you down.</p>
          </div>
          <div className="bg-black rounded-xl p-6 relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-white/0" />
            <ul className="relative space-y-3 text-white text-sm font-medium">
              <li className="flex items-start gap-3"><span className="h-2 w-2 mt-2 rounded-full bg-white" />Design for real movement</li>
              <li className="flex items-start gap-3"><span className="h-2 w-2 mt-2 rounded-full bg-white" />Keep setups clean & modular</li>
              <li className="flex items-start gap-3"><span className="h-2 w-2 mt-2 rounded-full bg-white" />Remove friction from daily transitions</li>
              <li className="flex items-start gap-3"><span className="h-2 w-2 mt-2 rounded-full bg-white" />Build products that last</li>
              <li className="flex items-start gap-3"><span className="h-2 w-2 mt-2 rounded-full bg-white" />Empower focus, flow & performance</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Future */}
  <div className="max-w-5xl mx-auto px-6 md:px-12 py-20 text-left">
        <h2 className="text-2xl font-semibold mb-4">Where We’re Headed</h2>
        <p className="text-gray-700 leading-relaxed">We’re here to keep pushing forward — designing products that feel natural, last long, and solve real problems. What started as a simple frustration on two wheels is now becoming a global journey to make everyday life smoother, one magnetic click at a time.</p>
      </div>
    </div>
  );
}
