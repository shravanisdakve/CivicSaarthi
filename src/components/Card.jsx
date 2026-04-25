/** Reusable card container */
export default function Card({ children, className = '', hover = true, accent = false }) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-200 shadow-card
        ${hover ? 'hover:shadow-card-hover hover:-translate-y-px transition-all' : ''}
        ${accent ? 'border-l-4 border-l-primary' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
