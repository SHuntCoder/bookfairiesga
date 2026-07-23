import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Heart } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const COLORS = {
  pink: '#ffa6cb',
  blue: '#84caed',
  lavender: '#d7a9ff',
  sky: '#e0f5ff',
  blush: '#ffdae9',
  dark: '#3a2a35',
  text: '#5a3e50',
};

export default function Home() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans overflow-x-hidden pt-16 md:pt-20">
      <Nav />

      {/* Hero */}
      <section
        className="relative pt-32 pb-20 md:pt-48 md:pb-32 min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${COLORS.blush} 0%, ${COLORS.sky} 50%, ${COLORS.lavender}88 100%)` }}
      >
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/50 text-[#ffa6cb] text-xs font-bold uppercase tracking-widest mb-6">
            Fulton County · Community Literacy Initiative
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-[#3a2a35] leading-tight mb-6">
            Creating Passion<br />
            <span className="italic text-[#ffa6cb] font-light">One Page at a Time</span>
          </h1>
          <p className="text-lg md:text-xl text-[#5a3e50] max-w-2xl mx-auto mb-10 leading-relaxed">
            We collect and distribute books to underserved students and families across Fulton County school communities — because every child deserves the joy of reading.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#ffa6cb] hover:bg-[#ff8ebc] text-white px-8 h-14 text-base font-semibold shadow-lg shadow-[#ffa6cb]/30"
            >
              <Link to="/donate">Donate Books</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-2 border-[#5a3e50] text-[#5a3e50] hover:bg-[#5a3e50] hover:text-white px-8 h-14 text-base font-semibold bg-transparent"
            >
              <Link to="/volunteer">Get Involved</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-10 top-32 text-[#ffa6cb] opacity-50 hidden lg:block"
        >
          <Sparkles size={64} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute left-20 bottom-32 text-[#d7a9ff] opacity-50 hidden lg:block"
        >
          <BookOpen size={48} />
        </motion.div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-20">

          {/* Mission row */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden shadow-xl relative"
            >
              <img
                src="/founders.jpg"
                alt="Book Fairies founders Marin DuMond and Lauren Holbrook"
                className="w-full h-auto object-contain"
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

      <Footer />
    </div>
  );
}
