"use client";
import React, { useState } from 'react';

export default function ContactForm(){
  const [status, setStatus] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const payload = Object.fromEntries(fd.entries());
    setLoading(true); setStatus(null);
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if(json.ok){ setStatus('Message sent. We\'ll reply soon.'); (e.currentTarget as HTMLFormElement).reset(); } else { setStatus(json.error||'Failed'); }
    } catch { setStatus('Network error'); } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col text-sm gap-1">Name<input required name="name" className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white" /></label>
        <label className="flex flex-col text-sm gap-1">Email<input required type="email" name="email" className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white" /></label>
      </div>
      <label className="flex flex-col text-sm gap-1">Subject<input required name="subject" className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white" placeholder="What is this about?" /></label>
      <label className="flex flex-col text-sm gap-1">Message<textarea required name="message" rows={5} className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white" /></label>
      <button disabled={loading} className="rounded bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-5 py-2 text-sm font-medium">{loading ? 'Sending…' : 'Send Message'}</button>
      {status && <p className="text-xs text-gray-400">{status}</p>}
    </form>
  );
}
