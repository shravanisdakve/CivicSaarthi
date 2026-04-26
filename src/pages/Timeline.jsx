import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { timelineStages } from '../data/timeline.js';
import { phaseExplainers } from '../data/phaseExplainers.js';
import PhaseExplainer from '../components/PhaseExplainer.jsx';
import Button from '../components/Button.jsx';
import { getProfile, saveProfile } from '../utils/guestProfile.js';

const INITIAL_VISIBLE = 5;

export default function Timeline() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(() => {
    const current = timelineStages.find(s => s.status === 'active');
    return current ? current.id : 1;
  });
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedExplainer, setSelectedExplainer] = useState(null);
  const detailRef = useRef(null);
  
  const profile = getProfile();
  const understoodExplainers = profile.understoodExplainers || [];

  const handleUnderstood = (phaseId) => {
    if (!understoodExplainers.includes(phaseId)) {
      const newList = [...understoodExplainers, phaseId];
      saveProfile({ 
        understoodExplainers: newList,
        readinessPoints: (profile.readinessPoints || 0) + 5
      });
    }
  };

  useEffect(() => {
    // Simulate loading for detail panel on stage change
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeId]);

  useEffect(() => {
    const selected = localStorage.getItem('selectedTimelineStage');
    if (selected) {
      const matchMap = {
        'announcement': 1,
        'mcc': 2,
        'nominations': 3,
        'scrutiny': 4,
        'withdrawal': 5,
        'campaigning': 6,
        'polling': 7,
        'counting': 8,
        'results': 9
      };
      
      const targetId = matchMap[selected] || parseInt(selected);
      if (targetId && targetId <= timelineStages.length) {
        setActiveId(targetId);
        if (targetId > INITIAL_VISIBLE) setShowAll(true);
        // Delay slightly for render
        setTimeout(() => {
          detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
      localStorage.removeItem('selectedTimelineStage');
    }
  }, []);

  const activeStage = timelineStages.find((s) => s.id === activeId);
  const activeIndex = timelineStages.findIndex((s) => s.id === activeId);
  const visibleStages = showAll ? timelineStages : timelineStages.slice(0, INITIAL_VISIBLE);
  const currentPhase = timelineStages.find((s) => s.status === 'active');

  const handleStageSelect = (id) => {
    setActiveId(id);
    if (window.innerWidth < 768) {
      detailRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (activeIndex < timelineStages.length - 1) {
      setActiveId(timelineStages[activeIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveId(timelineStages[activeIndex - 1].id);
    }
  };

  const getContextualAction = (stage) => {
    if (stage.id === 2) {
      return { label: 'Go to Checklist', icon: 'fact_check', action: () => navigate('/checklist') };
    }
    if (stage.id === 7) {
      return { label: 'Find Polling Booth', icon: 'location_on', action: () => navigate('/assistant', { state: { question: 'How do I find my polling station?' } }) };
    }
    if (stage.id === 1) {
      return { label: 'Read MCC Rules', icon: 'gavel', action: () => navigate('/glossary/mcc') };
    }
    return null;
  };

  const contextualAction = getContextualAction(activeStage);

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-['Public_Sans'] text-3xl md:text-4xl font-bold text-primary mb-3">Election Timeline</h1>
        <p className="text-on-surface-variant max-w-xl mx-auto text-sm">
          Understanding the electoral process from announcement to results. Follow the journey step-by-step.
        </p>
      </div>

      {/* Current Phase Banner */}
      {currentPhase && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary bg-primary-fixed w-10 h-10 rounded-full flex items-center justify-center shrink-0">{currentPhase.icon}</span>
            <div>
              <p className="font-['Public_Sans'] font-semibold text-on-surface">Current Phase: {currentPhase.title}</p>
              <p className="text-xs text-on-surface-variant">Step {currentPhase.id} of {timelineStages.length} • {currentPhase.date}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs ml-6">
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-primary rounded-full progress-bar"
                style={{ width: `${(currentPhase.id / timelineStages.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-5 gap-8">
        {/* Left Column: Steps List */}
        <div className="md:col-span-3 flex flex-col gap-4">
          {visibleStages.map((stage) => {
            const isActive = stage.status === 'active';
            const isCompleted = stage.status === 'completed';
            const isSelected = activeId === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => handleStageSelect(stage.id)}
                className={`w-full text-left rounded-xl border-2 p-5 transition-all ${
                  isSelected
                    ? 'border-primary bg-white shadow-md -translate-y-1'
                    : isActive
                    ? 'border-primary/30 bg-white'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Step indicator */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                    isCompleted ? 'bg-primary text-white' : isActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isCompleted ? <span className="material-symbols-outlined text-sm">check</span> : stage.id}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {stage.step}{isActive ? ' • ACTIVE' : ''}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 ml-2 shrink-0">{stage.date}</span>
                    </div>
                    <h3 className="font-['Public_Sans'] font-semibold text-on-surface mb-1">{stage.title}</h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2">{stage.shortDesc}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-primary font-bold mt-2 hover:underline">
                      {isSelected ? 'Viewing Details' : 'View more details'} →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Load more */}
          {!showAll && timelineStages.length > INITIAL_VISIBLE && (
            <div className="text-center pt-2">
              <Button variant="outline" onClick={() => setShowAll(true)} className="text-xs">
                View All {timelineStages.length} Stages
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Detail Panel */}
        <aside className="md:col-span-2" ref={detailRef}>
          <div className="sticky top-24 bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden min-h-[400px]">
            {loading ? (
              <div className="p-8 animate-pulse space-y-6" role="status">
                <div className="h-40 bg-slate-100 rounded-xl mb-8"></div>
                <div className="h-8 bg-slate-100 w-3/4 rounded-md"></div>
                <div className="h-4 bg-slate-100 w-1/4 rounded-md"></div>
                <div className="space-y-3 pt-4">
                  <div className="h-3 bg-slate-100 w-full rounded-md"></div>
                  <div className="h-3 bg-slate-100 w-full rounded-md"></div>
                  <div className="h-3 bg-slate-100 w-2/3 rounded-md"></div>
                </div>
                <p className="sr-only">Loading timeline details...</p>
              </div>
            ) : activeStage ? (
              <>
                <div className="bg-slate-800 h-40 flex items-end p-5 relative">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <span className="material-symbols-outlined text-white" style={{ fontSize: '6rem' }}>{activeStage.icon}</span>
                  </div>
                  <div className="relative z-10">
                    {activeStage.status === 'active' && (
                      <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-sm uppercase tracking-wider mb-2 inline-block">ACTIVE PHASE</span>
                    )}
                    <h2 className="font-['Public_Sans'] font-bold text-white text-2xl">{activeStage.title}</h2>
                    <p className="text-white/60 text-xs font-medium uppercase tracking-widest mt-1">{activeStage.date}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-100 pb-4">
                    <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      Official-source guided
                    </span>
                    <a 
                      href="https://www.eci.gov.in/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 hover:bg-blue-100 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                      Verify with ECI
                    </a>
                    <button 
                      onClick={() => setSelectedExplainer(phaseExplainers.find(e => e.phaseId === activeStage.id))}
                      className="text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 hover:bg-amber-100 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[12px]">play_circle</span>
                      {understoodExplainers.includes(activeStage.id) ? 'Review 30-sec Explainer' : 'Watch 30-sec Explainer'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                      <button 
                        onClick={handlePrev} 
                        disabled={activeIndex === 0}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary disabled:opacity-30 transition-all"
                      >
                        <span className="material-symbols-outlined text-base">chevron_left</span>
                      </button>
                      <button 
                        onClick={handleNext}
                        disabled={activeIndex === timelineStages.length - 1}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary disabled:opacity-30 transition-all"
                      >
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                      </button>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stage {activeStage.id} of {timelineStages.length}</span>
                  </div>

                  <p className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3">Process Summary</p>
                  <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">{activeStage.detail}</p>
                  
                  <p className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3">Key Requirements</p>
                  <ul className="flex flex-col gap-3 mb-8">
                    {activeStage.keyPoints.map((kp, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary shrink-0 text-base mt-0.5">check_circle</span>
                        {kp}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col gap-3">
                    {contextualAction && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={contextualAction.action}
                      >
                        <span className="material-symbols-outlined text-sm">{contextualAction.icon}</span>
                        {contextualAction.label}
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => navigate('/assistant', { state: { question: `Explain the "${activeStage.title}" phase of Indian elections in detail.` } })}
                    >
                      <span className="material-symbols-outlined text-sm">smart_toy</span>
                      Ask Assistant for Detail
                    </Button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </aside>
      </div>
      {selectedExplainer && (
        <PhaseExplainer 
          explainer={selectedExplainer} 
          onClose={() => setSelectedExplainer(null)} 
          onUnderstood={() => handleUnderstood(selectedExplainer.phaseId)}
        />
      )}
    </div>
  );
}
