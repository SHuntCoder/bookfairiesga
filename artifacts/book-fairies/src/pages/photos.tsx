import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Instagram, X, ChevronLeft, ChevronRight,
  Lock, Eye, EyeOff, Upload, CheckCircle, Loader2, ImagePlus, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

// ── GitHub config ─────────────────────────────────────────────────────────────
const OWNER   = 'SHuntCoder';
const REPO    = 'bookfairiesga';
const BRANCH  = 'main';
const GALLERY_JSON = 'artifacts/book-fairies/src/gallery.json';
const GALLERY_DIR  = 'artifacts/book-fairies/public/gallery';

const RAW = (path: string) =>
  `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`;

// ── Auth ──────────────────────────────────────────────────────────────────────
const DEV_PASSWORD   = 'BookFairiesGA123';
const SESSION_KEY    = 'bf_gh_token';

function getStoredToken() { return sessionStorage.getItem(SESSION_KEY) ?? ''; }
function storeToken(t: string) { sessionStorage.setItem(SESSION_KEY, t); }

// ── GitHub API helpers ────────────────────────────────────────────────────────
interface GalleryPhoto { src: string; caption: string; }

async function fetchGallery(): Promise<GalleryPhoto[]> {
  try {
    const resp = await fetch(`${RAW(GALLERY_JSON)}?t=${Date.now()}`);
    if (!resp.ok) return [];
    return await resp.json();
  } catch { return []; }
}

async function githubGet(token: string, path: string) {
  const r = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return r.json();
}

async function githubPut(
  token: string, path: string, content: string, message: string, sha?: string
) {
  const body: Record<string, string> = { message, content, branch: BRANCH };
  if (sha) body.sha = sha;
  const r = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  const json = await r.json();
  if (!r.ok) throw new Error(json.message ?? 'GitHub API error');
  return json;
}

