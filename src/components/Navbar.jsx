import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getProfile } from '../utils/guestProfile.js';
import { useTranslation } from '../hooks/useTranslation.js';
import GuestProfileChip from './GuestProfileChip.jsx';
import NamePromptModal from './NamePromptModal.jsx';
import LanguageToggle from './LanguageToggle.jsx';

const MAIN_LINKS = [
  { to: '/', label: 'nav.home' },
  { label: 'nav.assistant', isChat: true },
  { to: '/timeline', label: 'nav.timeline' },
  { to: '/checklist', label: 'nav.checklist' },
  { to: '/glossary', label: 'nav.glossary' },
  { to: '/quiz', label: 'nav.quiz' },
];

const MORE_LINKS = [
  { to: '/map', label: 'nav.map' },
  { to: '/sources', label: 'nav.sources' },
  { to: '/quality', label: 'nav.quality' },
  { to: '/about', label: 'nav.about' },
];

const ALL_LINKS = [...MAIN_LINKS, ...MORE_LINKS];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [namePromptOpen, setNamePromptOpen] = useState(false);
  const [profile, setProfile] = useState(getProfile());
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [moreOpen, setMoreOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleProfileUpdate = () => setProfile(getProfile());
    const handleOpenAuth = () => setNamePromptOpen(true);
    
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setMoreOpen(false);
      }
    };

    window.addEventListener('civicProfileUpdated', handleProfileUpdate);
    window.addEventListener('civicOpenAuth', handleOpenAuth);
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('civicProfileUpdated', handleProfileUpdate);
      window.removeEventListener('civicOpenAuth', handleOpenAuth);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const closeNamePrompt = () => setNamePromptOpen(false);

  const handleStartGuide = () => {
    const seen = localStorage.getItem('civicIntroSeen') === 'true';
    if (!seen) {
      window.dispatchEvent(new CustomEvent('civicOpenIntro'));
    } else {
      window.dispatchEvent(new CustomEvent('civicOpenChat', { detail: { mode: 'guide' } }));
    }
  };

  const handleAssistantClick = () => {
    window.dispatchEvent(new CustomEvent('civicOpenChat'));
  };

  const linkClass = ({ isActive }) =>
    `font-['Public_Sans'] text-sm tracking-tight transition-colors pb-1 ${
      isActive
        ? 'text-primary font-semibold border-b-2 border-primary'
        : 'text-slate-600 hover:text-primary'
    }`;

  const isSignedIn = profile.authProvider !== 'none';

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#F8F9FA] border-b border-slate-200 shadow-[0px_4px_20px_rgba(26,35,126,0.05)]">
        <div className="flex items-center justify-between px-6 md:px-8 py-3 max-w-screen-xl mx-auto">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2 group flex-shrink-0">
            <img src="/logo.svg" alt="CivicSaarthi Logo" className="w-7 h-7 transition-transform group-hover:scale-110" />
            <span className="text-lg font-extrabold tracking-tight text-primary font-['Public_Sans']">
              CivicSaarthi
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-3 xl:gap-5" aria-label="Main navigation">
            {MAIN_LINKS.map((link) => {
              if (link.isChat) {
                return (
                  <button 
                    key="nav-assistant"
                    onClick={handleAssistantClick}
                    className="font-['Public_Sans'] text-xs font-medium tracking-tight transition-colors pb-1 text-slate-600 hover:text-primary whitespace-nowrap"
                  >
                    {t(link.label)}
                  </button>
                );
              }
              return (
                <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
                  {t(link.label)}
                </NavLink>
              );
            })}
            
            {/* More Dropdown */}
            <div className="relative group" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
              <button 
                className={`font-['Public_Sans'] text-xs font-medium tracking-tight transition-colors pb-1 flex items-center gap-1 ${moreOpen ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
                aria-haspopup="true"
                aria-expanded={moreOpen}
              >
                More <span className="material-symbols-outlined text-[14px]">expand_more</span>
              </button>
              {moreOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-xl py-2 flex flex-col z-50">
                  {MORE_LINKS.map(link => (
                    <NavLink 
                      key={link.to} 
                      to={link.to} 
                      className={({ isActive }) => `px-4 py-2 text-sm transition-colors ${isActive ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}`}
                      onClick={() => setMoreOpen(false)}
                    >
                      {t(link.label)}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Actions */}
          <div className="hidden xl:flex items-center gap-3">
            <LanguageToggle />
            
            <button
              onClick={handleStartGuide}
              className="text-[10px] font-bold text-primary px-3 py-1.5 rounded-lg hover:bg-surface-container-low transition-colors whitespace-nowrap uppercase tracking-wider"
            >
              {t('cta.startGuide')}
            </button>
            
            <GuestProfileChip profile={profile} onOpenNamePrompt={() => setNamePromptOpen(true)} />
          </div>

          {/* Mobile Hamburger */}
          <div className="xl:hidden flex items-center gap-3">
            <LanguageToggle />
            <button
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className="material-symbols-outlined" aria-hidden="true">{menuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav
            ref={menuRef}
            className="xl:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4 absolute w-full shadow-lg"
            aria-label="Mobile navigation"
          >
            {ALL_LINKS.map((link) => {
              if (link.isChat) {
                return (
                  <button 
                    key="mobile-nav-assistant"
                    onClick={() => { 
                      handleAssistantClick();
                      setMenuOpen(false);
                    }}
                    className="font-['Public_Sans'] text-sm tracking-tight transition-colors pb-1 text-slate-600 hover:text-primary text-left font-medium"
                  >
                    {t(link.label)}
                  </button>
                );
              }
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {t(link.label)}
                </NavLink>
              );
            })}
            <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
              <GuestProfileChip profile={profile} onOpenNamePrompt={() => { setNamePromptOpen(true); setMenuOpen(false); }} />
              
              <button
                onClick={() => { handleStartGuide(); setMenuOpen(false); }}
                className="bg-primary text-white text-sm font-semibold py-2 rounded-full"
              >
                {t('cta.startGuide')}
              </button>
            </div>
          </nav>
        )}
      </header>

      <NamePromptModal isOpen={namePromptOpen} onClose={closeNamePrompt} />
    </>
  );
}
