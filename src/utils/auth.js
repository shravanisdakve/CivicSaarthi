import { saveProfile, clearProfile } from './profileStorage.js';

/**
 * Handles guest login by setting up a local profile.
 */
export function loginAsGuest() {
  saveProfile({
    name: 'Guest Citizen',
    authProvider: 'guest',
    avatar: ''
  });
}

/**
 * Initiates Google Sign-In if configured, else falls back cleanly.
 * We simulate the Google flow here for the prototype unless real auth is wired.
 */
export function loginWithGoogle() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    // Demo fallback for prototype
    saveProfile({
      name: 'Shravani Dakve',
      email: 'shravanisdakve@gmail.com',
      authProvider: 'google',
      avatar: '/avatar.png'
    });
    return { success: true, demo: true };
  }
  
  // Here you would implement real Google OAuth initialization
  console.warn("Real Google Sign-In requires an OAuth provider implementation.");
  return { success: false, error: 'Not implemented' };
}

export function signOut() {
  clearProfile();
}
