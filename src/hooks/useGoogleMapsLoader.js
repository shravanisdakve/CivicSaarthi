import { useState, useEffect } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;

let isScriptLoaded = false;
let resolveLoadPromise;
const loadPromise = new Promise((resolve) => {
  resolveLoadPromise = resolve;
});

// This function needs to be globally accessible for the Google Maps script to call it
window.initGoogleMaps = () => {
  resolveLoadPromise();
  isScriptLoaded = true;
};

export function useGoogleMapsLoader() {
  const [isLoaded, setIsLoaded] = useState(isScriptLoaded);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (isScriptLoaded) {
      setIsLoaded(true);
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      setLoadError('Google Maps API Key is missing. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.');
      return;
    }

    // Check if the script is already being loaded by another instance of the hook
    if (document.querySelector(`script[src="${GOOGLE_MAPS_URL}"]`)) {
      loadPromise.then(() => setIsLoaded(true)).catch(setLoadError);
      return;
    }

    const script = document.createElement('script');
    script.src = GOOGLE_MAPS_URL;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setLoadError('Failed to load Google Maps API script.');
    };
    document.head.appendChild(script);

    loadPromise.then(() => setIsLoaded(true)).catch(setLoadError);

    return () => {
      // Cleanup: Optionally remove the script if no longer needed,
      // but typically Google Maps API scripts are left in for the session.
      // For this simple example, we won't remove it.
    };
  }, []);

  return { isLoaded, loadError };
}
