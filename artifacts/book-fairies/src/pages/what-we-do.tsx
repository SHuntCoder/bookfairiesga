import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const COLORS = {
  pink: '#ffa6cb',
  blue: '#84caed',
  lavender: '#d7a9ff',
  gold: '#c9a96e',
};

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

export default function WhatWeDo() {
  const counterRef = useRef<HTMLDivElement>(null);
  const [counterVisible, setCounterVisible] = useState(false);
  const stored = typeof window !== 'undefined' ? Number(localStorage.getItem('bookfairies_book_count') || 4000) : 4000;
  const bookCount = useCountUp(stored, 2200, counterVisible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCounterVisible(true); },
      { threshold: 0.3 }
    );
    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans overflow-x-hidden">
      <Nav />

      {/* Page header */}
      <section
        className="pt-40 pb-20 text-center"
        style={{ background: `linear-gradient(to bottom, #e0f5ff, #ffffff)` }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-[#ffa6cb] text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            Our Programs
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-[#3a2a35] mb-6">What We Do</h1>
          <p className="text-lg text-[#5a3e50] leading-relaxed">
            Building stronger communities through the power of literacy and shared stories.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Community Book Drives',
                desc: 'We organize book drives throughout schools, neighborhoods, and local organizations to collect new and gently used books for children of all ages. Every donated book makes a difference in a child\'s life.',
                color: COLORS.pink,
                num: '01',
              },
              {
                title: 'Book Distribution',
                desc: 'Donated books are carefully sorted and distributed to underserved schools, community centers, and youth programs throughout Fulton County — getting books into the hands of kids who need them most.',
                color: COLORS.blue,
                num: '02',
              },
              {
                title: 'Volunteer Opportunities',
                desc: 'Students and community members can help organize donations, sort books, and support literacy events. Volunteers earn community service hours and make a real impact in their neighborhoods.',
                color: COLORS.lavender,
                num: '03',
              },
              {
                title: 'Literacy Advocacy',
                desc: 'We work to raise awareness about childhood literacy and the importance of equal access to educational resources. Every child deserves the chance to discover the joy of reading.',
                color: COLORS.gold,
                num: '04',
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden bg-white"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: card.color }} />
                <span className="font-serif text-5xl font-bold opacity-10 absolute top-6 right-8" style={{ color: card.color }}>
                  {card.num}
                </span>
                <h3 className="font-serif text-2xl text-[#3a2a35] mb-4 mt-2">{card.title}</h3>
                <p className="text-[#5a3e50] leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact counter */}
      <section className="py-24 bg-[#3a2a35] text-white" ref={counterRef}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">Our Impact</h2>
            <p className="text-gray-400">Growing every single day.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#ffa6cb] mb-4 tabular-nums">
                {bookCount.toLocaleString()}+
              </div>
              <div className="text-sm md:text-base text-gray-300 uppercase tracking-wide font-medium leading-snug">
                Books collected
              </div>
            </motion.div>
            {[
              { stat: 'Fulton County', text: 'Expanding across the whole county' },
              { stat: 'Many', text: 'Student-led volunteer initiatives' },
              { stat: 'Every Sunday', text: 'Pickups available nearly every week' },
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

      {/* Partner */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-4xl text-[#3a2a35] mb-6">Partner With Us</h2>
          <p className="text-lg text-[#5a3e50] mb-10">
            Book Fairies partners with schools, libraries, local businesses, and nonprofit organizations to expand access to books and educational resources. Together, we can help create brighter futures through literacy.
          </p>
          <a
            href="mailto:bookfairiesgeorgia@gmail.com"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full border-2 border-[#d7a9ff] text-[#3a2a35] hover:bg-[#d7a9ff] hover:text-white transition-colors text-base font-semibold"
          >
            Become a Partner
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
