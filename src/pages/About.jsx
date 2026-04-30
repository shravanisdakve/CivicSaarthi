import { useNavigate, useCallback } from 'react-router-dom';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-xs font-semibold tracking-widest uppercase bg-primary-fixed text-primary px-3 py-1 rounded-sm mb-4 inline-block">
          HACKATHON SUBMISSION
        </span>
        <h1 className="font-['Public_Sans'] text-3xl md:text-4xl font-bold text-primary mb-4">
          Project Overview
        </h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto">
          Bridging the gap between official government authority and modern digital convenience to
          empower the democratic process.
        </p>
      </div>

      {/* Main Intro + Vertical */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="md:col-span-2 p-8 border-0 shadow-sm" hover={false}>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary icon-fill">info</span>
            <h2 className="font-['Public_Sans'] text-xl font-bold text-primary">
              About CivicSaarthi
            </h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
            CivicSaarthi was built with institutional reliability and democratic accessibility at
            its core. Recognizing that electoral processes can often feel opaque or overly
            bureaucratic, this platform serves as an unbiased guide for citizens. We employ a &quot;Soft
            Minimalist&quot; approach to strip away friction, allowing the gravity of the civic duty to
            remain central.
          </p>
          <div className="w-full py-8 bg-surface-container-low rounded-xl overflow-hidden relative border border-slate-100 shadow-inner">
            <div className="flex items-center justify-center gap-4 md:gap-8 max-w-md mx-auto relative z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">
                  Citizen
                </span>
              </div>
              <div className="flex-grow h-0.5 bg-slate-200 relative">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-t-2 border-r-2 border-slate-300"></div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary shadow-md flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">
                  Journey
                </span>
              </div>
              <div className="flex-grow h-0.5 bg-slate-200 relative">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-t-2 border-r-2 border-slate-300"></div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-green-600">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">
                  Official
                </span>
              </div>
            </div>
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full grid grid-cols-6 grid-rows-3">
                {[...Array(18)].map((_, i) => (
                  <div key={i} className="border border-primary"></div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="bg-primary text-white rounded-xl p-8 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-8 right-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined" style={{ fontSize: '100px' }}>
              how_to_vote
            </span>
          </div>
          <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full w-fit mb-4">
            Track Focus
          </span>
          <h2 className="font-['Public_Sans'] text-2xl font-bold mb-6 relative z-10">
            Chosen Vertical
          </h2>
          <p className="text-sm text-primary-fixed leading-relaxed relative z-10 mt-auto pt-16">
            Civic Tech & Democratic Accessibility. Focused specifically on voter education,
            transparent timeline tracking, and AI-driven clarification of complex legislative or
            procedural jargon.
          </p>
        </div>
      </div>

      {/* Methodology & Assumptions */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Methodology */}
        <Card className="p-8 border-0 shadow-sm" hover={false}>
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">architecture</span>
            <h2 className="font-['Public_Sans'] text-lg font-bold text-primary">
              Methodology & Approach
            </h2>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary text-sm font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <h3 className="text-sm font-semibold text-on-surface mb-1">Data Aggregation</h3>
                <p className="text-xs text-on-surface-variant">
                  Centralizing authoritative, non-partisan electoral data into a unified schema.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary text-sm font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <h3 className="text-sm font-semibold text-on-surface mb-1">AI Translation Layer</h3>
                <p className="text-xs text-on-surface-variant">
                  Utilizing LLMs to parse complex legalese into accessible, grade-level appropriate
                  summaries.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary text-sm font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <h3 className="text-sm font-semibold text-on-surface mb-1">
                  Progressive Disclosure UI
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Presenting only essential actions initially, allowing users to drill down without
                  cognitive overload.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Core Assumptions */}
        <Card className="p-8 border-0 shadow-sm" hover={false}>
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary icon-fill">lightbulb</span>
            <h2 className="font-['Public_Sans'] text-lg font-bold text-primary">
              Core Assumptions
            </h2>
          </div>
          <div className="space-y-4">
            <div className="bg-surface-container-low border-l-4 border-primary p-4 rounded-r-lg text-sm text-on-surface-variant">
              Users primarily access civic information via mobile devices on limited bandwidth
              networks.
            </div>
            <div className="bg-surface-container-low border-l-4 border-secondary p-4 rounded-r-lg text-sm text-on-surface-variant">
              Voter apathy stems more from procedural confusion than lack of interest.
            </div>
            <div className="bg-surface-container-low border-l-4 border-primary p-4 rounded-r-lg text-sm text-on-surface-variant">
              Trust is paramount; hence the UI must feel authoritative, secure, and entirely
              unbiased.
            </div>
          </div>
        </Card>
      </div>

      {/* Google Services Highlight */}
      <section className="bg-slate-900 text-white rounded-3xl overflow-hidden mb-12">
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold font-['Public_Sans'] mb-4">
                Built for Google Cloud
              </h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                A modern, serverless architecture ensuring scalability, security, and intelligent AI
                capabilities.
              </p>
            </div>

            <div className="md:w-2/3 w-full bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 text-xs text-slate-300 font-medium justify-center whitespace-nowrap overflow-x-auto pb-2">
                  <span className="px-3 py-1 bg-slate-700 rounded">Browser</span>
                  <span
                    className="material-symbols-outlined text-slate-500 text-sm"
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-200 rounded border border-blue-800/50">
                    Cloud Run App
                  </span>
                  <span
                    className="material-symbols-outlined text-slate-500 text-sm"
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-200 rounded border border-purple-800/50">
                    Gemini API
                  </span>

                  <span
                    className="material-symbols-outlined text-slate-500 text-sm mx-2"
                    aria-hidden="true"
                  >
                    |
                  </span>

                  <span className="px-3 py-1 bg-blue-900/50 text-blue-200 rounded border border-blue-800/50">
                    Cloud Run App
                  </span>
                  <span
                    className="material-symbols-outlined text-slate-500 text-sm"
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                  <span className="px-3 py-1 bg-green-900/50 text-green-200 rounded border border-green-800/50">
                    Secret Manager
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 p-4 rounded-xl flex items-start gap-3 border border-slate-600/50">
                    <span className="material-symbols-outlined text-blue-400" aria-hidden="true">
                      cloud
                    </span>
                    <div>
                      <h4 className="font-bold text-sm mb-1">Cloud Run</h4>
                      <p className="text-[10px] text-slate-400">Deployed web app and backend</p>
                    </div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl flex items-start gap-3 border border-slate-600/50">
                    <span className="material-symbols-outlined text-purple-400" aria-hidden="true">
                      auto_awesome
                    </span>
                    <div>
                      <h4 className="font-bold text-sm mb-1">Gemini API</h4>
                      <p className="text-[10px] text-slate-400">Intelligent assistant answers</p>
                    </div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl flex items-start gap-3 border border-slate-600/50">
                    <span className="material-symbols-outlined text-green-400" aria-hidden="true">
                      key
                    </span>
                    <div>
                      <h4 className="font-bold text-sm mb-1">Secret Manager</h4>
                      <p className="text-[10px] text-slate-400">Keeps API key out of frontend</p>
                    </div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl flex items-start gap-3 border border-slate-600/50">
                    <span className="material-symbols-outlined text-orange-400" aria-hidden="true">
                      build
                    </span>
                    <div>
                      <h4 className="font-bold text-sm mb-1">Cloud Build / Artifact Registry</h4>
                      <p className="text-[10px] text-slate-400">Source deployment pipeline</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="text-center py-10 bg-surface-container-low rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="font-['Public_Sans'] text-2xl font-bold text-on-surface mb-4">
          Ready to start your civic journey?
        </h2>
        <p className="text-on-surface-variant mb-8 max-w-md mx-auto text-sm">
          Join thousands of voters using CivicSaarthi to navigate the electoral process with
          absolute confidence.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg" onClick={useCallback(() => navigate('/choose-path'), [navigate])}>
            Get Started Now
          </Button>
          <Button variant="outline" size="lg" onClick={useCallback(() => navigate('/timeline'), [navigate])}>
            View Election Timeline
          </Button>
        </div>
      </div>
    </div>
  );
}
