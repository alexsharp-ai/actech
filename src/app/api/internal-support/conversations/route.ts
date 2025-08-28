import { NextRequest, NextResponse } from 'next/server';
import { listConversations, addMessage } from '@/lib/supportStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET: list conversations (without messages)  POST: create conversation with first user message
export async function GET(req: NextRequest){
  const url = new URL(req.url);
  const source = url.searchParams.get('source') as ('chat'|'email'|'contact'|null);
  let convos = await listConversations();
  if(source) convos = convos.filter(c=> c.source === source);
  return NextResponse.json({ ok: true, conversations: convos });
}

export async function POST(req: NextRequest){
  try {
  const { content, userName, userEmail, source, subject } = await req.json();
    if(!content) return NextResponse.json({ error: 'Missing content' }, { status: 400 });
  const { conversation } = await addMessage({ role: 'user', content, userName, userEmail, source, subject });
    return NextResponse.json({ ok: true, conversation });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
