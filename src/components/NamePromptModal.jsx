import { useState } from 'react';
import Button from './Button.jsx';
import Card from './Card.jsx';
import { saveProfile, sanitizeDisplayName } from '../utils/guestProfile.js';

export default function NamePromptModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const sanitized = sanitizeDisplayName(name);
    if (sanitized && sanitized !== 'Guest Citizen') {
      saveProfile({ name: sanitized });
      onClose();
    }
  };

  const handleSkip = () => {
    saveProfile({ name: 'Guest Citizen' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" role="dialog" aria-modal="true">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      <Card className="relative w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300 border-none">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">face</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-['Public_Sans'] mb-2">
            What should CivicSaarthi call you?
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your name is stored only on this device. CivicSaarthi does not collect Aadhaar, voter ID, phone number, address, live location, or political preferences.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="guest-name" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">
              Your Name
            </label>
            <input 
              id="guest-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shravani"
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              autoFocus
              maxLength={30}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full"
              disabled={!name.trim()}
            >
              Save Name
            </Button>
            <button 
              type="button"
              onClick={handleSkip}
              className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors py-2"
            >
              Continue without name
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
