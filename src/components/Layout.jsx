import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf8ff]">
      <Navbar />
      <main className="flex-grow" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
