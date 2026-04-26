import { useState, useEffect } from 'react';
import Card from './Card.jsx';
import Button from './Button.jsx';
import { speakText, stopSpeech } from '../utils/speech.js';

export default function PhaseExplainer({ explainer, onClose, onUnderstood }) {
  const [progress, setProgress] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsAutoPlaying(false);
          return 100;
        }
        return p + (100 / 30); // 30 seconds
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleReadAloud = () => {
    const text = `${explainer.title}. ${explainer.hook}. ${explainer.bullets.join('. ')}. Key takeaway: ${explainer.takeaway}`;
    speakText(text);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => { stopSpeech(); onClose(); }} />
      
      <Card className="relative w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-300 border-none bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="bg-primary/10 px-3 py-1 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
            30-Sec Explainer
          </div>
          <button onClick={() => { stopSpeech(); onClose(); }} className="text-slate-400 hover:text-slate-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 font-['Public_Sans'] mb-2">{explainer.title}</h2>
          <p className="text-primary font-bold italic text-sm">"{explainer.hook}"</p>
        </div>

        <div className="space-y-4 mb-8">
          {explainer.bullets.map((bullet, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{bullet}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 p-4 rounded-xl mb-8 border border-slate-100">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Key Takeaway</p>
           <p className="text-slate-900 font-bold text-sm">{explainer.takeaway}</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-linear" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" className="flex-grow" onClick={() => { stopSpeech(); onUnderstood(); onClose(); }}>
              Mark as Understood
            </Button>
            <Button variant="outline" onClick={handleReadAloud} className="flex gap-2">
              <span className="material-symbols-outlined text-[18px]">volume_up</span>
              Listen
            </Button>
          </div>
          
          <p className="text-[10px] text-center text-slate-400">
            Official Reminder: Always verify timelines on the Election Commission website.
          </p>
        </div>
      </Card>
    </div>
  );
}
