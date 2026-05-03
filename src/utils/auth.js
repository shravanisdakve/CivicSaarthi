import { saveProfile, clearProfile } from './profileStorage.js';

/**
 * Handles guest login by setting up a local profile.
 */
export function loginAsGuest() {
  saveProfile({
    name: 'Guest Citizen',
    authProvider: 'guest',
    avatar: '',
  });
}

import { auth, googleProvider, isFirebaseConfigured } from './firebase.js';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

/**
 * Initiates Google Sign-In using Firebase.
 */
export async function loginWithGoogle() {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Google Authentication is not configured on this deployment. Please check environment variables.'
    );
  }

  const result = await signInWithPopup(auth, googleProvider);
  return { success: true, user: result.user };
}

/**
 * Signs in with email and password using Firebase.
 */
export async function loginWithEmail(email, password) {
  if (!isFirebaseConfigured) throw new Error('Authentication not configured.');
  const result = await signInWithEmailAndPassword(auth, email, password);
  return { success: true, user: result.user };
}

/**
 * Registers a new user with email and password using Firebase.
 */
export async function registerWithEmail(email, password) {
  if (!isFirebaseConfigured) throw new Error('Authentication not configured.');
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return { success: true, user: result.user };
}

export async function signOut() {
  try {
    await auth.signOut();
    clearProfile();
  } catch {
    clearProfile();
  }
}
