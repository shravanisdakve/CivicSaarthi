import { useState } from 'react';
import Button from './Button.jsx';

export default function ElectionOfficeMap() {
  const [query, setQuery] = useState('');
  const embedKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleSearch = (e) => {
    e.preventDefault();
    const searchQuery = query.trim() ? `${query} election office` : 'election office near me';
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    window.open(mapsUrl, '_blank');
  };

  const getEmbedUrl = () => {
    const q = query.trim() ? `${query} election office` : 'election office near me';
    return `https://www.google.com/maps/embed/v1/search?key=${embedKey}&q=${encodeURIComponent(q)}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-100">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-grow">
            <label htmlFor="city-search" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
              Search by City or District (Optional)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">location_on</span>
              <input
                id="city-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Pune, Mumbai, Delhi..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>
          <Button type="submit" variant="primary" className="h-[46px] px-8">
            Find Offices
          </Button>
        </form>
      </div>

      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner relative group">
        {embedKey ? (
          <iframe
            title="Election Office Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={getEmbedUrl()}
          ></iframe>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mb-6">
               <span className="material-symbols-outlined text-slate-400 text-4xl">map</span>
            </div>
            <h3 className="font-['Public_Sans'] text-xl font-bold text-on-surface mb-2">Google Maps Discovery</h3>
            <p className="text-sm text-on-surface-variant max-w-md mb-8">
              Use Google Maps to find official election offices or help centers near your location.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <Button onClick={handleSearch} variant="primary" className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-sm">open_in_new</span>
                 Open Search on Google Maps
               </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a 
          href="https://voters.eci.gov.in/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 bg-primary text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md group"
        >
          <div className="flex items-center gap-3">
             <span className="material-symbols-outlined">how_to_reg</span>
             <span className="text-sm font-bold uppercase tracking-tight">Official Voter Portal</span>
          </div>
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </a>
        <a 
          href="/assistant?prompt=How%20can%20I%20verify%20my%20official%20polling%20station%20safely%3F"
          className="flex items-center justify-between p-4 bg-white border border-primary text-primary rounded-xl hover:bg-indigo-50 transition-colors shadow-sm group"
        >
          <div className="flex items-center gap-3">
             <span className="material-symbols-outlined">smart_toy</span>
             <span className="text-sm font-bold uppercase tracking-tight">Verify Polling Station Safely</span>
          </div>
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </a>
      </div>
    </div>
  );
}
