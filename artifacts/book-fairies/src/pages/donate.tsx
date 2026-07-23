import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const COLORS = {
  pink: '#ffa6cb',
  blue: '#84caed',
  lavender: '#d7a9ff',
  blush: '#ffdae9',
  sky: '#e0f5ff',
};

export default function Donate() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col font-sans overflow-x-hidden">
      <Nav />

      {/* Page header */}
      <section
        className="pt-24 md:pt-40 pb-20 text-center"
        style={{ background: `linear-gradient(to right, ${COLORS.blush}, ${COLORS.sky})` }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <BookOpen className="w-12 h-12 mx-auto text-[#ffa6cb] mb-6" />
          <h1 className="font-serif text-5xl md:text-6xl text-[#3a2a35] mb-6">Donate Books</h1>
          <p className="text-lg text-[#5a3e50] leading-relaxed">
            Your donations help children discover new stories, improve literacy skills, and develop a lifelong love of reading.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-3xl text-[#3a2a35] text-center mb-12">How to Donate</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-14">
            {[
              {
                step: '1',
                title: 'Find Books',
                desc: 'Gather any books for ages 4–16 — new or gently used. Children\'s books, early readers, middle school novels, and educational materials are all welcome.',
                color: COLORS.pink,
              },
              {
                step: '2',
                title: 'Schedule a Pickup',
                desc: 'Pickup locations must be in the Milton / Alpharetta area. Pickups are available almost every Sunday — sign the form for your preferred date.',
                color: COLORS.blue,
                highlight: true,
              },
              {
                step: '3',
                title: 'We Handle the Rest',
                desc: 'That\'s it! Your books will be sorted and distributed directly to underserved schools and students across Fulton County.',
                color: COLORS.lavender,
              },
            ].map(s => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl p-8 flex flex-col gap-4 border"
                style={{ borderColor: s.color, background: s.highlight ? `${s.color}18` : '#fafafa' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: s.color }}>
                  {s.step}
                </div>
                <h3 className="font-serif text-xl text-[#3a2a35]">{s.title}</h3>
                {s.highlight && (
                  <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white w-fit" style={{ backgroundColor: s.color }}>
                    Milton / Alpharetta Area Only
                  </span>
                )}
                <p className="text-[#5a3e50] text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full bg-[#ffa6cb] hover:bg-[#ff8ebc] text-white px-10 h-14 text-base font-semibold shadow-lg shadow-[#ffa6cb]/30">
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSdzrZF9SlunOlqtGEx0u8JUyvZ_MrG_KsPEFxSjFN_dFTDxZg/viewform" target="_blank" rel="noopener noreferrer">
                Schedule a Pickup
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-2 border-[#84caed] text-[#3a2a35] hover:bg-[#84caed] hover:text-white px-10 h-14 text-base font-semibold bg-transparent">
              <a href="https://docs.google.com/forms/d/e/1FAIpQLScEBwegpIED_wqzXoCtpxj2ZuQLRsIo4itJ911LsKWIKIEMdw/viewform" target="_blank" rel="noopener noreferrer">
                Request Books
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* What we accept */}
      <section className="py-20" style={{ background: `linear-gradient(to bottom, #f0fbff, #ffffff)` }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-3xl text-[#3a2a35] text-center mb-12">What We Accept</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Picture Books', range: 'Ages 4–7', color: COLORS.pink },
              { label: 'Early Readers', range: 'Ages 6–9', color: COLORS.blue },
              { label: 'Middle Grade', range: 'Ages 8–12', color: COLORS.lavender },
              { label: 'Young Adult', range: 'Ages 13–16', color: '#c9a96e' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100"
              >
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${item.color}22` }}>
                  <BookOpen size={22} style={{ color: item.color }} />
                </div>
                <p className="font-serif text-lg text-[#3a2a35] font-semibold">{item.label}</p>
                <p className="text-sm text-[#5a3e50] mt-1">{item.range}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-[#5a3e50] mt-8 text-base">
            We accept new and gently used books. Educational materials and workbooks are also welcome!
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#e0f5ff]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-4xl text-[#3a2a35] text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              { q: 'Where are the books donated?', a: 'Books are distributed to underserved schools, students, and community organizations throughout Fulton County.' },
              { q: 'What books are most needed?', a: 'We take all books! Children\'s books, early readers, middle school novels, and educational materials are always appreciated.' },
              { q: 'How do I schedule a pickup?', a: 'Book pickups are available almost every Sunday in the Milton / Alpharetta area. Click "Schedule a Pickup" above to sign the form for your preferred date.' },
              { q: 'Can I drop off books instead?', a: 'Reach out to us at bookfairiesgeorgia@gmail.com and we can coordinate a drop-off location that works for both of us.' },
              { q: 'How can organizations partner with Book Fairies?', a: 'Schools, businesses, and local organizations can contact us to organize donation drives or literacy initiatives.' },
              { q: 'Can students volunteer to help?', a: 'Yes! Student volunteers are welcome and may earn community service hours. Email bookfairiesgeorgia@gmail.com to learn more.' },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-white rounded-2xl border-none shadow-sm px-6">
                <AccordionTrigger className="text-[#3a2a35] hover:text-[#ffa6cb] font-medium text-left hover:no-underline py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#5a3e50] pb-6 leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
}
