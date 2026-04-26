export default function PointsBadge({ points }) {
  let tier = 'Civic Starter';
  let color = 'bg-slate-100 text-slate-600';
  let icon = 'eco';

  if (points >= 150) {
    tier = 'Verification Champion';
    color = 'bg-orange-100 text-orange-700';
    icon = 'verified_user';
  } else if (points >= 100) {
    tier = 'Voter Ready';
    color = 'bg-green-100 text-green-700';
    icon = 'how_to_vote';
  } else if (points >= 50) {
    tier = 'Election Explorer';
    color = 'bg-blue-100 text-blue-700';
    icon = 'explore';
  }

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${color} border border-current/10 shadow-sm`}>
      <span className="material-symbols-outlined text-[16px]">{icon}</span>
      {tier}
    </div>
  );
}
