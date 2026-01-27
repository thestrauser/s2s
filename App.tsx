
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Link, useLocation } from 'react-router-dom';
import { 
  Trash2, MapPin, X, Lock, Unlock, Loader2, CheckCircle, Terminal, Activity, Plus,
  Instagram, Facebook, Youtube, Twitter, Disc as Tiktok, Link as LinkIcon, Calendar, Save, Globe, Code, RotateCcw, ExternalLink
} from 'lucide-react';
import { BandContent, TourDate } from './types';

// --- Hardcoded Site Data ---
// DEVELOPER NOTE: To make changes permanent for everyone on the base URL, 
// we have hardcoded the current band state below.
const PRESET_DATA = "JTdCJTIyYyUyMiUzQSU1QiU3QiUyMmlkJTIyJTNBJTIyMTc2Nzk5NjU3NzE1NyUyMiUyQyUyMnR5cGUlMjIlM0ElMjJzb2NpYWwlMjIlMkMlMjJ0aXRsZSUyMiUzQSUyMk5ldyUyMFNPQ0lBTCUyMiUyQyUyMmNvbnRlbnQlMjIlM0ElMjJodHRwcyUzQSUyRiUyRnd3dy5pbnN0YWdyYW0uY29tJTJGc291bHRvc3F1ZWV6ZWxvbmdpc2xhbmQlMkYlMjIlMkMlMjJtZXRhZGF0YSUyMiUzQSUyMkluc3RhZ3JhbSUyMiU3RCUyQyU3QiUyMmlkJTIyJTNBJTIyMTc2Nzk5NjQ4MTg5MCUyMiUyQyUyMnR5cGUlMjIlM0ElMjJzb2NpYWwlMjIlMkMlMjJ0aXRsZSUyMiUzQSUyMmZhY2Vib29rJTIyJTJDJTIyY29udGVudCUyMiUzQSUyMmh0dHBzJTNBJTJGJTJGd3d3LmZhY2Vib29rLmNvbSUyRnNvdWx0b3NxdWVlemViYW5kJTIyJTJDJTIybWV0YWRhdGElMjIlM0ElMjJmYWNlYm9vayUyMiU3RCUyQyU3QiUyMmlkJTIyJTNBJTIyMTc2Nzk5NjQzNTQ3NCUyMiUyQyUyMnR5cGUlMjIlM0ElMjJzb2NpYWwlMjIlMkMlMjJ0aXRsZSUyMiUzQSUyMnlvdXR1YmUlMjIlMkMlMjJjb250ZW50JTIyJTNBJTIyaHR0cHMlM0ElMkYlMkZ3d3cueW91dHViZS5jb20lMkYlNDBTb3VsdG9TcXVlZXplQmFuZCUyMiUyQyUyMm1ldGFkYXRhJTIyJTNBJTIyeW91dHViZSUyMiU3RCUyQyU3QiUyMmlkJTIyJTNBJTIyMTc2Nzk5Mzk0MDIxOCUyMiUyQyUyMnR5cGUlMjIlM0ElMjJ2aWRlbyUyMiUyQyUyMnRpdGxlJTIyJTNBJTIydW5kZXIlMjB0aGUlMjBicmlkZ2UlMjIlMkMlMjJjb250ZW50JTIyJTNBJTIyaHR0cHMlM0ElMkYlMkZ3d3cueW91dHViZS5jb20lMkZlbWJlZCUyRnY0ekpGLTlfcmE4JTNGcmVsJTNEMCUyNm1vZGVzdGJyYW5kaW5nJTNEMSUyMiUyQyUyMm1ldGFkYXRhJTIyJTNBJTIyRHJhZnQlMjBFbnRyeSUyMiU3RCUyQyU3QiUyMmlkJTIyJTNBJTIyMTc2Nzk5Mzg2MDA4NiUyMiUyQyUyMnR5cGUlMjIlM0ElMjJ2aWRlbyUyMiUyQyUyMnRpdGxlJTIyJTNBJTIyV2FybG9ja3MlMjIlMkMlMjJjb250ZW50JTIyJTNBJTIyaHR0cHMlM0ElMkYlMkZ3d3cueW91dHViZS5jb20lMkZlbWJlZCUyRjZsZWwzcFZRdFFRJTNGcmVsJTNEMCUyNm1vZGVzdGJyYW5kaW5nJTNEMSUyMiUyQyUyMm1ldGFkYXRhJTIyJTNBJTIyRHJhZnQlMjBFbnRyeSUyMiU3RCUyQyU3QiUyMmlkJTIyJTNBJTIyMTc2Nzk4NjU0OTE3NiUyMiUyQyUyMnR5cGUlMjIlM0ElMjJ2aWRlbyUyMiUyQyUyMnRpdGxlJTIyJTNBJTIyQ2FudCUyMFN0b3AlMjIlMkMlMjJjb250ZW50JTIyJTNBJTIyaHR0cHMlM0ElMkYlMkZ3d3cueW91dHViZS5jb20lMkZlbWJlZCUyRmpQNmhnWmE5NVZRJTNGcmVsJTNEMCUyNm1vZGVzdGJyYW5kaW5nJTNEMSUyMiUyQyUyMm1ldGFkYXRhJTIyJTNBJTIyRHJhZnQlMjBFbnRyeSUyMiU3RCUyQyU3QiUyMmlkJTIyJTNBJTIyMSUyMiUyQyUyMnR5cGUlMjIlM0ElMjJ0ZXh0JTIyJTJDJTIydGl0bGUlMjIlM0ElMjJCaW8lMjIlMkMlMjJjb250ZW50JTIyJTNBJTIyRm9ybWVkJTIwaW4lMjB0aGUlMjBzcGlyaXQlMjBvZiUyMHB1cmUlMjBmdW5rLXJvY2slMjBlbmVyZ3klMkMlMjBTb3VsJTIwVG8lMjBTcXVlZXplJTIwaXMlMjBkZWRpY2F0ZWQlMjB0byUyMHJlY3JlYXRpbmclMjB0aGUlMjBzb25pYyUyMGxhbmRzY2FwZSUyMG9mJTIwdGhlJTIwUmVkJTIwSG90JTIwQ2hpbGklMjBQZXBwZXJzLiUyMEZyb20lMjB0aGUlMjByYXclMjBwdW5rJTIwcm9vdHMlMjBvZiUyME1vdGhlcidzJTIwTWlsayUyMHRvJTIwdGhlJTIwc3RhZGl1bSUyMGFudGhlbXMlMjBvZiUyMFN0YWRpdW0lMjBBcmNhZGl1bSUyQyUyMHdlJTIwYnJpbmclMjB0aGUlMjBoZWF0LiUyMiU3RCUyQyU3QiUyMmlkJTIyJTNBJTIyMTc2Nzk4Mzg2MDAxNyUyMiUyQyUyMnR5cGUlMjIlM0ElMjJ2aWRlbyUyMiUyQyUyMnRpdGxlJTIyJTNBJTIyU3VjayUyME15JTIwS2lzcyUyMiUyQyUyMmNvbnRlbnQlMjIlM0ElMjJodHRwcyUzQSUyRiUyRnd3dy55b3V0dWJlLmNvbSUyRmVtYmVkJTJGVHl3eWRrTEgwUVElM0ZyZWwlM0QwJTI2bW9kZXN0YnJhbmRpbmclM0QxJTIyJTJDJTIybWV0YWRhdGElMjIlM0ElMjIlMjIlN0QlNUQlMkMlMjJ0JTIyJTNBJTVCJTdCJTIyaWQlMjIlM0ElMjIxJTIyJTJDJTIydmVudWUlMjIlM0ElMjJNciUyMEJlZXJ5J3MlMjIlMkMlMjJsb2NhdGlvbiUyMiUzQSUyMiUyMiUyQyUyMmRhdGUlMjIlM0ElMjJKYW4lMjAyNCUyMDIwMjYlMjA4cG0uJTIyJTdEJTVEJTdE"; 

