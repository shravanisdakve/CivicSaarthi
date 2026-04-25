import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SUGGESTED = [
  'How do I find my polling place?',
  'What is a ballot measure?',
  'How do I register to vote?',
  'What documents do I need to vote?',
];

const INFRA = [
  { icon: 'cloud', label: 'Google Cloud Run' },
  { icon: 'psychology', label: 'Gemini AI Models' },
  { icon: 'key', label: 'Secret Manager' },
];

const WELCOME = {
  role: 'ai',
  text: "Hello! I'm your Civic Assistant. I can help you understand the voting process, find your polling station, or explain complex electoral terms in simple language. How can I assist you today?",
};

export default function Assistant() {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Pre-fill question from navigation state (e.g. from Timeline or Checklist)
  useEffect(() => {
    const q = location.state?.question;
    if (q) setInput(q);
  }, [location.state]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const persona = (() => { try { return localStorage.getItem('civicPersona') || 'general'; } catch { return 'general'; } })();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, persona }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'ai', text: data.response || data.error || 'No response received.' }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'I\'m having trouble connecting right now. Please check your network and try again, or ask another question.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(); };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
      <div className="grid md:grid-cols-3 gap-6 items-start">

        {/* LEFT: Chat Panel */}
        <section className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-card flex flex-col" style={{ minHeight: '70vh' }}>
          {/* Chat Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">smart_toy</span>
              </div>
              <div>
                <p className="font-['Public_Sans'] font-semibold text-on-surface">Civic Assistant</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  Powered by Gemini
                </p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Options">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto px-5 py-4 flex flex-col gap-5" aria-live="polite" aria-label="Chat messages">
            <div className="text-center">
              <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Conversation started today</span>
            </div>

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 msg-enter ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-lg">smart_toy</span>
                  </div>
                )}
                {msg.role === 'user' && (
                  <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">person</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-secondary text-white rounded-tr-sm'
                      : 'bg-surface-container text-on-surface rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3 msg-enter">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-lg">smart_toy</span>
                </div>
                <div className="bg-surface-container px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                  <span className="dot w-2 h-2 bg-slate-400 rounded-full"></span>
                  <span className="dot w-2 h-2 bg-slate-400 rounded-full"></span>
                  <span className="dot w-2 h-2 bg-slate-400 rounded-full"></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested Chips */}
          <div className="px-5 py-3 border-t border-slate-100 flex flex-wrap gap-2">
            {SUGGESTED.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="text-xs border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-primary hover:text-primary hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="px-5 pb-5">
            <div className="flex items-center gap-3 border border-slate-200 rounded-full px-4 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about voting..."
                className="flex-grow text-sm bg-transparent outline-none text-on-surface placeholder-slate-400"
                aria-label="Type your question"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-container disabled:opacity-40 transition-colors shrink-0"
                aria-label="Send message"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">AI can make mistakes. Verify important information.</p>
          </form>
        </section>

        {/* RIGHT: Sidebar */}
        <aside className="flex flex-col gap-4">
          {/* Neutrality & Safety */}
          <div className="bg-white rounded-xl border-l-4 border-primary border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">security</span>
              <h3 className="font-['Public_Sans'] font-semibold text-on-surface">Neutrality &amp; Safety</h3>
            </div>
            <p className="text-sm text-on-surface-variant">
              This assistant is designed to provide factual, non-partisan information about electoral processes. It does not endorse candidates or political parties.
            </p>
          </div>

          {/* Privacy Focus */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-slate-500">lock</span>
              <h3 className="font-['Public_Sans'] font-semibold text-on-surface">Privacy Focus</h3>
            </div>
            <p className="text-sm text-on-surface-variant mb-3">
              Your conversation is secure. We do not store personally identifiable information linked to your voting queries.
            </p>
            <button onClick={() => navigate('/safety')} className="text-sm text-primary hover:underline">
              Read our Privacy Notes
            </button>
          </div>

          {/* Infrastructure */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">Infrastructure</p>
            {INFRA.map((item) => (
              <div key={item.label} className="flex items-center gap-3 py-2">
                <span className="material-symbols-outlined text-primary">{item.icon}</span>
                <span className="text-sm text-on-surface">{item.label}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
