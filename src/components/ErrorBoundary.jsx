import React from 'react';
import Button from './Button.jsx';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CivicSaarthi Error:', error, errorInfo);
    // Handle Vite dynamic import failure on new deployments
    if (error.message && error.message.includes('Failed to fetch dynamically imported module')) {
      if (!sessionStorage.getItem('civic_chunk_reloaded')) {
        sessionStorage.setItem('civic_chunk_reloaded', 'true');
        window.location.reload(true);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-100">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[40px]">error</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2 font-['Public_Sans']">
              Something went wrong
            </h1>
            <p className="text-slate-600 mb-8">
              We encountered an unexpected issue. You can return to the home page or try refreshing the app.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                variant="primary" 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Return Home
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/assistant'}
                className="w-full"
              >
                Open Assistant
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/timeline'}
                className="w-full"
              >
                Open Timeline
              </Button>
              <button 
                onClick={() => window.location.reload()}
                className="text-sm font-bold text-slate-400 hover:text-primary transition-colors"
              >
                Reload App
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
