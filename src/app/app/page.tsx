 "use client";
import React from 'react';

export default function FreeAppPage(){
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <section className="relative w-full h-[320px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-800 to-gray-600">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)]" />
        <div className="relative z-10 text-center px-6 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">AdamCoTech <span className="bg-red-500 px-2 rounded">FREE APP</span></h1>
          <p className="text-sm md:text-base text-gray-200 leading-relaxed">Companion app (coming soon) to track rides, film gym sessions hands‑free, manage magnetic accessories and get firmware style improvements for future smart mounts.</p>
        </div>
      </section>
  {/* Automated looping phone demo */}
      <PhoneAppLoopDemo />
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
        {[{
          title:'Plan & Track', body:'Map bike & e‑scooter routes, auto‑log distance, share secure location links with friends.'
        },{
          title:'Capture & Stream', body:'Remote camera framing presets + automatic orientation when you rotate the mount.'
        },{
          title:'Magnetic Insights', body:'Usage tips, setup guides and fast access to warranty & support inside the app.'
        }].map(card => (
          <div key={card.title} className="bg-gray-50 border rounded-xl p-6 flex flex-col gap-3">
            <h2 className="font-semibold text-lg">{card.title}</h2>
              <p className="text-sm text-gray-700 leading-relaxed flex-1 text-black">{card.body}</p>
            <div className="text-[11px] uppercase tracking-wide text-gray-500">Coming soon</div>
          </div>
        ))}
      </section>
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="bg-black text-white rounded-2xl p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-3">Get early access</h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">Leave your email to be invited to the beta. We will only send launch & critical feature updates.</p>
            <form onSubmit={(e)=>{e.preventDefault(); (e.target as HTMLFormElement).reset();}} className="flex flex-col sm:flex-row gap-3">
              <input required type="email" placeholder="you@example.com" className="flex-1 px-4 py-3 rounded bg-white text-black text-sm" />
              <button className="px-6 py-3 rounded bg-red-500 hover:bg-red-600 font-semibold text-sm">Notify me</button>
            </form>
            <p className="text-[10px] text-gray-400 mt-3">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Automated looping animation demo component
