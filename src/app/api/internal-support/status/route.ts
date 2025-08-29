import { NextResponse } from 'next/server';
import { _diagnostics, listConversations } from '@/lib/supportStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(){
  const convos = await listConversations();
  const diag = _diagnostics();
  return NextResponse.json({ ok: true, conversations: convos.length, file: diag.file, lastWriteError: diag.lastWriteError, runtime: process.env.VERCEL ? 'vercel' : 'local' });
}
