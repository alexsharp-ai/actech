import { NextRequest, NextResponse } from 'next/server';
import { listMessages, addMessage, getConversation } from '@/lib/supportStore';

export async function GET(req: NextRequest, context: Promise<{ params: { id: string } }>){
  const { params } = await context;
  const messages = await listMessages(params.id);
  return NextResponse.json({ ok: true, messages });
}

export async function POST(req: NextRequest, context: Promise<{ params: { id: string } }>){
  try {
    const { params } = await context;
    const { content, role } = await req.json();
    if(!content) return NextResponse.json({ error: 'Missing content' }, { status: 400 });
    if(role !== 'assistant' && role !== 'user') return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    const convo = await getConversation(params.id);
    if(!convo) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    const { message } = await addMessage({ conversationId: params.id, role, content });
    return NextResponse.json({ ok: true, message });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
