const NOTIFICATIONS = [
  { id: 1, text: 'Verify your polling station from official sources.', type: 'info', icon: 'location_on' },
  { id: 2, text: 'Review what to carry on polling day (EPIC, Voter Slip).', type: 'warning', icon: 'shopping_bag' },
  { id: 3, text: 'Try the quiz to test your election knowledge.', type: 'info', icon: 'quiz' },
  { id: 4, text: 'Check official sources before trusting forwarded messages.', type: 'error', icon: 'security' },
];

export default function NotificationPanel() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-['Public_Sans'] font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">notifications</span>
          Civic Alerts
        </h3>
        <span className="text-[10px] bg-primary-fixed text-primary px-2 py-0.5 rounded-full font-bold">New</span>
      </div>
      <div className="divide-y divide-slate-100">
        {NOTIFICATIONS.map((n) => (
          <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-3 items-start">
            <span className={`material-symbols-outlined text-[18px] mt-0.5 ${
              n.type === 'error' ? 'text-red-500' : n.type === 'warning' ? 'text-orange-500' : 'text-blue-500'
            }`}>
              {n.icon}
            </span>
            <p className="text-sm text-on-surface-variant leading-tight">{n.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
