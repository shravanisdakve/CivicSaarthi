import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DEMO_STEPS = [
  {
    id: 'welcome',
    step: 1,
    icon: 'waving_hand',
    badge: 'Welcome',
    title: 'CivicSaarthi — Your Election-Readiness Companion',
    description:
      'CivicSaarthi is a multilingual, privacy-first, official-source-guided election-readiness companion. No login required. No sensitive data collected. Completely neutral.',
    highlights: [
      'English · Hindi · Marathi',
      'Official-source grounded AI',
      'Zero PII collection',
    ],
    action: null,
    actionLabel: null,
  },
  {
    id: 'guided-journey',
    step: 2,
    icon: 'route',
    badge: 'Guided Journey',
    title: '9-Step Guided Election Journey',
    description:
      'The Guided Election Journey walks you through every phase of the election process — from voter registration to result day — with AI explanations and cross-linked timeline stages.',
    highlights: [
      '9 curated election stages',
      'AI explanation per step',
      'Cross-links to Visual Timeline',
    ],
    action: 'openJourney',
    actionLabel: 'Start Guided Journey →',
  },
  {
    id: 'vvpat',
    step: 3,
    icon: 'smart_toy',
    badge: 'CivicSaarthi AI',
    title: 'Ask CivicSaarthi AI — What is VVPAT?',
    description:
      'CivicSaarthi AI gives grounded, official-source-linked answers to complex election questions. Tap below to ask about VVPAT and see a live or offline fallback response.',
    highlights: [
      'Grounded with official ECI sources',
      'Local knowledge fallback',
      'Non-partisan guardrails',
    ],
    action: 'askVVPAT',
    actionLabel: 'Ask about VVPAT →',
  },
  {
    id: 'timeline',
    step: 4,
    icon: 'timeline',
    badge: 'Timeline',
    title: 'Visual Election Timeline Tracker',
    description:
      'Browse all 9 election phases — from announcement to results — with real-time highlighting of the current active phase. AI assistant cross-links directly to each stage.',
    highlights: [
      '9 traceable election phases',
      'Stage-specific AI cross-links',
      'Visual progress tracker',
    ],
    action: 'goTimeline',
    actionLabel: 'View Timeline →',
  },
  {
    id: 'checklist',
    step: 5,
    icon: 'fact_check',
    badge: 'Checklist',
    title: 'Voter Readiness Checklist',
    description:
      '7-step action checklist that persists across sessions. Check off steps like voter registration and ID verification. Progress is saved locally — no login needed.',
    highlights: [
      '7 actionable readiness steps',
      'Persists in localStorage',
      'Drives readiness score on Home',
    ],
    action: 'goChecklist',
    actionLabel: 'View Checklist →',
  },
  {
    id: 'summary',
    step: 6,
    icon: 'download',
    badge: 'Download',
    title: 'Download Readiness Summary',
    description:
      'Users can download a personalized Election Readiness Summary that captures their civic profile, checklist progress, and official reminders — a real, tangible artifact.',
    highlights: [
      'Personalized to citizen persona',
      'Privacy-first: no PII included',
      'One-click downloadable document',
    ],
    action: 'goChecklist',
    actionLabel: 'Open Summary Export →',
  },
  {
    id: 'map',
    step: 7,
    icon: 'map',
    badge: 'Google Maps',
    title: 'Election Office & Help Center Map',
    description:
      'Powered by Google Maps, citizens can search for nearby election offices or voter help centers. CivicSaarthi never claims to show official polling booth assignments.',
    highlights: [
      'Google Maps Embed/Search integration',
      'No geolocation collected',
      'Official voter portal linked',
    ],
    action: 'goMap',
    actionLabel: 'Open Map Helper →',
  },
  {
    id: 'neutrality',
    step: 8,
    icon: 'balance',
    badge: 'Neutrality Guardrail',
    title: 'Test the Neutrality Guardrail',
    description:
      'Ask "Which party should I vote for?" — CivicSaarthi AI refuses partisan recommendations every single time, then offers safe, factual alternatives like candidate manifesto review.',
    highlights: [
      'Hard-coded refusal pattern',
      'Tested in automated suite',
      'Logs refusal in every language',
    ],
    action: 'testNeutrality',
    actionLabel: 'Test Neutrality →',
  },
];

export default function DemoMode({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const step = DEMO_STEPS[currentStep];
  const isLast = currentStep === DEMO_STEPS.length - 1;

  const handleAction = () => {
    switch (step.action) {
      case 'openJourney':
        window.dispatchEvent(new CustomEvent('civicOpenChat', { detail: { mode: 'guide' } }));
        onClose();
        break;
      case 'askVVPAT':
        navigate('/assistant?prompt=What%20is%20VVPAT%20and%20how%20does%20it%20work%3F');
        onClose();
        break;
      case 'goTimeline':
        navigate('/timeline');
        onClose();
        break;
      case 'goChecklist':
        navigate('/checklist');
        onClose();
        break;
      case 'goMap':
        navigate('/map');
        onClose();
        break;
      case 'testNeutrality':
        navigate('/assistant?prompt=Which%20party%20should%20I%20vote%20for%3F');
        onClose();
        break;
      default:
        break;
    }
  };

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('civicDemoSeen', 'true');
      onClose();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="2-Minute Demo Mode"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">

        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-100 w-full">
          <div
            className="h-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / DEMO_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-indigo-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">{step.icon}</span>
            </div>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] opacity-70">
                Step {step.step} of {DEMO_STEPS.length} · 2-Minute Demo
              </p>
              <p className="text-xs font-bold">{step.badge}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Close demo"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="font-['Public_Sans'] text-lg font-extrabold text-on-surface mb-3 leading-snug">
            {step.title}
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
            {step.description}
          </p>

          {/* Highlights */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2">
            {step.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[12px]">check</span>
                </span>
                <span className="text-xs font-semibold text-on-surface">{h}</span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          {step.action && (
            <button
              onClick={handleAction}
              className="w-full py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-indigo-700 transition-colors mb-4 flex items-center justify-center gap-2 shadow-md"
            >
              <span className="material-symbols-outlined text-base">{step.icon}</span>
              {step.actionLabel}
            </button>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Previous
            </button>

            <div className="flex gap-1.5">
              {DEMO_STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentStep ? 'bg-primary w-6' : 'bg-slate-200 w-1.5 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 text-xs font-bold text-primary hover:text-indigo-700 transition-colors"
            >
              {isLast ? 'Done' : 'Next'}
              <span className="material-symbols-outlined text-sm">
                {isLast ? 'check_circle' : 'arrow_forward'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
