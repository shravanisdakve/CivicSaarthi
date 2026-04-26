import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import ProductPreview from '../components/ProductPreview.jsx';
import ReadinessDashboard from '../components/ReadinessDashboard.jsx';
import SmartNextStep from '../components/SmartNextStep.jsx';
import PollingStationHelper from '../components/PollingStationHelper.jsx';
import VerifyBeforeYouBelieve from '../components/VerifyBeforeYouBelieve.jsx';
import ModuleCard from '../components/ModuleCard.jsx';
import DemoMode from '../components/DemoMode.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import { getProfile, getChecklistProgress } from '../utils/guestProfile.js';
import AchievementBadges from '../components/AchievementBadges.jsx';
import ShareReadiness from '../components/ShareReadiness.jsx';

const QUICK_ACTIONS = [
  { icon: 'chat_bubble', title: 'nav.assistant', desc: 'Get neutral answers instantly.', to: '/assistant' },
  { icon: 'calendar_month', title: 'nav.timeline', desc: 'See all key dates and phases.', to: '/timeline' },
  { icon: 'checklist', title: 'nav.checklist', desc: 'See what you need to prepare.', to: '/checklist' },
  { icon: 'menu_book', title: 'nav.glossary', desc: 'Understand the jargon.', to: '/glossary' },
];

