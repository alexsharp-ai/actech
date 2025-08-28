import React from 'react';

export const metadata = { title: 'FAQ - AdamCoTech' };

const faqs: { q: string; a: string }[] = [
  { q: 'What devices are supported?', a: 'All modern smartphones. For the strongest hold use MagSafe or the included steel plate accessory where provided.' },
  { q: 'Do mounts work off-road?', a: 'Yes. The magnetic + mechanical retention (where applicable) is tested against vibration and shock typical for urban and light trail riding.' },
  { q: 'Shipping time?', a: 'EU delivery 2-5 business days. Outside EU 5-12 business days depending on carrier.' },
  { q: 'Warranty length?', a: '12 months limited warranty covering manufacturing defects. Accidental damage is excluded.' },
  { q: 'Can I return my order?', a: 'Yes, unused items in original condition can be returned within 30 days. Start the process on the Returns page.' }
];

export default function FAQPage(){
  return (
    <div className="w-full bg-white text-gray-900 py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 tracking-tight">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map(item => (
            <details key={item.q} className="group border border-gray-200 rounded-lg p-5 bg-gray-50 hover:bg-gray-100 transition">
              <summary className="cursor-pointer select-none font-medium text-gray-900 flex items-center justify-between">
                <span>{item.q}</span>
                <span className="ml-4 text-xs text-gray-400 group-open:hidden">+</span>
                <span className="ml-4 text-xs text-gray-400 hidden group-open:inline">−</span>
              </summary>
              <div className="mt-3 text-sm text-gray-700 leading-relaxed">{item.a}</div>
            </details>
          ))}
        </div>
        <p className="mt-16 text-sm text-gray-600">Still need help? <a href="/contact" className="text-red-600 hover:text-red-500 font-medium">Contact us</a>.</p>
      </div>
    </div>
  );
}
