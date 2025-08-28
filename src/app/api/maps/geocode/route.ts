import { NextRequest } from "next/server";

export async function GET(req: NextRequest){
  try {
    const q = req.nextUrl.searchParams.get('q');
    if(!q) return Response.json({ error:"Missing q" }, { status:400 });
    const key = process.env.GOOGLE_API_KEY;
    if(!key) return Response.json({ error:"Missing GOOGLE_API_KEY" }, { status:500 });
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+encodeURIComponent(q)+"&key="+key;
    const r = await fetch(url);
    if(!r.ok) return Response.json({ error:"geocode failed" }, { status:500 });
    const data = await r.json();
    const first = data.results?.[0];
    return Response.json({
      query: q,
      formatted: first?.formatted_address || null,
      location: first?.geometry?.location || null,
      raw: first || null
    });
  } catch (e){
    console.error("/api/maps/geocode error", e);
    return Response.json({ error:"internal" }, { status:500 });
  }
}
