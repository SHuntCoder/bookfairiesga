import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const COLORS = {
  pink: '#ffa6cb',
  blue: '#84caed',
  lavender: '#d7a9ff',
  sky: '#e0f5ff',
  blush: '#ffdae9',
  gold: '#c9a96e',
};

export default function Volunteer() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans overflow-x-hidden">
      <Nav />

      {/* Page header */}
      <section
        className="pt-40 pb-20 text-center"
        style={{ background: `linear-gradient(to bottom, ${COLORS.sky}, #ffffff)` }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-[#84caed] text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            Get Involved
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-[#3a2a35] mb-6">Volunteer</h1>
          <p className="text-lg text-[#5a3e50] leading-relaxed">
            Volunteers are the heart of the Book Fairies mission. Join us and help bring books to children who need them most.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-20 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start mb-20">

            <div>
              <h2 className="font-serif text-4xl text-[#3a2a35] mb-6">How You Can Help</h2>
              <p className="text-[#5a3e50] text-lg leading-relaxed mb-8">
                Whether you are helping collect books, organize donations, or participate in community outreach, your support helps us reach more students across the community. Every contribution — big or small — makes a real difference.
              </p>
              <ul className="space-y-6">
                {[
                  { text: 'Organize a book drive in your school, neighborhood, or organization', color: COLORS.pink },
                  { text: 'Sign up for a pickup — we\'ll handle the rest', color: COLORS.blue },
                  { text: 'Promote literacy initiatives in your community', color: COLORS.lavender },
                  { text: 'Support social media and outreach efforts', color: COLORS.gold },
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 text-lg text-[#5a3e50]"
                  >
                    <div className="mt-2 flex-shrink-0 w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl p-10 text-center shadow-lg"
              style={{ background: `linear-gradient(135deg, ${COLORS.lavender}22 0%, ${COLORS.blue}22 100%)` }}
            >
              <Users className="w-12 h-12 mx-auto text-[#84caed] mb-6" />
              <h3 className="font-serif text-3xl text-[#3a2a35] mb-4">Earn Service Hours</h3>
              <p className="text-[#5a3e50] mb-8 text-lg leading-relaxed">
                Students are welcome to volunteer with Book Fairies and earn community service hours through participation. Reach out to request opportunities.
              </p>
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto rounded-full bg-[#84caed] hover:bg-[#6ab9e3] text-white px-8 h-14 text-base font-semibold"
              >
                <a href="mailto:bookfairiesgeorgia@gmail.com">Email Us to Volunteer</a>
              </Button>
            </motion.div>
          </div>

          {/* Steps */}
          <div className="rounded-3xl p-10 md:p-14" style={{ background: `linear-gradient(135deg, ${COLORS.blush} 0%, ${COLORS.sky} 100%)` }}>
            <h2 className="font-serif text-3xl text-[#3a2a35] text-center mb-10">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Reach Out', desc: 'Email us at bookfairiesgeorgia@gmail.com to express your interest and let us know how you\'d like to help.', color: COLORS.pink },
                { step: '2', title: 'Get Matched', desc: 'We\'ll connect you with a volunteer opportunity that fits your schedule, skills, and interests.', color: COLORS.blue },
                { step: '3', title: 'Make an Impact', desc: 'Show up, help out, and make a real difference in the lives of children throughout Fulton County.', color: COLORS.lavender },
              ].map(s => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl p-8 shadow-sm text-center"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4" style={{ backgroundColor: s.color }}>
                    {s.step}
                  </div>
                  <h3 className="font-serif text-xl text-[#3a2a35] mb-3">{s.title}</h3>
                  <p className="text-[#5a3e50] text-sm leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
