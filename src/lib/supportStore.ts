import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export interface SupportMessage { id: string; role: 'user'|'assistant'; content: string; ts: number; }
export interface SupportConversation { id: string; createdAt: number; updatedAt: number; userName?: string; userEmail?: string; status: 'open'|'closed'; messages: SupportMessage[]; }

interface DataShape { conversations: SupportConversation[] }

const dataFile = process.env.SUPPORT_DATA_FILE || path.join(process.cwd(), 'support-data.json');
let loaded = false;
let data: DataShape = { conversations: [] };
let writeInFlight: Promise<void> | null = null;

async function load(){
  if(loaded) return; loaded = true;
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    data = JSON.parse(raw);
    if(!data.conversations) data.conversations = [];
  } catch {
    // ignore missing
  }
}

async function persist(){
  if(writeInFlight) return writeInFlight;
  const p = fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8').catch(()=>{}).finally(()=>{ writeInFlight = null; });
  writeInFlight = p;
  return p;
}

export async function listConversations(): Promise<SupportConversation[]> {
  await load();
  // Return shallow copy without messages for listing for performance
  return data.conversations.map(c => ({ ...c, messages: [] }));
}

export async function getConversation(id: string): Promise<SupportConversation | undefined> {
  await load();
  return data.conversations.find(c => c.id === id);
}

export async function addMessage(opts: { conversationId?: string; role: 'user'|'assistant'; content: string; userName?: string; userEmail?: string }): Promise<{ conversation: SupportConversation; message: SupportMessage; created: boolean }>{
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
      messages: []
    };
    data.conversations.unshift(convo); // newest first
    created = true;
  }
  const message: SupportMessage = { id: randomUUID(), role: opts.role, content: opts.content, ts: Date.now() };
  convo.messages.push(message);
  convo.updatedAt = message.ts;
  if(opts.userName && !convo.userName) convo.userName = opts.userName;
  if(opts.userEmail && !convo.userEmail) convo.userEmail = opts.userEmail;
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
