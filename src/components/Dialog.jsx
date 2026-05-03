import { useEffect, useRef } from 'react';

export default function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  type = 'confirm', // 'alert' or 'confirm'
}) {
  const modalRef = useRef(null);
  const confirmBtnRef = useRef(null);
  const previouslyFocusedElement = useRef(null); // To store the element that had focus before opening

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement; // Store the currently focused element

      const timer = setTimeout(() => {
        confirmBtnRef.current?.focus(); // Set initial focus
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.stopPropagation(); // Prevent other escape listeners
          onClose();
        }
        if (e.key === 'Tab') {
          const focusableElements = Array.from(
            modalRef.current?.querySelectorAll(
              'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            ) || []
          );
          if (focusableElements.length === 0) return;

          const currentActiveElement = document.activeElement;
          const currentIndex = focusableElements.indexOf(currentActiveElement);

          if (e.shiftKey) {
            // Tab backwards
            const prevIndex =
              (currentIndex - 1 + focusableElements.length) % focusableElements.length;
            focusableElements[prevIndex].focus();
            e.preventDefault();
          } else {
            // Tab forwards
            const nextIndex = (currentIndex + 1) % focusableElements.length;
            focusableElements[nextIndex].focus();
            e.preventDefault();
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
      };
    } else {
      // When dialog closes, restore focus to the previously focused element
      if (
        previouslyFocusedElement.current &&
        typeof previouslyFocusedElement.current.focus === 'function'
      ) {
        previouslyFocusedElement.current.focus();
      }
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
        tabIndex="-1" // Make the modal container focusable
      >
        <div className="p-6 text-center">
          <div
            className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${type === 'confirm' ? 'bg-amber-100 text-amber-600' : 'bg-primary-fixed text-primary'}`}
          >
            <span className="material-symbols-outlined text-3xl icon-fill">
              {type === 'confirm' ? 'report_problem' : 'info'}
            </span>
          </div>

          <h2
            id="dialog-title"
            className="text-xl font-bold font-['Public_Sans'] text-on-surface mb-2"
          >
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
              type === 'confirm'
                ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-400'
                : 'bg-primary hover:bg-primary-container focus-visible:ring-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
