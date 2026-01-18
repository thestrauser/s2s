import React, { useState, useEffect } from 'react';
import { 
  Trash2, MapPin, Lock, Unlock, Activity, Plus,
  Instagram, Facebook, Youtube, Twitter, Disc as Tiktok, 
  Calendar, Music, Image as ImageIcon, ExternalLink, RotateCcw, Save,
  Sparkles, Loader2
} from 'lucide-react';
import { generateBandBio, generateBandPoster } from './geminiService';

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

// --- Initial Stable Data ---
const INITIAL_BIO = "Soul To Squeeze is Long Island's premier tribute to the Red Hot Chili Peppers. We meticulously recreate the high-energy, soul-infused funk-rock experience that defines the Peppers' legendary live shows. From Flea's thumping bass to the soaring melodies of Kiedis, we bring the true California spirit to every stage.";

const INITIAL_TOUR: TourDate[] = [
  { id: '1', date: 'JAN 24', venue: "Mr. Beery's", location: 'Bethpage, NY', link: 'https://www.mrbeerys.com/' },
  { id: '2', date: 'FEB 14', venue: 'The Warehouse', location: 'Amityville, NY', link: '#' },
  { id: '3', date: 'MAR 07', venue: 'Mulcahy\'s', location: 'Wantagh, NY', link: '#' },
];

