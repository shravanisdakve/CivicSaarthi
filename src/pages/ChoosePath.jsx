import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PERSONAS } from '../data/personas.js';
import Button from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';

const PREVIEW_DATA = {
  'first-time': {
    title: 'First-Time Voter Guide',
    sub: 'Your complete step-by-step journey.',
    features: [
      { label: 'Registration Basics', detail: 'How to get your Voter ID.' },
      { label: 'Polling Day Guide', detail: 'What to expect at the booth.' },
      { label: 'Verification', detail: 'How to use VVPAT safely.' }
    ]
  },
  'student': {
    title: 'Student & Researcher Hub',
    sub: 'Deep dives and data access.',
    features: [
      { label: 'Timeline Tracking', detail: 'Track MCC and election phases.' },
      { label: 'Terminology', detail: 'Access the comprehensive glossary.' },
      { label: 'Official Sources', detail: 'Direct links to ECI and portals.' }
    ]
  },
  'candidate': {
    title: 'Candidate Resource Center',
    sub: 'Understand rules and compliance.',
    features: [
      { label: 'Nomination Rules', detail: 'Filing deadlines and forms.' },
      { label: 'MCC Compliance', detail: 'Campaigning do\'s and don\'ts.' },
      { label: 'Polling Day Protocols', detail: 'Guidelines for agents.' }
    ]
  },
  'observer': {
    title: 'Observer Toolkit',
    sub: 'Tools for monitoring the process.',
    features: [
      { label: 'Violation Reporting', detail: 'How to use cVIGIL app.' },
      { label: 'Booth Protocols', detail: 'Rules for inside the station.' },
      { label: 'EVM Checks', detail: 'Understanding mock polls.' }
    ]
  },
  'citizen': {
    title: 'Citizen Dashboard',
    sub: 'Stay informed and ready.',
    features: [
      { label: 'Quick Readiness', detail: 'Checklist to ensure you can vote.' },
      { label: 'Timeline', detail: 'Key dates you need to know.' },
      { label: 'Assistant', detail: 'Ask any questions securely.' }
    ]
  }
};

import { getSelectedPersona, saveSelectedPersona } from '../utils/profileStorage.js';

export default function ChoosePath() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(() => getSelectedPersona());

  const preview = PREVIEW_DATA[selected] || PREVIEW_DATA['first-time'];

  const handleChoose = (id) => {
    setSelected(id);
    saveSelectedPersona(id);
  };

  const handleContinue = () => navigate('/assistant');

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      <div className="text-center mb-10">
        <Badge variant="primary" className="mb-4">Personalization</Badge>
        <h1 className="font-['Public_Sans'] text-3xl md:text-4xl font-bold text-primary mb-3">Choose Your Path</h1>
        <p className="text-on-surface-variant text-base max-w-2xl mx-auto">
          Select a persona to tailor your CivicSaarthi experience. We'll customize your guide, timeline, and checklist based on your specific needs in the electoral process.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PERSONAS.map((p) => {
            const isSelected = selected === p.id;
            return (
              <div
                key={p.id}
                className={`rounded-2xl border-2 p-5 flex flex-col gap-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-white shadow-md'
                    : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
                onClick={() => handleChoose(p.id)}
              >
                <div className="flex items-center gap-4">
                  <span className={`material-symbols-outlined w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-primary text-white shadow-inner' : 'bg-surface-container text-primary'}`}>
                    {p.icon}
                  </span>
                  <div className="flex-grow">
                    <h3 className="font-bold text-base text-on-surface">{p.label}</h3>
                    <p className="text-xs text-slate-500">{p.sub}</p>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <aside className="bg-surface-container-lowest rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm h-fit sticky top-6">
          <Badge variant="secondary" className="mb-3">Preview</Badge>
          <h2 className="font-['Public_Sans'] font-bold text-xl text-on-surface mb-2">{preview.title}</h2>
          <p className="text-sm text-on-surface-variant mb-6">{preview.sub}</p>
          <ul className="flex flex-col gap-5 mb-8">
            {preview.features.map((f) => (
              <li key={f.label} className="flex gap-3">
                <span className="material-symbols-outlined text-primary shrink-0 icon-fill text-xl mt-0.5">verified</span>
                <div>
                  <p className="font-bold text-sm text-on-surface">{f.label}</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{f.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <Button variant="primary" className="w-full justify-center shadow-md hover:shadow-lg" onClick={handleContinue}>
            Continue to Assistant
          </Button>
        </aside>
      </div>
    </div>
  );
}
