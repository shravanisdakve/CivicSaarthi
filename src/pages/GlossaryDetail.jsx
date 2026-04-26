import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { glossaryTerms } from '../data/glossary.js';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';

export default function GlossaryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [askInput, setAskInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  
  const term = glossaryTerms.find((t) => t.id === id);

  if (!term) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Term not found</h1>
        <Button onClick={() => navigate('/glossary')}>Back to Glossary</Button>
      </div>
    );
  }

  const handleAsk = (e) => {
    e.preventDefault();
    if (!askInput.trim() || isAsking) return;
    setIsAsking(true);
    setTimeout(() => {
      navigate(`/assistant?prompt=${encodeURIComponent(askInput)}`);
      setIsAsking(false);
    }, 600);
  };

  const handleSuggested = (q) => {
    if (isAsking) return;
    setIsAsking(true);
    setTimeout(() => {
      navigate(`/assistant?prompt=${encodeURIComponent(q)}`);
      setIsAsking(false);
    }, 600);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/glossary" className="hover:text-primary transition-colors">Glossary</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="font-semibold text-on-surface">{term.term}</span>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Main Content (Left) */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Official-source guided
              </span>
              <a 
                href="https://voters.eci.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 hover:bg-blue-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                Verify with ECI
              </a>
            </div>
            <h1 className="font-['Public_Sans'] text-4xl md:text-5xl font-bold text-on-surface mb-2">{term.term}</h1>
            <p className="text-lg text-on-surface-variant">{term.fullForm}</p>
          </div>

          {/* Definition Box */}
          <Card className="p-6" hover={false} accent={true}>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-sm">menu_book</span>
              <span className="text-xs font-bold tracking-widest uppercase text-primary">Definition</span>
            </div>
            <p className="text-on-surface text-base leading-relaxed">{term.definition}</p>
          </Card>

          {/* How it Works (if available) */}
          {term.howItWorks && (
            <div>
              <h2 className="font-['Public_Sans'] text-2xl font-bold text-on-surface mb-5">How it Works</h2>
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
                        <h3 className="font-semibold text-on-surface mb-1">{step.step}</h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Why it Matters (if available) */}
          {term.whyItMatters && (
            <div className="bg-primary-fixed-dim/30 rounded-xl p-6 border border-primary-fixed-dim/50">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <h3 className="font-['Public_Sans'] font-semibold text-on-surface">Why it Matters</h3>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">{term.whyItMatters}</p>
            </div>
          )}
        </div>

        {/* Sidebar (Right) */}
        <aside className="space-y-6">
          {/* Ask AI Box */}
          <div className="bg-surface-container-low rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary">smart_toy</span>
              <h3 className="font-['Public_Sans'] font-semibold text-on-surface">Ask CivicSaarthi AI</h3>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">
              Still confused? Ask a specific question about {term.term}.
            </p>
            
            <form onSubmit={handleAsk} className="mb-4">
              <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                <input
                  type="text"
                  placeholder="e.g., What if the slip is wrong?"
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

            {term.suggestedQuestions && term.suggestedQuestions.length > 0 && (
              <div className="flex flex-col gap-2">
                {term.suggestedQuestions.map((q, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSuggested(q)}
                    disabled={isAsking}
                    className="text-left text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-full transition-colors truncate disabled:opacity-70"
                  >
                    {isAsking ? 'Asking...' : q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Related Terms */}
          {term.relatedTerms && term.relatedTerms.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-4">Related Terms</h3>
              <div className="flex flex-col gap-2">
                {term.relatedTerms.map((rtId) => {
                  const relatedTerm = glossaryTerms.find(t => t.id === rtId);
                  if (!relatedTerm) return null;
                  return (
                    <Link 
                      key={rtId} 
                      to={`/glossary/${rtId}`}
                      className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 hover:text-primary transition-colors text-sm text-on-surface"
                    >
                      <span>{relatedTerm.term} <span className="text-slate-400 text-xs">({relatedTerm.fullForm})</span></span>
                      <span className="material-symbols-outlined text-sm text-slate-300">arrow_forward</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
