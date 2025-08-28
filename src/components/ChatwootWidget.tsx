"use client";
import { useEffect, useRef } from 'react';

interface ChatwootWidgetProps {
  baseUrl?: string; // override
  websiteToken?: string; // override
}

// Loads Chatwoot website SDK once and runs it. Expects self-hosted Docker instance.
export default function ChatwootWidget({ baseUrl, websiteToken }: ChatwootWidgetProps){
  const loadedRef = useRef(false);
  const finalBase = baseUrl || process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL || '';
  const finalToken = websiteToken || process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN || '';

  useEffect(()=>{
    if(loadedRef.current) return;
    if(!finalBase || !finalToken) return; // missing config
    loadedRef.current = true;
    const script = document.createElement('script');
    script.src = `${finalBase.replace(/\/$/,'')}/packs/js/sdk.js`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // @ts-expect-error chatwootSDK injected by external script
      if(window.chatwootSDK){
        // @ts-expect-error chatwootSDK injected by external script
        window.chatwootSDK.run({ websiteToken: finalToken, baseUrl: finalBase });
      }
    };
    document.head.appendChild(script);
    return ()=> { /* do not remove script to preserve session */ };
  }, [finalBase, finalToken]);

  if(!finalBase || !finalToken){
    return <div className="text-sm text-red-600">Chatwoot not configured: set NEXT_PUBLIC_CHATWOOT_BASE_URL & NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN.</div>;
  }
  return null; // purely side-effect
}
