import React from 'react';

export const metadata = { title: 'Privacy Policy - AdamCoTech' };

export default function PrivacyPolicyPage(){
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-sm leading-relaxed text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>
      <p className="mb-4 text-gray-300">This page contains our privacy policy. (Full content pending integration from provided PDF.)</p>
      <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  );
}
