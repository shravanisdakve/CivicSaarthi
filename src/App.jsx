import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Assistant from './pages/Assistant.jsx';
import ChoosePath from './pages/ChoosePath.jsx';
import Timeline from './pages/Timeline.jsx';
import Checklist from './pages/Checklist.jsx';
import Glossary from './pages/Glossary.jsx';
import GlossaryDetail from './pages/GlossaryDetail.jsx';
import Quiz from './pages/Quiz.jsx';
import Sources from './pages/Sources.jsx';
import Safety from './pages/Safety.jsx';
import Architecture from './pages/Architecture.jsx';
import Quality from './pages/Quality.jsx';
import About from './pages/About.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/choose-path" element={<ChoosePath />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/glossary/:id" element={<GlossaryDetail />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/sources" element={<Sources />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/architecture" element={<Architecture />} />
        <Route path="/quality" element={<Quality />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
