import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  BookOpen, 
  Users, 
  Sparkles,
  Mail,
  Facebook,
  Instagram,
  BookMarked,
  Camera,
  ExternalLink,
  Lock,
  X,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  ImagePlus,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const COLORS = {
  pink: '#ffa6cb',
  blue: '#84caed',
  lavender: '#d7a9ff',
  sky: '#e0f5ff',
  blush: '#ffdae9',
  dark: '#3a2a35',
  text: '#5a3e50',
  gold: '#c9a96e',
};

const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'What We Do', href: '#what-we-do' },
  { name: 'Photos', href: '#photos' },
  { name: 'Book Club', href: '#book-club' },
  { name: 'Volunteer', href: '#volunteer' },
  { name: 'Donate', href: '#donate' },
  { name: 'Contact', href: '#contact' },
];

const DEV_PASSWORD = 'BookFairiesGA123';
const STORAGE_KEY = 'bookfairies_gallery_photos';

interface GalleryPhoto {
  id: string;
  src: string;
  caption: string;
  uploadedAt: number;
}

const PLACEHOLDER_COLORS = [
  `linear-gradient(135deg, ${COLORS.sky} 0%, ${COLORS.lavender}44 100%)`,
  `linear-gradient(135deg, ${COLORS.lavender}44 0%, ${COLORS.blush} 100%)`,
  `linear-gradient(135deg, ${COLORS.blush} 0%, ${COLORS.lavender}44 100%)`,
  `linear-gradient(135deg, ${COLORS.sky} 0%, ${COLORS.blush} 100%)`,
];

