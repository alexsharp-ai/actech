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
    <AdminDashboard />
  );
}

function AdminDashboard(){
  const [tab, setTab] = React.useState<'overview'|'conversations'|'widget'>('overview');
  interface Conversation { id:number; status:string; contact?: { name?:string; email?:string }; last_activity_at?: number; updated_at?: number; }
  const [convos, setConvos] = React.useState<Conversation[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(()=>{
    if(tab !== 'conversations') return;
    setLoading(true); setError('');
    fetch('/api/support/conversations').then(r=>r.json()).then(d=>{
      if(!d.ok) setError('Failed fetching conversations');
      const list = d.data?.payload || d.data?.data || [];
      setConvos(list);
    }).catch(e=> setError(String(e))).finally(()=> setLoading(false));
  }, [tab]);

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Support Console</h1>
      <div className="flex gap-3 mb-6">
        {[
          {k:'overview' as const, label:'Overview'},
          {k:'conversations' as const, label:'Conversations'},
          {k:'widget' as const, label:'Widget Test'}
        ].map(t=> (
          <button key={t.k} onClick={()=>setTab(t.k)} className={`px-4 py-2 rounded text-sm font-medium border ${tab===t.k? 'bg-black text-white':'bg-white hover:bg-gray-100'}`}>{t.label}</button>
        ))}
      </div>
      {tab==='overview' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">Quick links & health.</p>
          <ul className="list-disc list-inside text-xs text-gray-600">
            <li>Web chat widget integrated.</li>
            <li>Use Conversations tab to view open threads (API proxy).</li>
          </ul>
        </div>
      )}
      {tab==='conversations' && (
        <div>
          {loading && <div className="text-sm">Loading…</div>}
            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left py-2 px-3">ID</th>
                  <th className="text-left py-2 px-3">Contact</th>
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="text-left py-2 px-3">Updated</th>
                  <th className="py-2 px-3" />
                </tr>
              </thead>
              <tbody>
                {convos.map(c=> {
                  const contact = c.contact || {}; const lastActivity = c.last_activity_at || c.updated_at;
                  return (
                    <tr key={c.id} className="border-t">
                      <td className="py-2 px-3 font-mono text-xs">{c.id}</td>
                      <td className="py-2 px-3">{contact.name || contact.email || '—'}</td>
                      <td className="py-2 px-3 capitalize">{c.status}</td>
                      <td className="py-2 px-3 text-xs text-gray-500">{lastActivity ? new Date(lastActivity*1000).toLocaleString(): ''}</td>
                      <td className="py-2 px-3 text-right"><a className="text-blue-600 underline" href="#" target="_blank" rel="noreferrer">Open</a></td>
                    </tr>
                  );
                })}
                {!loading && !convos.length && <tr><td colSpan={5} className="py-6 text-center text-gray-500 text-sm">No conversations</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab==='widget' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">The Chatwoot widget should already have loaded globally after login (if configured).</p>
          <ChatwootWidget />
        </div>
      )}
    </div>
  );
}
