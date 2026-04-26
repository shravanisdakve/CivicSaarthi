import ElectionOfficeMap from '../components/ElectionOfficeMap.jsx';
import MapDisclaimer from '../components/MapDisclaimer.jsx';
import Card from '../components/Card.jsx';

export default function MapHelper() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-['Public_Sans'] text-3xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
          Election Office & Help Center Map
        </h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto text-lg leading-relaxed">
          Use this map to locate official election offices, voter help centers, or government assistance locations nearby.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Info & Disclaimer */}
        <div className="lg:col-span-4 space-y-6">
          <MapDisclaimer />
          
          <Card className="p-6 bg-white border-0 shadow-xl">
             <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">info</span>
                How to use this map
             </h3>
             <ul className="space-y-4">
                <li className="flex gap-3">
                   <div className="w-6 h-6 rounded-full bg-indigo-50 text-primary flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                   <p className="text-xs text-on-surface-variant leading-relaxed">
                      Enter your **city or district** name in the search bar to locate nearby offices.
                   </p>
                </li>
                <li className="flex gap-3">
                   <div className="w-6 h-6 rounded-full bg-indigo-50 text-primary flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                   <p className="text-xs text-on-surface-variant leading-relaxed">
                      Click **"Find Offices"** to see locations on the Google Map discovery interface.
                   </p>
                </li>
                <li className="flex gap-3">
                   <div className="w-6 h-6 rounded-full bg-indigo-50 text-primary flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                   <p className="text-xs text-on-surface-variant leading-relaxed">
                      Visit the **official voter portal** for verifying your specific polling booth assignment.
                   </p>
                </li>
             </ul>
          </Card>
        </div>

        {/* Right Side: Map Feature */}
        <div className="lg:col-span-8">
          <ElectionOfficeMap />
        </div>
      </div>

      <div className="mt-16 text-center border-t border-slate-100 pt-12">
         <p className="text-xs text-slate-400 max-w-xl mx-auto italic uppercase tracking-widest leading-loose">
            CivicSaarthi remains committed to strict data neutrality and privacy. We do not store map search data or request live location permissions.
         </p>
      </div>
    </div>
  );
}
