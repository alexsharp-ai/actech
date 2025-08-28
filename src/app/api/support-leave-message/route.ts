import { NextRequest } from "next/server";

interface StoredMessage { name: string; email: string; message: string; ts: number; }
const inbox: StoredMessage[] = [];

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), { status: 400 });
    }
    // Basic naive validation
    if (!/.+@.+\..+/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid email" }), { status: 400 });
    }
    inbox.push({ name: String(name).trim(), email: String(email).toLowerCase(), message: String(message).trim(), ts: Date.now() });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), { status: 500 });
  }
}

// (Optional) simple GET for debugging (not authenticated). Remove in production.
export async function GET() {
  return new Response(JSON.stringify({ count: inbox.length, inbox }), { status: 200, headers: { "Content-Type": "application/json" } });
}
