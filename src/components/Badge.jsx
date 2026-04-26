/** Small badge/chip for categories, statuses, and labels */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-surface-container-high text-on-surface-variant',
    primary: 'bg-primary-fixed text-primary font-bold',
    secondary: 'bg-secondary-fixed text-blue-900 font-bold',
    success: 'bg-green-100 text-green-900 font-bold',
    warning: 'bg-yellow-100 text-yellow-900 font-bold border border-yellow-200',
    error: 'bg-red-100 text-red-900 font-bold',
    voting: 'bg-orange-100 text-orange-900 font-bold border border-orange-200',
    security: 'bg-primary-fixed text-primary font-bold',
    process: 'bg-slate-100 text-slate-800 font-bold border border-slate-200',
    legal: 'bg-slate-200 text-slate-900 font-bold',
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium tracking-wide ${variants[variant] ?? variants.default} ${className}`}
    >
      {children}
    </span>
  );
}