const INITIAL_BLOCKS: ContentBlock[] = [
  { 
    id: 'b1', 
    type: 'text', 
    title: 'THE FUNK REVOLUTION', 
    body: 'We don\'t just play the notes; we capture the spirit. Our setlist spans the entire RHCP catalog, from the raw punk-funk energy of the early 80s to the melodic masterpieces of the modern era.' 
  },
  {
    id: 'b2',
    type: 'image',
    title: 'LIVE ENERGY',
    body: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1200'
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

  // --- Persistence Logic ---
  useEffect(() => {
    const savedBio = localStorage.getItem('sts_bio');
    const savedBlocks = localStorage.getItem('sts_blocks');
    const savedTour = localStorage.getItem('sts_tour');

    if (savedBio) setBio(savedBio);
    if (savedBlocks) {
      try {
        setBlocks(JSON.parse(savedBlocks));
      } catch (e) {
        setBlocks(INITIAL_BLOCKS);
      }
    }
    if (savedTour) {
      try {
        setTour(JSON.parse(savedTour));
      } catch (e) {
        setTour(INITIAL_TOUR);
      }
    }
    
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem('sts_bio', bio);
      localStorage.setItem('sts_blocks', JSON.stringify(blocks));
      localStorage.setItem('sts_tour', JSON.stringify(tour));
    }
  }, [bio, blocks, tour, hasLoaded]);

  // --- AI Handlers ---
  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    const newBio = await generateBandBio("Soul To Squeeze");
    setBio(newBio);
    setIsGeneratingBio(false);
  };

  const handleGeneratePoster = async (id: string, title: string) => {
    setGeneratingPosterId(id);
    const posterUrl = await generateBandPoster(title || "Red Hot Chili Peppers Concert");
    if (posterUrl) {
      updateBlock(id, 'body', posterUrl);
    }
    setGeneratingPosterId(null);
  };

  const resetToFactory = () => {
    if (window.confirm("Restore to January 14 version? This will undo all your custom text and images.")) {
      setBio(INITIAL_BIO);
      setBlocks(INITIAL_BLOCKS);
      setTour(INITIAL_TOUR);
      localStorage.clear();
      setIsEditMode(false);
    }
  };

  // --- Handlers ---
  const addTextBlock = () => {
    setBlocks([...blocks, {
      id: Date.now().toString(),
      type: 'text',
      title: 'NEW FUNK SECTION',
      body: 'Add your story here...'
    }]);
  };

  const addImageBlock = () => {
    setBlocks([...blocks, {
      id: Date.now().toString(),
      type: 'image',
      title: 'NEW MOMENT',
      body: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800'
    }]);
  };

  const removeBlock = (id: string) => setBlocks(blocks.filter(b => b.id !== id));
  
  const updateBlock = (id: string, field: keyof ContentBlock, value: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const addTourDate = () => {
    setTour([...tour, {
      id: Date.now().toString(),
      date: 'TBA',
      venue: 'NEW STAGE',
      location: 'CITY, ST',
      link: '#'
    }]);
  };

  const removeTour = (id: string) => setTour(tour.filter(t => t.id !== id));

  const updateTour = (id: string, field: keyof TourDate, value: string) => {
    setTour(tour.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  if (!hasLoaded) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-montserrat transition-opacity duration-500">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-red-900/30 px-6 py-4 flex justify-between items-center h-20">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
          <Activity size={32} className="text-red-600 rhcp-glow transition-transform group-hover:rotate-12" />
          <span className="font-bangers text-3xl tracking-widest uppercase italic">
            Soul<span className="text-red-600">To</span>Squeeze
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-8 font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500 mr-8">
            <a href="#bio" className="hover:text-red-600 transition-colors">Biography</a>
            <a href="#tour" className="hover:text-red-600 transition-colors">Tour Dates</a>
            <a href="#media" className="hover:text-red-600 transition-colors">Sights</a>
          </div>
          
          {isEditMode && (
            <button 
              onClick={resetToFactory}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 text-zinc-500 hover:text-red-600 hover:border-red-600 text-xs font-black uppercase tracking-widest transition-all"
              title="Restore January 14 version"
            >
              <RotateCcw size={14} />
              <span className="hidden lg:inline">Reset Version</span>
            </button>
          )}

          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all text-xs font-black uppercase tracking-widest shadow-lg ${isEditMode ? 'bg-red-600 border-red-600' : 'border-zinc-800 hover:border-red-600 text-zinc-400'}`}
          >
            {isEditMode ? <Unlock size={16} /> : <Lock size={16} />}
            <span className="hidden sm:inline">{isEditMode ? 'Editing Active' : 'Admin Lock'}</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover opacity-30 animate-ken-burns grayscale"
            alt="RHCP Stage"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/80"></div>
          <div className="liquid-overlay"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl">
          <h2 className="text-red-600 font-black uppercase tracking-[0.8em] text-[10px] md:text-xs mb-8 animate-pulse">
            The Ultimate Red Hot Chili Peppers Tribute
          </h2>
          <h1 className="text-7xl md:text-[13rem] font-bangers leading-none tracking-tighter mb-10 transform -rotate-3 italic text-white rhcp-glow select-none">
            GIVE IT <span className="text-red-600">AWAY</span>
          </h1>
          <div className="flex flex-wrap justify-center gap-6 mt-16">
            <a href="#tour" className="bg-red-600 text-white px-16 py-6 font-black text-2xl transform skew-x-[-15deg] hover:bg-white hover:text-red-600 transition-all uppercase shadow-[0_20px_50px_rgba(220,38,38,0.4)]">
              See Live Dates
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 space-y-48 py-40">
        
        {/* Bio Section */}
        <section id="bio" className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative group">
            <div className="relative aspect-square overflow-hidden border-[16px] border-zinc-900 rotate-3 group-hover:rotate-0 transition-transform duration-1000 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1521334885634-9552f9540abb?auto=format&fit=crop&q=80&w=800" 
                alt="Soul To Squeeze Band" 
                className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000 scale-110 group-hover:scale-100" 
              />
              <div className="absolute inset-0 bg-red-600/5 mix-blend-overlay"></div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-red-600 -z-10 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
          </div>

          <div className="space-y-12">
            <h2 className="text-6xl md:text-9xl font-bangers text-red-600 transform -rotate-2 italic uppercase leading-none tracking-tight">
              THE <span className="text-white">SOUL</span>
            </h2>
            
            <div className="relative group/edit">
              {isEditMode ? (
                <div className="space-y-4">
                  <button 
                    onClick={handleGenerateBio}
                    disabled={isGeneratingBio}
                    className="flex items-center gap-2 bg-red-600/20 text-red-600 px-4 py-2 rounded font-black text-[10px] uppercase tracking-widest border border-red-600/30 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                  >
                    {isGeneratingBio ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                    Magic Write Bio
                  </button>
                  <textarea 
                    className="w-full bg-zinc-900/50 border-2 border-dashed border-red-600/30 p-8 text-xl leading-relaxed text-zinc-300 min-h-[300px] outline-none font-light focus:border-red-600 transition-all"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              ) : (
                <p className="text-2xl md:text-4xl leading-relaxed font-light text-zinc-400 italic font-serif border-l-8 border-red-600 pl-10">
                  "{bio}"
                </p>
              )}
            </div>

            <div className="flex gap-8 pt-6">
              {[Instagram, Facebook, Youtube, Tiktok].map((Icon, i) => (
                <a key={i} href="#" className="w-16 h-16 rounded-full border-2 border-zinc-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all group shadow-xl">
                  <Icon size={28} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Content Blocks */}
        <section className="space-y-48">
          {blocks.map((block, idx) => (
            <div key={block.id} className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-24 items-center`}>
              <div className="flex-1 space-y-10 w-full">
                {isEditMode ? (
                  <div className="space-y-6 p-10 bg-zinc-900/30 border border-zinc-800 rounded-lg shadow-2xl">
                    <input 
                      className="text-4xl font-bangers bg-transparent border-b border-red-600 w-full outline-none uppercase italic text-red-600"
                      value={block.title}
                      onChange={(e) => updateBlock(block.id, 'title', e.target.value)}
                      placeholder="Section Title"
                    />
                    {block.type === 'text' ? (
                      <textarea 
                        className="w-full bg-black/40 border-2 border-dashed border-zinc-800 p-8 text-lg outline-none min-h-[250px] text-zinc-300 focus:border-red-600 transition-all"
                        value={block.body}
                        onChange={(e) => updateBlock(block.id, 'body', e.target.value)}
                        placeholder="Section content..."
                      />
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Image Content</label>
                          <button 
                            onClick={() => handleGeneratePoster(block.id, block.title)}
                            disabled={generatingPosterId === block.id}
                            className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors disabled:opacity-50"
                          >
                            {generatingPosterId === block.id ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                            AI Poster Gen
                          </button>
                        </div>
                        <input 
                          className="w-full bg-black/40 border border-zinc-800 p-5 text-sm outline-none font-mono text-red-400 focus:border-red-600"
                          value={block.body}
                          onChange={(e) => updateBlock(block.id, 'body', e.target.value)}
                          placeholder="URL or generated data..."
                        />
                      </div>
                    )}
                    <button onClick={() => removeBlock(block.id)} className="flex items-center gap-2 text-red-600 font-black uppercase text-xs hover:text-white transition-colors group">
                      <Trash2 size={16} className="group-hover:rotate-12 transition-transform" /> Delete Block
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-5xl md:text-8xl font-bangers uppercase italic tracking-tighter text-white leading-tight">
                      {block.title.split(' ').map((word, i) => i === 1 ? <span key={i} className="text-red-600">{word} </span> : word + ' ')}
                    </h3>
                    {block.type === 'text' && <p className="text-2xl text-zinc-500 leading-relaxed font-light">{block.body}</p>}
                  </>
                )}
              </div>
              
              <div className="flex-1 w-full aspect-video bg-zinc-950 border border-zinc-900 flex items-center justify-center relative overflow-hidden group rounded shadow-[0_30px_70px_rgba(0,0,0,0.6)]">
                {block.type === 'image' ? (
                  <img src={block.body} alt={block.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
                ) : (
                  <div className="flex flex-col items-center gap-6 opacity-20 group-hover:opacity-100 group-hover:text-red-600 transition-all">
                    <Music size={120} className="animate-spin-slow" />
                    <span className="font-bangers text-3xl italic tracking-widest">FUNK VIBES</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-red-600/5 mix-blend-color group-hover:bg-transparent transition-colors"></div>
              </div>
            </div>
          ))}

          {isEditMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
              <button 
                onClick={addTextBlock}
                className="w-full border-4 border-dashed border-zinc-900 py-16 flex flex-col items-center gap-6 text-zinc-700 hover:text-red-600 hover:border-red-600 transition-all uppercase font-black tracking-[0.4em] bg-zinc-950 group shadow-lg"
              >
                <Plus size={52} className="group-hover:scale-110 transition-transform" />
                Add Text Section
              </button>
              <button 
                onClick={addImageBlock}
                className="w-full border-4 border-dashed border-zinc-900 py-16 flex flex-col items-center gap-6 text-zinc-700 hover:text-red-600 hover:border-red-600 transition-all uppercase font-black tracking-[0.4em] bg-zinc-950 group shadow-lg"
              >
                <ImageIcon size={52} className="group-hover:scale-110 transition-transform" />
                Add Image Section
              </button>
            </div>
          )}
        </section>

        {/* Tour Section */}
        <section id="tour" className="scroll-mt-32">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
            <h3 className="text-6xl md:text-[11rem] font-bangers text-white uppercase italic tracking-tighter leading-none rhcp-glow">
              ON THE <span className="text-red-600">ROAD</span>
            </h3>
            <div className="bg-red-600 text-white px-10 py-4 font-black text-xs uppercase italic tracking-[0.4em] mb-4 transform skew-x-[-10deg] shadow-lg">
              Live Odyssey 2026
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 divide-y divide-zinc-900 shadow-3xl overflow-hidden rounded-sm">
            {tour.map(t => (
              <div key={t.id} className="flex flex-col md:flex-row items-center justify-between p-14 hover:bg-red-600/[0.03] transition-all group">
                {isEditMode ? (
                  <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6">
                    <input className="bg-zinc-900 p-5 font-black outline-none focus:ring-2 focus:ring-red-600 text-red-600 uppercase" value={t.date} onChange={e => updateTour(t.id, 'date', e.target.value)} placeholder="Date" />
                    <input className="bg-zinc-900 p-5 font-bold outline-none focus:ring-2 focus:ring-red-600" value={t.venue} onChange={e => updateTour(t.id, 'venue', e.target.value)} placeholder="Venue" />
                    <input className="bg-zinc-900 p-5 outline-none focus:ring-2 focus:ring-red-600" value={t.location} onChange={e => updateTour(t.id, 'location', e.target.value)} placeholder="Location" />
                    <div className="flex gap-4">
                      <input className="bg-zinc-900 p-5 flex-1 text-xs outline-none focus:ring-2 focus:ring-red-600 font-mono" value={t.link} onChange={e => updateTour(t.id, 'link', e.target.value)} placeholder="Tickets Link" />
                      <button onClick={() => removeTour(t.id)} className="text-red-600 p-2 hover:bg-red-600/10 rounded-full transition-colors"><Trash2 size={24} /></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row items-center gap-16 text-center md:text-left">
                      <div className="text-6xl font-black text-red-600 uppercase italic tracking-tighter min-w-[180px] group-hover:scale-110 transition-transform">{t.date}</div>
                      <div className="space-y-3">
                        <h4 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white group-hover:text-red-600 transition-colors">{t.venue}</h4>
                        <div className="flex items-center justify-center md:justify-start gap-3 text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">
                          <MapPin size={16} className="text-red-600" /> {t.location}
                        </div>
                      </div>
                    </div>
                    <a 
                      href={t.link} 
                      target="_blank" 
                      className="mt-12 md:mt-0 bg-red-600 text-white px-16 py-6 font-black uppercase transform skew-x-[-15deg] hover:bg-white hover:text-red-600 transition-all shadow-2xl flex items-center gap-3 active:scale-95"
                    >
                      Tickets <ExternalLink size={18} />
                    </a>
                  </>
                )}
              </div>
            ))}
            
            {isEditMode && (
              <button 
                onClick={addTourDate}
                className="w-full p-14 flex items-center justify-center gap-6 text-zinc-800 hover:text-red-600 transition-colors font-black uppercase tracking-[0.5em] bg-zinc-900/10 group"
              >
                <Plus size={32} className="group-hover:scale-110 transition-transform" /> Add Performance
              </button>
            )}
          </div>
        </section>

        {/* Media Gallery Section */}
        <section id="media" className="space-y-24">
          <div className="text-center">
            <h3 className="text-6xl md:text-9xl font-bangers uppercase tracking-[0.3em] italic text-white/90">SIGHTS <span className="text-red-600">&</span> SOUNDS</h3>
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
              <div key={i} className="aspect-square bg-zinc-950 border border-zinc-900 overflow-hidden group relative shadow-3xl rounded-sm">
                <img 
                  src={`${url}?auto=format&fit=crop&q=80&w=800`} 
                  alt={`Live performance ${i+1}`} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Plus size={32} className="text-white scale-75 group-hover:scale-100 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#050505] py-48 border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-20 text-center">
          <div className="flex flex-col items-center gap-10">
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-6xl transform rotate-45 select-none animate-spin-slow shadow-[0_0_60px_rgba(220,38,38,0.5)]">
              *
            </div>
            <h3 className="text-6xl md:text-8xl font-bangers tracking-widest text-white italic uppercase rhcp-glow">Soul To Squeeze</h3>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-16 gap-y-10 font-black uppercase text-xs tracking-[0.5em] text-zinc-600">
            <a href="#bio" className="hover:text-white transition-colors">Biography</a>
            <a href="#tour" className="hover:text-white transition-colors">Appearances</a>
            <a href="#media" className="hover:text-white transition-colors">Press Kit</a>
            <a href="#" className="hover:text-white transition-colors">Booking</a>
          </nav>

          <div className="space-y-6 pt-10">
            <p className="text-zinc-800 font-black uppercase tracking-[1.5em] text-[10px] opacity-40">Official Tribute Experience</p>
            <div className="flex items-center justify-center gap-5 text-zinc-900 text-[10px] font-black tracking-[0.3em] uppercase">
              <span>Long Island, NY</span>
              <div className="w-1 h-1 bg-zinc-900 rounded-full"></div>
              <span>© 2026</span>
              <div className="w-1 h-1 bg-zinc-900 rounded-full"></div>
              <span>Funky Monks Prod.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Persistence Notice */}
      {isEditMode && (
        <div className="fixed bottom-6 right-6 z-[60] bg-zinc-900 border border-red-600/50 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-500">
          <Save size={18} className="text-red-600" />
          <span className="text-[10px] font-black uppercase tracking-widest">Autosaving Changes...</span>
        </div>
      )}
    </div>
  );
}
