import React from 'react';

export const metadata = { title: 'Imprint - AdamCoTech' };

export default function ImprintPage(){
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed text-gray-300">
      <h1 className="text-3xl font-bold text-white mb-6">Imprint</h1>
      <p><strong>Adam &amp; Co tech</strong><br/>Admiraal de Ruiterweg 437<br/>Amsterdam, Netherlands<br/>Email: <a className="text-red-400" href="mailto:info@adamcotech.nl">info@adamcotech.nl</a></p>
      <p className="mt-6">VAT / Registration numbers to be inserted here. This page satisfies basic EU / German style imprint placeholder needs.</p>
      <p className="mt-12 text-xs text-gray-500">Draft placeholder – finalize with legal advisor.</p>
    </div>
  );
}
