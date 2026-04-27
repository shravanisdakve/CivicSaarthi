import { useNavigate } from 'react-router-dom';
import PollingGuidancePreview from '../components/PollingGuidancePreview.jsx';
import VoterMap from '../components/VoterMap.jsx';
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
          Civic Resource Finder
        </h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto text-lg leading-relaxed mb-6">
          Find election offices, help centers, and essential civic services near you using Google Maps Platform.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12">
          <Button variant="outline" size="sm" className="text-primary flex items-center gap-2" onClick={() => navigate('/assistant?prompt=How%20can%20I%20verify%20my%20official%20polling%20station%20safely%3F')}>
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            Ask AI about verification
          </Button>
          <div className="flex gap-2">
            <span className="text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100">
              <span className="material-symbols-outlined text-[14px]">map</span>
              Google Maps Platform: Active
            </span>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <VoterMap />
      </div>

      <PollingGuidancePreview />

      <div className="mt-16 text-center border-t border-slate-100 pt-12">
         <div className="flex items-center justify-center gap-2 mb-4">
           <span className="material-symbols-outlined text-primary text-xl">map</span>
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Google Maps Platform Integration</span>
         </div>
         <p className="text-xs text-slate-400 max-w-xl mx-auto italic uppercase tracking-widest leading-loose">
           Google Maps Platform is used for election office and help-center discovery. CivicSaarthi does not show officially assigned polling booths. Always verify through official voter services.
         </p>
      </div>
    </div>
  );
}