// Animated counter hook
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ── Dev Login Modal ──────────────────────────────────────────────────────────
function DevLoginModal({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEV_PASSWORD) {
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#ffdae9] flex items-center justify-center mx-auto mb-3">
            <Lock size={22} className="text-[#ffa6cb]" />
          </div>
          <h3 className="font-serif text-2xl text-[#3a2a35]">Developer Login</h3>
          <p className="text-sm text-[#5a3e50] mt-1">Enter your password to manage site photos</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Password"
              autoFocus
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-[#3a2a35] focus:outline-none focus:border-[#ffa6cb] pr-10 text-base"
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ffa6cb] transition-colors"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full bg-[#ffa6cb] hover:bg-[#ff8ebc] text-white h-12 font-semibold"
          >
            Sign In
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Dev Panel ────────────────────────────────────────────────────────────────
function DevPanel({
  photos,
  onAddPhoto,
  onDeletePhoto,
  onClose,
}: {
  photos: GalleryPhoto[];
  onAddPhoto: (photo: GalleryPhoto) => void;
  onDeletePhoto: (id: string) => void;
  onClose: () => void;
}) {
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
      setSuccess(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
      setSuccess(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUpload = () => {
    if (!preview) return;
    setUploading(true);
    setTimeout(() => {
      const newPhoto: GalleryPhoto = {
        id: `photo_${Date.now()}`,
        src: preview,
        caption: caption.trim() || 'Book Fairies',
        uploadedAt: Date.now(),
      };
      onAddPhoto(newPhoto);
      setPreview(null);
      setCaption('');
      setUploading(false);
      setSuccess(true);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setSuccess(false), 2500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl flex items-center justify-between px-8 py-5 border-b border-gray-100 z-10">
          <div>
            <h3 className="font-serif text-2xl text-[#3a2a35]">Photo Manager</h3>
            <p className="text-xs text-[#5a3e50] mt-0.5">Developer panel · Book Fairies</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Upload area */}
          <div>
            <h4 className="font-semibold text-[#3a2a35] mb-4 flex items-center gap-2">
              <ImagePlus size={18} className="text-[#ffa6cb]" />
              Add a New Photo
            </h4>

            <div
              className="border-2 border-dashed border-[#ffa6cb]/40 rounded-2xl p-6 text-center cursor-pointer hover:border-[#ffa6cb] hover:bg-[#ffdae9]/10 transition-all"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              {preview ? (
                <div className="space-y-3">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-48 object-cover rounded-xl mx-auto"
                  />
                  <p className="text-sm text-[#5a3e50]">Click to choose a different image</p>
                </div>
              ) : (
                <div className="py-4">
                  <Upload className="mx-auto text-[#ffa6cb] mb-3" size={32} />
                  <p className="text-[#5a3e50] font-medium">Click to upload or drag &amp; drop</p>
                  <p className="text-sm text-gray-400 mt-1">PNG, JPG, WEBP supported</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </div>

            {preview && (
              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="Photo caption (e.g. Book Drive 2024)"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-[#3a2a35] focus:outline-none focus:border-[#ffa6cb] text-sm"
                />
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full rounded-full bg-[#ffa6cb] hover:bg-[#ff8ebc] text-white h-11 font-semibold"
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Adding photo…
                    </span>
                  ) : 'Add to Gallery'}
                </Button>
              </div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium justify-center"
              >
                <CheckCircle size={16} />
                Photo added to gallery!
              </motion.div>
            )}
          </div>

          {/* Existing photos */}
          <div>
            <h4 className="font-semibold text-[#3a2a35] mb-4 flex items-center gap-2">
              <Camera size={18} className="text-[#84caed]" />
              Gallery Photos ({photos.length})
            </h4>
            {photos.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
                No photos uploaded yet. Add your first photo above!
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map(photo => (
                  <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square">
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      <p className="text-white text-xs font-medium text-center line-clamp-2">{photo.caption}</p>
                      <button
                        onClick={() => onDeletePhoto(photo.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
                      >
                        <Trash2 size={12} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Photos are stored locally in this browser. Changes appear on the site immediately.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  // Counter trigger
  const counterRef = useRef<HTMLDivElement>(null);
  const [counterVisible, setCounterVisible] = useState(false);
  const bookCount = useCountUp(4000, 2200, counterVisible);

  // Dev auth state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [devAuthed, setDevAuthed] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);

  // Gallery photos from localStorage
  const [uploadedPhotos, setUploadedPhotos] = useState<GalleryPhoto[]>([]);

  // Load saved photos on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUploadedPhotos(JSON.parse(saved));
    } catch {}
  }, []);

  // Save photos when they change
  const savePhotos = (photos: GalleryPhoto[]) => {
    setUploadedPhotos(photos);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    } catch {
      console.warn('localStorage full — photos may not persist');
    }
  };

  const handleAddPhoto = (photo: GalleryPhoto) => {
    savePhotos([...uploadedPhotos, photo]);
  };

  const handleDeletePhoto = (id: string) => {
    savePhotos(uploadedPhotos.filter(p => p.id !== id));
  };

  const handleDevLogin = () => {
    setDevAuthed(true);
    setShowLoginModal(false);
    setShowDevPanel(true);
  };

  const handleDevButtonClick = () => {
    if (devAuthed) {
      setShowDevPanel(true);
    } else {
      setShowLoginModal(true);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCounterVisible(true); },
      { threshold: 0.3 }
    );
    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, []);

  // Static "founders" photo always shown first
  const founderPhoto = {
    id: 'founders',
    src: '/founders.jpg',
    caption: 'Our Founders',
  };

  // Combine uploaded photos for gallery display
  const allGalleryPhotos = [founderPhoto, ...uploadedPhotos];

  // Placeholder cards to pad when < 6 photos
  const placeholderCount = Math.max(0, 5 - uploadedPhotos.length);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans overflow-x-hidden">
      
      {/* Modals */}
      <AnimatePresence>
        {showLoginModal && (
          <DevLoginModal
            onSuccess={handleDevLogin}
            onClose={() => setShowLoginModal(false)}
          />
        )}
        {showDevPanel && (
          <DevPanel
            photos={uploadedPhotos}
            onAddPhoto={handleAddPhoto}
            onDeletePhoto={handleDeletePhoto}
            onClose={() => setShowDevPanel(false)}
          />
        )}
      </AnimatePresence>

      {/* 1. Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold text-[#5a3e50] tracking-tight">Book Fairies</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffa6cb]">Fulton County, GA</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-[#5a3e50] hover:text-[#ffa6cb] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="md:hidden">
            <a href="#donate" className="text-sm font-semibold text-[#ffa6cb]">Donate</a>
          </div>
        </div>
      </nav>

      {/* 2. Hero */}
      <section 
        id="hero" 
        className="relative pt-32 pb-20 md:pt-48 md:pb-32 min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${COLORS.blush} 0%, ${COLORS.sky} 50%, ${COLORS.lavender}88 100%)`
        }}
      >
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/50 text-[#ffa6cb] text-xs font-bold uppercase tracking-widest mb-6">
            Fulton County · Community Literacy Initiative
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#3a2a35] leading-tight mb-6">
            Creating Passion<br />
            <span className="italic text-[#ffa6cb] font-light">One Page at a Time</span>
          </h1>
          <p className="text-lg md:text-xl text-[#5a3e50] max-w-2xl mx-auto mb-10 leading-relaxed">
            We collect and distribute books to underserved students and families across Fulton County school communities — because every child deserves the joy of reading.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button 
              size="lg" 
              className="rounded-full bg-[#ffa6cb] hover:bg-[#ff8ebc] text-white px-8 h-14 text-base font-semibold shadow-lg shadow-[#ffa6cb]/30"
              onClick={() => document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-donate-hero"
            >
              Donate Books
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full border-2 border-[#5a3e50] text-[#5a3e50] hover:bg-[#5a3e50] hover:text-white px-8 h-14 text-base font-semibold bg-transparent"
              onClick={() => document.getElementById('volunteer')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-volunteer-hero"
            >
              Get Involved
            </Button>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-10 top-32 text-[#ffa6cb] opacity-50 hidden lg:block"
        >
          <Sparkles size={64} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute left-20 bottom-32 text-[#d7a9ff] opacity-50 hidden lg:block"
        >
          <BookOpen size={48} />
        </motion.div>
      </section>

      {/* 3. About */}
      <section id="about" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 space-y-20">

          {/* Mission row */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3] relative"
            >
              <img
                src="/founders.jpg"
                alt="Book Fairies founders Marin DuMond and Lauren Holbrook"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#3a2a35]/70 to-transparent p-6">
                <p className="font-serif text-white text-lg font-semibold">Marin DuMond &amp; Lauren Holbrook</p>
                <p className="text-[#ffa6cb] text-sm font-medium">Founders, Book Fairies</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-5 text-[#5a3e50] text-lg leading-relaxed"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[#ffa6cb]">Our Mission</p>
              <h2 className="font-serif text-4xl text-[#3a2a35]">About Us</h2>
              <p>
                Book Fairies is dedicated to expanding access to books and promoting literacy for children in underserved communities throughout Fulton County. By organizing book drives and community partnerships, we help place books directly into the hands of students who need them most.
              </p>
              <blockquote className="border-l-4 pl-5 font-serif text-xl text-[#3a2a35] italic" style={{ borderColor: COLORS.pink }}>
                "We believe books inspire imagination, confidence, education, and opportunity — and every child deserves access to those opportunities."
              </blockquote>
            </motion.div>
          </div>

          {/* Founders row */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-5 text-[#5a3e50] text-lg leading-relaxed"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[#ffa6cb]">Meet the Founders</p>
              <h2 className="font-serif text-4xl text-[#3a2a35]">Marin DuMond &amp; Lauren Holbrook</h2>
              <p>
                Book Fairies was founded by Marin DuMond and Lauren Holbrook with a shared goal of making reading more accessible to children throughout the community.
              </p>
              <p>
                After recognizing that many students lacked access to books outside the classroom, we created Book Fairies to help bridge that gap through donation drives, volunteer efforts, and community connections.
              </p>
              <p className="font-semibold text-[#3a2a35]">
                Our mission is simple: help every child build a love for reading and create a joy for learning.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl p-12 relative overflow-hidden shadow-xl flex flex-col justify-center"
              style={{ background: `linear-gradient(135deg, ${COLORS.sky} 0%, ${COLORS.blush} 100%)` }}
            >
              <Heart className="text-[#ffa6cb] w-10 h-10 mb-6" />
              <blockquote className="font-serif text-2xl text-[#3a2a35] leading-snug">
                "Creating passion one page at a time."
              </blockquote>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#ffa6cb]">
                  <Sparkles size={20} />
                </div>
                <p className="font-medium text-[#5a3e50]">Book Fairies, Fulton County, GA</p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 4. What We Do */}
      <section id="what-we-do" className="py-24" style={{ background: `linear-gradient(to bottom, ${COLORS.sky}, #ffffff)` }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-[#3a2a35] mb-6">What We Do</h2>
            <p className="text-lg text-[#5a3e50]">Building stronger communities through the power of literacy and shared stories.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Community Book Drives", desc: "We organize book drives throughout schools, neighborhoods, and local organizations to collect new and gently used books for children of all ages.", color: COLORS.pink },
              { title: "Book Distribution", desc: "Donated books are carefully sorted and distributed to underserved schools, community centers, and youth programs throughout Fulton County.", color: COLORS.blue },
              { title: "Volunteer Opportunities", desc: "Students and community members can help organize donations, sort books, and support literacy events — and earn volunteer service hours.", color: COLORS.lavender },
              { title: "Literacy Advocacy", desc: "We work to raise awareness about childhood literacy and the importance of equal access to educational resources.", color: COLORS.gold }
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: card.color }}></div>
                <h3 className="font-serif text-xl font-semibold text-[#3a2a35] mb-4 mt-2">{card.title}</h3>
                <p className="text-[#5a3e50] leading-relaxed text-sm">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Impact — with animated book counter */}
      <section id="impact" className="py-24 bg-[#3a2a35] text-white" ref={counterRef}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center col-span-2 md:col-span-1"
            >
              <div className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#ffa6cb] mb-4 tabular-nums">
                {bookCount.toLocaleString()}+
              </div>
              <div className="text-sm md:text-base text-gray-300 uppercase tracking-wide font-medium leading-snug">
                Books collected &amp; counting
              </div>
            </motion.div>
            {[
              { stat: "Fulton County", text: "Expanding across the whole county" },
              { stat: "Many", text: "Student-led volunteer initiatives" },
              { stat: "Every Sunday", text: "Pickups available nearly every week" }
            ].map((item, i) => (
              <motion.div 
                key={item.stat}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i + 1) * 0.1 }}
                className="text-center"
              >
                <div className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#ffa6cb] mb-4">{item.stat}</div>
                <div className="text-sm md:text-base text-gray-300 uppercase tracking-wide font-medium leading-snug">{item.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Photos */}
      <section id="photos" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Camera className="text-[#ffa6cb]" size={28} />
              <p className="text-xs font-bold uppercase tracking-widest text-[#ffa6cb]">Our Work</p>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#3a2a35] mb-6">Photos</h2>
            <p className="text-lg text-[#5a3e50]">A glimpse into our book drives, volunteer efforts, and community moments.</p>
          </div>

          <div className="columns-2 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
            {/* Founders photo always first */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src="/founders.jpg"
                alt="Book Fairies founders"
                className="w-full object-cover"
              />
              <div className="bg-white px-4 py-3">
                <p className="font-serif text-sm text-[#3a2a35] font-medium">Our Founders</p>
                <p className="text-xs text-[#5a3e50]">Marin &amp; Lauren</p>
              </div>
            </motion.div>

            {/* Uploaded photos */}
            {uploadedPhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full object-cover"
                />
                <div className="bg-white px-4 py-3">
                  <p className="font-serif text-sm text-[#3a2a35] font-medium">{photo.caption}</p>
                </div>
              </motion.div>
            ))}

            {/* Placeholder cards */}
            {Array.from({ length: placeholderCount }).map((_, i) => (
              <motion.div
                key={`placeholder-${i}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm"
                style={{
                  background: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length],
                  aspectRatio: i % 2 === 0 ? '4/3' : '3/4',
                }}
              >
                <div className="w-full h-full min-h-32 flex flex-col items-center justify-center p-6">
                  <Camera className="text-[#ffa6cb] opacity-40 mb-2" size={28} />
                  <p className="font-serif text-[#5a3e50] text-center text-xs italic opacity-60">Photo coming soon</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-[#5a3e50] mb-4">Follow us on Instagram for more photos and updates!</p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-2 border-[#ffa6cb] text-[#3a2a35] hover:bg-[#ffa6cb] hover:text-white px-8 h-12 font-semibold bg-transparent"
            >
              <a
                href="https://www.instagram.com/bookfairiesgeorgia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Instagram size={18} />
                @bookfairiesgeorgia
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* 7. Book Club */}
      <section
        id="book-club"
        className="py-24 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${COLORS.lavender}55 0%, ${COLORS.blush} 60%, ${COLORS.sky} 100%)` }}
      >
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <BookMarked className="text-[#d7a9ff]" size={32} />
              <p className="text-xs font-bold uppercase tracking-widest text-[#d7a9ff]">Read with Us</p>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#3a2a35] mb-6">Book Club</h2>
            <p className="text-lg text-[#5a3e50] leading-relaxed mb-4 max-w-2xl mx-auto">
              Love reading? Join the Book Fairies Book Club on Fable — where we read, discuss, and celebrate stories together as a community. It's free, it's fun, and it keeps the love of reading alive.
            </p>
            <p className="text-base text-[#5a3e50] mb-10 max-w-xl mx-auto">
              Whether you're a lifelong reader or just getting started, there's a place for you in our club. Every book is a new adventure.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#d7a9ff] hover:bg-[#c990ff] text-[#3a2a35] px-10 h-14 text-base font-semibold shadow-lg shadow-[#d7a9ff]/40"
              data-testid="link-book-club-fable"
            >
              <a
                href="https://fable.co/club/book-fairies-book-club-with-lauren-holbrook-265819939304"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <BookMarked size={20} />
                Join Our Book Club on Fable
                <ExternalLink size={16} />
              </a>
            </Button>
            <p className="text-xs text-[#5a3e50]/60 mt-4">Opens Fable — our online book club platform</p>
          </motion.div>
        </div>
      </section>

      {/* 8. Volunteer */}
      <section id="volunteer" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl text-[#3a2a35] mb-4">Get Involved</h2>
              <p className="text-[#5a3e50] text-lg leading-relaxed mb-8">Volunteers are essential to the Book Fairies mission. Whether you are helping collect books, organize donations, or participate in community outreach, your support helps us reach more students across the community.</p>
              <ul className="space-y-6">
                {[
                  { text: "Organize a book drive in your school, neighborhood, or organization", color: COLORS.pink },
                  { text: "Sign up for a pickup — we'll handle the rest", color: COLORS.blue },
                  { text: "Promote literacy initiatives in your community", color: COLORS.lavender },
                  { text: "Support social media and outreach efforts", color: COLORS.gold }
                ].map((item, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-4 text-lg text-[#5a3e50]">
                    <div className="mt-1.5 flex-shrink-0 w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span>{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl p-10 text-center shadow-lg" style={{ background: `linear-gradient(135deg, ${COLORS.lavender}22 0%, ${COLORS.blue}22 100%)` }}>
              <Users className="w-12 h-12 mx-auto text-[#84caed] mb-6" />
              <h3 className="font-serif text-3xl text-[#3a2a35] mb-4">Earn Service Hours</h3>
              <p className="text-[#5a3e50] mb-8 text-lg">Students are welcome to volunteer with Book Fairies and earn community service hours through participation. Reach out to request opportunities.</p>
              <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-[#84caed] hover:bg-[#6ab9e3] text-white px-8 h-14 text-base font-semibold" data-testid="link-volunteer-email">
                <a href="mailto:bookfairiesgeorgia@gmail.com">Email Us to Volunteer</a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. Donate */}
      <section id="donate" className="py-24 px-6" style={{ background: `linear-gradient(to right, ${COLORS.blush}, ${COLORS.sky})` }}>
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 md:p-16 shadow-xl">
          <div className="text-center mb-10">
            <BookOpen className="w-12 h-12 mx-auto text-[#ffa6cb] mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl text-[#3a2a35] mb-4">Help a Child Discover Stories</h2>
            <p className="text-lg text-[#5a3e50] leading-relaxed">Your donations help children discover new stories, improve literacy skills, and develop a lifelong love of reading. We accept all books — children's books, early readers, middle school novels, and educational materials are always appreciated.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { step: "1", title: "Find Books", desc: "Gather any books for ages 4–16 — new or gently used. Children's books, early readers, middle school novels, and educational materials are all welcome.", color: COLORS.pink },
              { step: "2", title: "Schedule a Pickup", desc: "Pickup locations must be in the Milton / Alpharetta area. Pickups are available almost every Sunday — sign the form for your preferred date.", color: COLORS.blue, highlight: true },
              { step: "3", title: "We Handle the Rest", desc: "That's it! Your books will be sorted and distributed directly to underserved schools and students across Fulton County.", color: COLORS.lavender },
            ].map((s) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-2xl p-6 flex flex-col gap-3 border" style={{ borderColor: s.color, background: s.highlight ? `${s.color}18` : "#fafafa" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: s.color }}>{s.step}</div>
                <h3 className="font-serif text-xl text-[#3a2a35]">{s.title}</h3>
                {s.highlight && <span className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white w-fit" style={{ backgroundColor: s.color }}>Milton / Alpharetta Area Only</span>}
                <p className="text-[#5a3e50] text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full bg-[#ffa6cb] hover:bg-[#ff8ebc] text-white px-10 h-14 text-base font-semibold shadow-lg shadow-[#ffa6cb]/30" data-testid="link-pickup-form">
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSdzrZF9SlunOlqtGEx0u8JUyvZ_MrG_KsPEFxSjFN_dFTDxZg/viewform" target="_blank" rel="noopener noreferrer">Schedule a Pickup</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-2 border-[#84caed] text-[#3a2a35] hover:bg-[#84caed] hover:text-white px-10 h-14 text-base font-semibold bg-transparent" data-testid="link-request-books-form">
              <a href="https://docs.google.com/forms/d/e/1FAIpQLScEBwegpIED_wqzXoCtpxj2ZuQLRsIo4itJ911LsKWIKIEMdw/viewform" target="_blank" rel="noopener noreferrer">Request Books</a>
            </Button>
          </div>
        </div>
      </section>

      {/* 10. Partner */}
      <section id="partner" className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-4xl text-[#3a2a35] mb-6">Partner With Us</h2>
          <p className="text-lg text-[#5a3e50] mb-10">Book Fairies partners with schools, libraries, local businesses, and nonprofit organizations to expand access to books and educational resources. Together, we can help create brighter futures through literacy.</p>
          <Button asChild variant="outline" size="lg" className="rounded-full border-2 border-[#d7a9ff] text-[#3a2a35] hover:bg-[#d7a9ff] hover:text-white px-10 h-14 text-lg font-semibold bg-transparent" data-testid="link-partner-email">
            <a href="mailto:bookfairiesgeorgia@gmail.com">Become a Partner</a>
          </Button>
        </div>
      </section>

      {/* 11. FAQ */}
      <section id="faq" className="py-24 bg-[#e0f5ff]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-4xl text-[#3a2a35] text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              { q: "Where are the books donated?", a: "Books are distributed to underserved schools, students, and community organizations throughout Fulton County." },
              { q: "Can students volunteer?", a: "Yes! Student volunteers are welcome and may earn community service hours through participation. Email bookfairiesgeorgia@gmail.com to request opportunities." },
              { q: "What books are most needed?", a: "We take all books! Children's books, early readers, middle school novels, and educational materials are always appreciated." },
              { q: "How can organizations partner with Book Fairies?", a: "Schools, businesses, and local organizations can contact us to organize donation drives or literacy initiatives." },
              { q: "How do I donate books?", a: "Book donations drop on a monthly basis and are available almost all Sundays in the month. Sign the pickup form for your preferred date, and let us take care of the rest!" },
              { q: "Do you have a book club?", a: "Yes! Join our Book Fairies Book Club on Fable — an online platform where our community reads and discusses books together. Click the Book Club tab in the navigation to join." }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-white rounded-2xl border-none shadow-sm px-6">
                <AccordionTrigger className="text-[#3a2a35] hover:text-[#ffa6cb] font-medium text-left hover:no-underline py-6">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-[#5a3e50] pb-6 leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 12. Contact & Footer */}
      <footer id="contact" className="bg-[#3a2a35] pt-24 pb-8 text-white relative border-t-8" style={{ borderTopColor: COLORS.pink }}>
        <div className="max-w-4xl mx-auto px-6 text-center mb-24">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Contact Book Fairies</h2>
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
            Interested in donating, volunteering, or partnering with us? We'd love to hear from you and work together to expand literacy opportunities throughout the community.
          </p>
          <div className="mb-8">
            <a href="mailto:bookfairiesgeorgia@gmail.com" className="inline-flex items-center gap-3 text-[#ffa6cb] hover:text-white transition-colors text-lg font-medium" data-testid="contact-email-address">
              <Mail size={22} />
              bookfairiesgeorgia@gmail.com
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:bookfairiesgeorgia@gmail.com" className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-600 hover:border-white hover:bg-white/10 transition-colors" data-testid="contact-email">
              <Mail size={20} /><span>Send an Email</span>
            </a>
            <a href="https://www.instagram.com/bookfairiesgeorgia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-600 hover:border-white hover:bg-white/10 transition-colors" data-testid="contact-instagram">
              <Instagram size={20} /><span>@bookfairiesgeorgia</span>
            </a>
            <a href="https://www.facebook.com/bookfairiesgeorgia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-600 hover:border-white hover:bg-white/10 transition-colors" data-testid="contact-facebook">
              <Facebook size={20} /><span>@bookfairiesgeorgia</span>
            </a>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500 border-t border-white/10 pt-8 flex flex-col items-center gap-3">
          <p>© {new Date().getFullYear()} Book Fairies · Fulton County, Georgia · Creating Passion One Page at a Time</p>
          {/* Developer login — subtle, in footer */}
          <button
            onClick={handleDevButtonClick}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors mt-1"
            data-testid="dev-login-button"
          >
            <Lock size={11} />
            {devAuthed ? 'Manage Photos' : 'Developer Login'}
          </button>
        </div>
      </footer>
    </div>
  );
}
