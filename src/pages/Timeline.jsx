import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { timelineStages } from '../data/timeline.js';
import Button from '../components/Button.jsx';

const INITIAL_VISIBLE = 5;

export default function Timeline() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(3); // Candidate Nominations is active by default
  const [showAll, setShowAll] = useState(false);

  const activeStage = timelineStages.find((s) => s.id === activeId);
  const visibleStages = showAll ? timelineStages : timelineStages.slice(0, INITIAL_VISIBLE);
  const currentPhase = timelineStages.find((s) => s.status === 'active');

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-['Public_Sans'] text-3xl md:text-4xl font-bold text-primary mb-3">Election Timeline</h1>
        <p className="text-on-surface-variant max-w-xl mx-auto">
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
              <p className="text-sm text-on-surface-variant">Step {currentPhase.id} of {timelineStages.length} • {currentPhase.date}</p>
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
                onClick={() => setActiveId(stage.id)}
                className={`w-full text-left rounded-xl border-2 p-5 transition-all ${
                  isSelected
                    ? 'border-primary bg-white shadow-card-hover'
                    : isActive
                    ? 'border-primary/30 bg-white'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Step indicator */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    isCompleted ? 'bg-primary text-white' : isActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isCompleted ? <span className="material-symbols-outlined text-sm">check</span> : stage.id}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {stage.step}{isActive ? ' • ACTIVE' : ''}
                      </span>
                      <span className="text-xs text-slate-400 ml-2 shrink-0">{stage.date}</span>
                    </div>
                    <h3 className="font-['Public_Sans'] font-semibold text-on-surface mb-1">{stage.title}</h3>
                    <p className="text-sm text-on-surface-variant">{stage.shortDesc}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-2 hover:underline">
                      {isSelected ? 'View Details' : 'Learn more'} →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Load more */}
          {!showAll && (
            <div className="text-center pt-2">
              <Button variant="outline" onClick={() => setShowAll(true)}>
                Load Remaining Stages
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Detail Panel */}
        {activeStage && (
          <aside className="md:col-span-2">
            <div className="sticky top-24 bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
              <div className="bg-slate-800 h-40 flex items-end p-4 relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <span className="material-symbols-outlined text-white" style={{ fontSize: '5rem' }}>{activeStage.icon}</span>
                </div>
                {activeStage.status === 'active' && (
                  <span className="relative z-10 text-xs font-semibold bg-primary text-white px-2 py-0.5 rounded">ACTIVE PHASE</span>
                )}
                <h2 className="relative z-10 font-['Public_Sans'] font-bold text-white text-xl ml-2">{activeStage.title}</h2>
              </div>
              <div className="p-6">
                <p className="text-sm font-semibold text-on-surface mb-2">What happens during this stage?</p>
                <p className="text-sm text-on-surface-variant mb-5">{activeStage.detail}</p>
                <p className="text-sm font-semibold text-on-surface mb-3">Key Requirements</p>
                <ul className="flex flex-col gap-2 mb-6">
                  {activeStage.keyPoints.map((kp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary shrink-0 text-base mt-0.5">arrow_right</span>
                      {kp}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => navigate('/assistant', { state: { question: `Tell me more about the "${activeStage.title}" stage in Indian elections.` } })}
                >
                  <span className="material-symbols-outlined text-sm">smart_toy</span>
                  Ask AI about this step
                </Button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
