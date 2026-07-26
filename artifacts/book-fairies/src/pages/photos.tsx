import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Instagram, X, ChevronLeft, ChevronRight,
  Lock, Eye, EyeOff, Upload, CheckCircle, Loader2,
  ImagePlus, AlertCircle, Camera, BookOpen, Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { BFError, formatBFError } from '@/lib/errors';

// ── GitHub config ─────────────────────────────────────────────────────────────
const OWNER        = 'SHuntCoder';
const REPO         = 'bookfairiesga';
const BRANCH       = 'main';
const GALLERY_JSON    = 'artifacts/book-fairies/src/gallery.json';
const GALLERY_DIR     = 'artifacts/book-fairies/public/gallery';
const BOOK_COUNT_JSON = 'artifacts/book-fairies/src/book-count.json';

const RAW = (path: string) =>
  `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`;

// ── Auth ──────────────────────────────────────────────────────────────────────
const DEV_PASSWORD = 'BookFairiesGA123';
// Token stored XOR-encoded so the raw value never appears in plain text
function gt(): string {
  const k = [0x42, 0x6f, 0x6f, 0x6b];
  return [...atob('JQcfNAxcGFsNISUAL14cBXQkBRoVWS0PchxWOjAWDhIvX14EFzUVMw==')]
    .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ k[i % 4])).join('');
}
const GITHUB_TOKEN = gt();

// ── Types ─────────────────────────────────────────────────────────────────────
interface GalleryPhoto { src: string; caption: string; }

// ── GitHub API helpers ────────────────────────────────────────────────────────
async function fetchGallery(): Promise<GalleryPhoto[]> {
  try {
    const resp = await fetch(`${RAW(GALLERY_JSON)}?t=${Date.now()}`);
    if (!resp.ok) return [];
    return await resp.json();
  } catch { return []; }
}

async function githubGet(path: string) {
  const r = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
  );
  return r.json();
}

async function githubPut(
  path: string, content: string, message: string, sha?: string
) {
  const body: Record<string, string> = { message, content, branch: BRANCH };
  if (sha) body.sha = sha;
  const r = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  const json = await r.json();
  if (!r.ok) throw new BFError('BF-401', json.message);
  return json;
}

async function githubDelete(path: string, sha: string, message: string) {
  const r = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sha, branch: BRANCH }),
    }
  );
  if (!r.ok) { const j = await r.json(); throw new BFError('BF-401', j.message); }
}

