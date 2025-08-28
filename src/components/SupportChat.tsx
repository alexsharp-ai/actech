"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

const faq: { q: RegExp; a: string }[] = [
  { q: /warranty|garantie/i, a: "Our magnetic mounts include a standard 1 year warranty (extendable to 10 years upon registration)." },
  { q: /delivery|shipping|livraison/i, a: "Orders dispatch within 24–48h. EU delivery usually arrives in 2–5 business days." },
  { q: /returns?|refund/i, a: "You can request a return within 30 days in original condition for a full refund." },
  { q: /price|cost/i, a: "Current prices are visible on each product card—no hidden fees at checkout." },
  { q: /mount|holder|support/i, a: "Our system combines a high‑retention magnetic plate with mechanical stability for rough rides." },
  { q: /payment|methods|pay/i, a: "We accept major cards, Apple Pay, Google Pay, and secured marketplace payments." },
  { q: /install|installation|setup/i, a: "Most mounts install in under 2 minutes with included adhesive or clamp hardware." },
];

const suggestionSets: string[] = [
  "What are the shipping times?",
  "How long is the warranty?",
  "What payment methods do you accept?",
  "How do I install the mount?",
  "What's the returns policy?",
  "Can I track my order?",
  "Is it safe for my phone?",
  "Do you ship internationally?",
  "Leave a message"
];

async function askBackend(message: string): Promise<string> {
  try {
    const res = await fetch("/api/support-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();
    return data.answer as string;
  } catch {
    // Fallback simple FAQ match client‑side if backend fails
    const hit = faq.find(f => f.q.test(message));
    if (hit) return hit.a;
    return "Sorry, I'm having trouble reaching support right now. Please email contact@adamcotech.com.";
  }
}

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: "assistant",
    content: "Welcome to AdamCoTech, I'm your assistant. How can I help you today?",
    ts: Date.now(),
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaveMsgMode, setLeaveMsgMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (leaveMsgMode) {
      // Submit leave-a-message form
      if (!name.trim() || !email.trim() || !input.trim()) return;
      setLoading(true);
      try {
        const res = await fetch("/api/support-leave-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), message: input.trim() })
        });
        if (res.ok) {
          setMessages(m => [...m, { role: "assistant", content: "Thanks! Your message was sent. We'll reply by email shortly.", ts: Date.now() }]);
          setLeaveMsgMode(false);
          setName(""); setEmail(""); setInput("");
        } else {
          const data = await res.json().catch(() => ({}));
          setMessages(m => [...m, { role: "assistant", content: "Could not send message: " + (data.error || "Unknown error"), ts: Date.now() }]);
        }
      } finally { setLoading(false); }
      return;
    }
    const text = input.trim();
    if (!text || loading) return;
    const ts = Date.now();
    setMessages(m => [...m, { role: "user", content: text, ts }]);
    setInput("");
    setLoading(true);
    const answer = await askBackend(text);
    setMessages(m => [...m, { role: "assistant", content: answer, ts: Date.now() }]);
    setLoading(false);
  }

  function handleSuggestion(s: string) {
    if (s === "Leave a message") {
      setLeaveMsgMode(true);
      setMessages(m => [...m, { role: "assistant", content: "Please leave your message. We'll just need your name and email.", ts: Date.now() }]);
      return;
    }
    setInput(s);
    // auto send
    setTimeout(() => handleSend(), 10);
  }

  return (
    <>
      <button
        aria-label={open ? "Close support chat" : "Open support chat"}
        onClick={() => setOpen(o => !o)}
        className="fixed z-50 bottom-5 right-5 rounded-full bg-red-500 hover:bg-red-600 text-white w-14 h-14 shadow-lg flex items-center justify-center font-bold text-xl overflow-hidden"
      >
        {open ? (
          "×"
        ) : (
          <Image
            src="/bot.jpg"
            alt="Support bot"
            width={56}
            height={56}
            className="w-full h-full object-cover"
            priority
          />
        )}
      </button>
      {open && (
        <div className="fixed z-50 bottom-24 right-5 w-80 max-h-[70vh] flex flex-col rounded-xl shadow-2xl border border-gray-700/40 bg-[#111] text-white overflow-hidden">
          <div className="px-4 py-3 bg-black/60 text-sm font-semibold tracking-wide flex items-center justify-between">
            <span>Support Chat</span>
            <span className="text-[10px] text-gray-400">beta</span>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm custom-scrollbar">
            {messages.map(m => (
              <div key={m.ts} className={(m.role === "user" ? "ml-auto bg-red-500/90" : "mr-auto bg-white/10") + " px-3 py-2 rounded-lg max-w-[85%] whitespace-pre-wrap leading-relaxed"}>
                {m.content}
              </div>
            ))}
            {loading && <div className="mr-auto bg-white/10 px-3 py-2 rounded-lg text-gray-300 animate-pulse">Thinking…</div>}
            {!leaveMsgMode && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestionSets.map(s => (
                  <button key={s} type="button" onClick={() => handleSuggestion(s)} className="text-xs px-2 py-1 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur border border-white/10">
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={handleSend} className="border-t border-gray-700/50 flex flex-col gap-2 p-3 bg-black/40 text-sm">
            {leaveMsgMode && (
              <>
                <div className="flex gap-2">
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Name"
                    className="flex-1 bg-transparent outline-none placeholder-gray-500 border-b border-gray-700/60 pb-1"
                    disabled={loading}
                  />
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    className="flex-1 bg-transparent outline-none placeholder-gray-500 border-b border-gray-700/60 pb-1"
                    disabled={loading}
                    type="email"
                  />
                </div>
              </>
            )}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={leaveMsgMode ? "Your message" : "Type your question"}
                className="flex-1 bg-transparent outline-none placeholder-gray-500"
                disabled={loading}
              />
              {leaveMsgMode && (
                <button type="button" onClick={() => { setLeaveMsgMode(false); setName(""); setEmail(""); setInput(""); }} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20">Back</button>
              )}
              <button type="submit" disabled={loading || !input.trim() || (leaveMsgMode && (!name.trim() || !email.trim()))} className="font-semibold px-3 py-1 rounded bg-red-500 hover:bg-red-600 disabled:opacity-40">
                {leaveMsgMode ? "Send" : "Ask"}
              </button>
            </div>
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
