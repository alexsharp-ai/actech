import React from 'react';
import ContactForm from '@/components/ContactForm';

export const metadata = { title: 'Contact - AdamCoTech' };

export default function ContactPage(){
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-6">Contact Us</h1>
      <p className="text-sm text-gray-300 mb-8 max-w-prose">Questions, partnerships or feedback — drop us a line. We aim to respond within 24 hours (business days).</p>
      <ContactForm />
    </div>
  );
}

