"use client";
import React from 'react';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'adamcotech020';

export default function AdminPage(){
  const [authed, setAuthed] = React.useState(false);
  const [user, setUser] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [error, setError] = React.useState('');

  function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    if(user===ADMIN_USER && pass===ADMIN_PASS){ setAuthed(true); setError(''); } else setError('Invalid credentials');
  }

  if(!authed){
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-xs bg-neutral-900/70 rounded-xl p-6 flex flex-col gap-4 border border-neutral-700 shadow-lg">
          <h1 className="text-xl font-semibold text-center tracking-tight">Support Login</h1>
          <input value={user} onChange={e=> setUser(e.target.value)} placeholder="Username" className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
          <input value={pass} type="password" onChange={e=> setPass(e.target.value)} placeholder="Password" className="px-3 py-2 rounded-md bg-neutral-800 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
          {error && <div className="text-red-400 text-xs text-center">{error}</div>}
          <button className="bg-red-600 hover:bg-red-500 transition rounded-md py-2 text-sm font-medium">Login</button>
        </form>
      </div>
    );
  }
  return <Dashboard />;
}

function Dashboard(){
  type Source = 'chat'|'email'|'contact';
  interface InternalConvo { id:string; userName?:string; userEmail?:string; status:string; createdAt:number; updatedAt:number; needsHuman?: boolean; humanActive?: boolean; unread?: boolean; source: Source; subject?: string; lastMessage?: string; }
  interface Message { id:string; role:string; content:string; ts:number }
  const [tab, setTab] = React.useState<'overview'|Source>('overview');
  const [list, setList] = React.useState<InternalConvo[]>([]);
  const [selected, setSelected] = React.useState<InternalConvo | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [reply, setReply] = React.useState('');
  const [loadingList, setLoadingList] = React.useState(false);
  const [loadingMsgs, setLoadingMsgs] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<'all'|'open'|'closed'>('all');
  const [search, setSearch] = React.useState('');
  const pollRef = React.useRef<NodeJS.Timeout|null>(null);
  // Track previous chat conversation ids to detect new ones
  const prevChatIdsRef = React.useRef<Set<string>>(new Set());
  interface Toast { id:string; text:string }
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  function pushToast(text:string){
    const id = Math.random().toString(36).slice(2);
    setToasts(t=> [...t, { id, text }]);
    setTimeout(()=> setToasts(t=> t.filter(x=> x.id!==id)), 6000);
  }

  function playBeep(){
    try {
      const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
      const Ctx = w.AudioContext || w.webkitAudioContext; if(!Ctx) return; const ctx = new Ctx();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type='sine'; o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
      o.start(); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5); o.stop(ctx.currentTime + 0.5);
    } catch {}
  }

  const fetchList = React.useCallback(()=>{
    if(tab==='overview') return;
    setLoadingList(true);
  fetch(`/api/internal-support/conversations?source=${tab}`, { cache: 'no-store' })
      .then(r=>r.json())
      .then(d=> { if(d.conversations){
          // Detect new incoming chats only for chat tab
          if(tab==='chat'){
            const current = new Set<string>();
            for(const c of d.conversations) current.add(c.id);
            const prev = prevChatIdsRef.current;
            const newOnes = d.conversations.filter((c:InternalConvo)=> !prev.has(c.id));
            if(prev.size && newOnes.length){
              for(const n of newOnes){
                pushToast(`New chat: ${n.userName || n.userEmail || n.subject || 'Guest'}`);
                playBeep();
              }
            }
            prevChatIdsRef.current = current;
          }
          setList(d.conversations);
        } })
      .catch(()=>{})
      .finally(()=> setLoadingList(false));
  }, [tab]);

  React.useEffect(()=>{ fetchList(); if(pollRef.current) clearInterval(pollRef.current); if(tab!=='overview'){ pollRef.current = setInterval(fetchList, 8000);} return ()=> { if(pollRef.current) clearInterval(pollRef.current); }; }, [tab, fetchList]);

  async function openConversation(c: InternalConvo){
    setSelected(c); setMessages([]); setLoadingMsgs(true);
    fetch(`/api/internal-support/conversations/${c.id}/ack`, { method:'PATCH' }).catch(()=>{});
    const r = await fetch(`/api/internal-support/conversations/${c.id}/messages`, { cache: 'no-store' });
    const d = await r.json();
    if(d.ok) setMessages(d.messages || []);
    setLoadingMsgs(false);
    fetchList();
  }
  // Poll messages for selected conversation
  React.useEffect(()=>{
    if(!selected) return;
    const id = selected.id;
    const t = setInterval(async ()=>{
      try {
        const r = await fetch(`/api/internal-support/conversations/${id}/messages`, { cache: 'no-store' });
        const d = await r.json();
        if(r.ok && d.messages){ setMessages(d.messages); }
      } catch{}
    }, 4000);
    return ()=> clearInterval(t);
  }, [selected]);

  // Poll selected conversation status flags (humanActive / needsHuman) separately (lighter payload)
  React.useEffect(()=>{
    if(!selected) return;
    const id = selected.id;
    const t = setInterval(async ()=>{
      try {
        const r = await fetch(`/api/internal-support/conversations/${id}/human`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'status' }) });
        const d = await r.json();
        if(r.ok && d?.conversation){
          setSelected(s => s && s.id===id ? { ...s, humanActive: d.conversation.humanActive, needsHuman: d.conversation.needsHuman } : s);
        }
      } catch{}
    }, 6000);
    return ()=> clearInterval(t);
  }, [selected]);

  async function takeOver(){
    if(!selected) return;
    try {
      const res = await fetch(`/api/internal-support/conversations/${selected.id}/human`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'takeover' }) });
      if(res.ok){
        const d = await res.json().catch(()=>({}));
        if(d?.conversation){
          setSelected(s => s && s.id===selected.id ? { ...s, humanActive: d.conversation.humanActive, needsHuman: d.conversation.needsHuman } : s);
        }
      } else {
        pushToast('Take over failed');
      }
    } catch {
      pushToast('Take over error');
    }
    fetchList();
  }

  async function closeSelected(){
    if(!selected) return;
    await fetch(`/api/internal-support/conversations/${selected.id}/close`, { method:'PATCH' });
    fetchList();
    openConversation(selected);
  }

  async function sendReply(){
    if(!selected || !reply.trim()) return;
    const text = reply.trim(); setReply('');
    const res = await fetch(`/api/internal-support/conversations/${selected.id}/messages`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ role:'assistant', content: text }) });
    if(res.ok){ setMessages(m=> [...m, { id:'temp-'+Date.now(), role:'assistant', content:text, ts: Date.now() }]); }
  }

  const filteredList = list
    .filter(c=> statusFilter==='all' || c.status===statusFilter)
    .filter(c=> !search || (c.userName||'').toLowerCase().includes(search.toLowerCase()) || (c.userEmail||'').toLowerCase().includes(search.toLowerCase()) || (c.subject||'').toLowerCase().includes(search.toLowerCase()) || c.id.includes(search));

  return (
  <div className="h-screen flex flex-col bg-white text-black overflow-hidden">
      <div className="px-6 pt-5 pb-3 border-b bg-white flex items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Support Console</h1>
        <div className="flex gap-2">
          {(['overview','chat','email','contact'] as const).map(t=> {
            const active = tab===t;
            const label = t==='chat'?'Bot Chats': t==='email'?'Emails': t==='contact'?'Contact Forms':'Overview';
            const activeClass = t==='chat'
              ? 'border-red-600 ring-1 ring-red-600 bg-red-50 text-red-700'
              : t==='email'
                ? 'border-orange-500 ring-1 ring-orange-500 bg-orange-50 text-orange-700'
                : t==='contact'
                  ? 'border-pink-500 ring-1 ring-pink-500 bg-pink-50 text-pink-700'
                  : 'border-black ring-1 ring-black bg-white text-black';
            const inactiveClass = t==='chat'
              ? 'border-red-200 bg-white/80 hover:bg-red-50 text-red-600'
              : t==='email'
                ? 'border-orange-200 bg-white/80 hover:bg-orange-50 text-orange-600'
                : t==='contact'
                  ? 'border-pink-200 bg-white/80 hover:bg-pink-50 text-pink-600'
                  : 'border-gray-300 bg-white hover:bg-gray-50 text-black';
            return (
              <button key={t} onClick={()=> setTab(t)} className={`px-4 py-2 text-xs font-medium rounded-md border transition shadow-sm ${active? activeClass:inactiveClass}`}>{label}</button>
            );
          })}
        </div>
        {tab!=='overview' && (
          <div className="ml-auto flex items-center gap-2">
            <input value={search} onChange={e=> setSearch(e.target.value)} placeholder="Search" className="text-xs px-3 py-2 border rounded-md bg-white placeholder-gray-400" />
            <select value={statusFilter} onChange={e=> setStatusFilter(e.target.value as 'all'|'open'|'closed')} className="text-xs px-3 py-2 border rounded-md bg-white">
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <button onClick={()=> { if(confirm('Delete ALL conversations?')){ fetch('/api/internal-support/conversations/purge', { method:'POST' }).then(()=> { setSelected(null); setMessages([]); setList([]); }); } }} className="text-xs px-4 py-2 rounded-md border border-red-500 text-red-600 hover:bg-red-50 font-medium">Purge</button>
          </div>
        )}
      </div>
      {tab==='overview' && (
        <div className="p-8 text-sm text-gray-700 space-y-3">
          <p>Pick a channel tab to manage conversations.</p>
          <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
            <li><strong>Bot Chats</strong> shows live site chat sessions.</li>
            <li><strong>Emails</strong> & <strong>Contact Forms</strong> ready for future ingestion.</li>
          </ul>
        </div>
      )}
      {tab!=='overview' && (
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Conversation list */}
          <div className={`w-72 border-r flex flex-col overflow-hidden ${tab==='chat'? 'bg-red-25/40':'bg-white'} ${tab==='email'? 'bg-orange-25/40':''} ${tab==='contact'? 'bg-pink-25/40':''}`}> 
            <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-700 border-b bg-gray-50">Conversations ({filteredList.length})</div>
            <div className="flex-1 overflow-y-auto custom-scroll">
              {loadingList && <div className="p-4 text-xs text-gray-600">Loading…</div>}
              {!loadingList && !filteredList.length && <div className="p-4 text-xs text-gray-500">None</div>}
              {filteredList.map(c=> {
                const active = selected?.id===c.id;
                const needsHelp = c.needsHuman && c.status!=='closed';
                const unread = c.unread && !needsHelp && !c.humanActive;
                return (
                  <button
                    key={c.id}
                    onClick={()=> openConversation(c)}
                    className={`w-full text-left px-4 py-3 border-b text-[11px] relative transition
                      ${active? 'bg-gray-100': needsHelp? 'bg-red-50 hover:bg-red-100':'hover:bg-gray-50'}
                      ${needsHelp? 'border-red-300': ''}`}
                  >
                    <div className="flex justify-between items-center gap-3">
                      <span className={`truncate max-w-[140px] ${needsHelp? 'text-red-700 font-semibold': unread? 'font-bold text-gray-900':'font-medium text-gray-900'}`}>{c.userName || c.userEmail || c.subject || 'Guest'}</span>
                      {needsHelp && <span className="w-2 h-2 bg-red-500 rounded-full" title="Needs human" />}
                    </div>
                    {c.lastMessage && <div className={`mt-1 text-[10px] line-clamp-1 truncate ${needsHelp? 'text-red-600':'text-gray-600'}`}>{c.lastMessage}</div>}
                    <div className="text-[10px] flex justify-between mt-1 ${needsHelp? 'text-red-600':'text-gray-500' }"><span>{new Date(c.updatedAt).toLocaleTimeString()}</span><span>{c.status==='closed'?'Closed': c.humanActive?'Live': unread? 'Unread':''}</span></div>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Messages panel */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {selected ? (
              <>
                <div className="flex items-center gap-3 px-6 py-4 border-b bg-white">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate text-gray-900">{selected.userName || selected.userEmail || selected.subject || 'Guest'}</div>
                    <div className="text-[11px] text-gray-500 font-mono">{selected.id}</div>
                  </div>
                  {selected.status==='open' && !selected.humanActive && <button onClick={takeOver} className="text-[11px] px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 font-medium">Take over</button>}
                  {selected.humanActive && selected.status==='open' && <span className="text-[11px] px-3 py-1 rounded bg-green-600 text-white font-medium">Active</span>}
                  <button onClick={closeSelected} disabled={selected.status==='closed'} className="text-[11px] px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 font-medium">Close</button>
                </div>
                {/* Compact scrollable messages area */}
                <div className="overflow-y-auto max-h-[55vh] p-6 space-y-3 custom-scroll bg-white">
                  {loadingMsgs && <div className="text-xs text-gray-500">Loading messages…</div>}
                  {!loadingMsgs && !messages.length && <div className="text-xs text-gray-500">No messages yet.</div>}
                  {messages.map(m => (
                    <div key={m.id} className={`max-w-[70%] px-4 py-2 rounded-lg text-[13px] shadow-sm leading-relaxed ${m.role==='user' ? 'bg-black text-white':'bg-gray-200 ml-auto text-gray-900'}`}>{m.content}</div>
                  ))}
                </div>
                {selected.status==='open' && (
                  <div className="p-4 border-t bg-white flex items-center gap-3 sticky bottom-0">
                    <input value={reply} onChange={e=> setReply(e.target.value)} placeholder="Type reply" className="flex-1 border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
                    <button onClick={sendReply} disabled={!reply.trim()} className="px-5 py-2 bg-black text-white text-sm rounded-md disabled:opacity-40 font-medium">Send</button>
                  </div>
                )}
                {selected.status==='closed' && <div className="p-2 text-center text-[11px] bg-gray-100 border-t text-gray-600">Conversation closed.</div>}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-gray-500">Select a conversation.</div>
            )}
          </div>
          {/* Meta sidebar */}
          <div className="w-72 border-l bg-white px-5 py-5 hidden lg:flex flex-col text-xs overflow-y-auto">
            {selected ? (
              <>
                <div className="font-semibold mb-3 text-gray-900">Details</div>
                <div className="space-y-2 mb-6 text-[11px]">
                  <div><span className="text-gray-500">Source:</span> <span className="ml-1 font-medium text-gray-900">{selected.source}</span></div>
                  {selected.userEmail && <div><span className="text-gray-500">Email:</span> <span className="ml-1 font-medium text-gray-900">{selected.userEmail}</span></div>}
                  <div><span className="text-gray-500">Created:</span> <span className="ml-1 text-gray-900">{new Date(selected.createdAt).toLocaleString()}</span></div>
                  <div><span className="text-gray-500">Updated:</span> <span className="ml-1 text-gray-900">{new Date(selected.updatedAt).toLocaleString()}</span></div>
                  <div><span className="text-gray-500">Status:</span> <span className="ml-1 text-gray-900">{selected.status}</span></div>
                </div>
                <div className="font-semibold mb-2 text-gray-900">Notes</div>
                <textarea placeholder="Add a note (local only)" className="w-full h-40 border rounded-md p-3 resize-none bg-white text-[12px]" />
              </>
            ) : <div className="text-gray-500">No conversation selected.</div>}
          </div>
        </div>
      )}
  <style jsx global>{`
        .custom-scroll::-webkit-scrollbar{width:8px;height:8px}
        .custom-scroll::-webkit-scrollbar-track{background:transparent}
        .custom-scroll::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.28);border-radius:4px}
        .custom-scroll::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,0.45)}
      `}</style>
    {/* Toasts */}
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t=> (
        <div key={t.id} className="px-4 py-2 rounded-md text-xs shadow-lg bg-red-600/90 text-white font-medium animate-fade-in">
          {t.text}
        </div>
      ))}
    </div>
    </div>
  );
}
