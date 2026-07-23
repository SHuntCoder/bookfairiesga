import { motion } from 'framer-motion';
import { Mail, Instagram, Facebook } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const COLORS = {
  pink: '#ffa6cb',
  blush: '#ffdae9',
  sky: '#e0f5ff',
};

export default function Contact() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans overflow-x-hidden">
      <Nav />

      <section
        className="pt-40 pb-20 text-center"
        style={{ background: `linear-gradient(135deg, ${COLORS.blush} 0%, ${COLORS.sky} 100%)` }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-[#ffa6cb] text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            Reach Out
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-[#3a2a35] mb-6">Contact Us</h1>
          <p className="text-lg text-[#5a3e50] leading-relaxed">
            Interested in donating, volunteering, or partnering with us? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white flex-1">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: <Mail size={28} />,
                label: 'Email',
                value: 'bookfairiesgeorgia@gmail.com',
                href: 'mailto:bookfairiesgeorgia@gmail.com',
                color: COLORS.pink,
              },
              {
                icon: <Instagram size={28} />,
                label: 'Instagram',
                value: '@bookfairiesgeorgia',
                href: 'https://www.instagram.com/bookfairiesgeorgia',
                color: '#d7a9ff',
              },
              {
                icon: <Facebook size={28} />,
                label: 'Facebook',
                value: '@bookfairiesgeorgia',
                href: 'https://www.facebook.com/bookfairiesgeorgia',
                color: '#84caed',
              },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                target={item.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="block rounded-3xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white group"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors"
                  style={{ backgroundColor: `${item.color}22`, color: item.color }}
                >
                  {item.icon}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: item.color }}>{item.label}</p>
                <p className="font-serif text-[#3a2a35] text-base font-medium break-all">{item.value}</p>
              </motion.a>
            ))}
          </div>

          {/* Message card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-10 md:p-14 text-center"
            style={{ background: `linear-gradient(135deg, ${COLORS.blush} 0%, ${COLORS.sky} 100%)` }}
          >
            <h2 className="font-serif text-3xl text-[#3a2a35] mb-4">Get in Touch</h2>
            <p className="text-[#5a3e50] text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              Whether you want to organize a book drive, explore a partnership, volunteer your time, or simply learn more about what we do — we're happy to connect.
            </p>
            <a
              href="mailto:bookfairiesgeorgia@gmail.com"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#ffa6cb] hover:bg-[#ff8ebc] text-white font-semibold text-base shadow-lg shadow-[#ffa6cb]/30 transition-colors"
            >
              <Mail size={20} />
              Send an Email
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
