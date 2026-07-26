import { Mail, Facebook, Instagram, Lock } from 'lucide-react';

interface FooterProps {
  devAuthed?: boolean;
  onDevClick?: () => void;
}

export default function Footer({ devAuthed, onDevClick }: FooterProps) {
  return (
    <footer id="contact" className="bg-[#3a2a35] pt-20 pb-8 text-white border-t-8 border-[#ffa6cb]">
      <div className="max-w-4xl mx-auto px-6 text-center mb-16">
        <img src="/logo-transparent.png" alt="Book Fairies" className="w-16 h-16 object-contain mx-auto mb-6 opacity-80" />
        <h2 className="font-serif text-4xl md:text-5xl mb-6">Contact Book Fairies</h2>
        <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
          Interested in donating, volunteering, or partnering with us? We'd love to hear from you.
        </p>
        <div className="mb-8">
          <a
            href="mailto:bookfairiesgeorgia@gmail.com"
            className="inline-flex items-center gap-3 text-[#ffa6cb] hover:text-white transition-colors text-lg font-medium"
          >
            <Mail size={22} />
            bookfairiesgeorgia@gmail.com
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="mailto:bookfairiesgeorgia@gmail.com" className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-600 hover:border-white hover:bg-white/10 transition-colors">
            <Mail size={20} /><span>Send an Email</span>
          </a>
          <a href="https://www.instagram.com/bookfairiesgeorgia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-600 hover:border-white hover:bg-white/10 transition-colors">
            <Instagram size={20} /><span>@bookfairiesgeorgia</span>
          </a>
          <a href="https://www.facebook.com/bookfairiesgeorgia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-600 hover:border-white hover:bg-white/10 transition-colors">
            <Facebook size={20} /><span>@bookfairiesgeorgia</span>
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500 border-t border-white/10 pt-8 flex flex-col items-center gap-3">
        <p>© {new Date().getFullYear()} Book Fairies · Fulton County, Georgia · Creating Passion One Page at a Time</p>
        {onDevClick && (
          <button
            onClick={onDevClick}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors"
            data-testid="dev-login-button"
          >
            <Lock size={11} />
            {devAuthed ? 'Manage Photos' : 'Developer Login'}
          </button>
        )}
      </div>
    </footer>
  );
}
