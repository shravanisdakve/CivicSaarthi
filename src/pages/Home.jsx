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

const QUICK_ACTIONS = [
  {
    icon: 'chat_bubble',
    titleKey: 'qa.ask',
    desc: 'Get neutral answers instantly.',
    to: '/assistant',
  },
  { icon: 'explore', titleKey: 'qa.journey', desc: 'Step-by-step guidance.', to: '/choose-path' },
  {
    icon: 'calendar_month',
    titleKey: 'qa.timeline',
    desc: 'See all key dates and phases.',
    to: '/timeline',
  },
  {
    icon: 'checklist',
    titleKey: 'qa.checklist',
    desc: 'See what you need to prepare.',
    to: '/checklist',
  },
  { icon: 'where_to_vote', titleKey: 'qa.booth', desc: 'Find your booth.', to: '/map' },
  { icon: 'policy', titleKey: 'qa.sources', desc: 'Verified links.', to: '/sources' },
];

/**
 * Home Page Component
 * Serves as the primary landing page and user dashboard.
 * Implements Google Service visibility grid and civic progress tracking.
 */
export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

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
        <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-20 lg:py-28 text-center max-w-4xl">
          <h1 className="font-['Public_Sans'] text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface leading-tight mb-6 tracking-tight">
            {hasName ? `${t('profile.hi')} ${firstName}` : t('hero.title')}
          </h1>

          <p className="text-xl text-on-surface-variant mb-4 font-medium">{t('hero.subtitle')}</p>
          <p className="text-body-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Understand the election process, follow timelines, complete readiness steps, and verify
            information through official sources.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
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

          <div className="flex items-center justify-center gap-6 text-sm font-bold uppercase tracking-widest text-primary">
            <button onClick={() => navigate('/timeline')} className="hover:underline">
              {t('nav.timeline')}
            </button>
            <button onClick={() => navigate('/sources')} className="hover:underline">
              {t('nav.sources')}
            </button>
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
                status: import.meta.env.VITE_GEMINI_API_KEY ? 'Active' : 'Config Required',
              },
              {
                name: 'Maps Platform',
                icon: 'map',
                desc: 'Booth helper',
                status: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Active' : 'Config Required',
              },
              {
                name: 'Firebase',
                icon: 'login',
                desc: 'Secure Google Auth',
                status: import.meta.env.VITE_FIREBASE_API_KEY ? 'Active' : 'Config Required',
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

        {/* 3. Quick Actions */}
        <section>
          <div className="mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl" aria-hidden="true">
              bolt
            </span>
            <h2 className="text-3xl font-bold font-['Public_Sans']">Quick Actions</h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {QUICK_ACTIONS.map((action) => (
              <li key={action.titleKey} className="h-full">
                <a
                  href={action.to === '/assistant' ? '#' : action.to} // Use # for assistant to handle custom event
                  onClick={(e) => {
                    if (action.to === '/assistant') {
                      e.preventDefault(); // Prevent default link behavior
                      window.dispatchEvent(new CustomEvent('civicOpenChat'));
                    } else {
                      navigate(action.to);
                    }
                  }}
                  className="group h-full block" // Ensure link is a block-level element
                >
                  <Card className="p-6 h-full bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-slate-100 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors shrink-0">
                      <span
                        className="material-symbols-outlined text-primary group-hover:text-white transition-colors text-2xl"
                        aria-hidden="true"
                      >
                        {action.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-['Public_Sans'] font-bold text-on-surface mb-1 text-base group-hover:text-primary transition-colors">
                        {t(action.titleKey)}
                      </h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {action.desc}
                      </p>
                    </div>
                  </Card>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. Trust Strip */}
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:px-10 md:py-8">
          <ul className="flex flex-wrap justify-between items-center gap-6">
            <li className="flex items-center gap-2 text-slate-600">
              <span className="material-symbols-outlined text-green-600">balance</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                Neutral by design
              </span>
            </li>
            <li className="flex items-center gap-2 text-slate-600">
              <span className="material-symbols-outlined text-blue-600">shield_lock</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                Privacy-first
              </span>
            </li>
            <li className="flex items-center gap-2 text-slate-600">
              <span className="material-symbols-outlined text-purple-600">verified</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                Official-source-guided
              </span>
            </li>
            <li className="flex items-center gap-2 text-slate-600">
              <span className="material-symbols-outlined text-orange-600">cloud</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                Google Cloud Infrastructure
              </span>
            </li>
            <li className="flex items-center gap-2 text-slate-600">
              <span className="material-symbols-outlined text-blue-600">psychology</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                Gemini 2.5 Flash API
              </span>
            </li>
          </ul>
        </section>
      </div>

      <ErrorBoundary fallback={null}>
        <DemoMode isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      </ErrorBoundary>
    </div>
  );
}
