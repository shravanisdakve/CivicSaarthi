import { useEffect, useRef } from 'react';
import Button from './Button.jsx';

export default function Dialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = 'OK', 
  cancelLabel = 'Cancel',
  type = 'confirm' // 'alert' or 'confirm'
}) {
  const modalRef = useRef(null);
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        confirmBtnRef.current?.focus();
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'Tab') {
          const focusables = modalRef.current?.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden outline-none animate-in zoom-in duration-300"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
      >
        <div className="p-6 text-center">
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${type === 'confirm' ? 'bg-amber-100 text-amber-600' : 'bg-primary-fixed text-primary'}`}>
            <span className="material-symbols-outlined text-3xl icon-fill">
              {type === 'confirm' ? 'report_problem' : 'info'}
            </span>
          </div>
          
          <h2 id="dialog-title" className="text-xl font-bold font-['Public_Sans'] text-on-surface mb-2">
            {title}
          </h2>
          <p id="dialog-message" className="text-sm text-on-surface-variant leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex items-center gap-3 p-6 bg-slate-50 border-t border-slate-100">
          {type === 'confirm' && (
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 outline-none"
            >
              {cancelLabel}
            </button>
          )}
          <button
            ref={confirmBtnRef}
            onClick={() => {
              if (onConfirm) onConfirm();
              else onClose();
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-all active:scale-95 focus-visible:ring-2 outline-none ${
              type === 'confirm' ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-400' : 'bg-primary hover:bg-primary-container focus-visible:ring-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
