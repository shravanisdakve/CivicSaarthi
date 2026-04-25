import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/assistant', label: 'Assistant' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/checklist', label: 'Checklist' },
  { to: '/glossary', label: 'Glossary' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/sources', label: 'Sources' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `font-['Public_Sans'] text-sm tracking-tight transition-colors pb-1 ${
      isActive
        ? 'text-primary font-semibold border-b-2 border-primary'
        : 'text-slate-600 hover:text-primary'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F8F9FA] border-b border-slate-200 shadow-[0px_4px_20px_rgba(26,35,126,0.05)]">
      <div className="flex items-center justify-between px-6 md:px-8 py-4 max-w-screen-xl mx-auto">
        {/* Brand */}
        <NavLink to="/" className="text-xl font-extrabold tracking-tight text-primary font-['Public_Sans']">
          CivicSaarthi
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/assistant')}
            className="text-sm font-semibold text-primary px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            Ask AI
          </button>
          <button
            onClick={() => navigate('/choose-path')}
            className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-primary-container transition-colors"
          >
            Start Guide
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav
          className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => { navigate('/assistant'); setMenuOpen(false); }}
              className="flex-1 text-sm font-semibold text-primary border border-primary py-2 rounded-full"
            >
              Ask AI
            </button>
            <button
              onClick={() => { navigate('/choose-path'); setMenuOpen(false); }}
              className="flex-1 bg-primary text-white text-sm font-semibold py-2 rounded-full"
            >
              Start Guide
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
