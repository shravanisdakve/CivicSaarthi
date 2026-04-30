import { useTranslation } from '../hooks/useTranslation.js';

export default function MapDisclaimer() {
  const { t } = useTranslation();

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-amber-700">warning</span>
        </div>
        <div>
          <h3 className="text-amber-900 font-bold mb-2">Important Mapping Disclaimer</h3>
          <p className="text-amber-800 text-sm leading-relaxed mb-4">
            CivicSaarthi does **not** show your officially assigned polling booth. This map is
            provided to help you find nearby **Election Offices, Voter Help Centers, or official
            assistance locations** for guidance.
          </p>
          <div className="bg-white/60 rounded-xl p-4 border border-amber-100">
            <h4 className="text-[10px] font-bold text-amber-900 uppercase tracking-widest mb-1">
              Privacy Guarantee
            </h4>
            <p className="text-[11px] text-amber-800 italic">
              CivicSaarthi does **not** collect Aadhaar, Voter ID, phone numbers, exact residential
              addresses, live location coordinates, or political preferences. Your search is
              processed locally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
