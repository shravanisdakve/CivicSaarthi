import { useState, useEffect } from 'react';

export default function OfflineStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:w-96 animate-in slide-in-from-bottom-4">
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl shadow-xl flex items-start gap-3">
        <div className="bg-amber-100 p-2 rounded-full text-amber-600">
          <span className="material-symbols-outlined text-[20px]">cloud_off</span>
        </div>
        <div>
          <p className="text-sm font-bold text-amber-900 leading-tight">
            Offline Guide Mode
          </p>
          <p className="text-xs text-amber-700 mt-1">
            CivicSaarthi is using built-in civic guidance. AI responses and maps will return when you are back online.
          </p>
        </div>
        <button 
          onClick={() => setIsOffline(false)}
          className="text-amber-400 hover:text-amber-600 ml-auto"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
}
