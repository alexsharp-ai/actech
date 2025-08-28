import { NextRequest } from 'next/server';
import { addMessage } from '@/lib/supportStore';

export async function POST(req: NextRequest){
  try {
    const { firstName, lastName, email, orderNumber, product, message } = await req.json();
    if(!firstName || !lastName || !email || !orderNumber || !product) return new Response(JSON.stringify({ ok:false, error:'Missing fields'}), { status:400, headers:{'Content-Type':'application/json'} });
    if(!/.+@.+\..+/.test(email)) return new Response(JSON.stringify({ ok:false, error:'Invalid email'}), { status:400, headers:{'Content-Type':'application/json'} });
    const subject = `Warranty Registration ${orderNumber}`;
    const content = [
      'WARRANTY REGISTRATION',
      `Name: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Order: ${orderNumber}`,
      `Product: ${product}`,
      message? 'Message: '+message : null,
      '---'
    ].filter(Boolean).join('\n');
    const { conversation } = await addMessage({ role:'user', content, userName: `${firstName} ${lastName}`, userEmail: email, source:'contact', subject });
    return new Response(JSON.stringify({ ok:true, conversationId: conversation.id }), { status:200, headers:{'Content-Type':'application/json'} });
  } catch (err) {
    console.error('Warranty form error', err);
    return new Response(JSON.stringify({ ok:false, error:'Server error'}), { status:500, headers:{'Content-Type':'application/json'} });
  }
}

export async function GET(){ return new Response(JSON.stringify({ ok:true }), { status:200, headers:{'Content-Type':'application/json'} }); }