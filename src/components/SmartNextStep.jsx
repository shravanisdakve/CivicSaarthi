import { useNavigate } from 'react-router-dom';
import Card from './Card.jsx';
import Button from './Button.jsx';
import { getSmartRecommendation } from '../utils/recommendations.js';
import Badge from './Badge.jsx';

export default function SmartNextStep() {
  const navigate = useNavigate();
  const personaId = localStorage.getItem('civicPersona') || 'first-time';
  
  let completedCount = 0;
  try {
    const saved = localStorage.getItem('civicChecklist');
    if (saved) {
      const parsed = JSON.parse(saved);
      completedCount = Object.values(parsed).filter(Boolean).length;
    }
  } catch (e) {}

  const steps = getSmartRecommendation(personaId, completedCount);

  return (
    <Card className="p-6 md:p-8 bg-surface-container-lowest border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <Badge variant="secondary" className="mb-2">Personalized For You</Badge>
          <h3 className="text-xl font-bold font-['Public_Sans']">What should I do next?</h3>
        </div>
        <div className="w-10 h-10 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center">
          <span className="material-symbols-outlined">lightbulb</span>
        </div>
      </div>
      
      <ul className="space-y-4 mb-8">
        {steps.map((step, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary mt-0.5 text-[20px]">check_circle</span>
            <span className="text-sm font-medium text-on-surface-variant leading-relaxed">{step}</span>
          </li>
        ))}
      </ul>
      
      <Button variant="primary" onClick={() => window.dispatchEvent(new CustomEvent('civicOpenChat'))} className="w-full justify-center">
        Ask CivicSaarthi
      </Button>
    </Card>
  );
}
