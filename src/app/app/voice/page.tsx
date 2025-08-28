"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';

/*
  Voice Assistant Prototype (iPhone style frame)
  Demonstrates intent parsing for these commands:
  - take me to "ADDRESS"
  - search me a recipe to cook with ... (INGREDIENTS)
  - find me a 15 full body exercise video
  - add (ITEM) to my grocery list
  - open grocery list / show grocery list

  Roadmap integration (Google APIs):
  - Geocoding + Directions: call /api/voice/geocode?address= to get lat/lng, then /api/voice/directions?origin&dest
  - Places Autocomplete: refine ambiguous address commands
  - YouTube Data API (via Google) for workout / recipe video search
  - (Optional) Custom Search API or Serp for textual recipe pages
*/

interface GroceryItem { id:string; label:string; done:boolean }

type Screen =
  | { type:'idle' }
  | { type:'nav'; address:string }
  | { type:'recipes'; ingredients:string[]; recipes:Recipe[] }
  | { type:'workouts'; videos:VideoResult[] }
  | { type:'grocery'; items:GroceryItem[] };

interface Recipe { id:string; title:string; source:string; url:string; }
interface VideoResult { id:string; title:string; channel:string; duration:string; url:string; }

const sampleWorkoutVideos: VideoResult[] = [
  { id:'w1', title:'15 Min Full Body Dumbbell Blast', channel:'FitLab', duration:'15:02', url:'https://www.youtube.com/watch?v=xxxxx1' },
  { id:'w2', title:'No Equipment 15‑Minute Full Body', channel:'BodyFlow', duration:'15:10', url:'https://www.youtube.com/watch?v=xxxxx2' },
  { id:'w3', title:'HIIT 15 Min Total Body Shred', channel:'MoveDaily', duration:'14:59', url:'https://www.youtube.com/watch?v=xxxxx3' }
];

function buildRecipes(ingredients:string[]): Recipe[] {
  return ingredients.slice(0,5).map((ing,i)=>({
    id:'r'+i,
    title:`${capitalize(ing)} powered bowl (${ingredients.length} ingredients)`,
    source:'AI Suggestion',
    url:'#'
  })).concat([
    {
      id:'rYt',
      title:`Quick recipe ideas with ${ingredients.join(', ')}`,
      source:'YouTube',
      url:'https://www.youtube.com/results?search_query='+encodeURIComponent(ingredients.join(' ')+ ' easy recipe')
    }
  ]);
}

function capitalize(s:string){ return s.charAt(0).toUpperCase()+s.slice(1); }

