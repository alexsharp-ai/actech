import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

interface ContactRecord { id: string; name: string; email: string; subject: string; message: string; ts: number; }

const file = path.join(process.cwd(), 'contact-messages.json');
async function load(): Promise<ContactRecord[]> { try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch { return []; } }
async function save(list: ContactRecord[]){ await fs.writeFile(file, JSON.stringify(list, null, 2), 'utf8'); }

export async function POST(req: NextRequest){
  try {
    const body = await req.json();
    const { name, email, subject, message } = body || {};
    if(!name || !email || !subject || !message){
      return new Response(JSON.stringify({ ok:false, error:'Missing fields' }), { status:400 });
    }
    if(!/.+@.+\..+/.test(email)) return new Response(JSON.stringify({ ok:false, error:'Invalid email'}), { status:400 });
    const rec: ContactRecord = { id: crypto.randomUUID(), name: String(name), email: String(email).toLowerCase(), subject: String(subject), message: String(message), ts: Date.now() };
    const list = await load();
    list.push(rec);
    await save(list);
    return new Response(JSON.stringify({ ok:true }), { status:200 });
  } catch {
    return new Response(JSON.stringify({ ok:false, error:'Server error'}), { status:500 });
  }
}

export async function GET(){
  const list = await load();
  return new Response(JSON.stringify({ count: list.length }), { status:200, headers:{ 'Content-Type':'application/json' } });
}
