import { NextResponse } from 'next/server';
import { requestHuman, takeOverConversation, getConversation, deactivateHuman } from '@/lib/supportStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if(!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const convo = await requestHuman(id);
  if(!convo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true, conversation: { id: convo.id, needsHuman: convo.needsHuman, humanActive: convo.humanActive } });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { action } = await req.json().catch(()=>({}));
  if(!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  if(action === 'takeover'){
    const convo = await takeOverConversation(id);
    if(!convo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true, conversation: { id: convo.id, needsHuman: convo.needsHuman, humanActive: convo.humanActive } });
  }
  if(action === 'deactivate'){
    const convo = await deactivateHuman(id);
    if(!convo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true, conversation: { id: convo.id, needsHuman: convo.needsHuman, humanActive: convo.humanActive } });
  }
  if(action === 'status'){
    const convo = await getConversation(id);
    if(!convo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true, conversation: { id: convo.id, needsHuman: convo.needsHuman, humanActive: convo.humanActive } });
  }
  return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
}
