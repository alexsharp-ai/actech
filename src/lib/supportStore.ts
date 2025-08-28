import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export interface SupportMessage { id: string; role: 'user'|'assistant'; content: string; ts: number; }
export interface SupportConversation { id: string; createdAt: number; updatedAt: number; userName?: string; userEmail?: string; status: 'open'|'closed'; needsHuman?: boolean; humanActive?: boolean; unread?: boolean; source: 'chat'|'email'|'contact'; subject?: string; messages: SupportMessage[]; }

interface DataShape { conversations: SupportConversation[] }

const dataFile = process.env.SUPPORT_DATA_FILE || path.join(process.cwd(), 'support-data.json');
// Always reload file per operation to avoid stale state across route executions.
// (For higher throughput, introduce a small in-memory TTL cache later.)
let data: DataShape = { conversations: [] };
let writeInFlight: Promise<void> | null = null;

async function load(){
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    data = JSON.parse(raw);
    if(!data.conversations) data.conversations = [];
  } catch {
    // ignore missing; keep in-memory data
  }
}

async function persist(){
  if(writeInFlight) return writeInFlight;
  const p = fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8').catch(()=>{}).finally(()=>{ writeInFlight = null; });
  writeInFlight = p;
  return p;
}

export async function listConversations(): Promise<(SupportConversation & { lastMessage?: string })[]> {
  await load();
  // Return shallow copy without messages for listing for performance
  return data.conversations.map(c => ({ ...c, messages: [], lastMessage: c.messages[c.messages.length-1]?.content }));
}

export async function getConversation(id: string): Promise<SupportConversation | undefined> {
  await load();
  return data.conversations.find(c => c.id === id);
}

export async function addMessage(opts: { conversationId?: string; role: 'user'|'assistant'; content: string; userName?: string; userEmail?: string; source?: 'chat'|'email'|'contact'; subject?: string }): Promise<{ conversation: SupportConversation; message: SupportMessage; created: boolean }>{
  await load();
  let convo: SupportConversation | undefined;
  let created = false;
  if(opts.conversationId){
    convo = data.conversations.find(c => c.id === opts.conversationId);
  }
  if(!convo){
    convo = {
      id: randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userName: opts.userName,
      userEmail: opts.userEmail,
      status: 'open',
  needsHuman: false,
  humanActive: false,
  unread: true,
      source: opts.source || 'chat',
      subject: opts.subject,
      messages: []
    };
    data.conversations.unshift(convo); // newest first
    created = true;
  }
  const message: SupportMessage = { id: randomUUID(), role: opts.role, content: opts.content, ts: Date.now() };
  convo.messages.push(message);
  convo.updatedAt = message.ts;
  // If a user sends a message, mark unread (unless human already active which means agent is looking)
  if(message.role === 'user' && !convo.humanActive){ convo.unread = true; }
  // Assistant messages shouldn't mark unread (they are bot responses)
  if(opts.userName && !convo.userName) convo.userName = opts.userName;
  if(opts.userEmail && !convo.userEmail) convo.userEmail = opts.userEmail;
  if(!convo.source) convo.source = opts.source || 'chat';
  await persist();
  return { conversation: convo, message, created };
}

export async function listMessages(conversationId: string): Promise<SupportMessage[]>{
  await load();
  return data.conversations.find(c=>c.id===conversationId)?.messages || [];
}

export async function closeConversation(id: string){
  await load();
  const c = data.conversations.find(c=>c.id===id);
  if(c){ c.status = 'closed'; c.updatedAt = Date.now(); await persist(); }
  return c;
}

export async function requestHuman(id: string){
  await load();
  const c = data.conversations.find(c=>c.id===id);
  if(c){ c.needsHuman = true; c.updatedAt = Date.now(); await persist(); }
  return c;
}

export async function takeOverConversation(id: string){
  await load();
  const c = data.conversations.find(c=>c.id===id);
  if(c){ c.needsHuman = false; c.humanActive = true; c.updatedAt = Date.now(); await persist(); }
  return c;
}

export async function deactivateHuman(id: string){
  await load();
  const c = data.conversations.find(c=>c.id===id);
  if(c){ c.humanActive = false; await persist(); }
  return c;
}

export async function clearNeedsHuman(id: string){
  await load();
  const c = data.conversations.find(c=>c.id===id);
  if(c){
    // visiting a conversation acknowledges it: clear needsHuman flag and unread flag
    if(c.needsHuman) c.needsHuman = false;
    if(c.unread) c.unread = false;
    c.updatedAt = Date.now();
    await persist();
  }
  return c;
}

export async function purgeAll(){
  await load();
  data.conversations = [];
  await persist();
  return true;
}

