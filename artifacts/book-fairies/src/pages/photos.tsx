import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import galleryPhotos from '@/gallery-photos';

export default function Photos() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex(i => (i! + galleryPhotos.length - 1) % galleryPhotos.length);
  const next = () => setLightboxIndex(i => (i! + 1) % galleryPhotos.length);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans overflow-x-hidden">
      <Nav />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && galleryPhotos.length > 0 && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              onClick={closeLightbox}
            >
              <X size={28} />
            </button>

            {galleryPhotos.length > 1 && (
              <>
                <button
                  className="absolute left-4 text-white/70 hover:text-white transition-colors p-2"
                  onClick={e => { e.stopPropagation(); prev(); }}
                >
                  <ChevronLeft size={36} />
                </button>
                <button
                  className="absolute right-4 text-white/70 hover:text-white transition-colors p-2"
                  onClick={e => { e.stopPropagation(); next(); }}
                >
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
                src={galleryPhotos[lightboxIndex].src}
                alt={galleryPhotos[lightboxIndex].caption}
                className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              />
              {galleryPhotos[lightboxIndex].caption && (
                <p className="text-white/80 font-serif text-lg text-center">
                  {galleryPhotos[lightboxIndex].caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page header */}
      <section
        className="pt-24 md:pt-40 pb-16 text-center"
        style={{ background: 'linear-gradient(to bottom, #ffdae9, #ffffff)' }}
      >
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
          {galleryPhotos.length === 0 ? (
            <div className="text-center py-20 text-[#5a3e50]">
              <p className="font-serif text-2xl text-[#3a2a35] mb-3">Photos coming soon</p>
              <p className="text-base">Check back here for photos from our book drives and events!</p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
              {galleryPhotos.map((photo, i) => (
                <motion.div
                  key={photo.src}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => openLightbox(i)}
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
                <Instagram size={18} />@bookfairiesgeorgia
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
