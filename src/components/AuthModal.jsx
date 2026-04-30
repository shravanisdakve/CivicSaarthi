import { useEffect, useRef, useState } from 'react';
import { loginWithGoogle, loginWithEmail, registerWithEmail } from '../utils/auth.js';
import Button from './Button.jsx';

export default function AuthModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const signinTabRef = useRef(null); // Ref for Sign In tab button
  const [mode, setMode] = useState('signin'); // 'signin' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Set initial focus to the Sign In tab when modal opens
      const timer = setTimeout(() => {
        signinTabRef.current?.focus();
      }, 50); // Small delay to ensure element is rendered and focusable

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
        role="dialog" // Added role for accessibility
        aria-modal="true" // Added aria-modal for accessibility
        aria-labelledby="auth-modal-title" // Links to the h2 below
      >
        <div className="p-6 pb-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary icon-fill">
                shield_person
              </span>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">CivicSaarthi</span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors"
            aria-label="Close authentication dialog"
          >
            {' '}
            {/* Added aria-label */}
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-8 pt-4 pb-10">
          <div className="mb-8">
            <h2 id="auth-modal-title" className="text-3xl font-black text-slate-900 mb-1">
              {mode === 'signin' ? 'Welcome back!' : 'Join CivicSaarthi'}
            </h2>
            <p className="text-slate-500 font-medium">
              {mode === 'signin'
                ? 'Sign in to access your civic dashboard.'
                : 'Create an account to start your civic journey.'}
            </p>
          </div>

          <div role="tablist" className="bg-slate-100 p-1.5 rounded-2xl flex mb-6">
            {' '}
            {/* Added role="tablist" */}
            <button
              id="signin-tab" // Added id
              onClick={() => setMode('signin')}
              role="tab" // Added role="tab"
              aria-selected={mode === 'signin'} // Added aria-selected
              aria-controls="signin-panel" // Added aria-controls
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sign In
            </button>
            <button
              id="register-tab" // Added id
              onClick={() => setMode('register')}
              role="tab" // Added role="tab"
              aria-selected={mode === 'register'} // Added aria-selected
              aria-controls="register-panel" // Added aria-controls
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Register
            </button>
          </div>

          <div
            id="signin-panel" // Added id for aria-controls
            role="tabpanel" // Added role="tabpanel"
            aria-labelledby="signin-tab" // Added aria-labelledby
            hidden={mode !== 'signin'} // Hidden if not active
          >
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm mb-6 disabled:opacity-50"
            >
              <img
                src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium">
                or with email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signin' &&
                error && ( // Conditionally render error for signin mode
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold animate-shake">
                    {error}
                  </div>
                )}

              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                  aria-label="Email address"
                />
              </div>

              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min. 6 characters)"
                  className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                  aria-label="Password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">login</span>
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </button>
            </form>
          </div>

          <div
            id="register-panel" // Added id for aria-controls
            role="tabpanel" // Added role="tabpanel"
            aria-labelledby="register-tab" // Added aria-labelledby
            hidden={mode !== 'register'} // Hidden if not active
          >
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm mb-6 disabled:opacity-50"
            >
              <img
                src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium">
                or with email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' &&
                error && ( // Conditionally render error for register mode
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold animate-shake">
                    {error}
                  </div>
                )}

              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                  aria-label="Email address"
                />
              </div>

              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min. 6 characters)"
                  className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                  aria-label="Password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">login</span>
                    Create Account
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm text-slate-500 font-medium">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
              className="text-slate-900 font-black hover:underline"
            >
              {mode === 'signin' ? 'Register free' : 'Sign in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
