import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';

export default function About() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-xs font-semibold tracking-widest uppercase bg-primary-fixed text-primary px-3 py-1 rounded-sm mb-4 inline-block">HACKATHON SUBMISSION</span>
        <h1 className="font-['Public_Sans'] text-3xl md:text-4xl font-bold text-primary mb-4">Project Overview</h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto">
          Bridging the gap between official government authority and modern digital convenience to empower the democratic process.
        </p>
      </div>

      {/* Main Intro + Vertical */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="md:col-span-2 p-8 border-0 shadow-sm" hover={false}>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary icon-fill">info</span>
            <h2 className="font-['Public_Sans'] text-xl font-bold text-primary">About CivicSaarthi</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
            CivicSaarthi was built with institutional reliability and democratic accessibility at its core. Recognizing that electoral processes can often feel opaque or overly bureaucratic, this platform serves as an unbiased guide for citizens. We employ a "Soft Minimalist" approach to strip away friction, allowing the gravity of the civic duty to remain central.
          </p>
          <div className="w-full h-48 bg-slate-200 rounded-xl overflow-hidden relative">
            {/* Using a generic placeholder similar to the reference, avoiding external stitch images */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed to-secondary-fixed flex items-center justify-center">
               <span className="material-symbols-outlined text-white text-6xl opacity-50">how_to_vote</span>
            </div>
          </div>
        </Card>

        <div className="bg-primary text-white rounded-xl p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-8 right-8 opacity-10">
            <span className="material-symbols-outlined" style={{ fontSize: '100px' }}>how_to_vote</span>
          </div>
          <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full w-fit mb-4">Track Focus</span>
          <h2 className="font-['Public_Sans'] text-2xl font-bold mb-6 relative z-10">Chosen Vertical</h2>
          <p className="text-sm text-primary-fixed leading-relaxed relative z-10 mt-auto pt-16">
            Civic Tech & Democratic Accessibility. Focused specifically on voter education, transparent timeline tracking, and AI-driven clarification of complex legislative or procedural jargon.
          </p>
        </div>
      </div>

      {/* Methodology & Assumptions */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Methodology */}
        <Card className="p-8 border-0 shadow-sm" hover={false}>
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">architecture</span>
            <h2 className="font-['Public_Sans'] text-lg font-bold text-primary">Methodology & Approach</h2>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
               <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary text-sm font-bold flex items-center justify-center shrink-0">1</span>
               <div>
                  <h3 className="text-sm font-semibold text-on-surface mb-1">Data Aggregation</h3>
                  <p className="text-xs text-on-surface-variant">Centralizing authoritative, non-partisan electoral data into a unified schema.</p>
               </div>
            </div>
            <div className="flex gap-4">
               <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary text-sm font-bold flex items-center justify-center shrink-0">2</span>
               <div>
                  <h3 className="text-sm font-semibold text-on-surface mb-1">AI Translation Layer</h3>
                  <p className="text-xs text-on-surface-variant">Utilizing LLMs to parse complex legalese into accessible, grade-level appropriate summaries.</p>
               </div>
            </div>
            <div className="flex gap-4">
               <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary text-sm font-bold flex items-center justify-center shrink-0">3</span>
               <div>
                  <h3 className="text-sm font-semibold text-on-surface mb-1">Progressive Disclosure UI</h3>
                  <p className="text-xs text-on-surface-variant">Presenting only essential actions initially, allowing users to drill down without cognitive overload.</p>
               </div>
            </div>
          </div>
        </Card>

        {/* Core Assumptions */}
        <Card className="p-8 border-0 shadow-sm" hover={false}>
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary icon-fill">lightbulb</span>
            <h2 className="font-['Public_Sans'] text-lg font-bold text-primary">Core Assumptions</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-surface-container-low border-l-4 border-primary p-4 rounded-r-lg text-sm text-on-surface-variant">
              Users primarily access civic information via mobile devices on limited bandwidth networks.
            </div>
            <div className="bg-surface-container-low border-l-4 border-secondary p-4 rounded-r-lg text-sm text-on-surface-variant">
              Voter apathy stems more from procedural confusion than lack of interest.
            </div>
            <div className="bg-surface-container-low border-l-4 border-primary p-4 rounded-r-lg text-sm text-on-surface-variant">
              Trust is paramount; hence the UI must feel authoritative, secure, and entirely unbiased.
            </div>
          </div>
        </Card>
      </div>

      {/* Powered by Google Cloud Footer Banner */}
      <Card className="p-8 border-l-4 border-l-primary border-t-0 border-r-0 border-b-0 rounded-l-none" hover={false}>
         <h2 className="font-['Public_Sans'] text-xl font-bold text-primary mb-6">Powered by Google Cloud</h2>
         <div className="flex flex-wrap gap-4">
            {['Cloud Run', 'Gemini API', 'Cloud SQL', 'Cloud Identity'].map(tech => (
               <div key={tech} className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-md">
                  <span className="material-symbols-outlined text-secondary text-sm icon-fill">
                     {tech.includes('Gemini') ? 'psychology' : tech.includes('SQL') ? 'database' : tech.includes('Identity') ? 'shield' : 'cloud'}
                  </span>
                  <span className="text-sm font-semibold text-on-surface">{tech}</span>
               </div>
            ))}
         </div>
      </Card>
    </div>
  );
}
