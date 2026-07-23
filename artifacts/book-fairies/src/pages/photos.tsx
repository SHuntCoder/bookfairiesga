import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Instagram, Lock, X, Upload, Trash2, Eye, EyeOff, ImagePlus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const DEV_PASSWORD = 'BookFairiesGA123';
const STORAGE_KEY = 'bookfairies_gallery_photos';

interface GalleryPhoto {
  id: string;
  src: string;
  caption: string;
  uploadedAt: number;
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
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
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
            <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ffa6cb] transition-colors">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" size="lg" className="w-full rounded-full bg-[#ffa6cb] hover:bg-[#ff8ebc] text-white h-12 font-semibold">
            Sign In
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Dev Panel ────────────────────────────────────────────────────────────────
function DevPanel({ photos, onAddPhoto, onDeletePhoto, onClose }: {
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
    reader.onload = (ev) => { setPreview(ev.target?.result as string); setSuccess(false); };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setPreview(ev.target?.result as string); setSuccess(false); };
    reader.readAsDataURL(file);
  }, []);

  const handleUpload = () => {
    if (!preview) return;
    setUploading(true);
    setTimeout(() => {
      onAddPhoto({ id: `photo_${Date.now()}`, src: preview, caption: caption.trim() || 'Book Fairies', uploadedAt: Date.now() });
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
        <div className="sticky top-0 bg-white rounded-t-3xl flex items-center justify-between px-8 py-5 border-b border-gray-100 z-10">
          <div>
            <h3 className="font-serif text-2xl text-[#3a2a35]">Photo Manager</h3>
            <p className="text-xs text-[#5a3e50] mt-0.5">Developer panel · Book Fairies</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><X size={22} /></button>
        </div>

        <div className="p-8 space-y-8">
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
                  <img src={preview} alt="Preview" className="w-full max-h-48 object-cover rounded-xl mx-auto" />
                  <p className="text-sm text-[#5a3e50]">Click to choose a different image</p>
                </div>
              ) : (
                <div className="py-4">
                  <Upload className="mx-auto text-[#ffa6cb] mb-3" size={32} />
                  <p className="text-[#5a3e50] font-medium">Click to upload or drag &amp; drop</p>
                  <p className="text-sm text-gray-400 mt-1">PNG, JPG, WEBP supported</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
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
                <Button onClick={handleUpload} disabled={uploading} className="w-full rounded-full bg-[#ffa6cb] hover:bg-[#ff8ebc] text-white h-11 font-semibold">
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
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium justify-center">
                <CheckCircle size={16} />Photo added to gallery!
              </motion.div>
            )}
          </div>

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
                    <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      <p className="text-white text-xs font-medium text-center line-clamp-2">{photo.caption}</p>
                      <button onClick={() => onDeletePhoto(photo.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors">
                        <Trash2 size={12} />Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">Photos are stored locally in this browser. Changes appear on the site immediately.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Photos Page ─────────────────────────────────────────────────────────
export default function Photos() {
  const [uploadedPhotos, setUploadedPhotos] = useState<GalleryPhoto[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [devAuthed, setDevAuthed] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUploadedPhotos(JSON.parse(saved));
    } catch {}
  }, []);

  const savePhotos = (photos: GalleryPhoto[]) => {
    setUploadedPhotos(photos);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(photos)); } catch {}
  };

  const handleDevClick = () => {
    if (devAuthed) setShowDevPanel(true);
    else setShowLoginModal(true);
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans overflow-x-hidden">
      <Nav />

      <AnimatePresence>
        {showLoginModal && (
          <DevLoginModal
            onSuccess={() => { setDevAuthed(true); setShowLoginModal(false); setShowDevPanel(true); }}
            onClose={() => setShowLoginModal(false)}
          />
        )}
        {showDevPanel && (
          <DevPanel
            photos={uploadedPhotos}
            onAddPhoto={p => savePhotos([...uploadedPhotos, p])}
            onDeletePhoto={id => savePhotos(uploadedPhotos.filter(p => p.id !== id))}
            onClose={() => setShowDevPanel(false)}
          />
        )}
      </AnimatePresence>

      {/* Page header */}
      <section className="pt-40 pb-16 text-center" style={{ background: 'linear-gradient(to bottom, #ffdae9, #ffffff)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-[#ffa6cb] text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            Our Work
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-[#3a2a35] mb-6">Photos</h1>
          <p className="text-lg text-[#5a3e50] leading-relaxed">
            A glimpse into our book drives, volunteer efforts, and community moments.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-6">
          {(uploadedPhotos.length === 0) ? (
            // Only founders photo, centered nicely
            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl overflow-hidden shadow-xl max-w-sm w-full"
              >
                <img src="/founders.jpg" alt="Book Fairies founders" className="w-full h-auto object-contain" />
                <div className="bg-white px-6 py-4">
                  <p className="font-serif text-base text-[#3a2a35] font-medium">Our Founders</p>
                  <p className="text-sm text-[#5a3e50]">Marin &amp; Lauren</p>
                </div>
              </motion.div>
            </div>
          ) : (
            // Masonry grid when there are photos
            <div className="columns-2 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
              {/* Founders always first */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img src="/founders.jpg" alt="Book Fairies founders" className="w-full h-auto object-contain" />
                <div className="bg-white px-4 py-3">
                  <p className="font-serif text-sm text-[#3a2a35] font-medium">Our Founders</p>
                  <p className="text-xs text-[#5a3e50]">Marin &amp; Lauren</p>
                </div>
              </motion.div>

              {uploadedPhotos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <img src={photo.src} alt={photo.caption} className="w-full h-auto object-cover" />
                  <div className="bg-white px-4 py-3">
                    <p className="font-serif text-sm text-[#3a2a35] font-medium">{photo.caption}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <p className="text-[#5a3e50] mb-4">Follow us on Instagram for more photos and updates!</p>
            <Button asChild variant="outline" size="lg" className="rounded-full border-2 border-[#ffa6cb] text-[#3a2a35] hover:bg-[#ffa6cb] hover:text-white px-8 h-12 font-semibold bg-transparent">
              <a href="https://www.instagram.com/bookfairiesgeorgia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Instagram size={18} />@bookfairiesgeorgia
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer devAuthed={devAuthed} onDevClick={handleDevClick} />
    </div>
  );
}
