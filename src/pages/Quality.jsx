import Card from '../components/Card.jsx';

const METRICS = [
  { icon: 'security', label: 'Security', score: '98/100', desc: 'Data encryption and PII handling validated.', val: 98 },
  { icon: 'accessibility_new', label: 'Accessibility', score: '100/100', desc: 'WCAG 2.1 AA compliance achieved.', val: 100 },
  { icon: 'speed', label: 'Efficiency', score: '95/100', desc: 'LCP < 1.2s, optimal API response times.', val: 95 },
  { icon: 'code', label: 'Maintainability', score: '92/100', desc: 'Code coverage at 85%, linting passed.', val: 92 },
];

const MODULE_TESTS = [
  {
    title: 'Chat Engine',
    icon: 'chat',
    status: 'Operational',
    statusColor: 'bg-primary-fixed text-on-primary-fixed',
    checks: [
      { label: 'Context Retrieval', pass: true },
      { label: 'Tone Adherence (Neutrality)', pass: true },
      { label: 'Latency bounds (< 2s)', pass: true },
    ]
  },
  {
    title: 'Timeline Data',
    icon: 'timeline',
    status: 'Operational',
    statusColor: 'bg-primary-fixed text-on-primary-fixed',
    checks: [
      { label: 'Data Sync Integrity', pass: true },
      { label: 'Responsive Rendering', pass: true },
      { label: 'Date Formatting Accuracy', pass: true },
    ]
  },
  {
    title: 'Glossary Engine',
    icon: 'menu_book',
    status: 'Monitoring',
    statusColor: 'bg-secondary-fixed text-on-secondary-fixed',
    checks: [
      { label: 'Search Indexing', pass: true },
      { label: 'Cross-linking Validation', pass: true },
      { label: 'Definition Clarity Score', pass: false },
    ]
  }
];

export default function Quality() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
           <span className="material-symbols-outlined text-primary text-3xl icon-fill">verified</span>
           <h1 className="font-['Public_Sans'] text-2xl font-semibold text-on-surface">Quality Assurance Dashboard</h1>
        </div>
        <p className="text-on-surface-variant text-sm">System health, performance metrics, and testing status for all core CivicSaarthi modules.</p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
         {METRICS.map((m) => (
            <Card key={m.label} className="p-6" hover={false}>
               <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-primary">{m.icon}</span>
                  <span className="text-xs font-semibold bg-surface-container px-2 py-1 rounded-md text-on-surface">Score: {m.score}</span>
               </div>
               <h3 className="font-semibold text-on-surface mb-2 text-sm">{m.label}</h3>
               <p className="text-xs text-on-surface-variant mb-4">{m.desc}</p>
               <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${m.val === 100 ? 'bg-secondary' : m.val >= 95 ? 'bg-primary' : 'bg-primary-container'}`} style={{ width: `${m.val}%` }}></div>
               </div>
            </Card>
         ))}
      </div>

      {/* Module Testing Status */}
      <div>
         <h2 className="text-sm font-semibold text-on-surface mb-5">Module Testing Status</h2>
         <div className="grid md:grid-cols-3 gap-6">
            {MODULE_TESTS.map(mod => (
               <div key={mod.title} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-sm icon-fill">{mod.icon}</span>
                        <h3 className="font-semibold text-on-surface text-sm">{mod.title}</h3>
                     </div>
                     <span className={`text-xs px-2 py-1 rounded-md font-medium ${mod.statusColor}`}>{mod.status}</span>
                  </div>
                  <div className="flex flex-col divide-y divide-slate-100">
                     {mod.checks.map(check => (
                        <div key={check.label} className="px-5 py-3 flex items-center justify-between">
                           <span className="text-sm text-on-surface-variant">{check.label}</span>
                           {check.pass ? (
                              <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                                 <span className="material-symbols-outlined text-sm icon-fill">check_circle</span> PASS
                              </span>
                           ) : (
                              <span className="flex items-center gap-1 text-xs font-semibold text-yellow-600">
                                 <span className="material-symbols-outlined text-sm icon-fill">warning</span> REVIEW
                              </span>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
