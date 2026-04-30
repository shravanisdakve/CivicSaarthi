import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation.js';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
];

export default function LanguageToggle() {
  const { language: currentLang, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null); // Ref for the dropdown menu container

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]); // Depend on isOpen to add/remove listeners correctly

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const activeLang = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container transition-colors border border-slate-200 text-xs font-bold text-on-surface"
      >
        <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
          language
        </span>
        <span className="uppercase">{activeLang.code}</span>
        <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
          expand_more
        </span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-card border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-200"
          role="listbox"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={currentLang === lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center justify-between hover:bg-slate-50 transition-colors ${
                currentLang === lang.code ? 'text-primary bg-primary/5' : 'text-on-surface'
              }`}
            >
              <span>{lang.label}</span>
              {currentLang === lang.code && (
                <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                  check
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
