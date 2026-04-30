import Card from './Card.jsx';
import Button from './Button.jsx';
import ElectionOfficeMap from './ElectionOfficeMap.jsx';

const EXAMPLE_CARDS = [
  {
    title: 'Official Voter Services Portal',
    desc: 'Verify your assigned polling station.',
    icon: 'verified_user',
    action: 'Open Portal',
    url: 'https://voters.eci.gov.in/',
  },
  {
    title: 'Election Office / Help Center',
    desc: 'Find nearby assistance locations.',
    icon: 'location_on',
    action: 'Open in Google Maps',
    url: 'https://www.google.com/maps/search/District+Election+Office/',
  },
  {
    title: 'Accessibility Planning',
    desc: 'Check route and accessibility before polling day.',
    icon: 'accessible_forward',
    action: 'Plan Route',
    url: 'https://www.google.com/maps',
  },
];

export default function PollingGuidancePreview() {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Panel */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="p-6">

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-200">
              Official verification
            </span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-200">
              Nearby election offices
            </span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-200">
              Accessible route planning
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <span className="material-symbols-outlined text-primary text-sm">info</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                Example planning card — not official booth assignment
              </span>
            </div>

            {EXAMPLE_CARDS.map((card, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-primary/30 transition-colors bg-white shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-slate-600 text-sm">
                      {card.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{card.title}</p>
                    <p className="text-[10px] text-slate-500">{card.desc}</p>
                  </div>
                </div>
                <a
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-primary uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-primary/5 whitespace-nowrap shrink-0"
                >
                  {card.action}
                </a>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-slate-50 border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">fact_check</span>
            Verification Steps
          </h3>
          <ol className="space-y-3">
            <li className="flex gap-3 text-sm text-slate-600 items-start">
              <span className="font-bold text-primary">1.</span>
              Open official voter services portal.
            </li>
            <li className="flex gap-3 text-sm text-slate-600 items-start">
              <span className="font-bold text-primary">2.</span>
              Search using official voter details on the portal.
            </li>
            <li className="flex gap-3 text-sm text-slate-600 items-start">
              <span className="font-bold text-primary">3.</span>
              Confirm your assigned polling station there.
            </li>
            <li className="flex gap-3 text-sm text-slate-600 items-start">
              <span className="font-bold text-primary">4.</span>
              Use Maps only for route planning.
            </li>
            <li className="flex gap-3 text-sm text-slate-600 items-start">
              <span className="font-bold text-primary">5.</span>
              Do not rely only on forwarded messages.
            </li>
          </ol>
        </Card>
      </div>

      {/* Right Panel */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
          <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">warning</span>
            Important Disclaimer
          </h3>
          <p className="text-xs text-amber-800 leading-relaxed font-medium">
            CivicSaarthi does not show your officially assigned polling booth. Always verify your
            assigned polling station through official voter services or your state election office.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-4 border border-slate-100 flex-grow">
          <ElectionOfficeMap />
        </div>
      </div>
    </div>
  );
}
