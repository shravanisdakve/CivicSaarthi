import Badge from './Badge.jsx';
import { getChecklistProgress } from '../utils/profileStorage.js';

export default function ProductPreview() {
  const checklist = getChecklistProgress();
  const completedCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="z-10 relative hidden md:block" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-blue-400/10 rounded-3xl transform rotate-2 scale-105"></div>
      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-xl p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-fixed rounded-xl flex items-center justify-center text-primary font-bold shadow-inner">
              CS
            </div>
            <div>
              <h3 className="font-bold text-sm">CivicSaarthi Preview</h3>
              <p className="text-[10px] text-slate-400">Interactive Voter Guide</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="primary" className="text-[10px]">
              Gemini AI
            </Badge>
            <Badge variant="success" className="text-[10px]">
              Verified Data
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-surface-container-lowest border border-slate-100 p-4 rounded-xl shadow-sm">
            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">person</span> User
            </p>
            <p className="text-sm bg-blue-50 text-blue-900 p-2 rounded-lg inline-block mb-3 border border-blue-100">
              Walk me through elections.
            </p>

            <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">smart_toy</span> CivicSaarthi
              AI
            </p>
            <p className="text-xs text-on-surface-variant mb-1">
              Let&apos;s start your Guided Journey...
            </p>
            <ul className="text-xs text-on-surface-variant space-y-1 pl-2 border-l-2 border-primary/30">
              <li>• Phase 1: Election Announcement</li>
              <li>• Phase 2: Code of Conduct</li>
              <li>• Phase 3: Nominations</li>
            </ul>
          </div>

          <div className="bg-surface-container-lowest border border-slate-100 p-4 rounded-xl shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-orange-500 text-sm">timeline</span>
              <h4 className="text-xs font-bold">Timeline</h4>
            </div>
            <p className="text-[11px] font-medium">Stage 3 of 9: Nominations</p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-orange-500 h-full w-1/3"></div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-surface-container-lowest border border-slate-100 p-3 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-green-600 text-sm">fact_check</span>
                <h4 className="text-xs font-bold">Checklist</h4>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {completedCount} of 7 steps complete
              </p>
            </div>

            <div className="bg-surface-container-lowest border border-slate-100 p-3 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-purple-600 text-sm">quiz</span>
                <h4 className="text-xs font-bold">Quiz</h4>
              </div>
              <p className="text-[10px] text-slate-600 font-bold">Voter Literacy Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
