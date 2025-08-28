import { NextResponse } from 'next/server';
import { purgeAll } from '@/lib/supportStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(){
  await purgeAll();
  return NextResponse.json({ ok: true });
}