// --- State Serialization Helpers ---

const serializeState = (content: BandContent[], tourDates: TourDate[]) => {
  try {
    const data = JSON.stringify({ c: content, t: tourDates });
    return btoa(encodeURIComponent(data));
  } catch (e) {
    console.error("Serialization failed", e);
    return "";
  }
};

const deserializeState = (encoded: string) => {
  if (!encoded) return null;
  try {
    const decoded = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(decoded);
    return { content: parsed.c, tourDates: parsed.t };
  } catch (e) {
    console.error("Deserialization failed", e);
    return null;
  }
};

const convertToEmbedUrl = (url: string) => {
  if (!url) return url;
  try {
    let videoId = '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        if (urlObj.pathname === '/watch') {
          videoId = urlObj.searchParams.get('v') || '';
        } else if (urlObj.pathname.startsWith('/embed/')) {
          videoId = urlObj.pathname.split('/')[2];
        } else if (urlObj.pathname.startsWith('/shorts/')) {
          videoId = urlObj.pathname.split('/')[2];
        }
      } else if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      }
    }
    if (videoId) return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  } catch (e) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
  }
  return url;
};

const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('instagram')) return <Instagram size={32} />;
  if (p.includes('facebook')) return <Facebook size={32} />;
  if (p.includes('youtube')) return <Youtube size={32} />;
  if (p.includes('twitter')) return <Twitter size={32} />;
  if (p.includes('tiktok')) return <Tiktok size={32} />;
  return <LinkIcon size={32} />;
};

