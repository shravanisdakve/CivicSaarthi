import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { personas } from '../data/personas.js';
import Button from '../components/Button.jsx';

export default function ChoosePath() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(() => {
    try { return localStorage.getItem('civicPersona') || 'first-time'; } catch { return 'first-time'; }
  });

  const preview = personas.find((p) => p.id === selected) || personas[0];

  const handleChoose = (id) => {
    setSelected(id);
    try { localStorage.setItem('civicPersona', id); } catch {}
  };

  const handleContinue = () => navigate('/checklist');

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-['Public_Sans'] text-3xl md:text-4xl font-bold text-primary mb-3">Choose Your Path</h1>
        <p className="text-on-surface-variant text-base max-w-2xl mx-auto">
          Select a persona to tailor your CivicSaarthi experience. We'll customize your guide, timeline, and checklist based on your specific needs in the electoral process.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left + Centre: Persona Cards Grid */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {personas.map((p) => {
            const isSelected = selected === p.id;
            return (
              <div
                key={p.id}
                className={`rounded-xl border-2 p-5 flex flex-col gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-white shadow-card-hover'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                onClick={() => handleChoose(p.id)}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-primary text-white' : 'bg-surface-container text-primary'}`}>
                    {p.icon}
                  </span>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <h3 className="font-['Public_Sans'] font-semibold text-on-surface">{p.title}</h3>
                      {p.recommended && (
                        <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Recommended</span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant">{p.description}</p>
                <button
                  className={`mt-auto w-full py-2 rounded-full text-sm font-semibold transition-colors ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'border border-slate-300 text-on-surface hover:bg-surface-container-low'
                  }`}
                  onClick={(e) => { e.stopPropagation(); handleChoose(p.id); }}
                >
                  {isSelected ? 'Selected' : 'Choose path'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Right: Preview Panel */}
        <aside className="bg-white rounded-xl border border-slate-200 p-6 shadow-card h-fit">
          <h2 className="font-['Public_Sans'] font-bold text-on-surface mb-2">{preview.previewTitle}</h2>
          <p className="text-sm text-on-surface-variant mb-5">{preview.previewSubtitle}</p>
          <ul className="flex flex-col gap-4 mb-6">
            {preview.features.map((f) => (
              <li key={f.label} className="flex gap-3">
                <span className="material-symbols-outlined text-secondary shrink-0 icon-fill text-xl mt-0.5">check_circle</span>
                <div>
                  <p className="font-semibold text-sm text-on-surface">{f.label}</p>
                  <p className="text-xs text-on-surface-variant">{f.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <Button variant="primary" className="w-full" onClick={handleContinue}>
            Continue with this path
          </Button>
        </aside>
      </div>
    </div>
  );
}
