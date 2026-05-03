const STORAGE_KEY = 'civicProfile';

const defaultProfile = {
  name: 'Guest Citizen',
  avatar: '',
  selectedPersona: 'first-time',
  checklistProgress: {},
  quizScore: null,
  readinessPoints: 0,
  lastActiveAt: new Date().toISOString(),
};

export function getProfile() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    let parsed = {};
    if (data) {
      parsed = JSON.parse(data);
    }
    const finalProfile = { ...defaultProfile, ...parsed };
    // Strict safety check for string methods (split, trim) used across the app
    if (!finalProfile.name || typeof finalProfile.name !== 'string') {
      finalProfile.name = 'Guest Citizen';
    }
    return finalProfile;
  } catch {
    return { ...defaultProfile };
  }
}

export function saveProfile(updates) {
  try {
    const current = getProfile();
    const newProfile = { ...current, ...updates, lastActiveAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    // Dispatch event to sync UI across tabs/components
    window.dispatchEvent(new Event('civicProfileUpdated'));
    return newProfile;
  } catch {
    return getProfile();
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    // Legacy keys cleanup
    localStorage.removeItem('civicPersona');
    localStorage.removeItem('civicChecklist');
    localStorage.removeItem('civicIntroSeen'); // Add this for cleanup
    localStorage.removeItem('civicChatHistory'); // Add this for cleanup
    window.dispatchEvent(new Event('civicProfileUpdated'));
  } catch {
    // Fail silently if localStorage is not available
  }
}

export const clearGuestName = clearProfile;

export function getSelectedPersona() {
  const legacy = localStorage.getItem('civicPersona');
  if (legacy) {
    saveProfile({ selectedPersona: legacy });
    localStorage.removeItem('civicPersona');
    return legacy;
  }
  return getProfile().selectedPersona || 'first-time';
}

export function saveSelectedPersona(personaId) {
  saveProfile({ selectedPersona: personaId });
}

export function getChecklistProgress() {
  const legacy = localStorage.getItem('civicChecklist');
  if (legacy) {
    try {
      const parsed = JSON.parse(legacy);
      saveProfile({ checklistProgress: parsed });
      localStorage.removeItem('civicChecklist');
      return parsed;
    } catch { return {}; }
  }
  return getProfile().checklistProgress || {};
}

export function saveChecklistProgress(progress) {
  const current = getProfile();
  saveProfile({ checklistProgress: progress });
  // Update points based on progress
  calculateReadinessPoints({ ...current, checklistProgress: progress });
}

export function getQuizProgress() {
  return getProfile().quizScore;
}

export function saveQuizProgress(score) {
  const current = getProfile();
  saveProfile({ quizScore: score });
  calculateReadinessPoints({ ...current, quizScore: score });
}

export function calculateReadinessPoints(profile = getProfile()) {
  let points = 0;

  // Checklist points (10 per item)
  const checklist = profile.checklistProgress || {};
  const completedChecklistItems = Object.values(checklist).filter(Boolean).length;
  points += completedChecklistItems * 10;

  // Quiz points (20 per correct answer, max 100)
  if (profile.quizScore !== null) {
    points += profile.quizScore * 20;
  }

  // Persona selection bonus (10 points)
  if (profile.selectedPersona) {
    points += 10;
  }

  saveProfile({ readinessPoints: points });
  return points;
}
