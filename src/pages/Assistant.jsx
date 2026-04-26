import { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getLocalResponse } from '../utils/localAssistant.js';
import { useTranslation } from '../hooks/useTranslation.js';
import { normalizeUserMessage, containsUnsafePersonalDataHint, isValidChatMessage } from '../utils/inputSafety.js';
import { getProfile } from '../utils/guestProfile.js';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import { getSpeechRecognition, speakText, stopSpeech, isSpeechSupported } from '../utils/speech.js';


const SUGGESTED = [
  'Walk me through the election process step by step.',
  'What is VVPAT and how does it work?',
  'How do I verify my name in the electoral roll?',
  'What is the Model Code of Conduct?',
  'What documents can I carry to vote?',
  'What is NOTA and how does it work?',
];

// --- Mic Button (voice input) ---
function MicButton({ language, onTranscript, loading }) {
  const [listening, setListening] = useState(false);
  if (!isSpeechSupported()) return null;
  const handleMic = () => {
    const rec = getSpeechRecognition(language);
    if (!rec) return;
    setListening(true);
    rec.onresult = (e) => { onTranscript(e.results[0][0].transcript); setListening(false); };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  };
  return (
    <button
      type="button"
      onClick={handleMic}
      disabled={listening || loading}
      title={listening ? 'Listening...' : 'Speak your question'}
      className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow transition-all ${
        listening
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-slate-100 border border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">{listening ? 'mic_active' : 'mic'}</span>
    </button>
  );
}

// --- Read Aloud Button (TTS) ---
function ReadAloudButton({ lastResponse, language }) {
  const [speaking, setSpeaking] = useState(false);
  if (!lastResponse || !isSpeechSupported()) return null;
  const handleToggle = () => {
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      speakText(lastResponse, language);
      // Reset state when speech ends (approximate)
      const words = lastResponse.split(' ').length;
      const ms = Math.max(3000, words * 400);
      setTimeout(() => setSpeaking(false), ms);
    }
  };
  return (
    <button
      type="button"
      onClick={handleToggle}
      title={speaking ? 'Stop reading' : 'Read last response aloud'}
      className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow transition-all ${
        speaking
          ? 'bg-primary text-white animate-pulse'
          : 'bg-slate-100 border border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">{speaking ? 'stop_circle' : 'volume_up'}</span>
    </button>
  );
}

export default function Assistant() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { t, language: lang } = useTranslation();
  
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('civicChatHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [privacyWarning, setPrivacyWarning] = useState(false);
  const [geminiActive, setGeminiActive] = useState(false);
  const messagesEndRef = useRef(null);

  const profile = getProfile();
  const hasName = profile.name && profile.name !== 'Guest Citizen';
  const firstName = hasName ? profile.name.split(' ')[0] : '';

  const WELCOME = {
    role: 'ai',
    text: lang === 'hi' 
      ? `नमस्ते${firstName ? ' ' + firstName : ''}! मैं CivicSaarthi हूँ। मैं आपकी कैसे सहायता कर सकता हूँ?`
      : lang === 'mr'
      ? `नमस्कार${firstName ? ' ' + firstName : ''}! मी CivicSaarthi आहे. मी तुम्हाला आज कशी मदत करू शकतो?`
      : firstName 
      ? `Hi ${firstName}, I'm CivicSaarthi AI. I can help you understand the election process step by step.`
      : "Hi, I'm CivicSaarthi AI. I can help you understand the election process step by step.",
  };

  useEffect(() => {
    // Only reset if we only have the welcome message or no messages
    if (messages.length === 0 || (messages.length === 1 && messages[0].role === 'ai')) {
      setMessages([WELCOME]);
    }
    
    // Check Gemini Status
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setGeminiActive(data.geminiConfigured))
      .catch(() => setGeminiActive(false));
  }, [lang, profile.name]);

  // Handle query param or state prompt
  useEffect(() => {
    const prompt = searchParams.get('prompt') || location.state?.question;
    if (prompt) {
      // Check if this was already handled to avoid double sending
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMsg?.text !== prompt) {
        sendMessage(prompt);
      }
    }
  }, [searchParams, location.state]);

  useEffect(() => {
    const historyToSave = messages.slice(-20);
    sessionStorage.setItem('civicChatHistory', JSON.stringify(historyToSave));
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (text) => {
    const rawText = text || input;
    const userText = normalizeUserMessage(rawText);
    
    if (!isValidChatMessage(userText)) {
      setValidationError('Min 2 characters.');
      setTimeout(() => setValidationError(''), 3000);
      return;
    }
    
    if (containsUnsafePersonalDataHint(userText)) {
      setPrivacyWarning(true);
      return;
    }

    setPrivacyWarning(false);
    setValidationError('');
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const persona = getProfile().selectedPersona || 'general';
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, persona, language: lang }),
      });
      
      const data = await res.json();
      setMessages((prev) => [...prev, { 
        role: 'ai', 
        text: data.response || data.error || 'No response received.',
        grounded: data.grounded,
        references: data.references
      }]);
    } catch (err) {
      const fallback = getLocalResponse(userText);
      setMessages((prev) => [...prev, { 
        role: 'ai', 
        text: fallback, 
        isFallback: true,
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-6 lg:py-8 flex flex-col h-[calc(100dvh-100px)] lg:h-[calc(100vh-120px)]">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg overflow-hidden">
             <img src="/assistant-icon.jpg" alt="AI Icon" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-['Public_Sans'] text-2xl font-bold text-on-surface">CivicSaarthi AI</h1>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1 ${geminiActive ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                <span className="material-symbols-outlined text-[12px]">{geminiActive ? 'psychology' : 'cloud_off'}</span>
                {geminiActive ? 'Gemini API Active' : 'Local Fallback'}
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                Official-Source Guided
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100 uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">cloud</span>
                Powered by Google Cloud
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => {
           setMessages([WELCOME]);
           sessionStorage.removeItem('civicChatHistory');
        }} className="text-xs py-1 px-3 h-auto">
          Clear Chat
        </Button>
      </div>

      <Card className="flex-grow flex flex-col overflow-hidden bg-white/50 backdrop-blur-sm border-slate-200">
        <div className="flex-grow overflow-y-auto p-6 space-y-6" aria-live="polite" aria-atomic="false">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 rounded-tl-none text-on-surface'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                
                {msg.role === 'ai' && (
                  <div className="mt-3 flex justify-start">
                    <button 
                      onClick={() => speakText(msg.text, lang)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-[11px] font-bold border border-primary/20"
                      title="Listen to this response"
                    >
                      <span className="material-symbols-outlined text-[16px]">volume_up</span>
                      Listen
                    </button>
                  </div>
                )}
                
                {msg.grounded && (
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-green-700 uppercase mb-2">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      Official Source Grounded
                    </div>
                    {msg.references && (
                      <div className="space-y-1">
                        {msg.references.slice(0, 2).map((ref, idx) => (
                          <a key={idx} href={ref.sourceUrl} target="_blank" rel="noopener noreferrer" className="block text-[10px] text-primary hover:underline truncate">
                             • {ref.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {msg.isFallback && (
                  <div className="mt-2 pt-2 border-t border-amber-100 flex items-center gap-1 text-[10px] font-bold text-amber-700 italic">
                    <span className="material-symbols-outlined text-[14px]">cloud_off</span>
                    Offline Mode Guidance
                  </div>
                )}
                
                {msg.role === 'ai' && !msg.isFallback && (
                  <p className="mt-3 pt-2 border-t border-slate-50 text-[9px] text-slate-400 italic">
                    Answer generated with Gemini + CivicSaarthi official knowledge base.
                  </p>
                )}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="bg-white px-4 py-2 rounded-full border border-slate-100 flex gap-1 shadow-sm">
                 <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                 <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                 <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
            {SUGGESTED.map(q => (
              <button 
                key={q}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="whitespace-nowrap text-[11px] font-semibold px-4 py-2 rounded-full border border-slate-200 hover:border-primary hover:text-primary transition-all bg-slate-50"
              >
                {q}
              </button>
            ))}
          </div>

          {validationError && <p className="text-xs text-red-600 font-bold mb-2">{validationError}</p>}
          {privacyWarning && <p className="text-xs text-amber-700 font-bold mb-2">Avoid sensitive data like Voter IDs.</p>}

          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              {/* Mic button */}
              <MicButton language={lang} onTranscript={(text) => { setInput(text); sendMessage(text); }} loading={loading} />
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'hi' ? 'अपना प्रश्न लिखें...' : lang === 'mr' ? 'तुमचा प्रश्न लिहा...' : 'Type your question...'}
                className="flex-grow px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={loading}
              />
              {/* Read Aloud button */}
              <ReadAloudButton lastResponse={messages.filter(m => m.role === 'ai').reverse()[0]?.text} language={lang} />
              {/* Send button */}
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="w-12 h-12 shrink-0 rounded-2xl bg-primary text-white flex items-center justify-center shadow hover:brightness-110 disabled:opacity-40 transition-all"
                title="Send"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-3">
            CivicSaarthi AI provides non-partisan information. Your chat is stored locally in this session.
          </p>
        </div>
      </Card>
    </div>
  );
}
