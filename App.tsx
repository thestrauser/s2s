import React, { useState, useEffect } from 'react';
import { 
  Trash2, MapPin, Lock, Unlock, Activity, Plus,
  Instagram, Facebook, Youtube, Disc as Tiktok, 
  Music, Image as ImageIcon, ExternalLink, RotateCcw, Save,
  Sparkles, Loader2, ArrowRight, Zap, Globe, Share2, Link as LinkIcon
} from 'lucide-react';
import { generateBandBio, generateBandPoster } from './geminiService.ts';

// --- Types ---
type ContentBlock = {
  id: string;
  type: 'text' | 'image' | 'link';
  title: string;
  body: string;
  metadata?: string; // Used for link URLs
};

type TourDate = {
  id: string;
  date: string;
  venue: string;
  location: string;
  link: string;
};

type MediaItem = {
  id: string;
  url: string;
  caption?: string;
};

type SocialLink = {
  id: string;
  platform: string;
  url: string;
};

// --- Initial Data ---
const INITIAL_BIO = "Soul To Squeeze is Long Island's rawest tribute to the Red Hot Chili Peppers. We channel the chaotic energy of Flea, the spiritual flow of Kiedis, and the cosmic riffs of Frusciante to bring you a pure, unfiltered funk-rock explosion.";

const INITIAL_TOUR: TourDate[] = [
  { id: '1', date: 'FEB 01', venue: "Mulcahy's", location: 'Wantagh, NY', link: 'https://muls.com/' },
  { id: '2', date: 'FEB 14', venue: 'The Warehouse', location: 'Amityville, NY', link: '#' },
];

const INITIAL_BLOCKS: ContentBlock[] = [
  { 
    id: 'b1', 
    type: 'text', 
    title: 'THE FUNK IS REAL', 
    body: 'We don\'t just cover the hits. We cover the deep cuts, the B-sides, and the live jams.' 
  },
  {
    id: 'b2',
    type: 'link',
    title: 'OFFICIAL MERCH STORE',
    body: 'GET THE GEAR',
    metadata: 'https://example.com/merch'
  }
];

