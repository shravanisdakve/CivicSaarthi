const STORAGE_KEY = 'civicProfile';

const defaultProfile = {
  name: 'Guest Citizen',
  avatar: '',
  selectedPersona: 'first-time',
  checklistProgress: {},
  quizScore: null,
  readinessPoints: 0,
  lastActiveAt: new Date().toISOString()
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
    window.dispatchEvent(new Event('civicProfileUpdated'));
    return newProfile;
  } catch (e) {
    console.error('Failed to save profile', e);
    return getProfile();
  }
}

export function clearGuestName() {
  saveProfile({ name: 'Guest Citizen' });
}

export function getDisplayName() {
  const profile = getProfile();
  return profile.name || 'Guest Citizen';
}

export function sanitizeDisplayName(name) {
  if (!name) return 'Guest Citizen';
  return name.trim().substring(0, 30).replace(/[<>]/g, ''); // Simple XSS prevention
}

export function getChecklistProgress() {
  return getProfile().checklistProgress || {};
}

export function saveChecklistProgress(progress) {
  return saveProfile({ checklistProgress: progress });
}

export function saveQuizProgress(score) {
  return saveProfile({ quizScore: score, readinessPoints: (getProfile().readinessPoints || 0) + 10 });
}

export function clearProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    // Legacy keys cleanup
    localStorage.removeItem('civicPersona');
    localStorage.removeItem('civicChecklist');
    localStorage.removeItem('civicIntroSeen');
    localStorage.removeItem('civicChatHistory');
    window.dispatchEvent(new Event('civicProfileUpdated'));
  } catch (e) {
    console.error('Failed to clear profile', e);
  }
}
