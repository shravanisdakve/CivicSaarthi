import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-screen-xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-['Public_Sans'] font-bold text-primary text-xl">CivicSaarthi</h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              A multilingual, privacy-first, official-source-guided election-readiness companion.
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
              Understand. Prepare. Verify. Vote.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Platform</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-primary">About Project</Link></li>
              <li><Link to="/quality" className="hover:text-primary">Quality Report</Link></li>
              <li><Link to="/architecture" className="hover:text-primary">Architecture</Link></li>
              <li><Link to="/sources" className="hover:text-primary">Verified Sources</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Trust & Safety</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/safety" className="hover:text-primary">Safety Policy</Link></li>
              <li><Link to="/safety" className="hover:text-primary">Privacy Notes</Link></li>
              <li><Link to="/quality" className="hover:text-primary">Neutrality Audit</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acknowledgment</p>
              <p className="text-xs text-slate-500">Built for PromptWars Challenge 2.</p>
              <p className="text-[10px] text-slate-400 leading-relaxed max-w-2xl">
                Powered by Google Cloud Run, Gemini API, Secret Manager, Google Maps, Cloud Build, and Artifact Registry.
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">© 2026 CivicSaarthi. All rights reserved.</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-[10px] text-slate-400 leading-relaxed italic text-center">
              CivicSaarthi does not support or oppose any party or candidate. It does not show officially assigned polling booths. 
              Always verify final election details through official voter services.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
