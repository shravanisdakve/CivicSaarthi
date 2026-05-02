import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation.js';
import Card from './Card.jsx';
import Button from './Button.jsx';

export default function GlossaryModal({ isOpen, term, onClose, onRelatedClick }) {
  const modalRef = useRef(null);
  const [askInput, setAskInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiError, setAiError] = useState(false);
  const { language: lang } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const askInline = useCallback(async (question) => {
    if (!question.trim() || isAsking) return;
    setIsAsking(true);
    setAiResponse('');
    setAiError(false);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, language: lang }),
      });
      const data = await res.json();
      setAiResponse(data.response || data.error || 'No response received.');
    } catch {
      setAiError(true);
      setAiResponse('Could not reach CivicSaarthi AI. Please check your connection.');
    } finally {
      setIsAsking(false);
    }
  }, [isAsking, lang]);

  const handleAsk = (e) => {
    e.preventDefault();
    askInline(askInput);
    setAskInput('');
  };

  if (!isOpen || !term) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto outline-none animate-in zoom-in duration-300 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="glossary-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-8 py-6 flex justify-between items-start border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Official-source guided
              </span>
            </div>
            <h2 id="glossary-modal-title" className="text-3xl font-black text-slate-900 font-['Public_Sans']">
              {term.term}
            </h2>
            <p className="text-slate-500 font-medium">{term.fullForm}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8 overflow-y-auto">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Main Content (Left) */}
            <div className="md:col-span-2 space-y-8">
              {/* Definition Box */}
              <Card className="p-6" hover={false} accent={true}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-sm">menu_book</span>
                  <span className="text-xs font-bold tracking-widest uppercase text-primary">
                    Definition
                  </span>
                </div>
                <p className="text-on-surface text-base leading-relaxed">{term.definition}</p>
              </Card>

              {/* How it Works */}
              {term.howItWorks && (
                <div>
                  <h3 className="font-['Public_Sans'] text-xl font-bold text-on-surface mb-5">
                    How it Works
                  </h3>
                  <Card className="p-6" hover={false}>
                    <div className="space-y-6">
                      {term.howItWorks.map((step, idx) => (
                        <div key={idx} className="flex gap-4 relative">
                          {idx !== term.howItWorks.length - 1 && (
                            <div className="absolute left-[13px] top-8 bottom-[-24px] w-0.5 bg-slate-200"></div>
                          )}
                          <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 z-10">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-on-surface mb-1">{step.step}</h4>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                              {step.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* Why it Matters */}
              {term.whyItMatters && (
                <div className="bg-primary-fixed-dim/20 rounded-2xl p-6 border border-primary-fixed-dim/30">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary">verified_user</span>
                    <h4 className="font-['Public_Sans'] font-semibold text-on-surface">
                      Why it Matters
                    </h4>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{term.whyItMatters}</p>
                </div>
              )}
            </div>

            {/* Sidebar (Right) */}
            <aside className="space-y-6">
              {/* Ask AI Box */}
              <div className="bg-surface-container-low rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary">smart_toy</span>
                  <h4 className="font-['Public_Sans'] font-semibold text-on-surface">
                    Ask AI
                  </h4>
                </div>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Still confused? Ask a specific question about {term.term}.
                </p>

                <form onSubmit={handleAsk} className="mb-4">
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <input
                      type="text"
                      placeholder="Ask anything..."
                      className="w-full px-3 py-2 text-sm outline-none bg-transparent"
                      value={askInput}
                      onChange={(e) => setAskInput(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={isAsking || !askInput.trim()}
                      className="bg-primary text-white p-2 flex items-center justify-center hover:bg-primary-container disabled:opacity-70 transition-colors"
                    >
                      {isAsking ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <span className="material-symbols-outlined text-sm">send</span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Inline AI Response */}
                {isAsking && (
                  <div className="flex gap-1 mt-2 mb-3 px-1">
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}
                {aiResponse && !isAsking && (
                  <div
                    className={`mt-2 mb-3 p-3 rounded-xl text-xs leading-relaxed ${
                      aiError
                        ? 'bg-red-50 text-red-700 border border-red-100'
                        : 'bg-primary/5 text-on-surface border border-primary/10'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{aiResponse}</p>
                  </div>
                )}
              </div>

              {/* Related Terms */}
              {term.relatedTerms && term.relatedTerms.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <h4 className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-4">
                    Related Terms
                  </h4>
                  <div className="flex flex-col gap-2">
                    {term.relatedTerms.map((rtId) => (
                      <button
                        key={rtId}
                        onClick={() => onRelatedClick(rtId)}
                        className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 hover:text-primary transition-colors text-sm text-on-surface text-left"
                      >
                        <span className="capitalize">{rtId.replace(/-/g, ' ')}</span>
                        <span className="material-symbols-outlined text-sm text-slate-300">
                          arrow_forward
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
           <Button variant="outline" onClick={onClose} className="px-8">
             Close
           </Button>
        </div>
      </div>
    </div>
  );
}
