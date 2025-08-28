import React from 'react';

export const metadata = { title: 'Press - AdamCoTech' };

export default function PressPage(){
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed text-gray-300">
      <h1 className="text-3xl font-bold text-white mb-6">Press & Media</h1>
      <p className="mb-4">For media inquiries contact <a className="text-red-400" href="mailto:press@adamcotech.nl">press@adamcotech.nl</a>. A downloadable media kit will be added here.</p>
    </div>
  );
}