const MODULES = [
  { icon: 'smart_toy', title: 'Assistant Chat', desc: 'AI-powered Q&A', to: '/assistant' },
  { icon: 'timeline', title: 'Election Timeline', desc: 'Phase-by-phase tracker', to: '/timeline' },
  { icon: 'fact_check', title: 'Voter Checklist', desc: 'Actionable to-dos', to: '/checklist' },
  { icon: 'import_contacts', title: 'Glossary', desc: 'Definitions directory', to: '/glossary' },
  { icon: 'quiz', title: 'Quiz', desc: 'Test your knowledge', to: '/quiz' },
  { icon: 'policy', title: 'Official Sources', desc: 'Verified links', to: '/sources' },
  { icon: 'where_to_vote', title: 'Polling Station Helper', desc: 'Find your booth', to: '/assistant' }, // Could link to a specific helper or assistant
  { icon: 'shield', title: 'Safety & Neutrality', desc: 'Our commitments', to: '/safety' },
];

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [apiStatus, setApiStatus] = useState({ geminiConfigured: false, mode: 'local-fallback' });
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  
  // Real progress for dashboard - with safe guards
  const profile = getProfile() || {};
  const checklist = getChecklistProgress() || {};
  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalSteps = 7; 
  const readinessPct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setApiStatus(data))
      .catch(() => setApiStatus({ geminiConfigured: false, mode: 'local-fallback' }));
  }, []);

  const handleStartGuide = () => {
    const seen = localStorage.getItem('civicIntroSeen') === 'true';
    if (!seen) {
      window.dispatchEvent(new CustomEvent('civicOpenIntro'));
    } else {
      window.dispatchEvent(new CustomEvent('civicOpenChat', { detail: { mode: 'guide' } }));
    }
  };

  const hasName = profile.name && profile.name !== 'Guest Citizen';

  return (
    <div className="w-full bg-surface">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-lowest to-surface-container-low border-b border-slate-200">
        <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-16 items-center">
          <div className="z-10">
            <div className="flex flex-wrap gap-2 mb-6">
              {apiStatus.geminiConfigured ? (
                <Badge variant="primary" className="border border-primary/20 shadow-sm flex items-center gap-1 bg-blue-50 text-blue-700">
                  <span className="material-symbols-outlined text-[12px]" aria-hidden="true">auto_awesome</span> Gemini available
                </Badge>
              ) : (
                <div className="group relative">
                  <Badge variant="default" className="border border-slate-200 shadow-sm flex items-center gap-1 bg-slate-50 text-slate-600 cursor-help">
                    <span className="material-symbols-outlined text-[12px]" aria-hidden="true">database</span> Local knowledge mode
                  </Badge>
                  <div className="absolute top-full mt-2 left-0 w-64 p-3 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none leading-relaxed">
                    Gemini is unavailable, so CivicSaarthi AI is using the built-in civic knowledge base.
                  </div>
                </div>
              )}
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none">Neutral civic education</Badge>
              <Badge variant="success" className="bg-green-50 text-green-700 border-none">Official-source grounded</Badge>
            </div>
            
            {/* Hero Quick Access (Product Actions) */}
            <div className="flex flex-wrap items-center gap-6 mb-10 py-3 border-b border-slate-100 pb-5">
              <button onClick={() => navigate('/timeline')} className="text-[10px] font-extrabold text-slate-500 hover:text-primary uppercase tracking-[0.2em] transition-colors flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">timeline</span> View Timeline
              </button>
              <button onClick={() => navigate('/checklist')} className="text-[10px] font-extrabold text-slate-500 hover:text-primary uppercase tracking-[0.2em] transition-colors flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">fact_check</span> Checklist
              </button>
              <button onClick={() => navigate('/sources')} className="text-[10px] font-extrabold text-slate-500 hover:text-primary uppercase tracking-[0.2em] transition-colors flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">verified</span> Verify Sources
              </button>
              
              <div className="ml-auto hidden sm:block">
                {/* Unique Identity Status */}
                <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
                  <div className={`w-2 h-2 rounded-full ${hasName ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {hasName ? `Hi, ${profile.name}` : 'Browsing as Guest'}
                  </span>
                  {!hasName && (
                    <button 
                      onClick={() => navigate('/safety#privacy')}
                      className="text-[10px] font-extrabold text-primary hover:underline uppercase tracking-widest"
                      aria-label="Learn about privacy"
                    >
                      Learn about privacy
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <h1 className="font-['Public_Sans'] text-3xl md:text-4xl lg:text-5xl font-extrabold text-on-surface leading-tight mb-6 tracking-tight">
              {hasName ? `Hi ${(profile.name || '').split(' ')[0]}, ready to continue?` : t('hero.title')}
            </h1>
            
            <p className="text-body-lg text-on-surface-variant mb-8 max-w-lg leading-relaxed">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10">
              <Button variant="primary" onClick={handleStartGuide} className="shadow-md hover:shadow-lg transition-shadow py-3 px-6 text-base">
                {t('cta.startGuide')}
              </Button>
              <Button variant="outline" onClick={() => window.dispatchEvent(new CustomEvent('civicOpenChat'))} className="py-3 px-6 text-base bg-white">
                {t('cta.askAI')}
              </Button>
              <button
                id="demo-mode-btn"
                onClick={() => setIsDemoOpen(true)}
                className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 font-bold px-4 py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-amber-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">play_circle</span>
                Try 2-Minute Demo
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('civicOpenIntro'))}
                className="text-primary font-bold hover:underline px-4 py-3 text-xs uppercase tracking-widest"
              >
                How it works
              </button>
            </div>
          </div>
          
          <ProductPreview />
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 md:px-8 space-y-16 py-16">
        
        {/* Election Readiness Dashboard & Smart Next Step */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <ReadinessDashboard 
              pct={readinessPct} 
              completed={completedCount} 
              total={totalSteps} 
            />
          </div>
          <div className="space-y-6">
            <Card className="p-6 bg-white border-0 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <h3 className="font-['Public_Sans'] font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">emoji_events</span>
                Your Civic Progress
              </h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary font-black text-xl">
                  {profile.readinessPoints || 0}
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Readiness Points</p>
                   <p className="text-xs text-slate-600">Points earned through learning and preparation.</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Earned Badges</p>
                <AchievementBadges earnedBadges={profile.badges || []} />
              </div>
            </Card>

            <ShareReadiness status={readinessPct === 100 ? 'ready' : 'learning'} />
          </div>
        </div>

        <section className="py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {QUICK_ACTIONS.map((action) => (
              <div 
                key={action.title} 
                onClick={() => {
                  if (action.to === '/assistant') {
                    window.dispatchEvent(new CustomEvent('civicOpenChat'));
                  } else {
                    navigate(action.to);
                  }
                }} 
                className="cursor-pointer group h-full"
              >
                <Card className="p-5 h-full bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all border border-slate-100 flex flex-col">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors shrink-0">
                    <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors" aria-hidden="true">{action.icon}</span>
                  </div>
                  <h3 className="font-['Public_Sans'] font-bold text-on-surface mb-1 text-sm">{t(action.title)}</h3>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed flex-grow">{action.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Layer: Why CivicSaarthi answers are safer */}
        <section className="bg-green-50 rounded-3xl p-8 md:p-12 border border-green-100 shadow-sm">
          <div className="mb-10">
            <h2 className="text-3xl font-bold font-['Public_Sans'] text-green-900 mb-2">Why CivicSaarthi answers are safer</h2>
            <p className="text-green-700 font-medium">Grounded in structured official knowledge, not just generic AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm">
              <span className="material-symbols-outlined text-green-600 mb-3 text-3xl" aria-hidden="true">menu_book</span>
              <h4 className="font-bold text-sm mb-2 text-on-surface">Curated Knowledge Base</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">Common election guidance is matched against structured civic knowledge before AI responds.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm">
              <span className="material-symbols-outlined text-green-600 mb-3 text-3xl" aria-hidden="true">verified</span>
              <h4 className="font-bold text-sm mb-2 text-on-surface">Official-Source Reminders</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">Every critical topic points users back to official election sources for final verification.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm">
              <span className="material-symbols-outlined text-green-600 mb-3 text-3xl" aria-hidden="true">pin_drop</span>
              <h4 className="font-bold text-sm mb-2 text-on-surface">No Live Booth Claims</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">CivicSaarthi does not guess polling booths, dates, or voter-specific records.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm">
              <span className="material-symbols-outlined text-green-600 mb-3 text-3xl" aria-hidden="true">security</span>
              <h4 className="font-bold text-sm mb-2 text-on-surface">Neutral AI Guardrails</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">The assistant is technically constrained to refuse party or candidate recommendations.</p>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low rounded-3xl p-8 md:p-12 border border-slate-100">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold font-['Public_Sans'] mb-4">Your private civic dashboard</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                Track your readiness points, complete your checklist, and download your personalized summary. Everything is stored privately on your device.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  <span className="text-[11px] font-medium text-slate-600">Optional login</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  <span className="text-[11px] font-medium text-slate-600">Guest mode support</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  <span className="text-[11px] font-medium text-slate-600">Readiness tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  <span className="text-[11px] font-medium text-slate-600">Summary downloads</span>
                </div>
              </div>
              <Button variant="primary" onClick={() => navigate('/profile')}>Explore My Profile</Button>
            </div>
            <div className="md:w-1/2 bg-white rounded-2xl p-6 border border-slate-100 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">G</div>
                  <div>
                    <p className="text-sm font-bold">Guest Citizen</p>
                    <p className="text-[10px] text-slate-400">Civic Starter</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">{profile.readinessPoints || 0}</p>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Points</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${readinessPct}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>Readiness Progress</span>
                  <span>{readinessPct}%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Product Modules */}
        <section>
          <div className="mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl" aria-hidden="true">view_cozy</span>
            <h2 className="text-3xl font-bold font-['Public_Sans']">Featured Product Modules</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MODULES.map(m => (
              <ModuleCard key={m.title} {...m} />
            ))}
          </div>
        </section>

        {/* Verification & Polling Station */}
        <section className="grid lg:grid-cols-2 gap-8">
          <VerifyBeforeYouBelieve />
          <PollingStationHelper />
        </section>

      </div>

      {/* Google Services Highlight */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-screen-xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold font-['Public_Sans'] mb-4">Built for Google Cloud</h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                A modern, serverless architecture ensuring scalability, security, and intelligent AI capabilities.
              </p>
            </div>
            
            <div className="md:w-2/3 w-full bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 text-xs text-slate-300 font-medium justify-center whitespace-nowrap overflow-x-auto pb-2">
                  <span className="px-3 py-1 bg-slate-700 rounded">Browser</span>
                  <span className="material-symbols-outlined text-slate-500 text-sm" aria-hidden="true">arrow_forward</span>
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-200 rounded border border-blue-800/50">Cloud Run App</span>
                  <span className="material-symbols-outlined text-slate-500 text-sm" aria-hidden="true">arrow_forward</span>
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-200 rounded border border-purple-800/50">Gemini API</span>
                  
                  <span className="material-symbols-outlined text-slate-500 text-sm mx-2" aria-hidden="true">|</span>
                  
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-200 rounded border border-blue-800/50">Cloud Run App</span>
                  <span className="material-symbols-outlined text-slate-500 text-sm" aria-hidden="true">arrow_forward</span>
                  <span className="px-3 py-1 bg-green-900/50 text-green-200 rounded border border-green-800/50">Secret Manager</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 p-4 rounded-xl flex items-start gap-3 border border-slate-600/50">
                    <span className="material-symbols-outlined text-blue-400" aria-hidden="true">cloud</span>
                    <div>
                      <h4 className="font-bold text-sm mb-1">Cloud Run</h4>
                      <p className="text-[10px] text-slate-400">Deployed web app and backend</p>
                    </div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl flex items-start gap-3 border border-slate-600/50">
                    <span className="material-symbols-outlined text-purple-400" aria-hidden="true">auto_awesome</span>
                    <div>
                      <h4 className="font-bold text-sm mb-1">Gemini API</h4>
                      <p className="text-[10px] text-slate-400">Intelligent assistant answers</p>
                    </div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl flex items-start gap-3 border border-slate-600/50">
                    <span className="material-symbols-outlined text-green-400" aria-hidden="true">key</span>
                    <div>
                      <h4 className="font-bold text-sm mb-1">Secret Manager</h4>
                      <p className="text-[10px] text-slate-400">Keeps API key out of frontend</p>
                    </div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl flex items-start gap-3 border border-slate-600/50">
                    <span className="material-symbols-outlined text-orange-400" aria-hidden="true">build</span>
                    <div>
                      <h4 className="font-bold text-sm mb-1">Cloud Build / Artifact Registry</h4>
                      <p className="text-[10px] text-slate-400">Source deployment pipeline</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neutrality Banner */}
      <section className="bg-surface-container-highest border-t border-slate-200">
        <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-primary">
              <span className="material-symbols-outlined text-2xl" aria-hidden="true">balance</span>
            </div>
            <div>
              <p className="text-sm text-on-surface-variant max-w-2xl font-medium">
                CivicSaarthi explains election processes. It does not support or oppose any party or candidate.
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/safety')} className="bg-white shrink-0 whitespace-nowrap">
            View Neutrality Policy
          </Button>
        </div>
      </section>
      
      <DemoMode isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}
