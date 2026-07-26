import { Link, useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', to: '/' },
  { name: 'What We Do', to: '/what-we-do' },
  { name: 'Photos', to: '/photos' },
  { name: 'Book Club', to: '/book-club' },
  { name: 'Volunteer', to: '/volunteer' },
  { name: 'Donate', to: '/donate' },
  { name: 'Contact', to: '/contact' },
];

export default function Nav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 cursor-pointer">
            <img src="/logo-transparent.png" alt="Book Fairies logo" className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#5a3e50] tracking-tight">Book Fairies</span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#ffa6cb]">Fulton County, GA</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = link.to === '/' ? location === '/' : location.startsWith(link.to);
              return (
                <Link
                  key={link.name}
                  to={link.to}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-[#ffa6cb]' : 'text-[#5a3e50] hover:text-[#ffa6cb]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-full text-[#5a3e50] hover:bg-[#ffdae9]/40 transition-colors"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
          <span className="font-serif text-lg text-[#5a3e50] font-bold">Menu</span>
          <button
            className="flex items-center justify-center w-11 h-11 rounded-full text-[#5a3e50] hover:bg-[#ffdae9]/40 transition-colors"
            onClick={() => setOpen(false)}
          >
            <X size={22} />
          </button>
        </div>
        <nav className="flex flex-col px-4 pt-4 pb-8">
          {NAV_LINKS.map((link) => {
            const isActive = link.to === '/' ? location === '/' : location.startsWith(link.to);
            return (
              <Link
                key={link.name}
                to={link.to}
                className={`flex items-center px-4 py-4 rounded-2xl text-base font-medium transition-colors mb-1 ${
                  isActive
                    ? 'text-[#ffa6cb] bg-[#ffdae9]/40'
                    : 'text-[#5a3e50] hover:text-[#ffa6cb] hover:bg-[#ffdae9]/20'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="mt-6 px-4">
            <Link
              to="/donate"
              className="block w-full text-center bg-[#ffa6cb] hover:bg-[#ff8ebc] text-white font-semibold py-4 rounded-full transition-colors"
            >
              Donate Books
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
