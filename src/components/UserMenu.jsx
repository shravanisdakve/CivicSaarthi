import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, clearProfile } from '../utils/profileStorage.js';
import { PERSONAS } from '../data/personas.js';

export default function UserMenu({ profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const persona = PERSONAS.find(p => p.id === profile.selectedPersona) || PERSONAS[0];
  const initials = profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleSignOut = () => {
    clearProfile();
    setIsOpen(false);
    navigate('/');
  };

  const handleDownloadSummary = async () => {
    const { downloadReadinessSummary } = await import('../utils/summaryExport.js');
    const { checklistItems } = await import('../data/checklist.js');
    
    const itemsWithStatus = checklistItems.map(i => ({ 
      ...i, 
      completed: !!(profile.checklistProgress || {})[i.id] 
    }));
    
    const completedCount = Object.values(profile.checklistProgress || {}).filter(Boolean).length;
    const percentage = Math.round((completedCount / 7) * 100);

    downloadReadinessSummary({
      persona: profile.selectedPersona,
      checklistItems: itemsWithStatus,
      readinessPercent: percentage,
      nextAction: 'Review your checklist to complete pending steps.'
    });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-surface-container-low hover:bg-slate-200 py-1.5 px-3 rounded-full border border-slate-200 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold overflow-hidden">
          {profile.avatar ? <img src={profile.avatar} alt="Avatar" /> : initials}
        </div>
        <div className="hidden sm:flex flex-col items-start leading-none">
          <span className="text-xs font-semibold text-on-surface truncate max-w-[100px]">{profile.name}</span>
          <span className="text-[10px] font-bold text-primary">{profile.readinessPoints} pts</span>
        </div>
        <span className="material-symbols-outlined text-sm text-slate-500">expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <p className="font-bold text-on-surface">{profile.name}</p>
            <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px] text-primary">{persona.icon}</span>
              {persona.label}
            </p>
          </div>
          
          <div className="py-2">
            <button onClick={() => { navigate('/profile'); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-slate-50 flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-slate-400">person</span>
              My Civic Profile
            </button>
            <button onClick={() => { navigate('/checklist'); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-slate-50 flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-slate-400">checklist</span>
              Continue Checklist
            </button>
            <button onClick={() => { navigate('/assistant'); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-slate-50 flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-slate-400">smart_toy</span>
              Ask CivicSaarthi
            </button>
            <button onClick={handleDownloadSummary} className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-slate-50 flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-slate-400">download</span>
              Download Readiness Summary
            </button>
          </div>
          
          <div className="py-2 border-t border-slate-100">
            <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-semibold">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
