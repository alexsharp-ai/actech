"use client";
import React, { useState } from 'react';
// Chatwoot & external widget removed; internal support only

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
  const [tab, setTab] = React.useState<'overview'|'internal'>('overview');
  interface InternalConvo { id:string; userName?:string; userEmail?:string; status:string; createdAt:number; updatedAt:number; }
  const [internalConvos, setInternalConvos] = React.useState<InternalConvo[]>([]);
  const [selectedInternal, setSelectedInternal] = React.useState<InternalConvo | null>(null);
  const [internalMessages, setInternalMessages] = React.useState<{id:string; role:string; content:string; ts:number}[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(()=>{
    if(tab === 'internal'){
      setLoading(true); setError('');
      fetch('/api/internal-support/conversations').then(r=>r.json()).then(d=>{
        if(!d.ok) setError('Failed fetching internal conversations');
        setInternalConvos(d.conversations || []);
      }).catch(e=> setError(String(e))).finally(()=> setLoading(false));
    }
  }, [tab]);

  function loadInternalMessages(id: string){
    setSelectedInternal(internalConvos.find(c=>c.id===id) || null);
    setInternalMessages([]);
    fetch(`/api/internal-support/conversations/${id}/messages`).then(r=>r.json()).then(d=>{
      if(d.ok) setInternalMessages(d.messages || []);
    });
  }

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Support Console</h1>
      <div className="flex gap-3 mb-6">
        {[
          {k:'overview' as const, label:'Overview'},
          {k:'internal' as const, label:'Internal'}
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
  {error && tab==='internal' && <div className="text-sm text-red-600 mb-2">{error}</div>}
      {tab==='internal' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-2">
            <h2 className="font-semibold text-sm">Conversations</h2>
            <div className="border rounded divide-y max-h-[60vh] overflow-y-auto text-sm">
              {internalConvos.map(c=> (
                <button key={c.id} onClick={()=> loadInternalMessages(c.id)} className={`w-full text-left p-3 hover:bg-gray-50 ${selectedInternal?.id===c.id?'bg-gray-100':''}`}>
                  <div className="font-mono text-[10px] text-gray-500">{c.id.slice(0,8)}</div>
                  <div className="font-medium">{c.userName || c.userEmail || 'Guest'}</div>
                  <div className="text-[10px] text-gray-500">{new Date(c.updatedAt).toLocaleString()}</div>
                </button>
              ))}
              {!internalConvos.length && !loading && <div className="p-3 text-gray-500">None yet</div>}
            </div>
          </div>
          <div className="md:col-span-2 border rounded p-4 flex flex-col min-h-[50vh]">
            {selectedInternal ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-semibold text-sm">{selectedInternal.userName || selectedInternal.userEmail || 'Guest'}</div>
                    <div className="text-xs text-gray-500">ID {selectedInternal.id}</div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {internalMessages.map(m => (
                    <div key={m.id} className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${m.role==='user' ? 'bg-black text-white ml-0':'bg-gray-200 ml-auto'}`}>{m.content}</div>
                  ))}
                  {!internalMessages.length && <div className="text-xs text-gray-500">No messages yet.</div>}
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500">Select a conversation.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
