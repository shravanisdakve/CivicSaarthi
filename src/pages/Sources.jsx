import { officialSources, verificationChecklist, misinfoWarnings } from '../data/sources.js';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';

export default function Sources() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="font-['Public_Sans'] text-3xl md:text-4xl font-bold text-on-surface mb-3">Official Sources & Directory</h1>
          <p className="text-on-surface-variant max-w-2xl text-sm">
            Access verified, authoritative portals for voter registration, polling details, and electoral education directly from governing bodies.
          </p>
        </div>
        <div className="shrink-0">
          <div className="inline-flex items-center gap-2 bg-surface-container-low border border-slate-200 px-4 py-2 rounded-full text-sm font-semibold text-primary">
            <span className="material-symbols-outlined text-primary icon-fill text-lg">verified</span>
            Information verified for current election cycle
          </div>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {officialSources.map((source) => (
          <Card key={source.id} className="p-6 flex flex-col justify-between" accent={source.accent}>
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                   <span className="material-symbols-outlined text-primary">{source.icon}</span>
                </div>
                <Badge variant={source.category === 'Mobile App' ? 'default' : 'primary'}>{source.category}</Badge>
              </div>
              <h2 className="font-['Public_Sans'] text-xl font-bold text-on-surface mb-2">{source.name}</h2>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">{source.description}</p>
            </div>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-sm font-semibold text-on-surface transition-colors"
            >
              {source.action}
              {source.action === 'Visit Portal' ? (
                 <span className="material-symbols-outlined text-sm">open_in_new</span>
              ) : (
                 <span className="material-symbols-outlined text-sm">download</span>
              )}
            </a>
          </Card>
        ))}
      </div>

      {/* Combating Misinformation Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Misinfo Warnings */}
        <div className="md:col-span-2 bg-red-50 border border-red-100 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-red-600 text-2xl icon-fill">warning</span>
            <h2 className="font-['Public_Sans'] text-xl font-bold text-red-900">Combating Misinformation</h2>
          </div>
          <p className="text-red-800 text-sm mb-6 max-w-xl">
            During election cycles, unverified information spreads rapidly. Always cross-reference claims related to voting dates, polling locations, or candidate status with the official sources listed above.
          </p>
          <ul className="space-y-3">
            {misinfoWarnings.map((warning, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-red-800">
                <span className="material-symbols-outlined text-red-500 shrink-0 text-base mt-0.5">close</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>

        {/* Verification Checklist */}
        <div className="bg-surface-container-low border border-slate-200 rounded-2xl p-6 md:p-8">
          <h2 className="font-['Public_Sans'] text-lg font-bold text-on-surface mb-5">Verification Checklist</h2>
          <ul className="space-y-4">
            {verificationChecklist.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <span className="material-symbols-outlined text-primary icon-fill text-lg shrink-0">check_circle</span>
                <span className="text-sm font-medium text-on-surface">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
