import React from 'react';
import ReturnsForm from '@/components/ReturnsForm';

export const metadata = { title: 'Returns - AdamCoTech' };

export default function ReturnsPage(){
  return (
    <div className="w-full bg-white text-gray-900 py-20 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 tracking-tight">Return / Exchange Request</h1>
        <p className="text-sm text-gray-700 mb-10 max-w-prose">Return unused items in original condition within 30 days. Fill the form below; you&apos;ll receive instructions and an RMA number by email.</p>
        <ReturnsForm light />
      </div>
    </div>
  );
}

