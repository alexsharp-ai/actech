// Backup of original ChatwootWidget.tsx (not used in app build)
"use client";
import { useEffect, useRef } from 'react';

// Provide minimal typing for backed up widget so TypeScript passes during build
declare global {
  interface Window { chatwootSDK?: { run?: (opts: { websiteToken: string; baseUrl: string }) => void } }
}

interface ChatwootWidgetProps { baseUrl?: string; websiteToken?: string; }
export default function ChatwootWidget({ baseUrl, websiteToken }: ChatwootWidgetProps){
  const loadedRef = useRef(false);
  const finalBase = baseUrl || process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL || '';
  const finalToken = websiteToken || process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN || '';
  useEffect(()=>{
    if(loadedRef.current) return; if(!finalBase || !finalToken) return; loadedRef.current = true;
    const script = document.createElement('script');
  // Fixed regex (was broken copy): remove trailing slash if present
  script.src = `${finalBase.replace(/\/$/, '')}/packs/js/sdk.js`;
    script.async = true; script.defer = true;
  script.onload = () => { if(window.chatwootSDK?.run){ window.chatwootSDK.run({ websiteToken: finalToken, baseUrl: finalBase }); } };
    document.head.appendChild(script);
  }, [finalBase, finalToken]);
  if(!finalBase || !finalToken){ return <div className="text-sm text-red-600">Chatwoot not configured: set NEXT_PUBLIC_CHATWOOT_BASE_URL & NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN.</div>; }
  return null;
}
