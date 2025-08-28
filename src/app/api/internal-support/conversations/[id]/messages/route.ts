import { NextRequest, NextResponse } from 'next/server';
import { listMessages, addMessage, getConversation } from '@/lib/supportStore';

// This route reads/writes the filesystem (JSON store). Disable static optimization.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }){
  const { id } = await params;
  if(!id){
    if(process.env.NODE_ENV !== 'production') console.warn('[support] GET messages missing id');
    return NextResponse.json({ ok: true, messages: [] });
  }
  const convo = await getConversation(id);
  const messages = await listMessages(id);
  if(process.env.NODE_ENV !== 'production') console.log('[support] GET messages', id, 'count=', messages.length, 'status=', convo?.status);
  return NextResponse.json({ ok: true, messages, status: convo?.status });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }){
  try {
    const { id } = await params;
    const { content, role } = await req.json();
    if(!content) return NextResponse.json({ error: 'Missing content' }, { status: 400 });
    if(role !== 'assistant' && role !== 'user') return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    if(!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const convo = await getConversation(id);
    if(!convo) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    const { message } = await addMessage({ conversationId: id, role, content });
    return NextResponse.json({ ok: true, message });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
