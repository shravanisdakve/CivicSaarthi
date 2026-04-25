import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checklistItems } from '../data/checklist.js';

const STORAGE_KEY = 'civicChecklist';

function loadChecked() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function Checklist() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(loadChecked);
  const [voterReady, setVoterReady] = useState(false);

  const doneCount = checklistItems.filter((i) => checked[i.id]).length;
  const total = checklistItems.length;
  const pct = Math.round((doneCount / total) * 100);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(checked)); } catch {}
    if (doneCount === total) setVoterReady(true);
  }, [checked, doneCount, total]);

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleAskAI = (question) => navigate('/assistant', { state: { question } });

  // Voter Ready screen
  if (voterReady) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 relative overflow-hidden bg-[#fbf8ff]">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary-fixed rounded-full blur-[100px] opacity-40 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-secondary-fixed rounded-full blur-[100px] opacity-40 pointer-events-none" />
        <div className="relative z-10 bg-white rounded-2xl shadow-card-hover p-10 max-w-lg w-full text-center border border-slate-200">
          <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary icon-fill" style={{ fontSize: '2.5rem' }}>verified</span>
          </div>
          <h1 className="font-['Public_Sans'] text-3xl font-bold text-primary mb-2">Voter Ready!</h1>
          <p className="text-on-surface-variant mb-8 text-sm">Congratulations. You have successfully completed all necessary preparations for the upcoming election.</p>

          <div className="bg-surface-container-low rounded-xl p-5 mb-6 text-left border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Public_Sans'] font-semibold text-on-surface">Readiness Checklist</h2>
              <span className="text-xs bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-semibold">100% Complete</span>
            </div>
            {[
              { label: 'Voter Registration Verified', sub: 'Your status is active in the national registry.' },
              { label: 'Required Identification Secured', sub: 'Approved photo ID has been confirmed.' },
              { label: 'Ballot Review Completed', sub: 'Candidates and measures have been reviewed.' },
            ].map((row) => (
              <div key={row.label} className="flex items-start gap-3 py-3 border-t border-slate-200 first:border-0 first:pt-0">
                <span className="material-symbols-outlined text-secondary shrink-0 icon-fill mt-0.5">check_circle</span>
                <div>
                  <p className="font-semibold text-sm text-on-surface">{row.label}</p>
                  <p className="text-xs text-on-surface-variant">{row.sub}</p>
                </div>
              </div>
            ))}
            <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-full text-sm text-on-surface hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-sm">download</span>
              Download Readiness Summary PDF
            </button>
          </div>

          <p className="text-xs uppercase tracking-widest text-slate-400 mb-3 font-semibold">Recommended Next Steps</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: 'location_on', title: 'Find Polling Station', sub: 'Locate your designated voting center and plan your route.' },
              { icon: 'notification_add', title: 'Set Election Day Reminder', sub: "Add a calendar event to ensure you don't miss the deadline." },
            ].map((step) => (
              <button key={step.title} className="flex flex-col items-start p-4 rounded-xl border border-slate-200 hover:border-primary text-left transition-all">
                <span className="material-symbols-outlined text-primary bg-primary-fixed w-9 h-9 rounded-full flex items-center justify-center shrink-0 mb-3">{step.icon}</span>
                <p className="font-semibold text-sm text-on-surface mb-1">{step.title}</p>
                <p className="text-xs text-on-surface-variant">{step.sub}</p>
              </button>
            ))}
          </div>
          <button onClick={() => setVoterReady(false)} className="text-sm text-primary flex items-center gap-2 mx-auto hover:underline">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-['Public_Sans'] text-3xl font-bold text-on-surface mb-2">Your Voter Checklist</h1>
        <p className="text-on-surface-variant text-sm max-w-lg">
          Follow these institutional steps to ensure you are fully prepared for election day. Your progress is automatically saved.
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6 mb-8 flex items-center justify-between gap-6">
        <div className="flex-grow">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-['Public_Sans'] text-4xl font-bold text-on-surface">{pct}%</span>
            <span className="text-on-surface-variant text-sm font-medium">Completed</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2">
            <div className="h-2.5 bg-primary rounded-full progress-bar" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-on-surface-variant">{doneCount} of {total} mandatory steps verified.</p>
        </div>
        {/* Voter Ready badge */}
        <div className="shrink-0 text-center">
          <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-1 ${pct === 100 ? 'border-primary bg-primary-fixed' : 'border-slate-300 bg-slate-50'}`}>
            <span className={`material-symbols-outlined text-2xl ${pct === 100 ? 'text-primary icon-fill' : 'text-slate-400'}`}>verified</span>
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">VOTER READY</p>
          <p className="text-xs text-slate-400">{pct === 100 ? 'Achieved!' : 'Pending'}</p>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card divide-y divide-slate-100">
        <div className="p-5 pb-4">
          <h2 className="font-['Public_Sans'] font-semibold text-on-surface">Preparation Steps</h2>
        </div>
        {checklistItems.map((item) => {
          const done = !!checked[item.id];
          return (
            <div
              key={item.id}
              className={`flex items-center gap-4 px-5 py-4 transition-colors ${done ? '' : 'hover:bg-slate-50'}`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggle(item.id)}
                aria-label={`Mark "${item.label}" as ${done ? 'incomplete' : 'complete'}`}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  done ? 'bg-primary border-primary' : 'border-slate-300 hover:border-primary'
                }`}
              >
                {done && <span className="material-symbols-outlined text-white text-sm icon-fill">check</span>}
              </button>

              {/* Label */}
              <div className={`flex-grow ${done ? 'opacity-60' : ''}`}>
                <p className={`font-semibold text-sm text-on-surface ${done ? 'line-through' : ''}`}>{item.label}</p>
                <p className="text-xs text-on-surface-variant">{item.detail}</p>
              </div>

              {/* Status + Ask AI */}
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${done ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-primary'}`}>
                  {done ? 'Done' : 'Pending'}
                </span>
                <button
                  onClick={() => handleAskAI(item.aiQuestion)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    !done ? 'bg-primary text-white border-primary hover:bg-primary-container' : 'border-slate-300 text-on-surface-variant hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">smart_toy</span>
                  Ask AI
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
