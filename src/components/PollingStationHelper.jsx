import { useCallback } from 'react';
import Card from './Card.jsx';
import Button from './Button.jsx';
import Badge from './Badge.jsx';
import { useTranslation } from '../hooks/useTranslation.js';

export default function PollingStationHelper() {
  const { t } = useTranslation();

  const handleAskAI = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('civicOpenChat', {
        detail: { question: 'How can I find my official polling station safely?' },
      })
    );
  }, []); // Empty dependency array as it only depends on window events

  const handleMapSearch = useCallback(() => {
    window.open('https://www.google.com/maps/search/election+office+near+me', '_blank');
  }, []); // Empty dependency array as it only depends on window functions

  return (
    <Card className="p-0 bg-white border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Map Visual Header */}
      <div className="h-48 bg-slate-50 relative overflow-hidden flex items-center justify-center">
        {/* CSS Map Grid */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 opacity-10">
          {[...Array(32)].map((_, i) => (
            <div key={i} className="border border-slate-400"></div>
          ))}
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <span
              className="material-symbols-outlined text-primary text-5xl opacity-20"
              aria-hidden="true"
            >
              map
            </span>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <span
                className="material-symbols-outlined text-red-600 text-3xl drop-shadow-md"
                aria-hidden="true"
              >
                location_on
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 text-sm" aria-hidden="true">
              report_problem
            </span>
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tighter">
              Official verification required
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-4">
          <Badge variant="primary" className="mb-3">
            Official Link
          </Badge>
          <h3 className="text-xl font-bold font-['Public_Sans'] mb-2">Polling Station Guidance</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Learn how to verify your assigned polling station through official voter services.
            <span className="block mt-2 font-bold text-amber-800">{t('polling.disclaimer')}</span>
          </p>
        </div>

        <div className="space-y-2 mt-auto">
          <Button
            variant="primary"
            onClick={() => window.open('https://voters.eci.gov.in/', '_blank')}
            className="w-full justify-between group text-xs py-2 h-auto"
            aria-label="Open Official Voter Portal"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                public
              </span>{' '}
              Open Official Voter Portal
            </span>
            <span
              className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            >
              open_in_new
            </span>
          </Button>
          <Button
            variant="outline"
            onClick={handleAskAI}
            className="w-full justify-between text-xs py-2 h-auto"
            aria-label="Ask AI about polling station guidance"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                smart_toy
              </span>{' '}
              Guidance & official links
            </span>
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              arrow_forward
            </span>
          </Button>
          <Button
            variant="outline"
            onClick={handleMapSearch}
            className="w-full justify-between text-xs py-2 h-auto bg-slate-50"
            aria-label="Search nearby election office"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                pin_drop
              </span>{' '}
              Nearby Election Office
            </span>
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              open_in_new
            </span>
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-[9px] text-slate-400 leading-tight">
            For privacy, CivicSaarthi does not collect Aadhaar, voter ID, phone number, address, or
            live location. Map search is for nearby help centers only.
          </p>
        </div>
      </div>
    </Card>
  );
}
