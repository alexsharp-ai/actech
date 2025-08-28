import { NextRequest } from "next/server";

// Simple in-memory FAQ patterns (mirror those in the client for SSR fallback)
const faq: { pattern: RegExp; answer: string }[] = [
  { pattern: /shipping|deliver/i, answer: "We ship orders within 24h. Delivery typically takes 2-5 business days in the EU." },
  { pattern: /return|refund/i, answer: "You can request a return within 30 days. Refunds are processed 3-5 days after we receive the item." },
  { pattern: /warranty|guarantee/i, answer: "All products include a 1-year limited warranty covering manufacturing defects." },
  { pattern: /contact|human|agent/i, answer: "You can reach a human agent at support@adamcotech.com or via chat weekdays 9:00-17:00 CET." },
];

// Basic rate limiter (very naive, per Vercel instance memory)
const recentHits: Record<string, { count: number; ts: number }> = {};
const WINDOW_MS = 60_000; // 1 minute
const MAX_PER_WINDOW = 30;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
    const now = Date.now();
    const bucket = recentHits[ip] || { count: 0, ts: now };
    if (now - bucket.ts > WINDOW_MS) {
      bucket.count = 0;
      bucket.ts = now;
    }
    bucket.count += 1;
    recentHits[ip] = bucket;
    if (bucket.count > MAX_PER_WINDOW) {
      return new Response(
        JSON.stringify({ reply: "Rate limit exceeded. Please wait a minute and try again." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const { message } = await req.json();
    const text: string = (message || "").toString().trim();

    if (!text) {
      return new Response(
        JSON.stringify({ reply: "Please enter a question." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const hit = faq.find(f => f.pattern.test(text));
    if (hit) {
      return new Response(JSON.stringify({ answer: hit.answer }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Optional OpenAI call if key present
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const completion = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [
              { role: "system", content: "You are AdamCoTech's helpful support assistant. Be concise, friendly, and only answer questions related to the products (magnetic mounts, accessories), shipping, returns, warranty, and general site info. If unsure, ask the user to clarify." },
              { role: "user", content: text },
            ],
            temperature: 0.3,
            max_tokens: 300,
          }),
        });
        if (completion.ok) {
          const data = await completion.json();
            // OpenAI chat responses structure
          const answer = data.choices?.[0]?.message?.content?.trim();
          if (answer) {
            return new Response(JSON.stringify({ answer }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }
        } else {
          console.warn("OpenAI API non-OK status", completion.status);
        }
      } catch (err) {
        console.warn("OpenAI call failed", err);
      }
    }

    const generic = "Thanks! A human will review this shortly. You can also ask about shipping times, returns policy, warranty length, installation, or payment methods.";
    return new Response(JSON.stringify({ answer: generic }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error("/api/support-chat error", e);
    return new Response(JSON.stringify({ answer: "Sorry, something went wrong processing your question." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
