import { useNavigate } from 'react-router-dom';
import PollingGuidancePreview from '../components/PollingGuidancePreview.jsx';
import Button from '../components/Button.jsx';
import { trackVisit } from '../utils/badgeEngine.js';
import { useEffect } from 'react';

export default function MapHelper() {
  const navigate = useNavigate();

  useEffect(() => {
    trackVisit('map');
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="font-['Public_Sans'] text-3xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
          Polling Station Guidance Preview
        </h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto text-lg leading-relaxed mb-6">
          Learn how to verify your polling station and plan your visit using official voter services and Google Maps.
        </p>
        <div className="flex justify-center mb-8">
          <Button variant="outline" size="sm" className="text-primary flex items-center gap-2" onClick={() => navigate('/assistant?prompt=How%20can%20I%20verify%20my%20official%20polling%20station%20safely%3F')}>
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            Ask CivicSaarthi how to verify my polling station
          </Button>
        </div>
      </div>

      <PollingGuidancePreview />

      <div className="mt-16 text-center border-t border-slate-100 pt-12">
         <p className="text-xs text-slate-400 max-w-xl mx-auto italic uppercase tracking-widest leading-loose">
           Google Maps/Search helps users plan routes to election offices or assistance centers. Official polling booth assignment must be verified through official voter services.
         </p>
      </div>
    </div>
  );
}
