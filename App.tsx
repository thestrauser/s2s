import React, { useState, useEffect } from 'react';
import { 
  Trash2, MapPin, Lock, Unlock, Activity, Plus,
  Instagram, Facebook, Youtube, Disc as Tiktok, 
  Music, Image as ImageIcon, ExternalLink, RotateCcw, Save,
  Sparkles, Loader2, ArrowRight, Zap, Menu, X
} from 'lucide-react';
import { generateBandBio, generateBandPoster } from './geminiService.ts';

// --- Types ---
type ContentBlock = {
  id: string;
  type: 'text' | 'image';
  title: string;
  body: string;
};

type TourDate = {
  id: string;
  date: string;
  venue: string;
  location: string;
  link: string;
};

// --- Initial Data ---
const INITIAL_BIO = "Soul To Squeeze is Long Island's rawest tribute to the Red Hot Chili Peppers. We channel the chaotic energy of Flea, the spiritual flow of Kiedis, and the cosmic riffs of Frusciante to bring you a pure, unfiltered funk-rock explosion.";

const INITIAL_TOUR: TourDate[] = [
  { id: '1', date: 'FEB 01', venue: "Mulcahy's", location: 'Wantagh, NY', link: 'https://muls.com/' },
  { id: '2', date: 'FEB 14', venue: 'The Warehouse', location: 'Amityville, NY', link: '#' },
  { id: '3', date: 'MAR 22', venue: 'Revolution Bar', location: 'Amityville, NY', link: '#' },
];

const INITIAL_BLOCKS: ContentBlock[] = [
  { 
    id: 'b1', 
    type: 'text', 
    title: 'THE FUNK IS REAL', 
    body: 'We don\'t just cover the hits. We cover the deep cuts, the B-sides, and the live jams that made the Peppers the greatest band to ever emerge from the LA underground.' 
  },
  {
    id: 'b2',
    type: 'image',
    title: 'BLOOD SUGAR SEX MAGIK',
    body: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=1200'
  }
];

