import React from 'react';

export const metadata = { title: 'Careers - AdamCoTech' };

export default function CareersPage(){
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed text-gray-300">
      <h1 className="text-3xl font-bold text-white mb-6">Careers</h1>
      <p className="mb-4">We are not hiring right now, but you can send an open application to <a className="text-red-400" href="mailto:jobs@adamcotech.nl">jobs@adamcotech.nl</a>. Future postings will appear here.</p>
    </div>
  );
}
