import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ReadinessDashboard from '../components/ReadinessDashboard.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import { getProfile, getChecklistProgress } from '../utils/guestProfile.js';
import AchievementBadges from '../components/AchievementBadges.jsx';
import ShareReadiness from '../components/ShareReadiness.jsx';
import DemoMode from '../components/DemoMode.jsx';

const QUICK_ACTIONS = [
  { icon: 'chat_bubble', title: 'Ask CivicSaarthi AI', desc: 'Get neutral answers instantly.', to: '/assistant' },
  { icon: 'explore', title: 'Guided Election Journey', desc: 'Step-by-step guidance.', to: '/choose-path' },
  { icon: 'calendar_month', title: 'Election Timeline', desc: 'See all key dates and phases.', to: '/timeline' },
  { icon: 'checklist', title: 'Voter Checklist', desc: 'See what you need to prepare.', to: '/checklist' },
  { icon: 'where_to_vote', title: 'Polling Station Verification', desc: 'Find your booth.', to: '/map' },
  { icon: 'policy', title: 'Official Sources', desc: 'Verified links.', to: '/sources' },
  { icon: 'verified', title: 'Quality Report', desc: 'See how we built this.', to: '/quality' },
];

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  
  const profile = getProfile() || {};
  const checklist = getChecklistProgress() || {};
  const completedCount = Object.values(checklist).filter(Boolean).length;
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

  const hasName = profile.name && profile.name !== 'Guest Citizen';

  return (
    <div className="w-full bg-surface">
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-lowest to-surface-container-low border-b border-slate-200">
        <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-20 lg:py-28 text-center max-w-4xl">
          <h1 className="font-['Public_Sans'] text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface leading-tight mb-6 tracking-tight">
            {hasName ? `Hi ${(profile.name || '').split(' ')[0]}, ready to continue your election journey?` : 'Welcome to CivicSaarthi'}
          </h1>
          
          <p className="text-xl text-on-surface-variant mb-4 font-medium">
            A multilingual, privacy-first election-readiness companion.
          </p>
          <p className="text-body-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Understand the election process, follow timelines, complete readiness steps, and verify information through official sources.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button variant="primary" onClick={handleStartGuide} className="w-full sm:w-auto shadow-md py-4 px-8 text-lg">
              Start Guided Journey
            </Button>
            <Button variant="outline" onClick={() => window.dispatchEvent(new CustomEvent('civicOpenChat'))} className="w-full sm:w-auto py-4 px-8 text-lg bg-white">
              Ask CivicSaarthi AI
            </Button>
            <button
              id="demo-mode-btn"
              onClick={() => setIsDemoOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 font-bold px-6 py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-amber-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              Try 2-Minute Demo
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm font-bold uppercase tracking-widest text-primary">
             <button onClick={() => navigate('/timeline')} className="hover:underline">View Timeline</button>
             <button onClick={() => navigate('/sources')} className="hover:underline">Open Sources</button>
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 md:px-8 space-y-16 py-16">
        
        {/* 2. Civic Progress */}
        <section>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-grow w-full">
              <ReadinessDashboard 
                pct={readinessPct} 
                completed={completedCount} 
                total={totalSteps} 
              />
            </div>
            <div className="w-full lg:w-80 shrink-0 space-y-6">
              <Card className="p-6 bg-white border-0 shadow-sm overflow-hidden relative">
                <h3 className="font-['Public_Sans'] font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">emoji_events</span>
                  Your Civic Progress
                </h3>
                <div className="mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Recently Earned Badges</p>
                  <AchievementBadges earnedBadges={profile.badges || []} />
                </div>
                <Button variant="primary" className="w-full mb-3" onClick={() => navigate('/checklist')}>
                  Continue Checklist
                </Button>
              </Card>
              <ShareReadiness status={readinessPct === 100 ? 'ready' : 'learning'} />
            </div>
          </div>
        </section>

        {/* 3. Quick Actions */}
        <section>
          <div className="mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl" aria-hidden="true">bolt</span>
            <h2 className="text-3xl font-bold font-['Public_Sans']">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                <Card className="p-6 h-full bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-slate-100 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors shrink-0">
                    <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors text-2xl" aria-hidden="true">{action.icon}</span>
                  </div>
                  <div>
                     <h3 className="font-['Public_Sans'] font-bold text-on-surface mb-1 text-base group-hover:text-primary transition-colors">{t(action.title)}</h3>
                     <p className="text-xs text-on-surface-variant leading-relaxed">{action.desc}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Trust Strip */}
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:px-10 md:py-8 flex flex-wrap justify-between items-center gap-6">
           <div className="flex items-center gap-2 text-slate-600">
             <span className="material-symbols-outlined text-green-600">balance</span>
             <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Neutral by design</span>
           </div>
           <div className="flex items-center gap-2 text-slate-600">
             <span className="material-symbols-outlined text-blue-600">shield_lock</span>
             <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Privacy-first</span>
           </div>
           <div className="flex items-center gap-2 text-slate-600">
             <span className="material-symbols-outlined text-purple-600">verified</span>
             <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Official-source-guided</span>
           </div>
           <div className="flex items-center gap-2 text-slate-600">
             <span className="material-symbols-outlined text-orange-600">cloud</span>
             <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Google Cloud + Gemini</span>
           </div>
        </section>
      </div>

      <DemoMode isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}
