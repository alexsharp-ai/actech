import { NextRequest } from "next/server";

interface YouTubeSearchItem {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    channelTitle?: string;
    thumbnails?: {
      default?: { url?: string };
      medium?: { url?: string };
    };
  };
}

export async function GET(req: NextRequest){
  try {
    const q = req.nextUrl.searchParams.get('q');
    if(!q) return Response.json({ error:"Missing q" }, { status:400 });
    const key = process.env.GOOGLE_API_KEY; // assuming YouTube Data enabled on same key
    if(!key) return Response.json({ error:"Missing GOOGLE_API_KEY" }, { status:500 });
    const params = new URLSearchParams({
      part:"snippet",
      type:"video",
      maxResults:"5",
      q,
      key
    });
    const r = await fetch("https://www.googleapis.com/youtube/v3/search?"+params.toString());
    if(!r.ok) return Response.json({ error:"youtube search failed" }, { status:500 });
    const data = await r.json();
    const items: YouTubeSearchItem[] = data.items || [];
    const videos = items.map(it => ({
      id: it.id?.videoId as string | undefined,
      title: it.snippet?.title as string | undefined,
      thumbnail: it.snippet?.thumbnails?.medium?.url || it.snippet?.thumbnails?.default?.url,
      channel: it.snippet?.channelTitle as string | undefined
    })).filter(v => !!v.id);
    return Response.json({ query:q, videos });
  } catch (e){
    console.error("/api/youtube/search error", e);
    return Response.json({ error:"internal" }, { status:500 });
  }
}
