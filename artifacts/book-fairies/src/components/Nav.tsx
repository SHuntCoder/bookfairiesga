import { Link, useLocation } from 'wouter';

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <img src="/logo.png" alt="Book Fairies logo" className="w-10 h-10 object-contain" />
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold text-[#5a3e50] tracking-tight">Book Fairies</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffa6cb]">Fulton County, GA</span>
          </div>
        </Link>
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
        <div className="md:hidden">
          <Link to="/donate" className="text-sm font-semibold text-[#ffa6cb]">Donate</Link>
        </div>
      </div>
    </nav>
  );
}
