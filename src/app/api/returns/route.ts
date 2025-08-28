import { NextRequest } from 'next/server';
import { addMessage } from '@/lib/supportStore';

export async function POST(req: NextRequest){
  try {
    const { name, email, orderNumber, reason, details } = await req.json();
    if(!name || !email || !orderNumber || !reason) return new Response(JSON.stringify({ ok:false, error:'Missing fields' }), { status:400, headers:{'Content-Type':'application/json'} });
    if(!/.+@.+\..+/.test(email)) return new Response(JSON.stringify({ ok:false, error:'Invalid email'}), { status:400, headers:{'Content-Type':'application/json'} });
    const subject = `Return Request #${orderNumber}`;
    const lines = [
      `RETURNS FORM`,
      `Order: ${orderNumber}`,
      `Customer: ${name} <${email}>`,
      `Reason: ${reason}`,
      details? 'Details: '+details : null,
      '---'
    ].filter(Boolean).join('\n');
    const { conversation } = await addMessage({ role:'user', content: lines, userName: name, userEmail: email, source:'contact', subject });
    return new Response(JSON.stringify({ ok:true, conversationId: conversation.id }), { status:200, headers:{'Content-Type':'application/json'} });
  } catch (err) {
    console.error('Returns form error', err);
    return new Response(JSON.stringify({ ok:false, error:'Server error'}), { status:500, headers:{'Content-Type':'application/json'} });
  }
}

export async function GET(){
  return new Response(JSON.stringify({ ok:true }), { status:200, headers:{'Content-Type':'application/json'} });
}
