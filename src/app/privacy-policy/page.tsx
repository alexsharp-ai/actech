import React from 'react';

export const metadata = { title: 'Privacy Policy - AdamCoTech' };

export default function PrivacyPolicyPage(){
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-sm leading-relaxed text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>
      <p className="mb-4 text-gray-300">Below you can read our Privacy Policy summary. For the authoritative full document you can download the signed PDF version.</p>
      <div className="mb-6">
        <a
          href={encodeURI('/Privacy Policy AdamCotech.pdf')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-xs font-medium text-white border border-white/20"
        >
          Download Full PDF
        </a>
      </div>
      <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
      <p className="mt-8 text-xs text-gray-500">(Full textual version pending extraction from PDF.)</p>
    </div>
  );
}
