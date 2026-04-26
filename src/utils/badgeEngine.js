import { getProfile, saveProfile } from './guestProfile.js';
import { badges } from '../data/badges.js';

export function checkNewBadges() {
  const profile = getProfile();
  const currentBadges = profile.badges || [];
  const newEarned = [];

  // 1. Civic Starter
  if (!currentBadges.includes('civic-starter')) {
    if (localStorage.getItem('civicIntroSeen') === 'true') {
      newEarned.push('civic-starter');
    }
  }

  // 2. Election Explorer
  if (!currentBadges.includes('election-explorer')) {
    const understood = profile.understoodExplainers || [];
    if (understood.length >= 3) {
      newEarned.push('election-explorer');
    }
  }

  // 3. Glossary Guru
  if (!currentBadges.includes('glossary-guru')) {
    const history = JSON.parse(sessionStorage.getItem('civicChatHistory') || '[]');
    const glossaryQueries = history.filter(m => m.text && (m.text.includes('What is') || m.text.includes('Explain'))).length;
    if (glossaryQueries >= 5) {
      newEarned.push('glossary-guru');
    }
  }

  // 4. Verification Champion
  if (!currentBadges.includes('verification-champion')) {
    const visits = JSON.parse(localStorage.getItem('civic_visit_history') || '{}');
    if (visits.sources || visits.map) {
      newEarned.push('verification-champion');
    }
  }

  // 5. Quiz Scholar
  if (!currentBadges.includes('quiz-scholar')) {
    if (profile.quizScore !== null) {
      newEarned.push('quiz-scholar');
    }
  }

  // 6. Voter Ready
  if (!currentBadges.includes('voter-ready')) {
    const checklist = profile.checklistProgress || {};
    const completedCount = Object.values(checklist).filter(Boolean).length;
    if (completedCount >= 7) {
      newEarned.push('voter-ready');
    }
  }

  // 7. Democracy Champion
  if (!currentBadges.includes('democracy-champion')) {
    const hasStarter = currentBadges.includes('civic-starter') || newEarned.includes('civic-starter');
    const hasQuiz = currentBadges.includes('quiz-scholar') || newEarned.includes('quiz-scholar');
    const hasReady = currentBadges.includes('voter-ready') || newEarned.includes('voter-ready');
    const hasExplorer = currentBadges.includes('election-explorer') || newEarned.includes('election-explorer');
    
    if (hasStarter && hasQuiz && hasReady && hasExplorer) {
      newEarned.push('democracy-champion');
    }
  }

  if (newEarned.length > 0) {
    const updatedBadges = [...currentBadges, ...newEarned];
    saveProfile({ badges: updatedBadges });
    return newEarned.map(id => badges.find(b => b.id === id));
  }

  return [];
}

export function trackVisit(page) {
  const visits = JSON.parse(localStorage.getItem('civic_visit_history') || '{}');
  visits[page] = true;
  localStorage.setItem('civic_visit_history', JSON.stringify(visits));
  checkNewBadges();
}
