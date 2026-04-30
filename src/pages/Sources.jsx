import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { officialSources, verificationChecklist, misinfoWarnings } from '../data/sources.js';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';

export default function Sources() {
  const navigate = useNavigate();

  const handleCopyLink = useCallback((url) => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  }, []); // Empty dependency array as it only uses browser APIs

  const handleReportMisinfo = useCallback(() => {
    navigate('/assistant', {
      state: {
        question:
          'I found some suspicious information about voting. Can you help me verify it against official rules?',
      },
    });
  }, [navigate]); // navigate is a dependency

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="font-['Public_Sans'] text-3xl md:text-4xl font-bold text-on-surface mb-3">
            Official Sources & Directory
          </h1>
          <p className="text-on-surface-variant max-w-2xl text-sm">
            Access verified, authoritative portals for voter registration, polling details, and
            electoral education directly from governing bodies.
          </p>
        </div>
        <div className="shrink-0">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full text-sm font-semibold text-green-700">
            <span className="material-symbols-outlined text-green-600 icon-fill text-lg">
              verified
            </span>
            Official-source guided. Verify details for the current election cycle.
          </div>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {officialSources.map((source) => (
          <Card
            key={source.id}
            className="p-6 flex flex-col justify-between group"
            accent={source.accent}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-primary">{source.icon}</span>
                </div>
                <Badge variant={source.category === 'Mobile App' ? 'default' : 'primary'}>
                  {source.category}
                </Badge>
              </div>
              <h2 className="font-['Public_Sans'] text-xl font-bold text-on-surface mb-2">
                {source.name}
              </h2>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed min-h-[3rem]">
                {source.description}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary-container transition-all"
              >
                {source.action}
                <span className="material-symbols-outlined text-sm">
                  {source.action === 'Visit Portal' ? 'open_in_new' : 'download'}
                </span>
              </a>
              <button
                onClick={() => handleCopyLink(source.url)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-full border border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-xs">content_copy</span>
                Copy Link
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Combating Misinformation Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Misinfo Warnings */}
        <div className="md:col-span-2 bg-red-50 border border-red-100 rounded-2xl p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <span className="material-symbols-outlined text-[120px]">warning</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-red-600 text-2xl icon-fill">
                warning
              </span>
              <h2 className="font-['Public_Sans'] text-xl font-bold text-red-900">
                Combating Misinformation
              </h2>
            </div>
            <p className="text-red-800 text-sm mb-6 max-w-xl leading-relaxed">
              During election cycles, unverified information spreads rapidly. Always cross-reference
              claims related to voting dates, polling locations, or candidate status with the
              official sources listed above.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {misinfoWarnings.map((warning, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-sm text-red-800 bg-white/50 p-3 rounded-lg border border-red-100"
                >
                  <span className="material-symbols-outlined text-red-500 shrink-0 text-base">
                    close
                  </span>
                  {warning}
                </div>
              ))}
            </div>
            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700 border-none"
              onClick={handleReportMisinfo}
            >
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Verify suspicious claim with AI
            </Button>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="bg-surface-container-low border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col">
          <h2 className="font-['Public_Sans'] text-lg font-bold text-on-surface mb-5">
            Quick Verification
          </h2>
          <div className="flex flex-col gap-3 flex-grow">
            {verificationChecklist.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-transform hover:translate-x-1"
              >
                <span className="material-symbols-outlined text-green-600 icon-fill text-lg shrink-0">
                  check_circle
                </span>
                <span className="text-xs font-bold text-on-surface uppercase tracking-tight">
                  {item}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-6 italic">
            Source: ECI Communication Guidelines
          </p>
        </div>
      </div>
    </div>
  );
}
