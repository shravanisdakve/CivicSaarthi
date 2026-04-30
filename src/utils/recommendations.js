import { checklistItems } from '../data/checklist.js';
import { getProfile, getChecklistProgress } from './profileStorage.js';
import { translations } from '../data/translations.js';
import { getLanguage } from './language.js';

export function getSmartRecommendation(personaId) {
  const profile = getProfile();
  const completedChecklist = getChecklistProgress();
  const lang = getLanguage();

  const t = (key) => {
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  const uncompletedItems = checklistItems.filter(item => !completedChecklist[item.id]);

  let recommendations = [];

  // Prioritize uncompleted checklist items
  if (uncompletedItems.length > 0) {
    recommendations = uncompletedItems.slice(0, 2).map(item => ({
      title: item.label,
      description: item.detail,
      to: '/checklist'
    }));
  }

  // Add persona-specific general recommendations
  const generalRecommendations = {
    'first-time': [
      { title: t('reco.firstTime.verifyElectoral'), description: t('reco.firstTime.verifyElectoralDesc'), to: '/checklist' },
      { title: t('reco.firstTime.pollingDay'), description: t('reco.firstTime.pollingDayDesc'), to: '/checklist' },
      { title: t('reco.firstTime.vvpat'), description: t('reco.firstTime.vvpatDesc'), to: '/glossary/vvpat' },
    ],
    'student': [
      { title: t('reco.student.exploreTimeline'), description: t('reco.student.exploreTimelineDesc'), to: '/timeline' },
      { title: t('reco.student.learnTerms'), description: t('reco.student.learnTermsDesc'), to: '/glossary' },
      { title: t('reco.student.officialSources'), description: t('reco.student.officialSourcesDesc'), to: '/sources' },
    ],
    'candidate': [
      { title: t('reco.candidate.nomination'), description: t('reco.candidate.nominationDesc'), to: '/glossary/nomination' },
      { title: t('reco.candidate.mcc'), description: t('reco.candidate.mccDesc'), to: '/glossary/mcc' },
      { title: t('reco.candidate.officialSources'), description: t('reco.candidate.officialSourcesDesc'), to: '/sources' },
    ],
    'observer': [
      { title: t('reco.observer.pollingProtocols'), description: t('reco.observer.pollingProtocolsDesc'), to: '/glossary/polling-protocols' },
      { title: t('reco.observer.reportIssues'), description: t('reco.observer.reportIssuesDesc'), to: '/assistant?prompt=How%20to%20report%20election%20violations%3F' },
      { title: t('reco.observer.officialGuidance'), description: t('reco.observer.officialGuidanceDesc'), to: '/sources' },
    ],
    'citizen': [
      { title: t('reco.citizen.exploreTimeline'), description: t('reco.citizen.exploreTimelineDesc'), to: '/timeline' },
      { title: t('reco.citizen.checkReadiness'), description: t('reco.citizen.checkReadinessDesc'), to: '/checklist' },
      { title: t('reco.citizen.verifyDetails'), description: t('reco.citizen.verifyDetailsDesc'), to: '/sources' },
    ],
  };

  const finalRecommendations = [...recommendations, ...(generalRecommendations[personaId] || generalRecommendations['first-time'])];

  // Ensure unique recommendations and limit to 3-4
  const uniqueRecommendations = Array.from(new Set(finalRecommendations.map(r => r.title)))
                                  .map(title => finalRecommendations.find(r => r.title === title));

  return uniqueRecommendations.slice(0, 4);
}
