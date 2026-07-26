import { motion } from 'framer-motion';
import { BookMarked, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const COLORS = {
  lavender: '#d7a9ff',
  blush: '#ffdae9',
  sky: '#e0f5ff',
};

export default function BookClub() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans overflow-x-hidden">
      <Nav />

      {/* Page header */}
      <section
        className="pt-24 md:pt-40 pb-20 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${COLORS.lavender}55 0%, ${COLORS.blush} 60%, ${COLORS.sky} 100%)` }}
      >
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookMarked className="text-[#d7a9ff]" size={32} />
            <span className="text-xs font-bold uppercase tracking-widest text-[#d7a9ff]">Read with Us</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-[#3a2a35] mb-6">Book Club</h1>
          <p className="text-lg text-[#5a3e50] leading-relaxed max-w-2xl mx-auto">
            Join the Book Fairies community on Fable — where we read, discuss, and celebrate stories together.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-24 bg-white flex-1">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="font-serif text-4xl text-[#3a2a35]">What is Fable?</h2>
              <p className="text-[#5a3e50] text-lg leading-relaxed">
                Fable is an online book club platform that brings readers together — no matter where they are. Our Book Fairies Book Club on Fable is a place to read along with us, share your thoughts, and connect with fellow book lovers in our community.
              </p>
              <p className="text-[#5a3e50] text-lg leading-relaxed">
                Whether you're a lifelong reader or just getting started, there's a place for you. Every book is a new adventure, and every reader brings something unique to the conversation.
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
              <p className="text-xs text-[#5a3e50]/60">Opens Fable — our online book club platform</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl p-10 relative overflow-hidden shadow-xl flex flex-col gap-6"
              style={{ background: `linear-gradient(135deg, ${COLORS.lavender}44 0%, ${COLORS.sky} 100%)` }}
            >
              {[
                { title: 'Read Together', desc: 'Follow along with our current book pick and read at your own pace.' },
                { title: 'Share Thoughts', desc: 'Discuss chapters, share reactions, and explore ideas with the community.' },
                { title: 'Meet Book Lovers', desc: 'Connect with fellow readers who share your love of stories and learning.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
                    <Sparkles size={16} className="text-[#d7a9ff]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#3a2a35] mb-1">{item.title}</p>
                    <p className="text-sm text-[#5a3e50] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* CTA banner */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center rounded-3xl p-12 shadow-md"
            style={{ background: `linear-gradient(135deg, ${COLORS.blush} 0%, ${COLORS.lavender}44 100%)` }}
          >
            <BookMarked size={40} className="mx-auto text-[#d7a9ff] mb-4" />
            <h3 className="font-serif text-3xl text-[#3a2a35] mb-4">Ready to start reading?</h3>
            <p className="text-[#5a3e50] mb-8 max-w-lg mx-auto">
              Our book club is open to everyone — students, families, and community members. Join us on Fable today and be part of something meaningful.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#d7a9ff] hover:bg-[#c990ff] text-[#3a2a35] px-10 h-14 text-base font-semibold shadow-lg shadow-[#d7a9ff]/40"
            >
              <a
                href="https://fable.co/club/book-fairies-book-club-with-lauren-holbrook-265819939304"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <BookMarked size={20} />
                Join on Fable
                <ExternalLink size={16} />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
