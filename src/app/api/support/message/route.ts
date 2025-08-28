import { NextRequest, NextResponse } from 'next/server';

// Create (or reuse) a conversation and send a message to Chatwoot
// Body: { conversationId?: number, content: string, inboxId?: number, contactId?: number }
export async function POST(req: NextRequest){
  const base = process.env.CHATWOOT_BASE_URL?.replace(/\/$/,'');
  const token = process.env.CHATWOOT_API_TOKEN;
  const accountId = process.env.CHATWOOT_ACCOUNT_ID || '133204';
  if(!base || !token) return NextResponse.json({ error: 'Chatwoot not configured' }, { status: 500 });
  const body = await req.json();
  const { conversationId, content, inboxId, contactId } = body || {};
  if(!content) return NextResponse.json({ error: 'Missing content' }, { status: 400 });

  async function ensureConversation(): Promise<number>{
    if(conversationId) return conversationId;
    if(!inboxId || !contactId) throw new Error('Need inboxId & contactId to create conversation');
    const convRes = await fetch(`${base}/api/v1/accounts/${accountId}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
      body: JSON.stringify({ inbox_id: inboxId, contact_id: contactId })
    });
    const convData = await convRes.json();
    if(!convRes.ok) throw new Error(convData?.message || 'Failed creating conversation');
    return convData.id || convData.conversation?.id;
  }

  try {
    const convId = await ensureConversation();
    const msgRes = await fetch(`${base}/api/v1/accounts/${accountId}/conversations/${convId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
      body: JSON.stringify({ content, message_type: 'incoming' })
    });
    const msgData = await msgRes.json();
    if(!msgRes.ok) return NextResponse.json({ error: msgData }, { status: 500 });
    return NextResponse.json({ conversationId: convId, message: msgData });
  } catch (e){
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
