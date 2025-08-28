import React from 'react';
import ReturnsForm from '@/components/ReturnsForm';

export const metadata = { title: 'Returns - AdamCoTech' };

export default function ReturnsPage(){
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-6">Return / Exchange Request</h1>
      <p className="text-sm text-gray-300 mb-8 max-w-prose">Return unused items in original condition within 30 days. Fill the form below; you&apos;ll receive instructions and an RMA number by email.</p>
      <ReturnsForm />
    </div>
  );
}

