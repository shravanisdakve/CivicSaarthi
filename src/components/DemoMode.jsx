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
    id: 'voice',
    step: 2,
    icon: 'mic',
    badge: 'Voice Mode',
    title: 'Try Voice Assistant Mode',
    description:
      'Accessibility first. Users can speak their questions and hear AI responses read aloud. Powered by browser-native speech APIs for privacy.',
    highlights: [
      'Hands-free voice input',
      'Read-aloud responses',
      'Privacy-first: no audio storage',
    ],
    action: 'goAssistant',
    actionLabel: 'Try Voice Assistant →',
  },
  {
    id: 'explainers',
    step: 3,
    icon: 'play_circle',
    badge: 'Microlearning',
    title: '30-Second Phase Explainers',
    description:
      'Understand complex election stages in seconds. Lightweight HTML/CSS animated cards walk you through each phase from announcement to results.',
    highlights: [
      '9 phase-based explainers',
      'Lightweight & offline-friendly',
      'Read-aloud support included',
    ],
    action: 'goTimeline',
    actionLabel: 'Watch Explainers →',
  },
  {
    id: 'badges',
    step: 4,
    icon: 'emoji_events',
    badge: 'Gamification',
    title: 'Civic Achievement Badges',
    description:
      'Earn progressive badges for your civic learning. No political scoring — just educational milestones that persist locally on your device.',
    highlights: [
      '7 progressive badges',
      'Non-partisan achievements',
      'Visual progress tracking',
    ],
    action: 'goHome',
    actionLabel: 'View Achievements →',
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
    id: 'map',
    step: 6,
    icon: 'map',
    badge: 'Google Maps',
    title: 'Polling Station Verification Helper',
    description:
      'Powered by Google Maps, citizens can search for nearby election offices. Includes official verification portal links for secure booth lookup.',
    highlights: [
      'Google Maps discovery',
      'Official portal integration',
      'Verified-source disclaimers',
    ],
    action: 'goMap',
    actionLabel: 'Open Map Helper →',
  },
  {
    id: 'sharing',
    step: 7,
    icon: 'share',
    badge: 'Sharing',
    title: 'Share Your Civic Readiness',
    description:
      'Inspire others to be voter-ready. One-click social sharing to LinkedIn and X (Twitter) with privacy-protected templates.',
    highlights: [
      'Privacy-first templates',
      'LinkedIn & X integration',
      'Name-inclusion toggle',
    ],
    action: 'goChecklist',
    actionLabel: 'Test Social Share →',
  },
  {
    id: 'neutrality',
    step: 8,
    icon: 'balance',
    badge: 'Neutrality',
    title: 'Strict Non-Partisan Guardrails',
    description:
      'CivicSaarthi AI refuses to recommend candidates or parties. Ask "Which party should I vote for?" to see the refusal in action.',
    highlights: [
      'No candidate recommendations',
      'Official-source grounded',
      'Neutral civic education only',
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
      case 'goAssistant':
        navigate('/assistant');
        onClose();
        break;
      case 'goTimeline':
        navigate('/timeline');
        onClose();
        break;
      case 'goHome':
        navigate('/');
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
