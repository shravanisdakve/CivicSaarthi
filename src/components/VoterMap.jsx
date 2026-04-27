import { useState } from 'react';
import Card from './Card.jsx';
import Button from './Button.jsx';

export default function VoterMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [searchQuery, setSearchQuery] = useState('Election Office near me');
  const [activeQuery, setActiveQuery] = useState('Election Office near me');

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveQuery(searchQuery);
  };

  const mapUrl = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${encodeURIComponent(activeQuery)}`;

  if (!apiKey) {
    return (
      <Card className="p-8 md:p-12 bg-slate-50 border-dashed border-2 border-slate-200 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
          <span className="material-symbols-outlined text-3xl">map_off</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-['Public_Sans']">Maps Platform Inactive</h3>
        <p className="text-slate-500 max-w-sm mx-auto mb-8 text-sm">
          A valid Google Maps API Key is required to display the interactive helper. You can still use official external links.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" onClick={() => window.open('https://voters.eci.gov.in/', '_blank')}>
            ECI Voter Portal
          </Button>
          <Button variant="outline" onClick={() => window.open('https://www.google.com/maps/search/election+office+near+me', '_blank')}>
            Open Maps Directly
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-white shadow-md border border-slate-100 overflow-hidden">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for election offices, help centers..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            />
          </div>
          <Button type="submit" variant="primary" className="md:w-32">
            Search
          </Button>
        </form>
      </Card>

      <Card className="relative w-full aspect-video md:aspect-[21/9] bg-slate-100 border border-slate-200 overflow-hidden shadow-xl rounded-3xl">
        <iframe
          title="Voter Help Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={mapUrl}
        ></iframe>
        
        {/* Safe Overlay Label */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-slate-100 shadow-lg flex items-center gap-2 pointer-events-none">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Official Maps Platform Live</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Offices', query: 'Election Commission Office', icon: 'account_balance' },
          { label: 'Help Centers', query: 'Voter Registration Center', icon: 'info' },
          { label: 'Post Offices', query: 'Post Office near me', icon: 'mail' }
        ].map(filter => (
          <button
            key={filter.label}
            onClick={() => {
              setSearchQuery(filter.query);
              setActiveQuery(filter.query);
            }}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${activeQuery === filter.query ? 'bg-primary/5 border-primary text-primary' : 'bg-white border-slate-100 text-slate-600 hover:border-primary/50'}`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl">{filter.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider">{filter.label}</span>
            </div>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        ))}
      </div>
    </div>
  );
}
