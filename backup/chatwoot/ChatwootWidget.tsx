// Backup of original ChatwootWidget.tsx
"use client";
import { useEffect, useRef } from 'react';

interface ChatwootWidgetProps { baseUrl?: string; websiteToken?: string; }
export default function ChatwootWidget({ baseUrl, websiteToken }: ChatwootWidgetProps){
  const loadedRef = useRef(false);
  const finalBase = baseUrl || process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL || '';
  const finalToken = websiteToken || process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN || '';
  useEffect(()=>{
    if(loadedRef.current) return; if(!finalBase || !finalToken) return; loadedRef.current = true;
    const script = document.createElement('script');
    script.src = `${finalBase.replace(/\/$,'')}/packs/js/sdk.js`;
    script.async = true; script.defer = true;
    script.onload = () => { /* @ts-expect-error */ if(window.chatwootSDK){ /* @ts-expect-error */ window.chatwootSDK.run({ websiteToken: finalToken, baseUrl: finalBase }); } };
    document.head.appendChild(script);
  }, [finalBase, finalToken]);
  if(!finalBase || !finalToken){ return <div className="text-sm text-red-600">Chatwoot not configured: set NEXT_PUBLIC_CHATWOOT_BASE_URL & NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN.</div>; }
  return null;
}
