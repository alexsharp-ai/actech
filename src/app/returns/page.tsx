"use client";
import React, { useState } from 'react';

export const metadata = { title: 'Returns - AdamCoTech' };

export default function ReturnsPage(){
  const [status, setStatus] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const payload = Object.fromEntries(fd.entries());
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/returns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if(json.ok){
        setStatus('Request submitted. We\'ll email you within 24h.');
        (e.currentTarget as HTMLFormElement).reset();
      } else {
        setStatus(json.error || 'Submission failed.');
      }
    } catch {
      setStatus('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-6">Return / Exchange Request</h1>
  <p className="text-sm text-gray-300 mb-8 max-w-prose">Return unused items in original condition within 30 days. Fill the form below; you&apos;ll receive instructions and an RMA number by email.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="flex flex-col text-sm gap-1">Name<input required name="name" className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white" /></label>
          <label className="flex flex-col text-sm gap-1">Email<input required type="email" name="email" className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white" /></label>
          <label className="flex flex-col text-sm gap-1 sm:col-span-2">Order Number<input required name="orderNumber" className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white" placeholder="e.g. AC12345" /></label>
        </div>
        <label className="flex flex-col text-sm gap-1">Reason<select required name="reason" className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white">
          <option value="">Select one</option>
          <option>Wrong item received</option>
          <option>Damaged on arrival</option>
          <option>Not compatible</option>
          <option>No longer needed</option>
          <option>Other</option>
        </select></label>
        <label className="flex flex-col text-sm gap-1">Details<textarea name="details" rows={4} className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white" placeholder="Add clarifying info (optional)"></textarea></label>
        <button disabled={loading} className="rounded bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-5 py-2 text-sm font-medium">{loading ? 'Submitting...' : 'Submit Return Request'}</button>
        {status && <p className="text-xs text-gray-400">{status}</p>}
      </form>
    </div>
  );
}