const INITIAL_MEDIA: MediaItem[] = [
  { id: 'm1', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745' },
  { id: 'm2', url: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9' },
  { id: 'm3', url: 'https://images.unsplash.com/photo-1514525253361-bee8a197c9c4' },
];

const INITIAL_SOCIALS: SocialLink[] = [
  { id: 's1', platform: 'Instagram', url: '#' },
  { id: 's2', platform: 'Facebook', url: '#' },
  { id: 's3', platform: 'YouTube', url: '#' },
];

export default function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [bio, setBio] = useState(INITIAL_BIO);
  const [blocks, setBlocks] = useState<ContentBlock[]>(INITIAL_BLOCKS);
  const [tour, setTour] = useState<TourDate[]>(INITIAL_TOUR);
  const [media, setMedia] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [socials, setSocials] = useState<SocialLink[]>(INITIAL_SOCIALS);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [generatingPosterId, setGeneratingPosterId] = useState<string | null>(null);

  // --- Persistence ---
  useEffect(() => {
    const sBio = localStorage.getItem('sts_v3_bio');
    const sBlocks = localStorage.getItem('sts_v3_blocks');
    const sTour = localStorage.getItem('sts_v3_tour');
    const sMedia = localStorage.getItem('sts_v3_media');
    const sSocials = localStorage.getItem('sts_v3_socials');

    if (sBio) setBio(sBio);
    if (sBlocks) setBlocks(JSON.parse(sBlocks));
    if (sTour) setTour(JSON.parse(sTour));
    if (sMedia) setMedia(JSON.parse(sMedia));
    if (sSocials) setSocials(JSON.parse(sSocials));
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem('sts_v3_bio', bio);
      localStorage.setItem('sts_v3_blocks', JSON.stringify(blocks));
      localStorage.setItem('sts_v3_tour', JSON.stringify(tour));
      localStorage.setItem('sts_v3_media', JSON.stringify(media));
      localStorage.setItem('sts_v3_socials', JSON.stringify(socials));
    }
  }, [bio, blocks, tour, media, socials, hasLoaded]);

  // --- AI Handlers ---
  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    const newBio = await generateBandBio("Soul To Squeeze");
    setBio(newBio);
    setIsGeneratingBio(false);
  };

  const handleGeneratePoster = async (id: string, title: string) => {
    setGeneratingPosterId(id);
    const posterUrl = await generateBandPoster(title || "RHCP Tribute Poster");
    if (posterUrl) {
      setBlocks(prev => prev.map(b => b.id === id ? { ...b, body: posterUrl } : b));
    }
    setGeneratingPosterId(null);
  };

  // --- Helpers ---
  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram size={20} />;
      case 'facebook': return <Facebook size={20} />;
      case 'youtube': return <Youtube size={20} />;
      case 'tiktok': return <Tiktok size={20} />;
      default: return <Globe size={20} />;
    }
  };

  return (
    <div className="min-h-screen text-white selection:bg-[#ff0038] selection:text-white">
      <div className="scanline"></div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-[100] bg-black/90 backdrop-blur-xl border-b-4 border-white h-20 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="bg-[#ff0038] p-2 rotate-45 border-2 border-white">
            <Zap size={20} className="-rotate-45" />
          </div>
          <span className="font-bangers text-3xl tracking-tighter uppercase italic leading-none hidden sm:block">
            SOUL<span className="text-[#ff0038]">TO</span>SQUEEZE
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-6 py-2 border-2 border-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all ${isEditMode ? 'bg-[#ff0038] text-white' : ''}`}
          >
            {isEditMode ? <Unlock size={14} /> : <Lock size={14} />}
            {isEditMode ? 'EXIT EDITOR' : 'ENTER EDITOR'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[70vh] flex flex-col justify-center overflow-hidden bg-black pt-20">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full opacity-5 pointer-events-none select-none">
          <div className="marquee-text font-bangers text-[20vw] leading-none text-white text-outline">
            FUNK MONKS FUNK MONKS FUNK MONKS
          </div>
        </div>
        <div className="relative z-10 px-8 lg:px-24">
          <h1 className="text-6xl lg:text-9xl font-bangers leading-[0.9] tracking-tighter transform -rotate-2">
            STAY <span className="text-[#ff0038]">FUNKY</span>
          </h1>
        </div>
      </section>

      {/* Dynamic Content Container */}
      <main className="max-w-7xl mx-auto px-8 space-y-32 pb-32">
        
        {/* Bio + Socials Section */}
        <section id="about" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="rhcp-border-heavy relative aspect-square overflow-hidden bg-zinc-900">
            <img 
              src="https://images.unsplash.com/photo-1521334885634-9552f9540abb?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover grayscale brightness-50"
              alt="Band" 
            />
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl font-bangers uppercase text-[#ff0038]">THE STORY</h2>
              {isEditMode ? (
                <div className="space-y-4">
                  <button onClick={handleGenerateBio} disabled={isGeneratingBio} className="bg-white text-black px-4 py-2 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#ff0038] hover:text-white transition-all">
                    {isGeneratingBio ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                    Regenerate with AI
                  </button>
                  <textarea 
                    className="w-full bg-zinc-900 border-2 border-white p-4 font-space text-lg font-bold leading-relaxed focus:ring-0 focus:outline-none min-h-[150px]"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              ) : (
                <p className="text-xl font-space font-bold uppercase tracking-tight text-zinc-300">"{bio}"</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bangers uppercase tracking-widest text-zinc-500">CONNECT</h3>
              <div className="flex flex-wrap gap-4">
                {socials.map((social) => (
                  <div key={social.id} className="relative group">
                    {isEditMode ? (
                      <div className="flex flex-col gap-2 p-3 bg-zinc-900 border-2 border-white">
                        <input 
                          className="bg-black text-[10px] p-2 border border-zinc-700 outline-none" 
                          value={social.platform} 
                          placeholder="Platform"
                          onChange={(e) => setSocials(socials.map(s => s.id === social.id ? {...s, platform: e.target.value} : s))}
                        />
                        <input 
                          className="bg-black text-[10px] p-2 border border-zinc-700 outline-none" 
                          value={social.url} 
                          placeholder="Link"
                          onChange={(e) => setSocials(socials.map(s => s.id === social.id ? {...s, url: e.target.value} : s))}
                        />
                        <button onClick={() => setSocials(socials.filter(s => s.id !== social.id))} className="text-[#ff0038] self-end hover:scale-110 transition-transform">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <a href={social.url} target="_blank" className="w-12 h-12 border-4 border-white flex items-center justify-center hover:bg-[#ff0038] transition-all">
                        {getIcon(social.platform)}
                      </a>
                    )}
                  </div>
                ))}
                {isEditMode && (
                  <button 
                    onClick={() => setSocials([...socials, { id: Date.now().toString(), platform: 'Web', url: '#' }])}
                    className="w-12 h-12 border-4 border-dashed border-zinc-800 flex items-center justify-center text-zinc-800 hover:text-white hover:border-white transition-all"
                  >
                    <Plus size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Modular Content Blocks */}
        <section className="space-y-32">
          {blocks.map((block, idx) => (
            <div key={block.id} className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 items-center`}>
              <div className="flex-1 space-y-6 w-full">
                {isEditMode ? (
                  <div className="p-6 bg-zinc-900 border-l-8 border-[#ff0038] space-y-4">
                    <input 
                      className="text-3xl font-bangers bg-transparent border-b-2 border-white w-full outline-none uppercase italic"
                      value={block.title}
                      onChange={(e) => setBlocks(blocks.map(b => b.id === block.id ? {...b, title: e.target.value} : b))}
                    />
                    {block.type === 'text' && (
                      <textarea 
                        className="w-full bg-black/50 border-2 border-zinc-800 p-4 text-base font-space outline-none min-h-[120px]"
                        value={block.body}
                        onChange={(e) => setBlocks(blocks.map(b => b.id === block.id ? {...b, body: e.target.value} : b))}
                      />
                    )}
                    {block.type === 'image' && (
                      <div className="space-y-2">
                        <button onClick={() => handleGeneratePoster(block.id, block.title)} className="text-[10px] font-black text-[#ff0038] flex items-center gap-2">
                          <Sparkles size={12} /> AI GENERATE ART
                        </button>
                        <input 
                          className="w-full bg-black p-3 border border-zinc-800 text-xs font-mono" 
                          value={block.body} 
                          onChange={(e) => setBlocks(blocks.map(b => b.id === block.id ? {...b, body: e.target.value} : b))}
                        />
                      </div>
                    )}
                    {block.type === 'link' && (
                      <div className="space-y-2">
                        <input 
                          className="w-full bg-black p-3 border border-zinc-800 text-base font-space font-bold uppercase" 
                          value={block.body} 
                          placeholder="Button Text"
                          onChange={(e) => setBlocks(blocks.map(b => b.id === block.id ? {...b, body: e.target.value} : b))}
                        />
                        <input 
                          className="w-full bg-black p-3 border border-zinc-800 text-xs font-mono" 
                          value={block.metadata} 
                          placeholder="Destination URL"
                          onChange={(e) => setBlocks(blocks.map(b => b.id === block.id ? {...b, metadata: e.target.value} : b))}
                        />
                      </div>
                    )}
                    <button onClick={() => setBlocks(blocks.filter(b => b.id !== block.id))} className="text-[#ff0038] text-[10px] font-black uppercase flex items-center gap-2">
                      <Trash2 size={12} /> DELETE BLOCK
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-4xl lg:text-7xl font-bangers uppercase tracking-tighter leading-none">{block.title}</h3>
                    {block.type === 'text' && <p className="text-lg font-space font-medium text-zinc-400">{block.body}</p>}
                    {block.type === 'link' && (
                      <a href={block.metadata} target="_blank" className="inline-flex items-center gap-4 bg-[#ff0038] text-white px-8 py-4 font-black uppercase italic text-lg border-r-4 border-b-4 border-white hover:translate-x-1 hover:translate-y-1 hover:border-r-2 hover:border-b-2 transition-all">
                        {block.body} <LinkIcon size={20} />
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 w-full aspect-video bg-zinc-950 rhcp-border-heavy relative overflow-hidden group">
                {block.type === 'image' ? (
                  <img src={block.body} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={block.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-10 group-hover:opacity-100 group-hover:text-[#ff0038] transition-all">
                    {block.type === 'link' ? <ExternalLink size={80} /> : <Activity size={80} />}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isEditMode && (
            <div className="flex flex-wrap gap-4 pt-8">
              <button onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'text', title: 'NEW TEXT', body: 'Add your story...' }])} className="flex-1 border-2 border-dashed border-zinc-800 py-6 font-black text-[10px] uppercase tracking-widest hover:border-white transition-all">
                + Text Block
              </button>
              <button onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'image', title: 'NEW IMAGE', body: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b' }])} className="flex-1 border-2 border-dashed border-zinc-800 py-6 font-black text-[10px] uppercase tracking-widest hover:border-white transition-all">
                + Image Block
              </button>
              <button onClick={() => setBlocks([...blocks, { id: Date.now().toString(), type: 'link', title: 'NEW LINK', body: 'CLICK HERE', metadata: '#' }])} className="flex-1 border-2 border-dashed border-zinc-800 py-6 font-black text-[10px] uppercase tracking-widest hover:border-white transition-all">
                + Action Link
              </button>
            </div>
          )}
        </section>

        {/* Tour Section */}
        <section id="tour" className="space-y-12">
          <h3 className="text-5xl lg:text-8xl font-bangers uppercase tracking-tighter leading-none italic shadow-[#ff0038] drop-shadow-[3px_3px_0px_white]">
            ON THE <span className="text-[#ff0038]">ROAD</span>
          </h3>

          <div className="bg-zinc-950 border-4 border-white">
            {tour.map(t => (
              <div key={t.id} className="border-b-4 border-zinc-900 last:border-0 p-6 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                {isEditMode ? (
                  <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input className="bg-black border-2 border-zinc-800 p-3 font-black text-[#ff0038] uppercase" value={t.date} onChange={e => setTour(tour.map(item => item.id === t.id ? {...item, date: e.target.value} : item))} />
                    <input className="bg-black border-2 border-zinc-800 p-3 font-bold" value={t.venue} onChange={e => setTour(tour.map(item => item.id === t.id ? {...item, venue: e.target.value} : item))} />
                    <input className="bg-black border-2 border-zinc-800 p-3" value={t.location} onChange={e => setTour(tour.map(item => item.id === t.id ? {...item, location: e.target.value} : item))} />
                    <div className="flex gap-2">
                      <input className="bg-black border-2 border-zinc-800 p-3 flex-1 text-xs" value={t.link} onChange={e => setTour(tour.map(item => item.id === t.id ? {...item, link: e.target.value} : item))} />
                      <button onClick={() => setTour(tour.filter(item => item.id !== t.id))} className="text-[#ff0038]"><Trash2 size={20}/></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row items-center gap-10 flex-1">
                      <div className="text-5xl font-bangers text-[#ff0038]">{t.date}</div>
                      <div className="space-y-1 text-center md:text-left">
                        <h4 className="text-3xl font-bangers uppercase">{t.venue}</h4>
                        <div className="text-zinc-500 font-space font-black uppercase text-[10px] tracking-widest">{t.location}</div>
                      </div>
                    </div>
                    <a href={t.link} target="_blank" className="bg-white text-black px-10 py-3 font-black uppercase text-xs border-r-4 border-b-4 border-[#ff0038] hover:bg-[#ff0038] hover:text-white transition-all flex items-center gap-3">
                      TICKETS <ArrowRight size={14} />
                    </a>
                  </>
                )}
              </div>
            ))}
            {isEditMode && (
              <button onClick={() => setTour([...tour, { id: Date.now().toString(), date: 'TBA', venue: 'NEW SHOW', location: 'CITY, ST', link: '#' }])} className="w-full p-6 text-zinc-700 hover:text-white transition-all font-black text-xs bg-black border-t-4 border-zinc-900">
                + ADD PERFORMANCE
              </button>
            )}
          </div>
        </section>

        {/* Media Gallery */}
        <section id="media" className="space-y-12">
          <div className="text-center">
            <h3 className="text-5xl lg:text-7xl font-bangers uppercase tracking-tighter">SIGHTS <span className="text-[#ff0038]">&</span> SOUNDS</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.map((item) => (
              <div key={item.id} className="aspect-square border-4 border-white bg-zinc-900 group relative overflow-hidden">
                {isEditMode ? (
                  <div className="absolute inset-0 bg-black/80 p-6 flex flex-col justify-center gap-2 z-10">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Image URL</label>
                    <input 
                      className="bg-zinc-800 p-2 text-xs outline-none focus:ring-1 focus:ring-[#ff0038]" 
                      value={item.url} 
                      onChange={(e) => setMedia(media.map(m => m.id === item.id ? {...m, url: e.target.value} : m))}
                    />
                    <button onClick={() => setMedia(media.filter(m => m.id !== item.id))} className="text-[#ff0038] self-end flex items-center gap-2 font-black text-[10px]">
                      <Trash2 size={12} /> DELETE PHOTO
                    </button>
                  </div>
                ) : (
                  <img src={item.url} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 group-hover:scale-105" alt="Gallery" />
                )}
              </div>
            ))}
            {isEditMode && (
              <button 
                onClick={() => setMedia([...media, { id: Date.now().toString(), url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b' }])}
                className="aspect-square border-4 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-800 hover:text-white hover:border-white transition-all gap-2"
              >
                <Plus size={32} />
                <span className="font-black text-[10px] uppercase tracking-widest">Add Photo</span>
              </button>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white text-black py-16 border-t-8 border-[#ff0038] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center text-center gap-6 relative z-10">
          <div className="w-12 h-12 bg-[#ff0038] flex items-center justify-center text-white font-black text-2xl hover:rotate-90 transition-transform">
            *
          </div>
          <h3 className="text-4xl lg:text-6xl font-bangers tracking-tight uppercase leading-none">SOUL TO SQUEEZE</h3>
          <div className="flex items-center gap-4 font-space font-black text-[10px] tracking-widest uppercase">
            <span>LONG ISLAND</span>
            <div className="w-2 h-2 bg-[#ff0038] rotate-45"></div>
            <span>EST. 2024</span>
          </div>
        </div>
      </footer>

      {/* Global Save Indicator */}
      {isEditMode && (
        <div className="fixed bottom-8 right-8 z-[110] bg-white border-4 border-black text-black px-4 py-2 flex items-center gap-4 animate-pulse shadow-2xl">
          <div className="bg-[#ff0038] p-1 text-white">
            <Save size={16} />
          </div>
          <span className="font-space font-black text-[10px] uppercase tracking-widest">EDITING</span>
        </div>
      )}
    </div>
  );
}