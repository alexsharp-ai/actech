import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

interface ReturnRecord { id: string; name: string; email: string; orderNumber: string; reason: string; details?: string; ts: number; }

const file = path.join(process.cwd(), 'returns-submissions.json');
async function load(): Promise<ReturnRecord[]> { try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch { return []; } }
async function save(list: ReturnRecord[]){ await fs.writeFile(file, JSON.stringify(list, null, 2), 'utf8'); }

export async function POST(req: NextRequest){
  try {
    const body = await req.json();
    const { name, email, orderNumber, reason, details } = body || {};
    if(!name || !email || !orderNumber || !reason){
      return new Response(JSON.stringify({ ok:false, error:'Missing fields' }), { status:400 });
    }
    if(!/.+@.+\..+/.test(email)) return new Response(JSON.stringify({ ok:false, error:'Invalid email'}), { status:400 });
    const record: ReturnRecord = { id: crypto.randomUUID(), name: String(name), email: String(email).toLowerCase(), orderNumber: String(orderNumber), reason: String(reason), details: details? String(details): undefined, ts: Date.now() };
    const list = await load();
    list.push(record);
    await save(list);
    return new Response(JSON.stringify({ ok:true }), { status:200 });
  } catch {
    return new Response(JSON.stringify({ ok:false, error:'Server error'}), { status:500 });
  }
}

// Optional simple metrics endpoint
export async function GET(){
  const list = await load();
  return new Response(JSON.stringify({ count: list.length }), { status:200, headers:{ 'Content-Type':'application/json' } });
}
