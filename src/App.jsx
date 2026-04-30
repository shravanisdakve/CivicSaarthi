import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RouteLoader from './components/RouteLoader.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import OfflineStatus from './components/OfflineStatus.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const ChoosePath = lazy(() => import('./pages/ChoosePath.jsx'));
const Timeline = lazy(() => import('./pages/Timeline.jsx'));
const Checklist = lazy(() => import('./pages/Checklist.jsx'));
const Glossary = lazy(() => import('./pages/Glossary.jsx'));
const GlossaryDetail = lazy(() => import('./pages/GlossaryDetail.jsx'));
const Quiz = lazy(() => import('./pages/Quiz.jsx'));
const Sources = lazy(() => import('./pages/Sources.jsx'));
const Safety = lazy(() => import('./pages/Safety.jsx'));
const Architecture = lazy(() => import('./pages/Architecture.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Assistant = lazy(() => import('./pages/Assistant.jsx'));
const MapHelper = lazy(() => import('./pages/MapHelper.jsx'));

/**
 * Main Application Component
 * Handles high-level routing, lazy loading of pages for efficiency,
 * and global Error Boundary wrapping.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/map" element={<MapHelper />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/choose-path" element={<ChoosePath />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/glossary/:id" element={<GlossaryDetail />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </Suspense>
      <OfflineStatus />
    </ErrorBoundary>
  );
}
