import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-screen-xl mx-auto px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand */}
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span className="font-['Public_Sans'] font-bold text-primary text-base">CivicSaarthi</span>
          <span className="text-xs text-slate-500 font-medium tracking-wide">
            Built for PromptWars Challenge 2
          </span>
          <span className="text-xs text-slate-400">
            © 2026 CivicSaarthi. Powered by Google Cloud Run + Gemini.
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-widest text-slate-400">
          <Link to="/safety" className="hover:text-primary transition-colors">Safety Policy</Link>
          <Link to="/safety" className="hover:text-primary transition-colors">Privacy Notes</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About Project</Link>
        </div>
      </div>
    </footer>
  );
}
