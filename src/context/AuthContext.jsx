import { createContext, useContext, useEffect, useState } from 'react';
import { auth, isFirebaseConfigured, db } from '../utils/firebase.js'; // Import db
import { onAuthStateChanged } from 'firebase/auth';
import { saveProfile } from '../utils/profileStorage.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          name: firebaseUser.displayName || 'Civic Citizen',
          email: firebaseUser.email,
          authProvider: 'google',
          avatar: firebaseUser.photoURL || '',
        };
        setUser(userData);
        saveProfile(userData); // Sync with guestProfile logic for backwards compatibility
      } else {
        setUser(null);
        // We don't clearProfile() here because guest profiles should persist
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [saveProfile]); // Add saveProfile to dependencies

  return (
    <AuthContext.Provider value={{ user, loading, isFirebaseConfigured, db }}>
      {' '}
      {/* Include db in value */}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