function PhoneAppLoopDemo(){
  type PhaseId = 'listen1' | 'maps' | 'listen2' | 'workout' | 'listen3' | 'groceries';
  interface Phase { id:PhaseId; label:string; duration:number }
  const phases = React.useMemo<Phase[]>(() => ([
    { id:'listen1', label:'Listening', duration:2500 },
    { id:'maps', label:'Maps', duration:2800 },
    { id:'listen2', label:'Listening', duration:1600 },
    { id:'workout', label:'Workout', duration:2500 },
    { id:'listen3', label:'Listening', duration:1600 },
    { id:'groceries', label:'Groceries', duration:3000 },
  ]), []);
  const [index, setIndex] = React.useState(0);
  const phase = phases[index];
  const [groceryChecks, setGroceryChecks] = React.useState([false,false,false,false]);
  const groceryItems = ['bananas','almonds','blueberries','rice'];

  // advance loop
  React.useEffect(()=>{
    const timer = setTimeout(()=>{
      setIndex(i => (i+1) % phases.length);
    }, phase.duration);
    return ()=> clearTimeout(timer);
  }, [phase, phases.length]);

  // progressively check groceries when in groceries phase
  React.useEffect(()=>{
    if(phase.id !== 'groceries') return;
    const timeouts: NodeJS.Timeout[] = [];
    groceryChecks.forEach((c, i) => {
      if(!c){
        timeouts.push(setTimeout(()=>{
          setGroceryChecks(prev => prev.map((p,pi)=> pi===i? true : p));
        }, 400 + i*500));
      }
    });
    return ()=> timeouts.forEach(t=>clearTimeout(t));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase.id]);

  // reset checks when leaving groceries so animation repeats fresh
  React.useEffect(()=>{
    if(phase.id === 'listen1'){
      setGroceryChecks([false,false,false,false]);
    }
  }, [phase.id]);

  const activeTile: Record<PhaseId, FeatureKey | null> = {
    listen1: null,
    maps: 'navigation',
    listen2: null,
    workout: 'gym',
    listen3: null,
    groceries: 'groceries'
  } as const;

  return (
    <section className="py-20 px-6 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-10 text-center">Autonomous Demo Loop</h2>
      <div className="flex flex-col items-center gap-10">
        {/* Phone shell */}
        <div className="relative w-[320px] h-[640px] rounded-[46px] bg-gradient-to-br from-gray-900 via-black to-gray-800 p-[10px] shadow-2xl border border-white/10">
          <div className="absolute left-1/2 -translate-x-1/2 top-3 w-28 h-6 rounded-full bg-black/60" />
          <div className="w-full h-full rounded-[36px] bg-black/90 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2 text-[11px] font-medium text-gray-500 tracking-wide">
              <span>{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
              <span className="text-gray-600">adamcotech</span>
            </div>
            <div className="flex-1 relative text-white px-5 py-4">
              {/* Listening Phases */}
              {phase.id.startsWith('listen') && (
                <div className="flex flex-col items-center justify-center h-full gap-6">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-[0_0_0_8px_rgba(239,68,68,0.15)]">
                      <div className="w-40 h-40 rounded-full bg-black/60 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center text-center text-xs font-medium bg-red-500 animate-pulse">Listening…</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 animate-ping rounded-full bg-red-500/40" />
                  </div>
                  <p className="text-[11px] text-gray-400 tracking-wide">Phase {index+1} / {phases.length}</p>
                </div>
              )}
              {/* Maps */}
              {phase.id==='maps' && (
                <div className="absolute inset-0 p-2 flex flex-col">
                  <h3 className="font-semibold mb-2 text-sm">Directions</h3>
                  <div className="relative flex-1 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                    <svg viewBox="0 0 200 360" className="absolute inset-0 w-full h-full">
                      <defs>
                        <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
                          <stop offset="0%" stopColor="#ef4444"/>
                          <stop offset="100%" stopColor="#f87171"/>
                        </linearGradient>
                      </defs>
                      <path d="M10 340 L40 300 Q60 270 40 240 L30 200 Q20 160 60 140 L120 110 Q150 95 140 60 L130 30" stroke="#1f2937" strokeWidth="18" strokeLinecap="round" fill="none" />
                      <path d="M10 340 L40 300 Q60 270 40 240 L30 200 Q20 160 60 140 L120 110 Q150 95 140 60 L130 30" stroke="url(#grad)" strokeWidth="6" strokeLinecap="round" fill="none" strokeDasharray="12 14" className="animate-[dashMove_2.2s_linear_infinite]" />
                      <circle cx="130" cy="30" r="8" fill="#ef4444" />
                      <circle cx="10" cy="340" r="8" fill="#22c55e" />
                    </svg>
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-gray-400">
                      <span>ETA 14m</span><span>3.2 km</span>
                    </div>
                  </div>
                </div>
              )}
              {/* Workout */}
              {phase.id==='workout' && (
                <div className="absolute inset-0 flex flex-col">
                  <h3 className="font-semibold mb-2 text-sm">Workout Preview</h3>
                  <div className="relative rounded-xl overflow-hidden flex-1 bg-black">
                    <video className="absolute inset-0 w-full h-full object-cover" src="/v1.mp4" autoPlay muted playsInline loop />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-xs">15‑min Core Ride • 2s snippet</div>
                  </div>
                </div>
              )}
              {/* Groceries */}
              {phase.id==='groceries' && (
                <div className="absolute inset-0 flex flex-col">
                  <h3 className="font-semibold mb-2 text-sm">Grocery List</h3>
                  <ul className="space-y-2 text-xs">
                    {groceryItems.map((g,i)=> (
                      <li key={g} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${groceryChecks[i]? 'bg-red-500 border-red-500 text-white scale-110':'border-gray-500 text-transparent'}`}>✓</span>
                        <span className={groceryChecks[i]? 'line-through text-gray-400': ''}>{g}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-gray-500 mt-4">Auto‑checking items…</p>
                </div>
              )}
            </div>
            {/* feature tiles */}
            <div className="grid grid-cols-4 gap-2 p-4 bg-black/80 border-t border-white/5">
              {[{key:'navigation',icon:<IconNav/>,label:'Navigation'},{key:'groceries',icon:<IconGroceries/>,label:'Groceries'},{key:'gym',icon:<IconGym/>,label:'Gym'},{key:'cooking',icon:<IconCooking/>,label:'Cooking'}].map(tile=> {
                const k = tile.key as FeatureKey;
                const highlighted = activeTile[phase.id] === k;
                return (
                  <div key={tile.key} className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all ${highlighted? 'bg-red-500 text-white shadow-inner':'bg-white/5 text-gray-300'}`}>{tile.icon}<span>{tile.label.split(' ')[0]}</span></div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="max-w-xl text-sm text-gray-600 leading-relaxed text-center">
          <p className="mb-5">Non‑interactive showcase cycling through a typical session: listening → route visualization → listening → workout snippet → listening → grocery list. Loops automatically.</p>
          <ul className="space-y-2 list-none text-left inline-block">
            <li>• Pulsing red orb = passive voice capture animation</li>
            <li>• Maps segment: animated dashed path (placeholder)</li>
            <li>• Workout: muted looping 2s video snippet</li>
            <li>• Groceries: items auto‑check sequentially</li>
            <li>• Cycle repeats endlessly for kiosk style demo</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

type FeatureKey = 'navigation' | 'groceries' | 'gym' | 'cooking';

// Inline icons (simple stroke paths)
function IconNav(){
  return <svg width="20" height="20" viewBox="0 0 24 24" className="text-current" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></svg>;
}
function IconGroceries(){
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h18"/><path d="M5 4l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"/><path d="M9 10h6"/><path d="M9 6h6"/></svg>;
}
function IconGym(){
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="9" width="4" height="6"/><rect x="18" y="9" width="4" height="6"/><path d="M6 12h12"/><path d="M10 9v6"/><path d="M14 9v6"/></svg>;
}
function IconCooking(){
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h16"/><path d="M5 10l1 9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-9"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/></svg>;
}
