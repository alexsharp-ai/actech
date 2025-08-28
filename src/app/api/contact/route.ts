import { NextRequest } from 'next/server';
import { addMessage } from '@/lib/supportStore';

export async function POST(req: NextRequest){
  try {
    const { name, email, subject, message } = await req.json();
    if(!name || !email || !subject || !message) return new Response(JSON.stringify({ ok:false, error:'Missing fields' }), { status:400, headers:{'Content-Type':'application/json'} });
    if(!/.+@.+\..+/.test(email)) return new Response(JSON.stringify({ ok:false, error:'Invalid email'}), { status:400, headers:{'Content-Type':'application/json'} });
    // Create internal support conversation with source 'contact'
    const initialContent = `CONTACT FORM\nSubject: ${subject}\nFrom: ${name} <${email}>\n---\n${message}`;
    const { conversation } = await addMessage({ role:'user', content: initialContent, userName: name, userEmail: email, source:'contact', subject });
    return new Response(JSON.stringify({ ok:true, conversationId: conversation.id }), { status:200, headers:{'Content-Type':'application/json'} });
  } catch (err) {
    console.error('Contact form error', err);
    return new Response(JSON.stringify({ ok:false, error:'Server error'}), { status:500, headers:{'Content-Type':'application/json'} });
  }
}

// Lightweight health endpoint
export async function GET(){
  return new Response(JSON.stringify({ ok:true }), { status:200, headers:{'Content-Type':'application/json'} });
}
