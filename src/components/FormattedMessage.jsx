import FormattedText from './FormattedText.jsx';

export default function FormattedMessage({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  lines.forEach((line, i) => {
    let trimmed = line.trim();
    
    // Remove markdown heading hashes (e.g. "### Heading" -> "Heading")
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      trimmed = headingMatch[2];
    }

    const stepMatch = trimmed.match(/^(\d+)[.)]\s+(.*)/);
    
    if (stepMatch) {
      currentList.push({ num: stepMatch[1], content: stepMatch[2] });
    } else {
      if (currentList.length > 0) {
        elements.push(
          <div key={`list-${i}`} className="space-y-3 my-4">
            {currentList.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  {item.num}
                </div>
                <div className="text-sm text-slate-800 leading-relaxed pt-1 font-medium">
                  <FormattedText text={item.content} />
                </div>
              </div>
            ))}
          </div>
        );
        currentList = [];
      }
      
      const isTip = trimmed.toUpperCase().includes('IMPORTANT TIPS') || 
                   trimmed.toUpperCase().includes('महत्वपूर्ण टिपा') ||
                   trimmed.toUpperCase().includes('महत्वपूर्ण टिप्स');

      if (isTip) {
         elements.push(
           <div key={`tip-${i}`} className="my-4 p-5 bg-amber-50/80 rounded-3xl border border-amber-200/50 shadow-sm">
             <div className="flex items-center gap-2 mb-3 text-amber-900 font-extrabold text-[10px] uppercase tracking-[0.2em]">
               <span className="material-symbols-outlined text-lg">tips_and_updates</span>
               <FormattedText text={trimmed} />
             </div>
           </div>
         );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
        const bulletText = trimmed.replace(/^[-•*]\s+/, '');
        elements.push(
          <div key={i} className="flex gap-3 mb-2 px-2 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></div>
            <p className="text-sm leading-relaxed font-medium">
              <FormattedText text={bulletText} />
            </p>
          </div>
        );
      } else if (trimmed) {
        elements.push(
          <p key={i} className={`mb-3 last:mb-0 leading-relaxed ${headingMatch ? 'font-bold text-base mt-4' : 'font-medium'}`}>
            <FormattedText text={trimmed} />
          </p>
        );
      }
    }
  });

  if (currentList.length > 0) {
    elements.push(
      <div key="list-final" className="space-y-3 my-4">
        {currentList.map((item, idx) => (
          <div key={idx} className="flex gap-4 p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold text-xs">
              {item.num}
            </div>
            <div className="text-sm text-slate-800 leading-relaxed pt-1 font-medium">
              <FormattedText text={item.content} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <div className="w-full">{elements}</div>;
}
