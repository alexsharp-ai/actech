// Backup of original /api/support/chatwoot/route.ts
import { NextRequest, NextResponse } from 'next/server';
interface ChatwootBridgeBody { message: string; name?: string; email?: string; conversationId?: number; contactId?: number; clientId?: string; senderRole?: 'user' | 'assistant'; }
export async function POST(req: NextRequest){
  const base = process.env.CHATWOOT_BASE_URL?.replace(/\/$/, '');
  const token = process.env.CHATWOOT_API_TOKEN;
  const accountId = process.env.CHATWOOT_ACCOUNT_ID || '133204';
  const inboxId = process.env.CHATWOOT_INBOX_ID;
  if(!base || !token || !accountId || !inboxId){ return NextResponse.json({ error: 'Chatwoot server env vars missing' }, { status: 500 }); }
  let body: ChatwootBridgeBody; try { body = await req.json() as ChatwootBridgeBody; } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const { message, name, email, conversationId, contactId, clientId, senderRole } = body || {};
  if(!message || !message.toString().trim()) return NextResponse.json({ error: 'Missing message' }, { status: 400 });
  async function createContactIfNeeded(): Promise<number> { if(contactId) return contactId; const contactRes = await fetch(`${base}/api/v1/accounts/${accountId}/contacts`, { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ name: name || 'Guest', email: email || undefined, identifier: clientId || undefined }) }); const contactData = await contactRes.json(); if(!contactRes.ok) throw new Error(contactData?.message || 'Contact creation failed'); return contactData.id || contactData.contact?.id; }
  async function createConversationIfNeeded(finalContactId: number): Promise<number> { if(conversationId) return conversationId; const convRes = await fetch(`${base}/api/v1/accounts/${accountId}/conversations`, { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ inbox_id: Number(inboxId), contact_id: finalContactId }) }); const convData = await convRes.json(); if(!convRes.ok) throw new Error(convData?.message || 'Conversation creation failed'); return convData.id || convData.conversation?.id; }
  async function sendMessage(convId: number){ const type = senderRole === 'assistant' ? 'outgoing' : 'incoming'; const msgRes = await fetch(`${base}/api/v1/accounts/${accountId}/conversations/${convId}/messages`, { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ content: message, message_type: type }) }); const msgData = await msgRes.json(); if(!msgRes.ok) throw new Error(msgData?.message || 'Message send failed'); return msgData; }
  try { const cId = await createContactIfNeeded(); const convId = await createConversationIfNeeded(cId); const msg = await sendMessage(convId); return NextResponse.json({ ok: true, contactId: cId, conversationId: convId, message: msg }); } catch (e){ const err = e instanceof Error ? e.message : 'Unknown error'; return NextResponse.json({ error: err }, { status: 500 }); }
}
