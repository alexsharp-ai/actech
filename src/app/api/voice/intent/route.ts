import { NextRequest } from "next/server";

// Normalize intent keys
interface BaseIntent { intent: string; raw: string; }
interface IntentResult extends BaseIntent {
  address?: string;
  items?: string[];
  workout_query?: string;
  recipe_query?: string;
  error?: string;
}

export async function POST(req: NextRequest){
  try {
    const { transcript } = await req.json();
    const raw: string = (transcript||"").toString().trim();
    if(!raw){
      return Response.json({ error:"Empty transcript" }, { status:400 });
    }

    const lower = raw.toLowerCase();
    // Fast regex shortcuts before hitting OpenAI (cheap & low latency)
    const quick = regexParse(lower);
    if(quick) return Response.json(quick);

    const key = process.env.OPENAI_API_KEY;
    if(!key){
      // Fallback simple classification
      return Response.json({ intent:"unknown", raw });
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const prompt = `You classify a short user voice command for a mobile companion app. Return compact JSON ONLY (no markdown) with fields: intent (one of: navigation.go, groceries.add, gym.workouts, cooking.recipe, unknown), and optional fields: address, items (array of strings), workout_query, recipe_query. Input: "${raw.replace(/"/g,'\\"')}"`;
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${key}`
      },
      body: JSON.stringify({
        model,
        temperature:0.1,
        max_tokens:150,
        messages:[
          { role:"system", content:"You output strict JSON only."},
          { role:"user", content: prompt }
        ]
      })
    });
    if(!r.ok){
      console.warn("OpenAI intent classification failed", r.status);
      return Response.json({ intent:"unknown", raw }, { status:200 });
    }
    const data = await r.json();
  let parsed: IntentResult | undefined;
  try { parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}") as IntentResult; } catch {}
  if(!parsed || typeof parsed !== 'object' || !parsed.intent) parsed = { intent:"unknown", raw };
  else parsed.raw = raw;
  return Response.json(parsed);
  } catch (e){
    console.error("/api/voice/intent error", e);
    return Response.json({ intent:"error", error:"internal" }, { status:500 });
  }
}

function regexParse(lower: string): IntentResult | null {
  // add groceries: "add bananas and milk", "add rice"
  if(/^add /.test(lower)){
    const items = lower.replace(/^add /,'').split(/,| and /).map(s=>s.trim()).filter(Boolean);
  return { intent:"groceries.add", raw: lower, items };
  }
  if(/navigate|nav to|go to|directions|route to/.test(lower)){
    const addr = lower.replace(/.*?(navigate|nav to|go to|route to|directions?)/,'').replace(/^ to /,'').trim();
  return { intent:"navigation.go", raw: lower, address: addr };
  }
  if(/workout|gym|exercise/.test(lower)){
    const query = lower.replace(/.*?(workout|gym|exercise)/,'').trim() || 'full body workout';
  return { intent:"gym.workouts", raw: lower, workout_query: query };
  }
  if(/cook|recipe|make /.test(lower)){
    const q = lower.replace(/.*?(cook|recipe|make )/,'').trim() || 'healthy high protein';
  return { intent:"cooking.recipe", raw: lower, recipe_query: q };
  }
  return null;
}
