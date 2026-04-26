import { saveProfile, clearProfile } from './guestProfile.js';

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

import { auth, googleProvider, isFirebaseConfigured } from './firebase.js';
import { signInWithPopup } from 'firebase/auth';

/**
 * Initiates Google Sign-In using Firebase.
 */
export async function loginWithGoogle() {
  if (!isFirebaseConfigured) {
    console.warn("Firebase not configured. Using demo fallback.");
    saveProfile({
      name: 'Shravani Sunil Dakve',
      email: 'shravanisdakve@gmail.com',
      authProvider: 'google',
      avatar: ''
    });
    return { success: true, demo: true };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    saveProfile({
      name: user.displayName || 'Civic Citizen',
      email: user.email,
      authProvider: 'google',
      avatar: user.photoURL || ''
    });
    
    return { success: true, user };
  } catch (error) {
    console.error("Firebase Auth Error:", error.message);
    
    // Fallback for local development if no config
    if (error.code === 'auth/invalid-api-key' || error.code === 'auth/network-request-failed') {
      console.warn("Using demo fallback due to missing/invalid Firebase config.");
      saveProfile({
        name: 'Shravani Sunil Dakve',
        email: 'shravanisdakve@gmail.com',
        authProvider: 'google',
        avatar: ''
      });
      return { success: true, demo: true };
    }
    
    return { success: false, error: error.message };
  }
}

export async function signOut() {
  try {
    await auth.signOut();
    clearProfile();
  } catch (error) {
    console.error("Sign Out Error:", error.message);
    clearProfile();
  }
}
