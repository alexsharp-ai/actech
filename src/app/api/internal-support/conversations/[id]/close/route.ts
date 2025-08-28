import { NextResponse } from 'next/server';
import { closeConversation } from '@/lib/supportStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if(!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const convo = await closeConversation(id);
  if(!convo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true, conversation: { id: convo.id, status: convo.status } });
}
