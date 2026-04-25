import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';

const CORE_SERVICES = [
  {
    icon: 'cloud',
    title: 'Google Cloud Run',
    desc: 'Fully managed compute platform that automatically scales our application containers from zero to high traffic instantly, ensuring availability during election spikes.',
    tags: ['Serverless', 'Auto-scaling'],
  },
  {
    icon: 'psychology',
    title: 'Gemini Pro API',
    desc: 'Powers the core intelligence of CivicSaarthi. Handles complex natural language queries about electoral processes, translates official jargon into accessible guidance, and generates context-aware responses while maintaining a strict non-partisan persona.',
    tags: ['LLM', 'Generative AI', 'Context Caching'],
  },
  {
    icon: 'key',
    title: 'Secret Manager',
    desc: 'Securely stores and manages access to Gemini API keys and other sensitive credentials, isolating them from application code.',
  },
  {
    icon: 'build',
    title: 'Cloud Build',
    desc: 'Executes continuous integration and deployment (CI/CD) pipelines, building application images automatically upon source code commits.',
  },
  {
    icon: 'inventory_2',
    title: 'Artifact Registry',
    desc: 'Centralized repository for storing, managing, and securing container images before they are deployed to Cloud Run.',
  },
];

export default function Architecture() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="font-['Public_Sans'] text-3xl md:text-4xl font-bold text-primary mb-4">Built on Google Cloud</h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto">
          CivicSaarthi leverages enterprise-grade Google Cloud services to ensure high availability, security, and real-time AI assistance for voters.
        </p>
      </div>

      {/* System Architecture Diagram */}
      <div className="mb-16">
        <h2 className="font-['Public_Sans'] text-2xl font-bold text-on-surface mb-6">System Architecture</h2>
        <div className="bg-white rounded-xl border border-slate-200 border-dashed p-8 md:p-12 overflow-x-auto">
          <div className="min-w-[600px] flex items-center justify-center gap-6">
             {/* Browser */}
             <div className="text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-surface-container border border-slate-200 flex items-center justify-center mb-3">
                   <span className="material-symbols-outlined text-primary text-2xl">devices</span>
                </div>
                <p className="text-sm font-semibold text-on-surface">User Browser</p>
                <p className="text-xs text-on-surface-variant">React / Web App</p>
             </div>

             <div className="flex flex-col items-center px-4">
                <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">HTTPS</span>
             </div>

             {/* Cloud Run */}
             <div className="text-center flex flex-col items-center">
                <div className="w-24 h-24 rounded-2xl bg-primary-fixed border border-primary-fixed-dim flex items-center justify-center mb-3">
                   <span className="material-symbols-outlined text-primary text-4xl icon-fill">cloud</span>
                </div>
                <p className="text-sm font-semibold text-on-surface">Cloud Run</p>
                <p className="text-xs text-on-surface-variant">Serverless Compute</p>
             </div>

             <div className="flex flex-col items-center px-4">
                <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">API Call</span>
             </div>

             {/* Backend Services */}
             <div className="flex flex-col gap-8 relative">
               {/* Line connecting the two */}
               <div className="absolute left-1/2 top-16 bottom-16 w-px bg-slate-300 -translate-x-1/2 -z-10"></div>
               
               {/* Gemini */}
               <div className="text-center flex flex-col items-center bg-white">
                  <div className="w-16 h-16 rounded-xl bg-secondary-fixed border border-secondary-fixed-dim flex items-center justify-center mb-3">
                     <span className="material-symbols-outlined text-secondary text-2xl">psychology</span>
                  </div>
                  <p className="text-sm font-semibold text-on-surface">Gemini API</p>
                  <p className="text-xs text-on-surface-variant">LLM Inference</p>
               </div>

               {/* Secret Manager */}
               <div className="text-center flex flex-col items-center bg-white mt-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container border border-slate-200 flex items-center justify-center mb-2">
                     <span className="material-symbols-outlined text-slate-600 text-xl">key</span>
                  </div>
                  <p className="text-xs font-semibold text-on-surface">Secret Manager</p>
                  <p className="text-[10px] text-on-surface-variant">API Keys</p>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Core Services Grid */}
      <div>
        <h2 className="font-['Public_Sans'] text-2xl font-bold text-on-surface mb-6">Core Services</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {CORE_SERVICES.map((s, idx) => (
             <Card key={idx} className="p-6 md:p-8 bg-surface-container-low border-0" hover={false}>
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-5">
                   <span className="material-symbols-outlined text-primary">{s.icon}</span>
                </div>
                <h3 className="font-['Public_Sans'] text-xl font-bold text-on-surface mb-3">{s.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-5">{s.desc}</p>
                {s.tags && (
                   <div className="flex flex-wrap gap-2">
                     {s.tags.map(tag => (
                        <Badge key={tag} variant="process">{tag}</Badge>
                     ))}
                   </div>
                )}
             </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
