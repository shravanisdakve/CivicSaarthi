/** Reusable Button component with primary / secondary / outline / ghost variants */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ariaLabel, // New prop for aria-label
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-container active:scale-95',
    secondary: 'bg-secondary text-white hover:opacity-90 active:scale-95',
    outline:
      'border border-outline text-on-surface bg-white hover:bg-surface-container-high active:scale-95',
    ghost: 'text-primary hover:bg-surface-container-low active:scale-95',
  };

  return (
    <button
      type={type}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel} // Apply aria-label if provided
      aria-disabled={disabled} // Apply aria-disabled based on disabled prop
      {...props}
    >
      {children}
    </button>
  );
}
