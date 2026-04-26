import { useNavigate } from 'react-router-dom';

export default function ModuleCard({ title, desc, icon, to }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (to === '/assistant') {
      window.dispatchEvent(new CustomEvent('civicOpenChat'));
    } else {
      navigate(to);
    }
  };
  
  return (
    <div 
      onClick={handleClick} 
      className="cursor-pointer group flex flex-col items-center text-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all h-full"
    >
      <div className="w-12 h-12 bg-surface-container-low text-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary-fixed transition-all">
        <span className="material-symbols-outlined text-2xl" aria-hidden="true">{icon}</span>
      </div>
      <h3 className="font-bold text-sm text-on-surface mb-2">{title}</h3>
      <p className="text-xs text-slate-500 mb-3 flex-grow">{desc}</p>
      <span className="text-[10px] font-bold uppercase tracking-wider text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        Open <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
      </span>
    </div>
  );
}
