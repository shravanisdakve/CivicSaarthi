
export default function RouteLoader() {
  return (
    <div className="min-h-screen relative bg-[#F8F9FA]">
      <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse">
        <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
        <div className="h-4 w-48 bg-slate-200 rounded-full mb-2"></div>
        <div className="h-3 w-32 bg-slate-100 rounded-full"></div>
        <div className="mt-8 text-slate-400 font-bold text-xs uppercase tracking-widest">
          Loading CivicSaarthi...
        </div>
      </div>
    </div>
  );
}
