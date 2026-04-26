import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import FloatingAssistant from './FloatingAssistant.jsx';
import WelcomeIntro from './WelcomeIntro.jsx';

export default function Layout() {
  const [isIntroOpen, setIsIntroOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('civicIntroSeen') === 'true';
    if (!seen) {
      setTimeout(() => setIsIntroOpen(true), 1500);
    }

    const handleOpenIntro = () => setIsIntroOpen(true);
    window.addEventListener('civicOpenIntro', handleOpenIntro);
    return () => window.removeEventListener('civicOpenIntro', handleOpenIntro);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf8ff]">
      <a 
        href="#main-content" 
        className="absolute top-0 left-0 w-full bg-primary text-white text-center py-2 -translate-y-full focus:translate-y-0 transition-transform z-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      >
        Skip to main content
      </a>
      <Navbar />
      <main className="flex-grow" id="main-content" tabIndex="-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingAssistant />
      <WelcomeIntro isOpen={isIntroOpen} onClose={() => setIsIntroOpen(false)} />
    </div>
  );
}
