import React from 'react';
import ContactForm from '@/components/ContactForm';

export const metadata = { title: 'Contact - AdamCoTech' };

export default function ContactPage(){
  return (
    <div className="w-full bg-white text-gray-900 py-20 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 tracking-tight">Contact Us</h1>
        <p className="text-sm text-gray-700 mb-10 max-w-prose">Questions, partnerships or feedback — drop us a line. We aim to respond within 24 hours (business days).</p>
        <ContactForm light />
      </div>
    </div>
  );
}