// --- Modals & Deployment ---

const DeploymentConsole: React.FC<{ 
  isOpen: boolean; 
  onComplete: (pkg: string) => void;
  content: BandContent[];
  tourDates: TourDate[];
}> = ({ isOpen, onComplete, content, tourDates }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLogs([]);
      setProgress(0);
      const steps = [
        "Syncing local draft...",
        "Encoding site structure...",
        "Finalizing public manifest...",
        "GEN-X FUNK UPLOAD COMPLETE."
      ];
      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${steps[currentStep]}`]);
          setProgress(((currentStep + 1) / steps.length) * 100);
          currentStep++;
        } else {
          clearInterval(interval);
          const pkg = serializeState(content, tourDates);
          setTimeout(() => onComplete(pkg), 600);
        }
      }, 250);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 font-mono">
      <div className="bg-zinc-950 border-2 border-red-600 w-full max-w-2xl h-[350px] flex flex-col shadow-2xl rounded-sm">
        <div className="bg-zinc-900 border-b border-red-600 p-4 flex items-center gap-3">
          <Terminal size={18} className="text-red-600" />
          <h2 className="text-red-600 font-bold uppercase tracking-widest text-[10px]">Publishing Engine</h2>
        </div>
        <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-1 text-[10px] text-red-500/80">
          {logs.map((log, i) => (
            <div key={i} className={i === logs.length - 1 ? 'text-white' : ''}>> {log}</div>
          ))}
          {progress < 100 && <div className="text-white animate-pulse">_</div>}
        </div>
        <div className="p-4 bg-zinc-900">
          <div className="h-1 bg-black rounded-full overflow-hidden">
            <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeploymentSuccessModal: React.FC<{ pkg: string; onClose: () => void }> = ({ pkg, onClose }) => {
  const [copied, setCopied] = useState(false);
  const liveUrl = `${window.location.origin}${window.location.pathname}#/deploy/${pkg}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/98 p-4 backdrop-blur-md">
      <div className="bg-zinc-900 border-2 border-white p-10 w-full max-w-2xl text-center space-y-8 relative shadow-2xl">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
            <CheckCircle size={40} className="text-black" />
          </div>
        </div>
        <div className="space-y-3">
           <h2 className="text-4xl font-bangers tracking-widest text-white uppercase italic">SITE PUBLISHED!</h2>
           <p className="text-zinc-400 text-sm max-w-md mx-auto">Your changes are now locked into this specific link. Share it with your fans to show them the latest version!</p>
        </div>
        <div className="bg-black p-4 border border-zinc-800 break-all text-[9px] text-zinc-500 font-mono text-left max-h-24 overflow-y-auto select-all ring-1 ring-red-600/20">
          {liveUrl}
        </div>
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
          <button onClick={copyToClipboard} className="flex items-center justify-center gap-3 bg-white text-black font-black px-8 py-4 uppercase text-sm hover:bg-red-600 hover:text-white transition-all transform skew-x-[-12deg]">
            {copied ? "COPIED!" : "COPY PUBLIC LINK"}
          </button>
          <button onClick={onClose} className="border-2 border-zinc-700 text-zinc-500 font-black px-8 py-4 uppercase text-sm hover:border-white hover:text-white transition-all transform skew-x-[-12deg]">CLOSE</button>
        </div>
      </div>
    </div>
  );
};

