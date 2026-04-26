import { useState, useEffect } from 'react';
import { badges } from '../data/badges.js';
import { checkNewBadges } from '../utils/badgeEngine.js';

export default function AchievementBadges({ earnedBadges = [] }) {
  const [newlyEarned, setNewlyEarned] = useState([]);

  useEffect(() => {
    const fresh = checkNewBadges();
    if (fresh.length > 0) {
      setNewlyEarned(fresh);
      setTimeout(() => setNewlyEarned([]), 5000);
    }
  }, []);

  return (
    <div className="relative">
      {/* Toast Notification */}
      {newlyEarned.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-10 duration-500">
          {newlyEarned.map(badge => (
            <div key={badge.id} className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 mb-2">
              <div className={`${badge.color} w-10 h-10 rounded-full flex items-center justify-center shadow-lg`}>
                <span className="material-symbols-outlined text-xl icon-fill">{badge.icon}</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">New Badge Earned!</p>
                <p className="font-bold">{badge.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Badge List */}
      <div className="flex flex-wrap gap-3">
        {badges.map(badge => {
          const isEarned = earnedBadges.includes(badge.id);
          return (
            <div 
              key={badge.id} 
              className={`group relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isEarned ? `${badge.color} shadow-lg text-white` : 'bg-slate-100 text-slate-300 border border-slate-200 opacity-50 grayscale'
              }`}
            >
              <span className="material-symbols-outlined text-2xl icon-fill">{badge.icon}</span>
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 p-3 bg-slate-900 text-white text-[10px] rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none text-center">
                <p className="font-black uppercase tracking-widest mb-1 text-primary">{badge.name}</p>
                <p className="leading-relaxed">{badge.description}</p>
                {!isEarned && <p className="mt-2 text-white/50 italic font-bold">Keep exploring to earn!</p>}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
