export default function LoadingOverlay({ message = 'Loading CivicSaarthi...' }) {
  return (
    <div
      className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center p-6 text-center"
      role="status"
    >
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
      <p className="font-['Public_Sans'] font-bold text-on-surface animate-pulse">{message}</p>
      <p className="text-xs text-slate-400 mt-2">Privacy-first civic education</p>
    </div>
  );
}
