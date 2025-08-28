import { NextResponse } from 'next/server';
import { clearNeedsHuman } from '@/lib/supportStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if(!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const convo = await clearNeedsHuman(id);
  if(!convo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true, conversation: { id: convo.id, needsHuman: convo.needsHuman, humanActive: convo.humanActive, status: convo.status } });
}
