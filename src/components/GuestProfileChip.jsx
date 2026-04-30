import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearGuestName } from '../utils/profileStorage.js';
import { useTranslation } from '../hooks/useTranslation.js';
import { signOut } from '../utils/auth.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function GuestProfileChip({ profile, onOpenNamePrompt }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasName = profile.name && profile.name !== 'Guest Citizen';
  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleClear = async () => {
    if (user) {
      await signOut();
    } else {
      clearGuestName();
    }
    setIsOpen(false);
    window.location.reload(); // Refresh to clear all states
  };

  const handleDownloadSummary = async () => {
    const { downloadReadinessSummary } = await import('../utils/summaryExport.js');
    const { checklistItems } = await import('../data/checklist.js');

    const itemsWithStatus = checklistItems.map((i) => ({
      ...i,
      completed: !!(profile.checklistProgress || {})[i.id],
    }));

    downloadReadinessSummary({
      persona: profile.selectedPersona,
      checklistItems: itemsWithStatus,
      readinessPercent: Math.round(
        (Object.values(profile.checklistProgress || {}).filter(Boolean).length / 7) * 100
      ),
      nextAction: 'Review your checklist to complete pending steps.',
    });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-white hover:bg-slate-50 py-2 px-4 rounded-xl border border-slate-200 transition-all shadow-sm group"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black overflow-hidden border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          ) : hasName ? (
            initials
          ) : (
            <span className="material-symbols-outlined text-[14px]">person</span>
          )}
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {hasName ? t('profile.hi') : t('profile.browsingAs')}
          </span>
          <span className="text-sm font-extrabold text-slate-900 truncate max-w-[120px]">
            {hasName ? profile.name : t('profile.guest')}
          </span>
        </div>
        <span className="material-symbols-outlined text-sm text-slate-400 group-hover:text-primary transition-colors">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-5 border-b border-slate-50 bg-slate-50/50">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
              {t('profile.yourProgress')}
            </p>
            <div className="flex items-center justify-between">
              <p className="font-extrabold text-slate-900">{profile.name}</p>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {profile.readinessPoints} pts
              </span>
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                onOpenNamePrompt();
                setIsOpen(false);
              }}
              className="w-full text-left px-5 py-3 text-sm text-primary hover:bg-primary/5 flex items-center gap-3 transition-colors font-bold border-b border-slate-50"
            >
              <span className="material-symbols-outlined text-[20px] text-primary icon-fill">
                account_circle
              </span>
              {user ? 'Signed in with Google' : 'Sign in with Google'}
            </button>
            <button
              onClick={() => {
                navigate('/checklist');
                setIsOpen(false);
              }}
              className="w-full text-left px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-slate-400">
                checklist
              </span>
              {t('profile.myChecklist')}
            </button>
            <button
              onClick={handleDownloadSummary}
              className="w-full text-left px-5 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-slate-400">download</span>
              {t('profile.downloadSummary')}
            </button>
            <div className="h-px bg-slate-50 my-1 mx-5"></div>
            <button
              onClick={handleClear}
              className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-semibold"
            >
              <span className="material-symbols-outlined text-[20px] text-red-400">
                {user ? 'logout' : 'delete_sweep'}
              </span>
              {user ? 'Sign Out from Google' : 'Clear Guest Session'}
            </button>
          </div>

          <div className="p-4 bg-slate-900 text-[10px] text-slate-400 leading-relaxed">
            <p className="flex items-center gap-1 font-bold text-white mb-1 uppercase tracking-widest">
              <span className="material-symbols-outlined text-[14px]">shield</span>{' '}
              {t('safety.sensitive').split('.')[0]}
            </p>
            {t('profile.privacyNote')}
          </div>
        </div>
      )}
    </div>
  );
}
