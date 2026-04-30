// jest.setup.js
import '@testing-library/jest-dom';
import 'jest-fetch-mock'; // Import jest-fetch-mock

// Mock matchMedia for components that use it (e.g., responsive designs)
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

// Mock the firebase.js module to prevent it from accessing import.meta.env
// and to provide consistent mock objects for tests.
jest.mock('./src/utils/firebase.js', () => ({
  isFirebaseConfigured: true,
  firebaseConfig: {
    apiKey: 'mock-api-key',
    authDomain: 'mock-auth-domain',
    projectId: 'mock-project-id',
    storageBucket: 'mock-storage-bucket',
    messagingSenderId: 'mock-messaging-sender-id',
    appId: 'mock-app-id',
  },
  auth: { // Mock Firebase Auth object
    onAuthStateChanged: jest.fn((callback) => {
      // Immediately call callback with a mock user or null
      callback(null); 
      return jest.fn(); // Return an unsubscribe function
    }),
  }, 
  googleProvider: {}, // Mock GoogleAuthProvider
  db: {}, // Mock Firestore db object
}));

// You might need to mock other browser APIs if your components use them
// For example, if you use `URL.createObjectURL` or `navigator.clipboard`
// global.URL.createObjectURL = jest.fn();
// Object.defineProperty(navigator, 'clipboard', {
//   value: {
//     writeText: jest.fn(),
//   },
// });

