import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getProfile } from '../utils/profileStorage.js';
import { useTranslation } from '../hooks/useTranslation.js';
import AuthModal from './AuthModal.jsx';
import UserMenu from './UserMenu.jsx';
import LanguageToggle from './LanguageToggle.jsx';

const NAV_LINKS = [
  { to: '/', label: 'nav.home' },
  { label: 'nav.assistant', isChat: true },
  { to: '/timeline', label: 'nav.timeline' },
  { to: '/checklist', label: 'nav.checklist' },
  { to: '/glossary', label: 'nav.glossary' },
  { to: '/quiz', label: 'nav.quiz' },
  { to: '/map', label: 'nav.map' },
  { to: '/sources', label: 'nav.sources' },
  { to: '/quality', label: 'nav.quality' },
  { to: '/about', label: 'nav.about' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profile, setProfile] = useState(getProfile());
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loginBtnRef = useRef(null);

  useEffect(() => {
    const handleProfileUpdate = () => setProfile(getProfile());
    const handleOpenAuth = () => setAuthModalOpen(true);

    window.addEventListener('civicProfileUpdated', handleProfileUpdate);
    window.addEventListener('civicOpenAuth', handleOpenAuth);

    return () => {
      window.removeEventListener('civicProfileUpdated', handleProfileUpdate);
      window.removeEventListener('civicOpenAuth', handleOpenAuth);
    };
  }, []);

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    // Return focus to login button
    if (loginBtnRef.current) {
      loginBtnRef.current.focus();
    }
  };

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
          <NavLink to="/" className="flex items-center gap-2 group">
            <img src="/logo.svg" alt="CivicSaarthi Logo" className="w-8 h-8 transition-transform group-hover:scale-110" />
            <span className="text-xl font-extrabold tracking-tight text-primary font-['Public_Sans']">
              CivicSaarthi
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              if (link.isChat) {
                return (
                  <button 
                    key="nav-assistant"
                    onClick={handleAssistantClick}
                    className="font-['Public_Sans'] text-sm tracking-tight transition-colors pb-1 text-slate-600 hover:text-primary whitespace-nowrap"
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
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageToggle />
            
            <button
              onClick={handleStartGuide}
              className="text-xs font-semibold text-primary px-3 py-1.5 rounded-lg hover:bg-surface-container-low transition-colors whitespace-nowrap"
            >
              {t('cta.startGuide')}
            </button>
            
            {isSignedIn ? (
              <UserMenu profile={profile} />
            ) : (
              <button
                ref={loginBtnRef}
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-extrabold px-4 py-2 rounded-xl hover:bg-white hover:border-primary hover:text-primary transition-all shadow-sm uppercase tracking-widest group"
              >
                <div className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center text-[10px] text-white group-hover:bg-primary transition-colors">
                   <span className="material-symbols-outlined text-[14px]">person</span>
                </div>
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center gap-3">
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
            className="lg:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => {
              if (link.isChat) {
                return (
                  <button 
                    key="mobile-nav-assistant"
                    onClick={() => { 
                      handleAssistantClick();
                      setMenuOpen(false);
                    }}
                    className="font-['Public_Sans'] text-sm tracking-tight transition-colors pb-1 text-slate-600 hover:text-primary text-left"
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
              {isSignedIn ? (
                <div className="flex items-center justify-between">
                  <UserMenu profile={profile} />
                </div>
              ) : (
                <button
                  onClick={() => { setAuthModalOpen(true); setMenuOpen(false); }}
                  className="flex items-center justify-center gap-2.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-extrabold py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-sm uppercase tracking-widest"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center text-[10px] text-white">
                    <span className="material-symbols-outlined text-[14px]">person</span>
                  </div>
                  <span>Login</span>
                </button>
              )}
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

      <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} />
    </>
  );
}