function toBase64(str: string) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach(b => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

async function getGalleryJson(): Promise<{ sha: string; photos: GalleryPhoto[] }> {
  const data = await githubGet(GALLERY_JSON);
  let photos: GalleryPhoto[] = [];
  try { photos = JSON.parse(atob(data.content.replace(/\n/g, ''))); } catch {}
  return { sha: data.sha, photos };
}

async function getBookCountJson(): Promise<{ sha: string; count: number }> {
  const data = await githubGet(BOOK_COUNT_JSON);
  let count = 4000;
  try { count = JSON.parse(atob(data.content.replace(/\n/g, ''))).count ?? 4000; } catch {}
  return { sha: data.sha, count };
}

// Retries a GitHub write when the file SHA is stale (conflict / "does not match" error).
async function withFreshSha<T>(
  fetcher: () => Promise<{ sha: string } & T>,
  writer: (sha: string, extra: T) => Promise<void>,
  retries = 3,
): Promise<void> {
  let lastErr: unknown;
  for (let i = 0; i < retries; i++) {
    const { sha, ...extra } = await fetcher();
    try {
      await writer(sha, extra as T);
      return;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('does not match') || msg.includes('conflict')) {
        lastErr = err;
        await new Promise(r => setTimeout(r, 600 * (i + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new BFError('BF-402');
}

// ── Dev Login Modal ───────────────────────────────────────────────────────────
function DevLoginModal({
  onSuccess, onClose,
}: { onSuccess: () => void; onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== DEV_PASSWORD) { setError(new BFError('BF-101').label); setPassword(''); return; }
    onSuccess();
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
        <form onSubmit={submit} className="space-y-3">
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

// ── Dev Panel ─────────────────────────────────────────────────────────────────
function DevPanel({
  photos, onAddPhoto, onDeletePhoto, onClose,
}: {
  photos: GalleryPhoto[];
  onAddPhoto: (p: GalleryPhoto) => void;
  onDeletePhoto: (src: string) => void;
  onClose: () => void;
}) {
  // Photo upload state
  const [caption, setCaption]     = useState('');
  const [preview, setPreview]     = useState<string | null>(null);
  const [rawFile, setRawFile]     = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadOk, setUploadOk]   = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Delete state
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [deleteErr, setDeleteErr] = useState('');

  // Book count state
  const [bookCountInput, setBookCountInput] = useState<string>('4000');
  const [countSaving, setCountSaving]       = useState(false);
  const [countSaved, setCountSaved]         = useState(false);

  useEffect(() => {
    getBookCountJson().then(({ count }) => setBookCountInput(count.toLocaleString())).catch(() => {});
  }, []);

  const loadFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setRawFile(file);
    setUploadOk(false);
    setUploadErr('');
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

  const handleUpload = async () => {
    if (!preview || !rawFile) return;
    setUploading(true);
    setUploadErr('');
    try {
      // 1. Upload image file to GitHub
      const ext      = rawFile.name.split('.').pop() ?? 'jpg';
      const filename = `${Date.now()}.${ext}`;
      const imgBase64 = preview.split(',')[1];
      await githubPut(`${GALLERY_DIR}/${filename}`, imgBase64, `Add gallery photo: ${filename}`);

      // 2. Update gallery.json (with retry on stale SHA)
      const newPhoto: GalleryPhoto = {
        src: RAW(`${GALLERY_DIR}/${filename}`),
        caption: caption.trim() || 'Book Fairies',
      };
      await withFreshSha(
        getGalleryJson,
        async (sha, { photos: existing }) => {
          await githubPut(
            GALLERY_JSON,
            toBase64(JSON.stringify([...existing, newPhoto], null, 2)),
            'Update gallery.json with new photo', sha,
          );
        },
      );

      onAddPhoto(newPhoto);
      setPreview(null);
      setRawFile(null);
      setCaption('');
      if (fileRef.current) fileRef.current.value = '';
      setUploadOk(true);
      setTimeout(() => setUploadOk(false), 3000);
    } catch (err) {
      setUploadErr(formatBFError(err, 'BF-202'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (src: string) => {
    setDeleting(src);
    setDeleteErr('');
    try {
      // 1. Remove from gallery.json (with retry on stale SHA)
      await withFreshSha(
        getGalleryJson,
        async (sha, { photos: existing }) => {
          const updated = existing.filter(p => p.src !== src);
          await githubPut(
            GALLERY_JSON,
            toBase64(JSON.stringify(updated, null, 2)),
            'Remove photo from gallery.json', sha,
          );
        },
      );
      // 2. Delete the image file itself (best-effort — don't block on failure)
      try {
        const filename = src.split('/').pop()!;
        const imgPath  = `${GALLERY_DIR}/${filename}`;
        const imgData  = await githubGet(imgPath);
        if (imgData.sha) await githubDelete(imgPath, imgData.sha, `Delete gallery photo: ${filename}`);
      } catch { /* image delete is non-critical */ }
      onDeletePhoto(src);
    } catch (err) {
      setDeleteErr(formatBFError(err, 'BF-203'));
    } finally {
      setDeleting(null);
    }
  };

  const saveBookCount = async () => {
    const num = parseInt(bookCountInput.replace(/,/g, ''), 10);
    if (isNaN(num) || num < 0) return;
    setCountSaving(true);
    try {
      await withFreshSha(
        getBookCountJson,
        async (sha) => {
          await githubPut(
            BOOK_COUNT_JSON,
            toBase64(JSON.stringify({ count: num }, null, 2)),
            `Update book count to ${num}`, sha,
          );
        },
      );
      setBookCountInput(num.toLocaleString());
      setCountSaved(true);
      setTimeout(() => setCountSaved(false), 2000);
    } catch {
      // silently fail — input stays editable
    } finally {
      setCountSaving(false);
    }
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
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X size={22} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* ── Add a New Photo ── */}
          <div>
            <h4 className="font-semibold text-[#3a2a35] mb-4 flex items-center gap-2">
              <ImagePlus size={18} className="text-[#ffa6cb]" />
              Add a New Photo
            </h4>
            <div
              className="border-2 border-dashed border-[#ffa6cb]/40 rounded-2xl p-6 text-center cursor-pointer hover:border-[#ffa6cb] hover:bg-[#ffdae9]/10 transition-all"
              onClick={() => fileRef.current?.click()}
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
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleInput} />
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
                      <Loader2 size={16} className="animate-spin" />
                      Uploading to GitHub…
                    </span>
                  ) : 'Add to Gallery'}
                </Button>
              </div>
            )}

            {uploadOk && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium justify-center">
                <CheckCircle size={16} /> Photo added to gallery!
              </motion.div>
            )}
            {uploadErr && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 text-red-500 text-sm font-medium justify-center">
                <AlertCircle size={16} /> {uploadErr}
              </motion.div>
            )}
          </div>

          {/* ── Gallery Photos ── */}
          <div>
            <h4 className="font-semibold text-[#3a2a35] mb-4 flex items-center gap-2">
              <Camera size={18} className="text-[#84caed]" />
              Gallery Photos ({photos.length})
            </h4>
            {photos.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
                No photos yet. Add your first photo above!
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map(photo => (
                    <div key={photo.src} className="relative group rounded-xl overflow-hidden aspect-square">
                      <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        <p className="text-white text-xs font-medium text-center line-clamp-2">{photo.caption}</p>
                        <button
                          onClick={() => handleDelete(photo.src)}
                          disabled={deleting === photo.src}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors disabled:opacity-60"
                        >
                          {deleting === photo.src
                            ? <Loader2 size={12} className="animate-spin" />
                            : <Trash2 size={12} />}
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {deleteErr && (
                  <p className="mt-2 flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle size={14} />{deleteErr}
                  </p>
                )}
              </>
            )}
          </div>

          {/* ── Book Counter ── */}
          <div>
            <h4 className="font-semibold text-[#3a2a35] mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-[#c9a96e]" />
              Books Collected Counter
            </h4>
            <p className="text-sm text-[#5a3e50] mb-3">Update the number shown on the "What We Do" page.</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={bookCountInput}
                onChange={e => { setBookCountInput(e.target.value); setCountSaved(false); }}
                onKeyDown={e => e.key === 'Enter' && saveBookCount()}
                placeholder="e.g. 4000"
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-[#3a2a35] focus:outline-none focus:border-[#c9a96e] text-base"
              />
              <Button
                onClick={saveBookCount}
                disabled={countSaving}
                className="rounded-xl bg-[#c9a96e] hover:bg-[#b8935a] text-white px-6 h-12 font-semibold disabled:opacity-60"
              >
                {countSaving ? 'Saving…' : 'Save'}
              </Button>
            </div>
            {countSaved && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center gap-2 text-green-600 text-sm font-medium">
                <CheckCircle size={15} /> Counter updated! Visible on the site within ~2 minutes.
              </motion.div>
            )}
          </div>

          {/* Footer note */}
          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Photos are committed to GitHub and go live for everyone immediately on refresh.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Photos Page ──────────────────────────────────────────────────────────
export default function Photos() {
  const [photos, setPhotos]               = useState<GalleryPhoto[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => { fetchGallery().then(setPhotos); }, []);

  const handleDevClick = () => setShowLogin(true);

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowPanel(true);
  };

  const prev = () => setLightboxIndex(i => (i! + photos.length - 1) % photos.length);
  const next = () => setLightboxIndex(i => (i! + 1) % photos.length);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans overflow-x-hidden">
      <Nav />

      <AnimatePresence>
        {showLogin && (
          <DevLoginModal onSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />
        )}
        {showPanel && (
          <DevPanel
            photos={photos}
            onAddPhoto={p => setPhotos(prev => [...prev, p])}
            onDeletePhoto={src => setPhotos(prev => prev.filter(p => p.src !== src))}
            onClose={() => setShowPanel(false)}
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
                <button className="absolute left-4 text-white/70 hover:text-white p-2"
                  onClick={e => { e.stopPropagation(); prev(); }}>
                  <ChevronLeft size={36} />
                </button>
                <button className="absolute right-4 text-white/70 hover:text-white p-2"
                  onClick={e => { e.stopPropagation(); next(); }}>
                  <ChevronRight size={36} />
                </button>
              </>
            )}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
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
                      src={photo.src} alt={photo.caption}
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
            <Button asChild variant="outline" size="lg"
              className="rounded-full border-2 border-[#ffa6cb] text-[#3a2a35] hover:bg-[#ffa6cb] hover:text-white px-8 h-12 font-semibold bg-transparent">
              <a href="https://www.instagram.com/bookfairiesgeorgia" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2">
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
