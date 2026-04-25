/** Small badge/chip for categories, statuses, and labels */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-surface-container-high text-on-surface-variant',
    primary: 'bg-primary-fixed text-on-primary-fixed-variant',
    secondary: 'bg-secondary-fixed text-on-secondary-fixed',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-error-container text-on-error-container',
    voting: 'bg-orange-100 text-orange-700',
    security: 'bg-primary-fixed text-on-primary-fixed-variant',
    process: 'bg-surface-container-highest text-on-surface-variant',
    legal: 'bg-surface-variant text-on-surface-variant',
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium tracking-wide ${variants[variant] ?? variants.default} ${className}`}
    >
      {children}
    </span>
  );
}