export default function VoicePrototype(){
  const [input,setInput]=useState('');
  const [screen,setScreen]=useState<Screen>({type:'idle'});
  const [grocery,setGrocery]=useState<GroceryItem[]>(()=>[]);
  const inputRef = useRef<HTMLInputElement|null>(null);
  const [listening,setListening]=useState(false);

  // Fake listening animation
  useEffect(()=>{
    let t: ReturnType<typeof setTimeout> | undefined; 
    if(listening){ t = setTimeout(()=>setListening(false), 2200);} 
    return ()=>{ if(t) clearTimeout(t); };
  },[listening]);

  const updateGroceryScreen = useCallback((items:GroceryItem[]) => {
    setScreen({type:'grocery', items});
  },[]);

  const parseCommand = useCallback((raw:string)=>{
    const cmd = raw.trim().toLowerCase();
    if(!cmd) return;

    // NAVIGATION (Address to directions)
    let match = cmd.match(/take (me )?to (.+)/);
    if(match){
      const address = match[2].replace(/^(the )/, '').replace(/"/g,'').trim();
      setScreen({type:'nav', address});
      // TODO: call geocode endpoint then store coordinates for map embed
      return;
    }

    // RECIPES
    match = cmd.match(/recipe.*with (.+)/) || cmd.match(/cook with (.+)/);
    if(match){
      const ingRaw = match[1].replace(/\.$/,'');
      const ingredients = ingRaw.split(/,| and /).map(s=>s.trim()).filter(Boolean);
      const recipes = buildRecipes(ingredients);
      setScreen({type:'recipes', ingredients, recipes});
      return;
    }

    // WORKOUT (force 15 minute full body video intent)
    if(/find (me )?(a )?15( |-)?(minute )?(full body )?(exercise|workout).*video/.test(cmd)){
      // TODO: fetch top 3 YouTube videos (duration <= 16:00) with query '15 minute full body workout'
      setScreen({type:'workouts', videos: sampleWorkoutVideos});
      return;
    }

  // ADD TO GROCERY LIST
    match = cmd.match(/add (.+) to (my )?(the )?grocery list/);
    if(match){
      const itemLabel = match[1].trim();
      setGrocery(g => {
        const next = [...g, {id:Math.random().toString(36).slice(2), label: capitalize(itemLabel), done:false}];
        updateGroceryScreen(next);
        return next;
      });
      return;
    }

  // OPEN GROCERY LIST
    if(/(open|show) (my )?(the )?grocery list/.test(cmd)){
      updateGroceryScreen(grocery);
      return;
    }

    // Fallback -> idle with interpreted attempt
    setScreen({type:'idle'});
  },[grocery, updateGroceryScreen]);

  const handleSubmit = (e:React.FormEvent)=>{ e.preventDefault(); parseCommand(input); setInput(''); };

  const toggleDone = (id:string)=> setGrocery(g => g.map(it => it.id===id ? {...it, done:!it.done}:it));

  const phoneInner = (
    <div className="relative w-full h-full flex flex-col">
      {/* Dynamic content area */}
      <div className="flex-1 overflow-y-auto p-5 pb-32 rounded-b-[42px] scrollbar-thin">
        {screen.type==='idle' && (
          <div className="h-full flex flex-col items-center justify-center text-center text-sm text-gray-500 gap-4">
            <p className="text-gray-600 font-medium">Voice assistant ready</p>
            <p className="max-w-[240px] leading-relaxed">Try commands like:<br/>“take me to 12 Baker Street”<br/>“search me a recipe to cook with chicken, rice and broccoli”<br/>“find me a 15 full body exercise video”<br/>“add milk to my grocery list”</p>
          </div>
        )}
        {screen.type==='nav' && <NavScreen address={screen.address} />}
        {screen.type==='recipes' && <RecipeScreen data={screen} />}
        {screen.type==='workouts' && <WorkoutScreen videos={screen.videos} />}
        {screen.type==='grocery' && <GroceryScreen items={screen.items} toggle={toggleDone} />}
      </div>
      {/* Input / mic bar */}
      <form onSubmit={handleSubmit} className="absolute left-4 right-4 bottom-6 bg-black/90 text-white rounded-full flex items-center gap-3 px-4 py-3 shadow-lg backdrop-blur-md">
        <button type="button" onClick={()=>{setListening(true); if(inputRef.current) inputRef.current.focus();}} className={`w-9 h-9 rounded-full flex items-center justify-center transition ${listening? 'bg-red-500 animate-pulse':'bg-white text-black'}`} aria-label="Voice input">
          {listening ? <span className="w-2 h-2 bg-white rounded-full" /> : <MicIcon />}
        </button>
        <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} placeholder={listening? 'Listening…':'Type or speak a command'} className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400" />
        <button type="submit" className="text-xs font-semibold uppercase tracking-wide bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full">Go</button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center py-16 px-4 text-white">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Voice Assistant Prototype</h1>
      <p className="text-sm text-gray-400 mb-10 max-w-xl text-center leading-relaxed">Early concept: offline intent parsing only (no real API calls). Demonstrates how a hands‑free experience could route you to navigation, recipes, workouts & grocery list management inside a unified app shell.</p>
      <div className="relative">
        {/* iPhone outer frame */}
        <div className="w-[320px] h-[660px] rounded-[52px] bg-neutral-900 border-[8px] border-neutral-700 shadow-[0_0_0_6px_#111,0_8px_24px_-4px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-black/80 rounded-b-2xl z-20 flex items-center justify-center">
            <div className="w-16 h-1 rounded bg-neutral-700" />
          </div>
          {phoneInner}
        </div>
        <div className="absolute -left-6 top-32 w-1.5 h-24 rounded bg-neutral-700" />
        <div className="absolute -right-6 top-40 w-1.5 h-10 rounded bg-neutral-700" />
      </div>
      {/* Quick command buttons */}
      <div className="mt-10 flex flex-wrap justify-center gap-3 max-w-2xl">
        {[
          'take me to 1600 Amphitheatre Parkway',
          'search me a recipe to cook with salmon, lemon and asparagus',
          'find me a 15 full body exercise video',
          'add oats to my grocery list',
          'open grocery list'
        ].map(c => (
          <button key={c} onClick={()=>{parseCommand(c);}} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full whitespace-nowrap">
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

// Individual screen components
function NavScreen({ address }:{ address:string }){
  return (
    <div className="space-y-4 animate-fadeIn">
      <h2 className="text-lg font-semibold">Directions</h2>
      <div className="w-full aspect-[4/5] rounded-xl bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-xs text-white/70">
  <span className="px-4 text-center leading-relaxed">Map placeholder<br/>Address parsed:<br/><strong>{address}</strong><br/><em className='text-[10px] text-white/40'>Geocoding pending…</em></span>
      </div>
      <button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 text-sm font-semibold">Start navigation</button>
    </div>
  );
}

function RecipeScreen({ data }:{ data: Extract<Screen,{type:'recipes'}> }){
  return (
    <div className="space-y-5 animate-fadeIn">
      <h2 className="text-lg font-semibold">Recipes with {data.ingredients.join(', ')}</h2>
      <ul className="space-y-3 text-sm">
        {data.recipes.map(r => (
          <li key={r.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition flex flex-col">
            <span className="font-medium text-white mb-1 leading-snug">{r.title}</span>
            <span className="text-[11px] text-gray-400 mb-2">{r.source}</span>
            <a href={r.url} target="_blank" className="text-xs text-red-400 hover:text-red-300 underline">Open</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WorkoutScreen({ videos }:{ videos:VideoResult[] }){
  return (
    <div className="space-y-5 animate-fadeIn">
      <h2 className="text-lg font-semibold">15‑minute full body workouts</h2>
      <ul className="space-y-3 text-sm">
        {videos.map(v => (
          <li key={v.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition flex flex-col">
            <span className="font-medium text-white mb-1 leading-snug">{v.title}</span>
            <span className="text-[11px] text-gray-400 mb-1">{v.channel} • {v.duration}</span>
            <a href={v.url} target="_blank" className="text-xs text-red-400 hover:text-red-300 underline">Play</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GroceryScreen({ items, toggle }:{ items:GroceryItem[]; toggle:(id:string)=>void }){
  return (
    <div className="space-y-5 animate-fadeIn">
      <h2 className="text-lg font-semibold">Grocery list</h2>
      {items.length===0 && <p className="text-xs text-gray-400">No items yet. Try: add milk to my grocery list</p>}
      <ul className="space-y-2">
        {items.map(it => (
          <li key={it.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition">
            <button onClick={()=>toggle(it.id)} className={`w-5 h-5 rounded border flex items-center justify-center text-[10px] ${it.done? 'bg-red-500 border-red-500':'border-gray-500'}`}>{it.done? '✓':''}</button>
            <span className={`text-sm ${it.done? 'line-through text-gray-500':'text-white'}`}>{it.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MicIcon(){
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

// Simple fade animation
const styles = `@keyframes fadeIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} } .animate-fadeIn{animation:fadeIn .35s ease;}`;
if (typeof document !== 'undefined' && !document.getElementById('voice-proto-anim')) {
  const style = document.createElement('style');
  style.id = 'voice-proto-anim';
  style.innerHTML = styles;
  document.head.appendChild(style);
}