// --- Main Content Component ---

const AppContent: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('s2s_is_admin') === 'true');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDeployment, setShowDeployment] = useState(false);
  const [deployedPkg, setDeployedPkg] = useState<string | null>(null);
  const [content, setContent] = useState<BandContent[]>([]);
  const [tourDates, setTourDates] = useState<TourDate[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const location = useLocation();

  const resetToDefault = () => {
    if (window.confirm("This will clear your local draft and revert to the hardcoded version. Continue?")) {
      localStorage.removeItem('s2s_content');
      localStorage.removeItem('s2s_tour');
      window.location.reload();
    }
  };

  // Initialization Logic
  useEffect(() => {
    let baseContent: BandContent[] = [];
    let baseTour: TourDate[] = [];

    // 1. Priority: URL Package (Deployment View)
    const pkgMatch = location.pathname.match(/\/deploy\/(.+)/);
    if (pkgMatch) {
      const state = deserializeState(pkgMatch[1]);
      if (state) {
        baseContent = state.content;
        baseTour = state.tourDates;
      }
    } 
    // 2. Priority: Local Storage (Personal Edits)
    if (baseContent.length === 0) {
      const localC = localStorage.getItem('s2s_content');
      const localT = localStorage.getItem('s2s_tour');
      if (localC) {
        baseContent = JSON.parse(localC);
        baseTour = localT ? JSON.parse(localT) : [];
      }
    }
    // 3. Priority: Hardcoded Preset (from Developer)
    if (baseContent.length === 0 && PRESET_DATA) {
      const state = deserializeState(PRESET_DATA);
      if (state) {
        baseContent = state.content;
        baseTour = state.tourDates;
      }
    }
    // 4. Final Fallback: Defaults
    if (baseContent.length === 0) {
      baseContent = [
        { id: '1', type: 'text', title: 'The Squeeze', content: 'Soul To Squeeze is the ultimate tribute to the Red Hot Chili Peppers. We bring the high-voltage energy, the funky bass lines, and the soulful melodies that define the Peppers sound.' },
        { id: 'bio-photo-main', type: 'image', title: 'Band Bio Image', content: 'https://images.unsplash.com/photo-1521334885634-9552f9540abb?auto=format&fit=crop&q=80&w=800', metadata: 'bio-photo' },
        { id: 'm1', type: 'image', title: 'Stage View', content: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800' },
        { id: 'm2', type: 'video', title: 'Live Squeeze', content: convertToEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ') },
        { id: 's1', type: 'social', title: 'Instagram', content: 'https://instagram.com/', metadata: 'Instagram' },
        { id: 's2', type: 'social', title: 'Facebook', content: 'https://facebook.com/', metadata: 'Facebook' },
        { id: 's3', type: 'social', title: 'YouTube', content: 'https://youtube.com/', metadata: 'YouTube' }
      ];
      baseTour = [{ id: 't1', venue: 'The Funk House', location: 'USA', date: 'DEC 22' }];
    }

    setContent(baseContent);
    setTourDates(baseTour);
    setIsLoaded(true);
  }, [location.pathname]);

  // Autosave Drafts
  useEffect(() => {
    if (isLoaded && (content.length > 0 || tourDates.length > 0)) {
      setIsSaving(true);
      localStorage.setItem('s2s_content', JSON.stringify(content));
      localStorage.setItem('s2s_tour', JSON.stringify(tourDates));
      const timer = setTimeout(() => setIsSaving(false), 800);
      return () => clearTimeout(timer);
    }
  }, [content, tourDates, isLoaded]);

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('s2s_is_admin');
  };

  const handleVerify = () => {
    setIsAdmin(true);
    sessionStorage.setItem('s2s_is_admin', 'true');
    setShowAdminModal(false);
  };

  const addContent = (type: BandContent['type']) => {
    const newItem: BandContent = {
      id: Date.now().toString(),
      type,
      title: 'NEW BLOCK',
      content: type === 'text' ? 'Write here...' : 'https://',
      metadata: type === 'social' ? 'Instagram' : ''
    };
    setContent([newItem, ...content]);
  };

  const addTourDate = () => {
    const newTour: TourDate = {
      id: Date.now().toString(),
      venue: 'VENUE NAME',
      location: 'CITY, STATE',
      date: 'MONTH DD',
      ticketsUrl: ''
    };
    setTourDates([...tourDates, newTour]);
  };

  const updateContent = (id: string, updates: Partial<BandContent>) => {
    setContent(content.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const updateTourDate = (id: string, updates: Partial<TourDate>) => {
    setTourDates(tourDates.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteContent = (id: string) => {
    if (window.confirm("Delete this block?")) setContent(content.filter(c => c.id !== id));
  };

  const deleteTourDate = (id: string) => {
    if (window.confirm("Delete this tour date?")) setTourDates(tourDates.filter(t => t.id !== id));
  };

  if (!isLoaded) return <div className="h-screen bg-black flex items-center justify-center font-bangers text-red-600 text-6xl animate-pulse italic">LOADING THE FUNK...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-montserrat selection:bg-red-600 overflow-x-hidden">
      <Navbar isAdmin={isAdmin} onLoginClick={() => setShowAdminModal(true)} onLogout={handleLogout} />
      <AdminModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} onVerify={handleVerify} />
      <DeploymentConsole isOpen={showDeployment} onComplete={(pkg) => { setShowDeployment(false); setDeployedPkg(pkg); }} content={content} tourDates={tourDates} />
      {deployedPkg && <DeploymentSuccessModal pkg={deployedPkg} onClose={() => setDeployedPkg(null)} />}

      <Hero />

      {isAdmin && (
        <div className="sticky top-20 z-40 bg-red-600 py-3 px-6 shadow-2xl flex flex-wrap gap-4 items-center justify-center border-b border-black/20">
          <div className="flex items-center gap-2 font-black text-[9px] uppercase tracking-widest text-white border-r border-white/20 pr-4">
            <Activity size={14} className="animate-pulse" /> ADMIN PANEL
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => addContent('text')} className="bg-black/20 hover:bg-white/20 px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors flex items-center gap-1.5"><Plus size={12}/> Text</button>
            <button onClick={() => addContent('image')} className="bg-black/20 hover:bg-white/20 px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors flex items-center gap-1.5"><Plus size={12}/> Image</button>
            <button onClick={() => addContent('video')} className="bg-black/20 hover:bg-white/20 px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors flex items-center gap-1.5"><Plus size={12}/> Video</button>
            <button onClick={addTourDate} className="bg-white/20 hover:bg-white/40 px-3 py-1.5 rounded text-[10px] font-black uppercase transition-colors border border-white/20 flex items-center gap-1.5"><Plus size={12}/> Tour Date</button>
          </div>
          <div className="h-6 w-px bg-white/20 mx-2"></div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                {isSaving ? (
                  <span className="flex items-center gap-1 text-[8px] font-bold uppercase text-white/50"><Loader2 size={10} className="animate-spin" /> Saving...</span>
                ) : (
                  <span className="flex items-center gap-1 text-[8px] font-bold uppercase text-white/90"><CheckCircle size={10} /> Saved</span>
                )}
             </div>
             <button onClick={resetToDefault} className="bg-black/30 text-white/70 hover:text-white px-3 py-1.5 rounded text-[9px] font-bold uppercase flex items-center gap-1.5 transition-all"><RotateCcw size={12} /> Reset Draft</button>
             <button onClick={() => setShowDeployment(true)} className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase hover:bg-zinc-900 transition-all border border-white/20 flex items-center gap-2 shadow-xl">
               <Globe size={12} /> Get Public Link
             </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-24 space-y-40">
        
        {/* ABOUT SECTION */}
        <section id="about" className="scroll-mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-6xl md:text-8xl font-bangers text-red-600 tracking-wider uppercase transform -rotate-2">THE <span className="text-white">FUNK</span></h2>
              {content.filter(c => c.type === 'text').map(item => (
                <div key={item.id} className="relative group">
                  {isAdmin ? (
                    <div className="bg-zinc-900/50 p-6 border-2 border-dashed border-zinc-700 rounded-lg">
                      <input className="bg-transparent text-2xl font-black w-full mb-2 border-b border-zinc-800 uppercase outline-none focus:border-red-600" value={item.title} onChange={(e) => updateContent(item.id, { title: e.target.value })} />
                      <textarea className="bg-transparent text-zinc-400 text-lg w-full h-32 outline-none resize-none" value={item.content} onChange={(e) => updateContent(item.id, { content: e.target.value })} />
                      <button onClick={() => deleteContent(item.id)} className="absolute -top-2 -right-2 bg-red-600 p-1.5 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="text-3xl font-black uppercase italic flex items-center gap-3"><div className="w-8 h-1 bg-red-600"></div>{item.title}</h3>
                      <p className="text-xl text-zinc-400 font-light leading-relaxed">{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="relative">
              {content.filter(c => c.metadata === 'bio-photo').map(photo => (
                <div key={photo.id} className="relative group">
                  {isAdmin && (
                    <div className="absolute top-4 left-4 z-20 space-y-2">
                       <input className="bg-black/80 text-[10px] p-2 rounded border border-white/20 w-48 block" value={photo.content} onChange={(e) => updateContent(photo.id, { content: e.target.value })} placeholder="Photo URL" />
                    </div>
                  )}
                  <img src={photo.content} className="relative border-4 border-zinc-900 shadow-2xl transform rotate-2 w-full grayscale hover:grayscale-0 transition-all duration-700 rounded-sm" alt="Band" />
                  <div className="absolute -inset-4 bg-red-600/10 rounded-full blur-3xl opacity-50 -z-10 group-hover:bg-red-600/20 transition-all"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOCIALS */}
        <section id="socials" className="text-center">
          <h2 className="text-5xl font-bangers text-white mb-16 tracking-widest uppercase italic">FOLLOW THE <span className="text-red-600">BEAT</span></h2>
          <div className="flex flex-wrap justify-center gap-10">
            {content.filter(c => c.type === 'social').map(item => (
              <div key={item.id} className="relative group">
                {isAdmin ? (
                   <div className="bg-zinc-900 p-4 border border-zinc-800 rounded-lg w-40">
                      <input className="bg-black p-1 text-[9px] uppercase font-black w-full mb-1" value={item.metadata} onChange={(e) => updateContent(item.id, { metadata: e.target.value })} />
                      <input className="bg-black p-1 text-[9px] font-mono w-full" value={item.content} onChange={(e) => updateContent(item.id, { content: e.target.value })} />
                      <button onClick={() => deleteContent(item.id)} className="absolute -top-2 -right-2 bg-red-600 p-1 rounded-full"><Trash2 size={10}/></button>
                   </div>
                ) : (
                  <a href={item.content} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 hover:text-red-600 transition-all hover:scale-110">
                    <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-full group-hover:border-red-600 transition-all flex items-center justify-center">
                      {getSocialIcon(item.metadata || 'link')}
                    </div>
                    <span className="font-black uppercase tracking-tighter text-[10px]">{item.metadata}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* MEDIA */}
        <section id="media" className="space-y-16">
          <h2 className="text-6xl font-bangers text-center uppercase tracking-widest">LIVE <span className="text-red-600">SIGHTS</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {content.filter(c => (c.type === 'image' || c.type === 'video') && c.metadata !== 'bio-photo').map(item => (
              <div key={item.id} className="group bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-red-600 transition-all shadow-xl">
                <div className="aspect-video relative overflow-hidden bg-black">
                  {item.type === 'image' && <img src={item.content} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />}
                  {item.type === 'video' && <iframe src={item.content} className="w-full h-full" allowFullScreen loading="lazy"></iframe>}
                  {isAdmin && (
                    <div className="absolute top-2 left-2 z-20 space-y-1">
                      <input className="bg-black/80 text-[9px] p-1 border border-white/20 w-32 block" value={item.content} onChange={(e) => updateContent(item.id, { content: e.target.value })} placeholder="URL" />
                    </div>
                  )}
                  {isAdmin && <button onClick={() => deleteContent(item.id)} className="absolute top-2 right-2 bg-red-600 p-2 rounded-full shadow-lg z-20"><Trash2 size={16}/></button>}
                </div>
                <div className="p-6">
                  {isAdmin ? (
                    <input className="bg-black p-2 text-xs w-full font-black uppercase rounded" value={item.title} onChange={(e) => updateContent(item.id, { title: e.target.value })} />
                  ) : (
                    <h4 className="text-xl font-black uppercase tracking-tighter group-hover:text-red-600 transition-colors">{item.title}</h4>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TOUR */}
        <section id="tour" className="scroll-mt-32 pb-40">
          <div className="flex flex-col items-center mb-20 gap-4">
            <h2 className="text-7xl font-bangers text-white text-center uppercase tracking-widest italic transform -rotate-1">ON THE <span className="text-red-600">ROAD</span></h2>
            {isAdmin && <button onClick={addTourDate} className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all transform skew-x-[-10deg]"><Plus size={14}/> Add New Date</button>}
          </div>
          <div className="bg-zinc-900/30 border-y border-zinc-800 divide-y divide-zinc-800">
            {tourDates.map(date => (
              <div key={date.id} className="flex flex-col md:flex-row items-center justify-between p-10 hover:bg-white/[0.02] transition-colors group">
                {isAdmin ? (
                  <div className="flex flex-grow flex-col md:flex-row items-center gap-6 w-full">
                    <input 
                      className="bg-zinc-950 border border-zinc-800 p-4 text-3xl font-black text-red-600 uppercase tracking-tighter w-full md:w-48 text-center outline-none focus:border-red-600"
                      value={date.date}
                      onChange={(e) => updateTourDate(date.id, { date: e.target.value })}
                      placeholder="DATE (e.g. JAN 15)"
                    />
                    <div className="flex-grow space-y-2 w-full">
                      <input 
                        className="bg-zinc-950 border border-zinc-800 p-2 text-xl font-black uppercase tracking-tighter leading-none w-full outline-none focus:border-red-600"
                        value={date.venue}
                        onChange={(e) => updateTourDate(date.id, { venue: e.target.value })}
                        placeholder="VENUE NAME"
                      />
                      <input 
                        className="bg-zinc-950 border border-zinc-800 p-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest w-full outline-none focus:border-red-600"
                        value={date.location}
                        onChange={(e) => updateTourDate(date.id, { location: e.target.value })}
                        placeholder="CITY, STATE"
                      />
                      <input 
                        className="bg-zinc-950 border border-zinc-800 p-2 text-[9px] font-mono text-zinc-600 w-full outline-none focus:border-red-600"
                        value={date.ticketsUrl || ''}
                        onChange={(e) => updateTourDate(date.id, { ticketsUrl: e.target.value })}
                        placeholder="TICKET LINK URL (OPTIONAL)"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-12">
                    <div className="text-4xl font-black text-red-600 uppercase tracking-tighter">{date.date}</div>
                    <div>
                      <h4 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2">{date.venue}</h4>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1"><MapPin size={10} className="text-red-600"/> {date.location}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 mt-8 md:mt-0">
                  {!isAdmin && (
                    <a 
                      href={date.ticketsUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`font-black px-10 py-3 rounded transform skew-x-[-10deg] transition-all uppercase text-sm shadow-xl flex items-center gap-2 ${date.ticketsUrl ? 'bg-red-600 hover:bg-white hover:text-black text-white' : 'bg-zinc-800 text-zinc-600 cursor-default'}`}
                    >
                      Tickets {date.ticketsUrl && <ExternalLink size={14}/>}
                    </a>
                  )}
                  {isAdmin && <button onClick={() => deleteTourDate(date.id)} className="bg-zinc-900 border border-zinc-800 text-zinc-600 hover:text-red-600 p-4 rounded hover:border-red-600 transition-all shadow-lg hover:bg-black"><Trash2 size={24}/></button>}
                </div>
              </div>
            ))}
          </div>
          {tourDates.length === 0 && (
            <div className="text-center py-20 bg-zinc-900/10 border-2 border-dashed border-zinc-800 rounded-3xl mt-10">
              <p className="text-zinc-600 font-black uppercase tracking-widest">No tour dates listed. {isAdmin ? 'Click "Add New Date" to start!' : 'Check back soon for funk!'}</p>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-zinc-950 py-32 text-center border-t border-zinc-900">
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-4xl transform rotate-45 select-none">*</div>
            <h3 className="text-4xl font-bangers tracking-[0.3em] text-white italic">SOUL TO SQUEEZE</h3>
          </div>
          <p className="text-zinc-700 font-black uppercase tracking-[0.8em] text-[9px]">RHCP Tribute</p>
      </footer>
    </div>
  );
};

// --- Static Layout Components ---

const Navbar: React.FC<{ isAdmin: boolean; onLoginClick: () => void; onLogout: () => void }> = ({ isAdmin, onLoginClick, onLogout }) => (
  <nav className="fixed top-0 w-full z-50 bg-black/90 border-b border-zinc-800 h-20 px-8 flex items-center justify-between backdrop-blur-md">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-black text-2xl text-white transform rotate-45 select-none">*</div>
      <Link to="/" className="text-xl md:text-3xl font-bangers tracking-widest hover:text-red-600 transition-colors uppercase italic">Soul To Squeeze</Link>
    </div>
    <div className="hidden lg:flex items-center space-x-8 font-black uppercase tracking-tighter text-[10px]">
      <a href="#about" className="hover:text-red-600 transition-colors">History</a>
      <a href="#media" className="hover:text-red-600 transition-colors">Media</a>
      <a href="#tour" className="hover:text-red-600 transition-colors">Tour</a>
      {isAdmin ? (
        <button onClick={onLogout} className="bg-white text-black px-4 py-2 rounded-sm flex items-center gap-2 transform skew-x-[-12deg] hover:bg-red-600 hover:text-white transition-all"><Unlock size={14}/> LOCK EDITOR</button>
      ) : (
        <button onClick={onLoginClick} className="border border-zinc-700 px-4 py-2 rounded-sm flex items-center gap-2 transform skew-x-[-12deg] hover:border-white transition-all"><Lock size={14}/> ADMIN</button>
      )}
    </div>
  </nav>
);

const Hero: React.FC = () => (
  <div className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
    <div className="absolute inset-0 overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1920" 
        className="absolute inset-0 w-full h-full object-cover opacity-40 contrast-125 animate-ken-burns animate-hue-cycle" 
        alt="Hero Background" 
      />
    </div>
    <div className="absolute inset-0 bg-color-wave opacity-50 mix-blend-overlay"></div>
    <div className="liquid-overlay"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
    <div className="relative z-10 text-center px-4 max-w-5xl">
      <h2 className="text-red-600 font-black uppercase tracking-[1.5em] mb-4 text-[10px] md:text-xs animate-pulse italic">The Ultimate RHCP Experience</h2>
      <h1 className="text-7xl md:text-[14rem] font-black font-bangers leading-none mb-10 tracking-tighter rhcp-glow transform -rotate-2 select-none uppercase italic">SOUL TO <span className="text-red-600">SQUEEZE</span></h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <a href="#tour" className="bg-red-600 text-white px-16 py-6 font-black text-3xl transform skew-x-[-12deg] hover:bg-white hover:text-red-600 transition-all shadow-[0_0_60px_rgba(220,38,38,0.6)] uppercase">Tour Dates</a>
      </div>
    </div>
  </div>
);

const AdminModal: React.FC<{ isOpen: boolean; onClose: () => void; onVerify: () => void }> = ({ isOpen, onClose, onVerify }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  if (!isOpen) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().toLowerCase() === 'funk') { onVerify(); setPassword(''); }
    else { setError(true); setTimeout(() => setError(false), 2000); }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl">
      <div className="bg-zinc-900 border-2 border-red-600 p-12 w-full max-w-md relative shadow-2xl rounded-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={24} /></button>
        <div className="text-center mb-10 space-y-4">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg"><Lock className="text-white" size={24} /></div>
          <h2 className="text-4xl font-bangers tracking-widest text-white uppercase italic">Editor Login</h2>
          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Password: funk</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="password" autoFocus placeholder="Access Key" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full bg-black border-2 ${error ? 'border-red-600' : 'border-zinc-800'} p-6 text-center text-3xl font-black rounded-xl outline-none focus:border-red-600 transition-all`} />
          <button type="submit" className="w-full bg-red-600 text-white py-6 rounded-xl font-black text-xl uppercase transform hover:bg-zinc-100 hover:text-red-600 transition-all">Unlock Funk</button>
        </form>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
