import { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation.js';
import Button from './Button.jsx';
import Badge from './Badge.jsx';
import Card from './Card.jsx';

export default function WelcomeIntro({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const { t } = useTranslation();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNext = () => setStep(s => s + 1);
  const handleStartGuide = () => {
    localStorage.setItem('civicIntroSeen', 'true');
    window.dispatchEvent(new CustomEvent('civicOpenChat', { detail: { mode: 'guide' } }));
    onClose();
  };
  const handleExplore = () => {
    localStorage.setItem('civicIntroSeen', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" role="dialog" aria-modal="true">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100 flex">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`flex-grow transition-all duration-500 ${s <= step ? 'bg-primary' : 'bg-transparent'}`}></div>
          ))}
        </div>

        <div className="p-8 md:p-10 flex-grow relative">
          {step === 1 && (
            <div key="step1" className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-4xl">handshake</span>
              </div>
              <h2 className="text-3xl font-extrabold font-['Public_Sans'] text-slate-900 leading-tight">
                Welcome to CivicSaarthi
              </h2>
              <p className="text-sm font-bold text-primary tracking-wide uppercase">Your neutral election-readiness companion.</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                CivicSaarthi helps you understand the election process, timelines, voter steps, key terms, and official verification in a simple step-by-step way.
              </p>
              <Button onClick={handleNext} className="w-full py-4 text-base font-bold shadow-lg mt-4">Next</Button>
            </div>
          )}

          {step === 2 && (
            <div key="step2" className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold font-['Public_Sans'] text-slate-900">What you can do</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <span className="material-symbols-outlined text-blue-600 mb-2">smart_toy</span>
                  <h4 className="text-xs font-bold mb-1">Ask CivicSaarthi AI</h4>
                  <p className="text-[10px] text-slate-500">Get simple explanations for election terms.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                  <span className="material-symbols-outlined text-purple-600 mb-2">timeline</span>
                  <h4 className="text-xs font-bold mb-1">Follow the Timeline</h4>
                  <p className="text-[10px] text-slate-500">Understand each election stage.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                  <span className="material-symbols-outlined text-green-600 mb-2">fact_check</span>
                  <h4 className="text-xs font-bold mb-1">Complete Readiness Steps</h4>
                  <p className="text-[10px] text-slate-500">Track preparation with a checklist.</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <span className="material-symbols-outlined text-orange-600 mb-2">verified</span>
                  <h4 className="text-xs font-bold mb-1">Verify Official Sources</h4>
                  <p className="text-[10px] text-slate-500">Check trusted election portals.</p>
                </div>
              </div>
              <Button onClick={handleNext} className="w-full py-4 text-base font-bold shadow-lg mt-4">Next</Button>
            </div>
          )}

          {step === 3 && (
            <div key="step3" className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-center">
              <h2 className="text-2xl font-bold font-['Public_Sans'] text-slate-900">Neutral and privacy-first</h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                CivicSaarthi does not support or oppose any party or candidate. It does not collect Aadhaar, voter ID, phone number, or political preferences.
              </p>
              <div className="flex flex-col items-center gap-3 pt-4">
                <Badge variant="primary" className="px-4 py-2 text-xs">Neutral by design</Badge>
                <Badge variant="success" className="px-4 py-2 text-xs">Official-source grounded</Badge>
                <Badge variant="default" className="px-4 py-2 text-xs">Privacy-conscious</Badge>
              </div>
              <Button onClick={handleNext} className="w-full py-4 text-base font-bold shadow-lg mt-6">Next</Button>
            </div>
          )}

          {step === 4 && (
            <div key="step4" className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                <span className="material-symbols-outlined text-5xl">rocket_launch</span>
              </div>
              <h2 className="text-2xl font-bold font-['Public_Sans'] text-slate-900">Start your guided journey</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Learn the election process one step at a time, with simple explanations and links to the visual timeline.
              </p>
              <div className="space-y-3 pt-6">
                <Button onClick={handleStartGuide} className="w-full py-4 text-base font-bold shadow-lg">Start Guided Journey</Button>
                <button onClick={handleExplore} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">Explore Home First</button>
              </div>
            </div>
          )}
        </div>

        {/* Footer skip */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Step {step} of 4</span>
          {step < 4 && (
            <button onClick={handleExplore} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter">Skip Intro</button>
          )}
        </div>
      </div>
    </div>
  );
}
