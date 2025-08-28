"use client";
import React, { useState } from 'react';

export default function ContactForm({ light }: { light?: boolean }){
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
  if(json.ok){ setStatus('Message sent. Conversation created.'); (e.currentTarget as HTMLFormElement).reset(); } else { setStatus(json.error||'Failed'); }
    } catch { setStatus('Network error'); } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col text-sm gap-1">Name<input required name="name" className={(light? 'bg-white border-gray-300 text-gray-900':'bg-black/40 border-white/10 text-white')+ ' border rounded px-3 py-2'} /></label>
        <label className="flex flex-col text-sm gap-1">Email<input required type="email" name="email" className={(light? 'bg-white border-gray-300 text-gray-900':'bg-black/40 border-white/10 text-white')+ ' border rounded px-3 py-2'} /></label>
      </div>
      <label className="flex flex-col text-sm gap-1">Subject<input required name="subject" className={(light? 'bg-white border-gray-300 text-gray-900':'bg-black/40 border-white/10 text-white')+ ' border rounded px-3 py-2'} placeholder="What is this about?" /></label>
      <label className="flex flex-col text-sm gap-1">Message<textarea required name="message" rows={5} className={(light? 'bg-white border-gray-300 text-gray-900':'bg-black/40 border-white/10 text-white')+ ' border rounded px-3 py-2'} /></label>
      <button disabled={loading} className={(light? 'bg-gray-900 hover:bg-black text-white':'bg-red-500 hover:bg-red-600 text-white')+ ' rounded disabled:opacity-50 px-5 py-2 text-sm font-medium'}>{loading ? 'Sending…' : 'Send Message'}</button>
      {status && <p className={light? 'text-xs text-gray-600':'text-xs text-gray-400'}>{status}</p>}
    </form>
  );
}
