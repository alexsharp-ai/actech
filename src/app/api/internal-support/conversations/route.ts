import { NextRequest, NextResponse } from 'next/server';
import { listConversations, addMessage } from '@/lib/supportStore';

// GET: list conversations (without messages)  POST: create conversation with first user message
export async function GET(){
  const convos = await listConversations();
  return NextResponse.json({ ok: true, conversations: convos });
}

export async function POST(req: NextRequest){
  try {
    const { content, userName, userEmail } = await req.json();
    if(!content) return NextResponse.json({ error: 'Missing content' }, { status: 400 });
    const { conversation } = await addMessage({ role: 'user', content, userName, userEmail });
    return NextResponse.json({ ok: true, conversation });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
