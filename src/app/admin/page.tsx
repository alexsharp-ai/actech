"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy load widget only after login to avoid exposing token pre-auth
const ChatwootWidget = dynamic(()=>import('@/components/ChatwootWidget'), { ssr:false });

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'adamcotech020';

export default function AdminPage(){
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    if(user === ADMIN_USER && pass === ADMIN_PASS){
      setAuthed(true); setError('');
    } else {
      setError('Invalid credentials');
    }
  }

  if(!authed){
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-xs bg-white/5 backdrop-blur rounded-lg p-6 flex flex-col gap-4 border border-white/10">
          <h1 className="text-xl font-semibold text-center">Admin Login</h1>
          <input value={user} onChange={e=>setUser(e.target.value)} placeholder="Username" className="px-3 py-2 rounded bg-black/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500" />
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" className="px-3 py-2 rounded bg-black/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500" />
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          <button className="bg-red-600 hover:bg-red-500 transition rounded py-2 font-medium">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Support Console</h1>
      <p className="text-sm mb-6 text-gray-600">Chat agent widget loads below (self‑hosted Docker Chatwoot).</p>
      <div className="border rounded p-4 bg-gray-50 text-sm mb-10">
        If the chat bubble does not appear, ensure the environment variables
        <code className="bg-black/10 px-1 ml-1">NEXT_PUBLIC_CHATWOOT_BASE_URL</code> and
        <code className="bg-black/10 px-1 ml-1">NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN</code> are set.
      </div>
      <ChatwootWidget />
    </div>
  );
}
