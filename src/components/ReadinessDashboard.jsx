import { useNavigate } from 'react-router-dom';
import Card from './Card.jsx';
import Button from './Button.jsx';
import { PERSONAS } from '../data/personas.js';
import { getProfile } from '../utils/profileStorage.js';
import { useTranslation } from '../hooks/useTranslation.js';

export default function ReadinessDashboard() {
  const navigate = useNavigate();
  const profile = getProfile();
  const personaId = profile.selectedPersona;
  const persona = PERSONAS.find(p => p.id === personaId) || PERSONAS[0];
  const { t } = useTranslation();
  
  const completedCount = Object.values(profile.checklistProgress || {}).filter(Boolean).length;
  const totalCount = 7;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <Card className="p-6 md:p-8 bg-white border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
      
      <h2 className="text-2xl font-bold font-['Public_Sans'] mb-6 text-on-surface">{t('dash.title')}</h2>
      
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        {/* Profile Card */}
        <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-slate-100 min-w-[240px]">
          <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-2xl">{persona.icon}</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{t('dash.selectedPath')}</p>
            <p className="font-bold text-on-surface">{persona.label}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex-grow w-full">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">{t('checklist.title')}</p>
              <p className="text-lg font-bold text-primary">{percentage}% <span className="text-sm font-normal text-slate-500">({completedCount} of {totalCount} {t('checklist.complete')})</span></p>
            </div>
            <button onClick={() => navigate('/checklist')} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              {t('checklist.continue')} <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <p className="text-sm font-semibold mb-3 text-on-surface">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => window.dispatchEvent(new CustomEvent('civicOpenChat'))} className="text-xs py-1.5 px-3">{t('nav.assistant')}</Button>
          <Button variant="outline" onClick={() => navigate('/checklist')} className="text-xs py-1.5 px-3">{t('nav.checklist')}</Button>
          <Button 
            variant="outline" 
            onClick={(e) => {
              import('../utils/summaryExport.js').then(async ({ downloadReadinessSummary }) => {
                const { checklistItems } = await import('../data/checklist.js');
                const saved = localStorage.getItem('civicChecklist');
                const checked = saved ? JSON.parse(saved) : {};
                const itemsWithStatus = checklistItems.map(i => ({ ...i, completed: !!checked[i.id] }));
                
                downloadReadinessSummary({
                  persona: personaId,
                  checklistItems: itemsWithStatus,
                  readinessPercent: percentage,
                  nextAction: t('dash.nextAction')
                });
                
                const btn = e.currentTarget;
                const originalText = btn.innerText;
                btn.innerText = t('checklist.completed');
                setTimeout(() => { btn.innerText = originalText; }, 2000);
              });
            }} 
            className="text-xs py-1.5 px-3"
          >
            {t('cta.downloadSummary')}
          </Button>
          <Button variant="outline" onClick={() => navigate('/timeline')} className="text-xs py-1.5 px-3">{t('nav.timeline')}</Button>
          <Button variant="outline" onClick={() => navigate('/glossary')} className="text-xs py-1.5 px-3">{t('nav.glossary')}</Button>
          <Button variant="outline" onClick={() => navigate('/sources')} className="text-xs py-1.5 px-3">{t('nav.sources')}</Button>
        </div>
      </div>
    </Card>
  );
}
