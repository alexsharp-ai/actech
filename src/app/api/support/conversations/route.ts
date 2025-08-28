import { NextRequest, NextResponse } from 'next/server';

// Proxy list Chatwoot conversations
// Env vars required (server side only): CHATWOOT_BASE_URL, CHATWOOT_API_TOKEN, CHATWOOT_ACCOUNT_ID
export async function GET(req: NextRequest){
  const base = process.env.CHATWOOT_BASE_URL?.replace(/\/$/,'');
  const token = process.env.CHATWOOT_API_TOKEN;
  const accountId = process.env.CHATWOOT_ACCOUNT_ID || '133204'; // fallback provided
  if(!base || !token) return NextResponse.json({ error: 'Chatwoot not configured' }, { status: 500 });

  const searchParams = req.nextUrl.searchParams;
  const page = searchParams.get('page') || '1';
  const status = searchParams.get('status') || 'open';

  const url = `${base}/api/v1/accounts/${accountId}/conversations?status=${encodeURIComponent(status)}&page=${encodeURIComponent(page)}`;
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
  interface ChatwootConversationResponse { payload?: unknown; data?: unknown; message?: string; error?: string; }
  let data: ChatwootConversationResponse | null = null;
  try { data = await res.json() as ChatwootConversationResponse; } catch { /* ignore json parse error */ }
    if(!res.ok){
      console.error('Chatwoot conversations fetch failed', res.status, data);
    }
    return NextResponse.json({ ok: res.ok, status: res.status, data });
  } catch (e){
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
