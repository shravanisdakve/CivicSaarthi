import { useState, useRef, useEffect } from 'react';
import { glossaryTerms } from '../data/glossary.js';
import Card from './Card.jsx';
import Button from './Button.jsx';
import { useNavigate } from 'react-router-dom';

export default function CivicTerm({ termId, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const term = glossaryTerms.find(t => t.id === termId);
  const navigate = useNavigate();
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!term) return children;

  return (
    <span className="relative inline-block group/term">
      <button
        type="button"
        id={`civic-term-btn-${termId}`}
        aria-label={`Show definition for ${term.term}`}
        aria-expanded={isOpen}
        aria-describedby={isOpen ? `civic-term-popup-${termId}` : undefined}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="underline decoration-primary/30 decoration-2 underline-offset-4 hover:decoration-primary transition-all cursor-help font-bold text-primary"
      >
        {children}
      </button>

      {isOpen && (
        <div 
          ref={tooltipRef}
          id={`civic-term-popup-${termId}`}
          role="dialog"
          aria-modal="false"
          aria-labelledby={`civic-term-title-${termId}`}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 sm:w-80 z-[60] animate-in fade-in zoom-in duration-200"
        >
          <Card className="p-5 bg-white border border-slate-200 shadow-2xl overflow-hidden relative" hover={false}>
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            <div className="flex items-center justify-between mb-2">
              <h4 id={`civic-term-title-${termId}`} className="font-bold text-sm text-on-surface truncate pr-4">{term.term}</h4>
              <button 
                onClick={() => setIsOpen(false)}
                aria-label={`Close ${term.term} definition`}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              {term.fullForm}
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4 line-clamp-3">
              {term.definition}
            </p>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-[10px] py-1 h-auto flex-1"
                onClick={() => navigate('/glossary')}
              >
                Glossary
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="text-[10px] py-1 h-auto flex-1"
                onClick={() => navigate(`/assistant?prompt=Explain ${term.term} simply`)}
              >
                Ask AI
              </Button>
            </div>
          </Card>
          {/* Arrow */}
          <div className="w-3 h-3 bg-white border-b border-r border-slate-200 absolute left-1/2 -translate-x-1/2 -bottom-1.5 rotate-45 shadow-sm"></div>
        </div>
      )}
    </span>
  );
}
