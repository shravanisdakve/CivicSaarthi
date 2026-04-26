import { useEffect, useRef } from 'react';
import { loginAsGuest, loginWithGoogle } from '../utils/auth.js';
import Button from './Button.jsx';

export default function AuthModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const firstFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure render is complete
      const timer = setTimeout(() => {
        firstFocusRef.current?.focus();
      }, 50);
      
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
        
        // Trap focus (basic)
        if (e.key === 'Tab') {
          const focusables = modalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (focusables && focusables.length > 0) {
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGuest = () => {
    loginAsGuest();
    onClose();
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden outline-none animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary icon-fill">how_to_vote</span>
            <span className="font-['Public_Sans'] font-bold text-on-surface">CivicSaarthi</span>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close authentication modal"
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8">
          <h2 id="modal-title" className="text-2xl font-bold font-['Public_Sans'] text-on-surface mb-2 text-center">Your Civic Identity</h2>
          <p className="text-on-surface-variant text-sm text-center mb-8 font-medium">
            Sign in to sync your civic readiness dashboard, or continue as guest to keep everything on this device.
          </p>

          <div className="flex flex-col gap-4">
            <button
              ref={firstFocusRef}
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 py-3 border border-slate-300 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-primary outline-none"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google Logo" className="w-5 h-5" />
              Continue with Google
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] uppercase tracking-widest font-bold">Privacy-First Access</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <Button variant="primary" onClick={handleGuest} className="w-full justify-center py-3 rounded-xl font-bold shadow-md">
              Continue as Guest
            </Button>
            <p className="text-[10px] text-slate-500 text-center mt-1 font-medium">
              Guest mode stores your progress <span className="text-primary font-bold">privately</span> on your local device.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-5 text-xs text-slate-600 border-t border-slate-100 flex items-start gap-3">
          <span className="material-symbols-outlined text-[20px] text-primary/60 shrink-0 mt-0.5 icon-fill">shield</span>
          <p className="leading-relaxed">
            <strong>Commitment to Privacy:</strong> CivicSaarthi does not collect Aadhaar, voter ID, phone number, address, live location, or political preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
