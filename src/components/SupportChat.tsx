"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ChatMessage { role: 'user'|'assistant'; content: string; ts: number; id?: string; }
interface Bridge { conversationId?: string; }

const WELCOME = "Welcome to AdamCoTech, I'm your assistant. How can I help you today?";

const SUGGESTIONS = [
  'What are the shipping times?',
  'How do I install the mount?',
  'Is it safe for my phone?'
];

async function askBackend(message: string, conversationId?: string): Promise<string>{
  const res = await fetch('/api/support-chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message, conversationId }) });
  const data = await res.json().catch(()=>({ answer: 'Sorry, temporary issue.' }));
  if(!res.ok) return 'Sorry, temporary issue.';
  return data.answer || 'Okay.';
}

async function sendToInternal(conversationId: string|undefined, role:'user'|'assistant', content:string){
  try {
    if(!conversationId && role==='user'){
      const r = await fetch('/api/internal-support/conversations', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ content }) });
      const d = await r.json();
      if(r.ok) return d.conversation?.id as string;
    } else if(conversationId){
      await fetch(`/api/internal-support/conversations/${conversationId}/messages`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ content, role }) });
      return conversationId;
    }
  } catch {}
  return conversationId || '';
}

export default function SupportChat(){
  const [open, setOpen] = useState(false);
  // Always start fresh: no persisted conversation from previous page load
  const [bridge, setBridge] = useState<Bridge>({ conversationId: undefined });
  const [messages, setMessages] = useState<ChatMessage[]>([{ role:'assistant', content: WELCOME, ts: Date.now(), id: 'welcome' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [humanRequested, setHumanRequested] = useState(false);
  const [humanAccepted, setHumanAccepted] = useState(false);
  const endRef = useRef<HTMLDivElement|null>(null);
  const assistantSeen = useRef<Set<string>>(new Set());
  const pollTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, open]);
  // Clear any legacy stored conversation id on mount
  useEffect(()=>{ try { if(typeof window !== 'undefined') localStorage.removeItem('support_chat_conversation'); } catch {} }, []);

  useEffect(()=>{
    if(!humanRequested || !bridge.conversationId || humanAccepted) return;
    const t = setInterval(async ()=>{
      try {
        const r = await fetch(`/api/internal-support/conversations/${bridge.conversationId}/human`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'status' }) });
        const d = await r.json();
        if(r.ok && d.conversation?.humanActive){
          setHumanAccepted(true);
          setMessages(m=> m.some(msg=> msg.content.startsWith('A human agent has joined'))? m : [...m, { role:'assistant', content:'A human agent has joined. Please continue.', ts: Date.now() }]);
          clearInterval(t);
        }
      } catch {}
    }, 4000);
    return ()=> clearInterval(t);
  }, [humanRequested, bridge.conversationId, humanAccepted]);

  async function handleSend(e?: React.FormEvent){
    e?.preventDefault();
    const text = input.trim();
    if(!text || loading) return;
    setInput('');
    setMessages(m=> [...m, { role:'user', content:text, ts: Date.now() }]);
    setLoading(true);
    const convId = await sendToInternal(bridge.conversationId, 'user', text);
    if(convId && convId!==bridge.conversationId){
      setBridge({ conversationId: convId });
    }
    if(/human|agent/i.test(text)) setHumanRequested(true);
    if(!humanAccepted){
      const answer = await askBackend(text, convId || bridge.conversationId);
      // Prevent duplicate assistant message (sometimes both backend push + poll retrieval)
      setMessages(m=> {
        const last = [...m].reverse().find(x=> x.role==='assistant');
        if(last && last.content.trim() === answer.trim()) return m; // skip duplicate
        return [...m, { role:'assistant', content: answer, ts: Date.now() }];
      });
      if(/we will connect you now with our agent|connect you with a human agent/i.test(answer)) setHumanRequested(true);
      if(convId) await sendToInternal(convId, 'assistant', answer);
    }
    setLoading(false);
  }

  async function endChat(){
    if(!confirm('End this chat?')) return;
    const id = bridge.conversationId;
    if(id){
      try { await fetch(`/api/internal-support/conversations/${id}/close`, { method:'PATCH' }); } catch {}
    }
    // Reset local state
    setBridge({ conversationId: undefined });
    setMessages([{ role:'assistant', content: WELCOME, ts: Date.now() }]);
    setHumanRequested(false);
    setHumanAccepted(false);
    assistantSeen.current.clear();
  }

  function handleSuggestion(s: string){
    setInput(s);
    setTimeout(()=> handleSend(), 10);
  }

  // Poll for agent (assistant) replies once a conversation exists
  useEffect(()=>{
    if(!bridge.conversationId) return;
    if(pollTimer.current) clearInterval(pollTimer.current);
    pollTimer.current = setInterval(async ()=>{
      try {
  const r = await fetch(`/api/internal-support/conversations/${bridge.conversationId}/messages`);
        const d = await r.json();
        if(r.ok){
          const list: ChatMessage[] = d.messages || [];
          const newAssistant: ChatMessage[] = [];
          list.filter(m=> m.role==='assistant').forEach(m => {
            const key = m.id || m.ts+':'+m.content;
            if(!assistantSeen.current.has(key)){
              assistantSeen.current.add(key);
              // Skip the initial welcome message duplication
              if(!messages.some(existing => existing.role==='assistant' && existing.content===m.content && existing.ts===m.ts)){
                newAssistant.push(m);
              }
            }
          });
          if(newAssistant.length){
            setMessages(prev => [...prev, ...newAssistant]);
          }
          // Detect closure
          if(d.status === 'closed' && bridge.conversationId){
            setMessages(prev => prev.some(m=> m.content.includes('This chat was closed'))? prev : [...prev, { role:'assistant', content:'This chat was closed by an agent. You can start a new chat anytime.', ts: Date.now() }]);
            setBridge({ conversationId: undefined });
            setHumanRequested(false);
            setHumanAccepted(false);
            assistantSeen.current.clear();
          }
        }
      } catch {}
    }, 4000);
    return ()=> { if(pollTimer.current) clearInterval(pollTimer.current); };
  }, [bridge.conversationId, messages, humanRequested, humanAccepted]);

  return (
    <>
      <button aria-label={open? 'Close support chat':'Open support chat'} onClick={()=> setOpen(o=>!o)} className="fixed z-50 bottom-5 right-5 rounded-full bg-red-500 hover:bg-red-600 text-white w-14 h-14 shadow-lg flex items-center justify-center font-bold text-xl overflow-hidden">
        {open ? '×' : <Image src="/bot.jpg" alt="Support bot" width={56} height={56} className="w-full h-full object-cover" priority />}
      </button>
      {open && (
        <div className="fixed z-50 bottom-24 right-5 w-80 max-h-[70vh] flex flex-col rounded-xl shadow-2xl border border-gray-700/40 bg-[#111] text-white overflow-hidden">
          <div className="px-4 py-3 bg-black/60 text-sm font-semibold tracking-wide flex items-center justify-between">
            <span>Support Chat</span>
            <div className="flex items-center gap-2">
              <button onClick={endChat} type="button" className="text-[10px] px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-medium">End</button>
              <span className='text-[10px] text-gray-400'>beta</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm custom-scrollbar">
            {messages.map(m=> (
              <div key={m.id || m.ts} className={(m.role==='user'?'ml-auto bg-red-500/90':'mr-auto bg-white/10')+" px-3 py-2 rounded-lg max-w-[85%] whitespace-pre-wrap leading-relaxed"}>{m.content}</div>
            ))}
            {loading && <div className='mr-auto bg-white/10 px-3 py-2 rounded-lg text-gray-300 animate-pulse'>Thinking…</div>}
            {humanRequested && !humanAccepted && <div className='mr-auto bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 px-3 py-2 rounded-lg text-xs'>Connecting you to a human…</div>}
            {humanAccepted && <div className='mr-auto bg-green-600/20 border border-green-500/40 text-green-300 px-3 py-2 rounded-lg text-xs'>Human connected</div>}
            {!loading && !humanRequested && (
              <div className='flex flex-wrap gap-2 pt-1'>
                {SUGGESTIONS.map(s=> <button key={s} type='button' onClick={()=> handleSuggestion(s)} className='text-xs px-2 py-1 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur border border-white/10'>{s}</button>)}
                <button type='button' onClick={()=> handleSuggestion('I want to talk to a human agent')} className='text-xs px-2 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10'>Human</button>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={handleSend} className='border-t border-gray-700/50 flex gap-2 p-3 bg-black/40 text-sm'>
            <input value={input} onChange={e=> setInput(e.target.value)} placeholder='Type your question' className='flex-1 bg-transparent outline-none placeholder-gray-500' disabled={loading} />
            <button type='submit' disabled={loading || !input.trim()} className='font-semibold px-3 py-1 rounded bg-red-500 hover:bg-red-600 disabled:opacity-40'>Ask</button>
          </form>
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar{width:6px}
            .custom-scrollbar::-webkit-scrollbar-track{background:transparent}
            .custom-scrollbar::-webkit-scrollbar-thumb{background:#333;border-radius:3px}
          `}</style>
        </div>
      )}
    </>
  );
}