export default function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [bio, setBio] = useState(INITIAL_BIO);
  const [blocks, setBlocks] = useState<ContentBlock[]>(INITIAL_BLOCKS);
  const [tour, setTour] = useState<TourDate[]>(INITIAL_TOUR);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [generatingPosterId, setGeneratingPosterId] = useState<string | null>(null);

  useEffect(() => {
    const savedBio = localStorage.getItem('sts_bio_v2');
    const savedBlocks = localStorage.getItem('sts_blocks_v2');
    const savedTour = localStorage.getItem('sts_tour_v2');

    if (savedBio) setBio(savedBio);
    if (savedBlocks) {
      try { setBlocks(JSON.parse(savedBlocks)); } catch (e) { setBlocks(INITIAL_BLOCKS); }
    }
    if (savedTour) {
      try { setTour(JSON.parse(savedTour)); } catch (e) { setTour(INITIAL_TOUR); }
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem('sts_bio_v2', bio);
      localStorage.setItem('sts_blocks_v2', JSON.stringify(blocks));
      localStorage.setItem('sts_tour_v2', JSON.stringify(tour));
    }
  }, [bio, blocks, tour, hasLoaded]);

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    const newBio = await generateBandBio("Soul To Squeeze");
    setBio(newBio);
    setIsGeneratingBio(false);
  };

  const handleGeneratePoster = async (id: string, title: string) => {
    setGeneratingPosterId(id);
    const posterUrl = await generateBandPoster(title || "RHCP Tribute Poster");
    if (posterUrl) updateBlock(id, 'body', posterUrl);
    setGeneratingPosterId(null);
  };

  const updateBlock = (id: string, field: keyof ContentBlock, value: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const updateTour = (id: string, field: keyof TourDate, value: string) => {
    setTour(tour.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  if (!hasLoaded) return null;

  return (
    <div className="min-h-screen text-white selection:bg-[#ff0038] selection:text-white">
      <div className="scanline"></div>

      {/* Modern Brutalist Nav */}
      <nav className="fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-xl border-b-4 border-white h-24 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="bg-[#ff0038] p-2 rotate-45 border-2 border-white">
            <Zap size={24} className="-rotate-45" />
          </div>
          <span className="font-bangers text-4xl tracking-tighter uppercase italic leading-none">
            SOUL<span className="text-[#ff0038]">TO</span>SQUEEZE
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex gap-10 font-black text-[10px] uppercase tracking-[0.3em]">
            <a href="#about" className="hover:text-[#ff0038] transition-colors">THE VIBE</a>
            <a href="#tour" className="hover:text-[#ff0038] transition-colors">LIVE DATES</a>
            <a href="#media" className="hover:text-[#ff0038] transition-colors">SIGHTS</a>
          </div>

          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-6 py-2 border-2 border-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all ${isEditMode ? 'bg-[#ff0038] text-white' : ''}`}
          >
            {isEditMode ? <Unlock size={14} /> : <Lock size={14} />}
            {isEditMode ? 'EDITING' : 'ADMIN'}
          </button>
        </div>
      </nav>

      {/* Massive Hero Section */}
      <section className="relative h-screen flex flex-col justify-center overflow-hidden bg-black pt-24">
        {/* Animated Marquee Background */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full opacity-10 pointer-events-none select-none">
          <div className="marquee-text font-bangers text-[20vw] leading-none text-white text-outline">
            FUNKY MONKS FUNKY MONKS FUNKY MONKS FUNKY MONKS FUNKY MONKS FUNKY MONKS
          </div>
        </div>

        <div className="relative z-10 px-8 lg:px-24">
          <h2 className="text-[#ff0038] font-space font-black uppercase tracking-[0.5em] text-xs lg:text-sm mb-6 flex items-center gap-4">
            <span className="h-px w-12 bg-[#ff0038]"></span> 
            LONG ISLAND'S ULTIMATE RHCP EXPERIENCE
          </h2>
          <h1 className="text-8xl lg:text-[14rem] font-bangers leading-[0.85] tracking-tighter transform -rotate-2 mb-8">
            GIVE IT <span className="text-outline text-white">AWAY</span><br/>
            <span className="text-[#ff0038]">NOW!</span>
          </h1>
          
          <div className="flex flex-col md:flex-row gap-6 mt-12">
            <a href="#tour" className="group bg-white text-black px-12 py-5 font-black text-xl uppercase italic border-r-8 border-b-8 border-[#ff0038] hover:translate-x-1 hover:translate-y-1 hover:border-r-4 hover:border-b-4 transition-all flex items-center gap-4">
              See Live Tour <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>
        
        {/* Hero Decorative Elements */}
        <div className="absolute bottom-12 right-12 text-right hidden lg:block">
          <div className="font-space font-black text-[10px] tracking-[1em] text-zinc-700 uppercase mb-4">Established 2024</div>
          <div className="flex items-center gap-4 justify-end">
            <div className="w-12 h-12 border-2 border-zinc-800 rounded-full flex items-center justify-center text-zinc-600 font-bold italic text-sm">RHCP</div>
            <div className="w-12 h-12 bg-zinc-900 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Bio / About - Skewed Brutalist Style */}
      <section id="about" className="relative py-40 overflow-hidden">
        <div className="skew-section bg-white text-black py-32 -mx-48 px-48">
          <div className="unskew-content max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 relative">
              <div className="rhcp-border-heavy relative overflow-hidden aspect-[4/5] bg-zinc-200">
                <img 
                  src="https://images.unsplash.com/photo-1521334885634-9552f9540abb?auto=format&fit=crop&q=80&w=800" 
                  alt="Band" 
                  className="w-full h-full object-cover grayscale brightness-50"
                />
                <div className="absolute inset-0 bg-[#ff0038]/10 mix-blend-multiply"></div>
                <div className="absolute -bottom-8 -right-8 font-bangers text-9xl text-white opacity-20 pointer-events-none">SOUL</div>
              </div>
            </div>

            <div className="flex-1 space-y-8">
              <h2 className="text-7xl lg:text-9xl font-bangers leading-none tracking-tight">
                THE <span className="text-[#ff0038]">SOUL</span> OF<br/>THE SHRED
              </h2>
              
              <div className="space-y-6">
                {isEditMode ? (
                  <div className="space-y-4">
                    <button onClick={handleGenerateBio} disabled={isGeneratingBio} className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#ff0038] transition-all">
                      {isGeneratingBio ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                      AI Magic Writer
                    </button>
                    <textarea 
                      className="w-full bg-zinc-100 border-4 border-black p-8 text-xl font-space font-bold leading-relaxed focus:ring-0 focus:outline-none min-h-[250px]"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                ) : (
                  <p className="text-2xl lg:text-3xl font-space font-bold leading-tight uppercase tracking-tight text-black">
                    "{bio}"
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                {[Instagram, Facebook, Youtube, Tiktok].map((Icon, i) => (
                  <a key={i} href="#" className="w-14 h-14 border-4 border-black flex items-center justify-center hover:bg-[#ff0038] hover:text-white transition-all">
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Content Sections */}
      <main className="max-w-7xl mx-auto px-8 space-y-48 py-40">
        {blocks.map((block, idx) => (
          <div key={block.id} className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-20 items-center`}>
            <div className="flex-1 space-y-8 w-full">
              {isEditMode ? (
                <div className="p-8 bg-zinc-900 border-l-8 border-[#ff0038] space-y-6 shadow-2xl">
                  <input 
                    className="text-4xl font-bangers bg-transparent border-b-2 border-white w-full outline-none uppercase italic"
                    value={block.title}
                    onChange={(e) => updateBlock(block.id, 'title', e.target.value)}
                    placeholder="Title"
                  />
                  {block.type === 'text' ? (
                    <textarea 
                      className="w-full bg-black/50 border-2 border-zinc-800 p-6 text-lg font-space outline-none min-h-[200px]"
                      value={block.body}
                      onChange={(e) => updateBlock(block.id, 'body', e.target.value)}
                    />
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black tracking-widest uppercase opacity-50">IMAGE URL</label>
                        <button 
                          onClick={() => handleGeneratePoster(block.id, block.title)} 
                          className="flex items-center gap-2 text-[#ff0038] font-black text-[10px] uppercase"
                          disabled={generatingPosterId === block.id}
                        >
                          {generatingPosterId === block.id ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                          AI GEN POSTER
                        </button>
                      </div>
                      <input 
                        className="w-full bg-black p-4 border border-zinc-800 font-mono text-xs" 
                        value={block.body} 
                        onChange={(e) => updateBlock(block.id, 'body', e.target.value)} 
                      />
                    </div>
                  )}
                  <button onClick={() => setBlocks(blocks.filter(b => b.id !== block.id))} className="text-red-600 font-black text-xs uppercase flex items-center gap-2">
                    <Trash2 size={14} /> Remove Block
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-6xl lg:text-9xl font-bangers uppercase tracking-tighter leading-[0.9]">
                    {block.title.split(' ').map((word, i) => i === 1 ? <span key={i} className="text-[#ff0038]">{word} </span> : word + ' ')}
                  </h3>
                  {block.type === 'text' && <p className="text-xl lg:text-2xl font-space font-medium text-zinc-400 max-w-xl">{block.body}</p>}
                </>
              )}
            </div>

            <div className="flex-1 w-full aspect-square md:aspect-video bg-zinc-950 rhcp-border-heavy group relative overflow-hidden">
              {block.type === 'image' ? (
                <img src={block.body} alt={block.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-10 group-hover:opacity-100 group-hover:text-[#ff0038] transition-all">
                  <Music size={120} />
                </div>
              )}
              <div className="absolute top-4 left-4 bg-white text-black px-4 py-1 font-black text-xs uppercase tracking-widest italic shadow-xl">
                {block.type} BLOCK
              </div>
            </div>
          </div>
        ))}

        {isEditMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'text', title: 'NEW SECTION', body: 'Funk text here...' }])} className="border-4 border-dashed border-zinc-800 py-12 flex flex-col items-center gap-4 text-zinc-600 hover:text-white hover:border-[#ff0038] transition-all font-black uppercase tracking-widest bg-zinc-950/50">
              <Plus size={40} /> Add Text
            </button>
            <button onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'image', title: 'NEW IMAGE', body: 'https://images.unsplash.com/photo-1514525253361-bee8a197c9c4' }])} className="border-4 border-dashed border-zinc-800 py-12 flex flex-col items-center gap-4 text-zinc-600 hover:text-white hover:border-[#ff0038] transition-all font-black uppercase tracking-widest bg-zinc-950/50">
              <ImageIcon size={40} /> Add Image
            </button>
          </div>
        )}

        {/* Tour Section - Brutalist Table */}
        <section id="tour" className="space-y-16">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
            <h3 className="text-7xl lg:text-[12rem] font-bangers uppercase tracking-tighter leading-none italic text-white shadow-[#ff0038] drop-shadow-[5px_5px_0px_rgba(255,0,56,1)]">
              ON THE <span className="text-[#ff0038]">ROAD</span>
            </h3>
            <div className="bg-[#eaff00] text-black px-8 py-3 font-black text-xs uppercase italic tracking-widest transform rotate-3 shadow-lg">
              CALIFORNIA FUNK TOUR 2026
            </div>
          </div>

          <div className="bg-zinc-950 border-4 border-white shadow-[12px_12px_0px_rgba(255,0,56,1)]">
            {tour.map(t => (
              <div key={t.id} className="border-b-4 border-zinc-900 last:border-0 hover:bg-[#ff0038]/5 transition-colors p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-10 group">
                {isEditMode ? (
                  <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input className="bg-black border-2 border-zinc-800 p-4 font-black text-[#ff0038] uppercase" value={t.date} onChange={e => updateTour(t.id, 'date', e.target.value)} />
                    <input className="bg-black border-2 border-zinc-800 p-4 font-bold" value={t.venue} onChange={e => updateTour(t.id, 'venue', e.target.value)} />
                    <input className="bg-black border-2 border-zinc-800 p-4" value={t.location} onChange={e => updateTour(t.id, 'location', e.target.value)} />
                    <div className="flex gap-2">
                      <input className="bg-black border-2 border-zinc-800 p-4 flex-1 text-xs" value={t.link} onChange={e => updateTour(t.id, 'link', e.target.value)} />
                      <button onClick={() => setTour(tour.filter(item => item.id !== t.id))} className="text-red-600"><Trash2 /></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row items-center gap-12 flex-1">
                      <div className="text-6xl font-bangers text-[#ff0038] tracking-tighter group-hover:scale-110 transition-transform">{t.date}</div>
                      <div className="space-y-1">
                        <h4 className="text-3xl lg:text-5xl font-bangers uppercase tracking-tighter">{t.venue}</h4>
                        <div className="flex items-center gap-2 text-zinc-500 font-space font-black uppercase text-[10px] tracking-[0.3em]">
                          <MapPin size={12} className="text-[#ff0038]" /> {t.location}
                        </div>
                      </div>
                    </div>
                    <a href={t.link} target="_blank" className="bg-white text-black px-12 py-4 font-black uppercase text-sm border-r-4 border-b-4 border-[#ff0038] hover:bg-[#ff0038] hover:text-white transition-all flex items-center gap-3">
                      Get Tickets <ExternalLink size={16} />
                    </a>
                  </>
                )}
              </div>
            ))}
            
            {isEditMode && (
              <button onClick={() => setTour([...tour, { id: Date.now().toString(), date: 'TBA', venue: 'NEW VENUE', location: 'CITY, ST', link: '#' }])} className="w-full p-8 text-zinc-700 hover:text-white transition-all font-black uppercase tracking-widest bg-black/50 border-t-4 border-zinc-900">
                + ADD PERFORMANCE
              </button>
            )}
          </div>
        </section>

        {/* Media Sights - Brutalist Cards */}
        <section id="media" className="space-y-24">
          <div className="text-center">
            <h3 className="text-6xl lg:text-[10rem] font-bangers uppercase tracking-tighter leading-none">
              SIGHTS <span className="text-[#ff0038]">&</span> SOUNDS
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
              'https://images.unsplash.com/photo-1493225255756-d9584f8606e9',
              'https://images.unsplash.com/photo-1514525253361-bee8a197c9c4',
              'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b',
              'https://images.unsplash.com/photo-1459749411177-0421800673d6',
              'https://images.unsplash.com/photo-1429962714451-bb934ecbb4ec'
            ].map((url, i) => (
              <div key={i} className="aspect-square border-4 border-white bg-zinc-900 group relative hover-lift cursor-crosshair">
                <img src={`${url}?auto=format&fit=crop&q=80&w=800`} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:brightness-75" />
                <div className="absolute inset-0 border-8 border-transparent group-hover:border-[#ff0038]/50 transition-all pointer-events-none"></div>
                <div className="absolute top-2 right-2 bg-[#ff0038] text-white p-1 text-[8px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">LIVE_SHOT_{i+1}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer - High Contrast */}
      <footer className="bg-white text-black py-40 border-t-8 border-[#ff0038] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center text-center gap-16 relative z-10">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-[#ff0038] mx-auto flex items-center justify-center text-white font-black text-5xl hover:rotate-90 transition-transform duration-500 cursor-pointer">
              *
            </div>
            <h3 className="text-7xl lg:text-9xl font-bangers tracking-tight uppercase leading-none">SOUL TO SQUEEZE</h3>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-12 gap-y-6 font-black uppercase text-xs tracking-[0.4em]">
            <a href="#about" className="hover:text-[#ff0038] transition-colors">BIO</a>
            <a href="#tour" className="hover:text-[#ff0038] transition-colors">TOUR</a>
            <a href="#media" className="hover:text-[#ff0038] transition-colors">SIGHTS</a>
            <a href="mailto:booking@soultosqueeze.com" className="hover:text-[#ff0038] transition-colors">BOOKING</a>
          </nav>

          <div className="space-y-4 pt-8">
            <div className="flex items-center justify-center gap-6 font-space font-black text-[10px] tracking-widest uppercase">
              <span>LONG ISLAND, NY</span>
              <div className="w-2 h-2 bg-[#ff0038] rotate-45"></div>
              <span>EST. 2024</span>
              <div className="w-2 h-2 bg-black rotate-45"></div>
              <span>RHCP TRIBUTE</span>
            </div>
          </div>
        </div>

        {/* Footer Marquee Background */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full opacity-5 pointer-events-none -rotate-12 select-none">
          <div className="marquee-text font-bangers text-[30vw] leading-none text-black">
            FUNK NEVER DIES FUNK NEVER DIES FUNK NEVER DIES
          </div>
        </div>
      </footer>

      {/* Floating Save Notice */}
      {isEditMode && (
        <div className="fixed bottom-8 right-8 z-[110] bg-white border-4 border-black text-black px-6 py-4 flex items-center gap-4 animate-bounce shadow-2xl">
          <div className="bg-[#ff0038] p-2 text-white">
            <Save size={20} />
          </div>
          <span className="font-space font-black text-xs uppercase tracking-widest">LIVE AUTOSAVE ON</span>
        </div>
      )}
    </div>
  );
}