function toBase64(str: string) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach(b => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

// ── Dev Login Modal ───────────────────────────────────────────────────────────
function DevLoginModal({
  onSuccess, onClose,
}: { onSuccess: (token: string) => void; onClose: () => void }) {
  const [password, setPassword]   = useState('');
  const [token, setToken]         = useState(getStoredToken);
  const [showPw, setShowPw]       = useState(false);
  const [showTk, setShowTk]       = useState(false);
  const [error, setError]         = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== DEV_PASSWORD) { setError('Incorrect password.'); setPassword(''); return; }
    if (!token.trim()) { setError('Please enter a GitHub token.'); return; }
    storeToken(token.trim());
    onSuccess(token.trim());
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
          <p className="text-sm text-[#5a3e50] mt-1">Sign in to manage site photos</p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {/* Password */}
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Password"
              autoFocus
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-[#3a2a35] focus:outline-none focus:border-[#ffa6cb] pr-10 text-base"
            />
            <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ffa6cb] transition-colors">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* GitHub token */}
          <div className="relative">
            <input
              type={showTk ? 'text' : 'password'}
              value={token}
              onChange={e => { setToken(e.target.value); setError(''); }}
              placeholder="GitHub personal access token"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-[#3a2a35] focus:outline-none focus:border-[#ffa6cb] pr-10 text-base"
            />
            <button type="button" onClick={() => setShowTk(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ffa6cb] transition-colors">
              {showTk ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            Need a token?{' '}
            <a
              href="https://github.com/settings/tokens/new?description=Book+Fairies+Photos&scopes=repo"
              target="_blank" rel="noopener noreferrer"
              className="text-[#ffa6cb] hover:underline"
            >
              Create one on GitHub
            </a>
            {' '}with <strong>repo</strong> scope. It's saved only in this browser session.
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center flex items-center justify-center gap-1">
              <AlertCircle size={14} />{error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full rounded-full bg-[#ffa6cb] hover:bg-[#ff8ebc] text-white h-12 font-semibold">
            Sign In
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Dev Upload Panel ──────────────────────────────────────────────────────────
type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

function DevPanel({
  token, onClose, onPhotoAdded,
}: { token: string; onClose: () => void; onPhotoAdded: (p: GalleryPhoto) => void }) {
  const [caption, setCaption]   = useState('');
  const [preview, setPreview]   = useState<string | null>(null);
  const [rawFile, setRawFile]   = useState<File | null>(null);
  const [status, setStatus]     = useState<UploadStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setRawFile(file);
    setStatus('idle');
    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) loadFile(f);
  }, []);

  const upload = async () => {
    if (!preview || !rawFile) return;
    setStatus('uploading');
    setErrorMsg('');
    try {
      // 1. Build filename & pure base64 for image
      const ext      = rawFile.name.split('.').pop() ?? 'jpg';
      const filename = `${Date.now()}.${ext}`;
      const imgBase64 = preview.split(',')[1]; // strip data:...;base64,

      // 2. Upload the image file to GitHub
      await githubPut(
        token,
        `${GALLERY_DIR}/${filename}`,
        imgBase64,
        `Add gallery photo: ${filename}`,
      );

      // 3. Read current gallery.json (get SHA so we can update it)
      const current = await githubGet(token, GALLERY_JSON);
      const currentSha: string = current.sha;
      let currentPhotos: GalleryPhoto[] = [];
      try {
        currentPhotos = JSON.parse(atob(current.content.replace(/\n/g, '')));
      } catch { /* file might be empty */ }

      // 4. Build the new entry — raw GitHub URL is live immediately
      const newPhoto: GalleryPhoto = {
        src: RAW(`${GALLERY_DIR}/${filename}`),
        caption: caption.trim() || 'Book Fairies',
      };

      // 5. Update gallery.json
      const updatedPhotos = [...currentPhotos, newPhoto];
      await githubPut(
        token,
        GALLERY_JSON,
        toBase64(JSON.stringify(updatedPhotos, null, 2)),
        'Update gallery.json with new photo',
        currentSha,
      );

      setStatus('done');
      onPhotoAdded(newPhoto);
      setPreview(null);
      setRawFile(null);
      setCaption('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed. Check your token and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white rounded-t-3xl flex items-center justify-between px-8 py-5 border-b border-gray-100 z-10">
          <div>
            <h3 className="font-serif text-2xl text-[#3a2a35]">Add a Photo</h3>
            <p className="text-xs text-[#5a3e50] mt-0.5">Goes live for everyone within seconds</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X size={22} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Drop zone */}
          <div
            className="border-2 border-dashed border-[#ffa6cb]/40 rounded-2xl p-6 text-center cursor-pointer hover:border-[#ffa6cb] hover:bg-[#ffdae9]/10 transition-all"
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
          >
            {preview ? (
              <div className="space-y-2">
                <img src={preview} alt="Preview" className="w-full max-h-52 object-cover rounded-xl mx-auto" />
                <p className="text-xs text-gray-400">Click to choose a different image</p>
              </div>
            ) : (
              <div className="py-4">
                <Upload className="mx-auto text-[#ffa6cb] mb-3" size={32} />
                <p className="text-[#5a3e50] font-medium">Click to upload or drag &amp; drop</p>
                <p className="text-sm text-gray-400 mt-1">JPG, PNG, WEBP</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleInput} />
          </div>

          {/* Caption */}
          {preview && (
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Caption (e.g. Book Drive 2024)"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-[#3a2a35] focus:outline-none focus:border-[#ffa6cb] text-sm"
            />
          )}

          {/* Upload button */}
          {preview && (
            <Button
              onClick={upload}
              disabled={status === 'uploading'}
              className="w-full rounded-full bg-[#ffa6cb] hover:bg-[#ff8ebc] text-white h-11 font-semibold"
            >
              {status === 'uploading' ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Uploading to GitHub…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ImagePlus size={16} />
                  Publish Photo
                </span>
              )}
            </Button>
          )}

          {/* Status messages */}
          <AnimatePresence>
            {status === 'done' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-start gap-3 p-4 rounded-2xl bg-green-50 text-green-700"
              >
                <CheckCircle size={18} className="mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold">Photo published!</p>
                  <p className="text-green-600 mt-0.5">
                    Visible on this page right now. The full site deploy finishes in ~2 minutes.
                  </p>
                </div>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 text-red-700"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold">Upload failed</p>
                  <p className="text-red-600 mt-0.5">{errorMsg}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-center text-gray-400">
            Photos are committed directly to GitHub and live immediately.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Photos Page ──────────────────────────────────────────────────────────
export default function Photos() {
  const [photos, setPhotos]             = useState<GalleryPhoto[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showLogin, setShowLogin]       = useState(false);
  const [showPanel, setShowPanel]       = useState(false);
  const [devToken, setDevToken]         = useState('');

  // Load gallery from GitHub on mount (runtime fetch — no rebuild needed)
  useEffect(() => {
    fetchGallery().then(setPhotos);
  }, []);

  const handleDevClick = () => {
    const stored = getStoredToken();
    if (stored) { setDevToken(stored); setShowPanel(true); }
    else setShowLogin(true);
  };

  const handleLoginSuccess = (token: string) => {
    setDevToken(token);
    setShowLogin(false);
    setShowPanel(true);
  };

  const handlePhotoAdded = (photo: GalleryPhoto) => {
    setPhotos(prev => [...prev, photo]);
  };

  const prev = () => setLightboxIndex(i => (i! + photos.length - 1) % photos.length);
  const next = () => setLightboxIndex(i => (i! + 1) % photos.length);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans overflow-x-hidden">
      <Nav />

      <AnimatePresence>
        {showLogin && (
          <DevLoginModal
            onSuccess={handleLoginSuccess}
            onClose={() => setShowLogin(false)}
          />
        )}
        {showPanel && (
          <DevPanel
            token={devToken}
            onClose={() => setShowPanel(false)}
            onPhotoAdded={handlePhotoAdded}
          />
        )}

        {/* Lightbox */}
        {lightboxIndex !== null && photos.length > 0 && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              onClick={() => setLightboxIndex(null)}
            >
              <X size={28} />
            </button>
            {photos.length > 1 && (
              <>
                <button className="absolute left-4 text-white/70 hover:text-white p-2" onClick={e => { e.stopPropagation(); prev(); }}>
                  <ChevronLeft size={36} />
                </button>
                <button className="absolute right-4 text-white/70 hover:text-white p-2" onClick={e => { e.stopPropagation(); next(); }}>
                  <ChevronRight size={36} />
                </button>
              </>
            )}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl w-full flex flex-col items-center gap-4"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={photos[lightboxIndex].src}
                alt={photos[lightboxIndex].caption}
                className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              />
              {photos[lightboxIndex].caption && (
                <p className="text-white/80 font-serif text-lg text-center">
                  {photos[lightboxIndex].caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page header */}
      <section className="pt-24 md:pt-40 pb-16 text-center" style={{ background: 'linear-gradient(to bottom, #ffdae9, #ffffff)' }}>
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
          {photos.length === 0 ? (
            <div className="text-center py-20 text-[#5a3e50]">
              <p className="font-serif text-2xl text-[#3a2a35] mb-3">Photos coming soon</p>
              <p className="text-base">Check back here for photos from our book drives and events!</p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.src}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => setLightboxIndex(i)}
                >
                  <div className="relative">
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl" />
                  </div>
                  {photo.caption && (
                    <div className="bg-white px-4 py-3">
                      <p className="font-serif text-sm text-[#3a2a35] font-medium">{photo.caption}</p>
                    </div>
                  )}
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

      <Footer onDevClick={handleDevClick} />
    </div>
  );
}
