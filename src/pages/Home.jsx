import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ReadinessDashboard from '../components/ReadinessDashboard.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import { getProfile, getChecklistProgress } from '../utils/profileStorage.js';
import AchievementBadges from '../components/AchievementBadges.jsx';
import ShareReadiness from '../components/ShareReadiness.jsx';
import DemoMode from '../components/DemoMode.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import heroIllustration from '../assets/hero_civic_edu.png';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    geminiConfigured: true, // Default to true as we're usually in production
    mapsConfigured: true,
    firebaseConfigured: true
  });

  useEffect(() => {
    fetch('/api/status')
      .then(r => r.json())
      .then(data => setApiStatus(data))
      .catch(() => {});
  }, []);


  const profile = getProfile() || {};
  const checklist = getChecklistProgress() || {};
  const completedCount = Object.values(checklist || {}).filter(Boolean).length;
  const totalSteps = 7;
  const readinessPct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const handleStartGuide = () => {
    const seen = localStorage.getItem('civicIntroSeen') === 'true';
    if (!seen) {
      window.dispatchEvent(new CustomEvent('civicOpenIntro'));
    } else {
      navigate('/choose-path');
    }
  };

  const hasName =
    profile.name && profile.name !== 'Guest Citizen' && typeof profile.name === 'string';
  const firstName = hasName ? profile.name.split(' ')[0] : '';

  return (
    <div className="w-full bg-surface">
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-lowest to-surface-container-low border-b border-slate-200">
        <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-16 lg:py-24 flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left max-w-2xl">
            <h1 className="font-['Public_Sans'] text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface leading-tight mb-6 tracking-tight">
              {hasName ? `${t('profile.hi')} ${firstName}` : t('hero.title')}
            </h1>

            <p className="text-xl text-on-surface-variant mb-4 font-medium">{t('hero.subtitle')}</p>
            <p className="text-body-lg text-slate-500 mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed">
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-8">
              <Button
                variant="primary"
                onClick={handleStartGuide}
                className="w-full sm:w-auto shadow-md py-4 px-8 text-lg"
              >
                {t('cta.startGuide')}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.dispatchEvent(new CustomEvent('civicOpenChat'))}
                className="w-full sm:w-auto py-4 px-8 text-lg bg-white"
              >
                {t('cta.askAI')}
              </Button>
              <button
                id="demo-mode-btn"
                onClick={() => setIsDemoOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 font-bold px-6 py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-amber-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                {t('cta.tryDemo')}
              </button>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-6 text-sm font-bold uppercase tracking-widest text-primary">
              <button onClick={() => navigate('/timeline')} className="hover:underline">
                {t('nav.timeline')}
              </button>
              <button onClick={() => navigate('/sources')} className="hover:underline">
                {t('nav.sources')}
              </button>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="flex-1 w-full max-w-md lg:max-w-lg mx-auto">
            <img src={heroIllustration} alt="Civic education showing diverse Indian citizens learning about voting and rights" className="w-full h-auto drop-shadow-xl" />
          </div>
        </div>
      </section>

      {/* 1.5 Google Services Proof Section - Native Cloud Integration */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-screen-xl mx-auto px-6 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-3">
              Powered by Google Cloud
            </h2>
            <p className="text-slate-500 text-xs font-medium">
              CivicSaarthi leverages the latest Google Cloud and AI infrastructure to ensure
              neutral, secure, and accessible civic education.
            </p>
          </div>

          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: 'Cloud Run',
                icon: 'cloud_done',
                desc: 'Production hosting',
                status: 'Active',
              },
              {
                name: 'Gemini AI',
                icon: 'smart_toy',
                desc: 'Neutral civic AI',
                status: apiStatus.geminiConfigured ? 'Active' : 'Config Required',
              },
              {
                name: 'Maps Platform',
                icon: 'map',
                desc: 'Booth helper',
                status: apiStatus.mapsConfigured ? 'Active' : 'Config Required',
              },
              {
                name: 'Firebase',
                icon: 'login',
                desc: 'Secure Google Auth',
                status: apiStatus.firebaseConfigured ? 'Active' : 'Config Required',
              },
              { name: 'Secret Manager', icon: 'key', desc: 'Key protection', status: 'Active' },
              { name: 'Cloud Build', icon: 'build', desc: 'Safe delivery', status: 'Active' },
              {
                name: 'Artifact Registry',
                icon: 'inventory_2',
                desc: 'Safe storage',
                status: 'Active',
              },
              {
                name: 'Cloud Logging',
                icon: 'history_edu',
                desc: 'Anonymous events',
                status: 'Active',
              },
            ].map((svc) => (
              <li
                key={svc.name}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-colors"
              >
                <span className="material-symbols-outlined text-primary text-2xl mb-2">
                  {svc.icon}
                </span>
                <h3 className="text-[11px] font-bold text-on-surface mb-1">{svc.name}</h3>
                <p className="text-[9px] text-slate-500 leading-tight mb-2">{svc.desc}</p>
                <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 uppercase tracking-widest">
                  {svc.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 md:px-8 space-y-16 py-16">
        {/* 2. Civic Progress */}
        <section>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-grow w-full">
              <ErrorBoundary
                fallback={
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 text-sm">
                    Dashboard unavailable.
                  </div>
                }
              >
                <ReadinessDashboard
                  pct={readinessPct}
                  completed={completedCount}
                  total={totalSteps}
                />
              </ErrorBoundary>
            </div>
            <div className="w-full lg:w-80 shrink-0 space-y-6">
              <Card className="p-6 bg-white border-0 shadow-sm overflow-hidden relative">
                <h3 className="font-['Public_Sans'] font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">emoji_events</span>
                  {t('profile.yourProgress')}
                </h3>
                <div className="mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Recently Earned Badges
                  </p>
                  <ErrorBoundary
                    fallback={<div className="text-xs text-slate-400">Badges unavailable.</div>}
                  >
                    <AchievementBadges earnedBadges={profile.badges || []} />
                  </ErrorBoundary>
                </div>
                <Button
                  variant="primary"
                  className="w-full mb-3"
                  onClick={() => navigate('/checklist')}
                >
                  {t('checklist.continue')}
                </Button>
              </Card>
              <ErrorBoundary fallback={null}>
                <ShareReadiness status={readinessPct === 100 ? 'ready' : 'learning'} />
              </ErrorBoundary>
            </div>
          </div>
        </section>

        {/* 3. Actionable Guided Journey */}
        <section>
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl" aria-hidden="true">
                auto_awesome
              </span>
              <h2 className="text-3xl font-bold font-['Public_Sans']">Your Guided Journey</h2>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
              Institutional Preparation Path
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 border-slate-200 hover:border-primary transition-all group flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">how_to_reg</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Step 1: Verify Registration</h3>
              <p className="text-sm text-on-surface-variant mb-6 flex-grow">
                Check if your name is on the electoral roll and locate your general polling area.
              </p>
              <Button variant="primary" onClick={() => navigate('/map')} className="w-full justify-center">
                Go to Map Helper
              </Button>
            </Card>

            <Card className="p-8 border-slate-200 hover:border-primary transition-all group flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">token</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Step 2: Understand EVM/VVPAT</h3>
              <p className="text-sm text-on-surface-variant mb-6 flex-grow">
                Learn how Electronic Voting Machines and VVPAT work to ensure your vote is counted.
              </p>
              <Button variant="primary" onClick={() => navigate('/glossary')} className="w-full justify-center">
                Open Glossary
              </Button>
            </Card>

            <Card className="p-8 border-slate-200 hover:border-primary transition-all group flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">campaign</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Step 3: Voting Day Tips</h3>
              <p className="text-sm text-on-surface-variant mb-6 flex-grow">
                Get real-time advice on what to carry, queue priorities, and polling booth protocols.
              </p>
              <Button variant="primary" onClick={() => window.dispatchEvent(new CustomEvent('civicOpenChat'))} className="w-full justify-center">
                Ask AI Assistant
              </Button>
            </Card>
          </div>
        </section>

        {/* 4. Trust & Alignment Section */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-['Public_Sans'] mb-4">Rank 1 Trust Architecture</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                CivicSaarthi is engineered for absolute neutrality and privacy. We bridge the gap between 
                complex electoral data and citizen readiness using official sources and zero-PII technology.
              </p>
              
              <ul className="space-y-4">
                {[
                  { icon: 'shield_lock', title: 'Privacy First', desc: 'No personal data collection. Your progress stays on your device.' },
                  { icon: 'balance', title: 'Non-Partisan AI', desc: 'Models are strictly tuned to avoid political bias or endorsements.' },
                  { icon: 'verified', title: 'ECI-Grounded', desc: 'All information is verified against Election Commission of India data.' },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-on-surface">{item.title}</h3>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 flex gap-4">
                <Button variant="outline" onClick={() => navigate('/privacy')} className="text-xs">
                  View Privacy Policy
                </Button>
                <Button variant="outline" onClick={() => navigate('/safety')} className="text-xs">
                  Neutrality Proof
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
                <p className="text-4xl font-black text-primary mb-1">100%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Privacy Score</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
                <p className="text-4xl font-black text-green-600 mb-1">0</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PII Collected</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
                <p className="text-4xl font-black text-amber-500 mb-1">Neutral</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Stance</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
                <p className="text-4xl font-black text-blue-600 mb-1">Official</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source Grounding</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ErrorBoundary fallback={null}>
        <DemoMode isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      </ErrorBoundary>
    </div>
  );
}
