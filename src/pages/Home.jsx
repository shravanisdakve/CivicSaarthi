import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';

const FEATURES = [
  { icon: 'code', title: 'Code Quality', desc: 'Rigorous standards ensuring robust and maintainable Infrastructure for long-term stability.' },
  { icon: 'security', title: 'Security', desc: 'Enterprise-grade protection of user data and strict adherence to privacy protocols.' },
  { icon: 'bolt', title: 'Efficiency', desc: 'Optimized performance for quick information retrieval, even on low-bandwidth networks.' },
  { icon: 'science', title: 'Testing', desc: 'Comprehensive automated testing ensuring reliable guidance without systemic errors.' },
  { icon: 'accessibility_new', title: 'Accessibility', desc: 'WCAG compliant design ensuring all voters can access vital electoral information.' },
  { icon: 'cloud', title: 'Google Services', desc: 'Seamlessly integrated with Google Cloud and Gemini for advanced, scalable capabilities.' },
];

const PERSONAS = [
  { icon: 'school', label: 'First-Time Voter', sub: 'Step-by-step basics' },
  { icon: 'home_work', label: 'Recently Moved', sub: 'Updating registration' },
  { icon: 'mail', label: 'Absentee Voter', sub: 'Mail-in procedures' },
];

const HOW_STEPS = [
  { n: 1, title: 'Assess Eligibility', desc: 'Answer a few simple, anonymous questions to determine your registration status and specific voting requirements based on your jurisdiction.' },
  { n: 2, title: 'Build Your Checklist', desc: 'Receive a personalized, actionable checklist containing deadlines, required documents, and official links needed to cast your ballot.' },
  { n: 3, title: 'Understand the Ballot', desc: 'Use the AI Assistant to explore non-partisan explanations of ballot measures and candidate roles, empowering informed decision-making.' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-8 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-primary-fixed px-3 py-1 rounded-full mb-6">
            <span className="material-symbols-outlined text-sm">cloud</span>
            POWERED BY GOOGLE CLOUD + GEMINI
          </span>
          <h1 className="font-['Public_Sans'] text-4xl md:text-5xl font-bold text-on-surface leading-tight mb-4">
            Understand Elections<br />Step by Step
          </h1>
          <p className="text-body-lg text-on-surface-variant mb-6 max-w-md">
            CivicSaarthi provides clear, unbiased, and accessible guidance to help you navigate the democratic process with confidence.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {['Neutral', 'First-time voter friendly', 'Official-source guided', 'Privacy-conscious'].map((tag) => (
              <span key={tag} className="text-xs border border-slate-300 text-slate-600 px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => navigate('/choose-path')}>Get Started</Button>
            <Button variant="outline" onClick={() => navigate('/about')}>Learn More</Button>
          </div>
        </div>
        {/* Illustration placeholder */}
        <div className="hidden md:flex items-center justify-center bg-surface-container-low rounded-2xl h-72">
          <div className="text-center text-on-surface-variant p-8">
            <span className="material-symbols-outlined text-7xl text-primary-fixed-dim">how_to_vote</span>
            <p className="mt-3 font-semibold text-primary font-['Public_Sans']">CivicSaarthi</p>
            <p className="text-sm text-on-surface-variant mt-1">Your Electoral Guide</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-surface-container-low py-14">
        <div className="max-w-screen-xl mx-auto px-6 md:px-8">
          <p className="text-center text-xs uppercase tracking-widest text-slate-400 mb-8 font-semibold">Built on Institutional Reliability</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <Card key={f.title} className="p-6">
                <span className="material-symbols-outlined text-primary mb-3">{f.icon}</span>
                <h3 className="font-['Public_Sans'] font-semibold text-on-surface mb-2">{f.title}</h3>
                <p className="text-sm text-on-surface-variant">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Persona + How it Works */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-8 py-16 grid md:grid-cols-2 gap-12">
        {/* Persona Selector */}
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">Tailored for Every Voter</p>
          <p className="text-sm text-on-surface-variant mb-6">
            Select a profile to{' '}
            <button onClick={() => navigate('/choose-path')} className="text-primary underline hover:no-underline">
              see customized guidance paths
            </button>
            .
          </p>
          <div className="flex flex-col gap-3">
            {PERSONAS.map((p) => (
              <button
                key={p.label}
                onClick={() => navigate('/choose-path')}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-primary hover:bg-surface-container-low text-left transition-all group"
              >
                <span className="material-symbols-outlined text-primary bg-primary-fixed w-10 h-10 rounded-full flex items-center justify-center text-2xl shrink-0">{p.icon}</span>
                <div className="flex-grow">
                  <p className="font-semibold text-on-surface text-sm">{p.label}</p>
                  <p className="text-xs text-on-surface-variant">{p.sub}</p>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
              </button>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-surface-container-low rounded-2xl p-8">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-6">How CivicSaarthi Works</p>
          <div className="flex flex-col gap-6">
            {HOW_STEPS.map((s) => (
              <div key={s.n} className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{s.n}</span>
                <div>
                  <p className="font-semibold text-on-surface text-sm mb-1">{s.title}</p>
                  <p className="text-xs text-on-surface-variant">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
