import React from 'react';

export const metadata = { title: 'Cookie Policy - AdamCoTech' };

export default function CookiesPage(){
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-sm leading-relaxed text-gray-300">
      <h1 className="text-3xl font-bold text-white mb-6">Cookie Policy</h1>
      <p className="mb-4">We use cookies and similar technologies to deliver core functionality, enhance performance, analyze traffic and personalize content.</p>
      <h2 className="text-xl font-semibold text-white mt-10 mb-3">Types of Cookies</h2>
      <ul className="list-disc ml-6 space-y-2 mb-6">
        <li><strong>Essential:</strong> Required for site operation (cannot be disabled).</li>
        <li><strong>Performance:</strong> Anonymous analytics about usage.</li>
        <li><strong>Functional:</strong> Remember preferences (e.g. language).</li>
        <li><strong>Marketing:</strong> Measure campaign effectiveness (only with consent).</li>
      </ul>
      <h2 className="text-xl font-semibold text-white mt-10 mb-3">Managing Cookies</h2>
      <p className="mb-4">Use your browser settings or future in‑page controls to manage non‑essential cookies.</p>
      <p className="mt-12 text-xs text-gray-500">Draft placeholder – replace with final audited cookie inventory.</p>
    </div>
  );
}
