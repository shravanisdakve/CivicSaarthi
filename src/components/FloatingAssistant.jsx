import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocalResponse } from '../utils/localAssistant.js';
import { useTranslation } from '../hooks/useTranslation.js';
import { normalizeUserMessage, containsUnsafePersonalDataHint, isValidChatMessage } from '../utils/inputSafety.js';
import { getProfile } from '../utils/profileStorage.js';
import { guidedSteps } from '../data/guidedSteps.js';
import VoiceAssistantControls from './VoiceAssistantControls.jsx';
import { speakText, getSpeechRecognition, isSpeechSupported } from '../utils/speech.js';

const SUGGESTED = [
  'Walk me through the election process step by step.',
  'What is VVPAT and how does it work?',
  'How do I verify my name in the electoral roll?',
  'What is the Model Code of Conduct?',
  'What documents can I carry to vote?',
  'What is NOTA and how does it work?',
  'How do I find my polling booth safely?',
  'How to check candidate affidavits?',
];

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('civicChatHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [privacyWarning, setPrivacyWarning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Guided Journey State
  const [journeyStep, setJourneyStep] = useState(() => {
    const saved = localStorage.getItem('civicJourneyStep');
    return saved ? parseInt(saved) : 0;
  });
  const [isJourneyActive, setIsJourneyActive] = useState(() => {
    return localStorage.getItem('civicJourneyActive') === 'true';
  });

  const { t, language: lang } = useTranslation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const WELCOME = {
    role: 'ai',
    text: lang === 'hi' 
      ? "नमस्ते! मैं CivicSaarthi हूँ। मैं आपकी कैसे सहायता कर सकता हूँ?"
      : lang === 'mr'
      ? "नमस्कार! मी CivicSaarthi आहे. मी तुम्हाला आज कशी मदत करू शकतो?"
      : "Hello! I'm CivicSaarthi. I'm your neutral election-readiness companion. How can I assist you today?",
  };

  useEffect(() => {
    if (messages.length === 0) setMessages([WELCOME]);
    
    const handleOpenChat = (e) => {
      setIsOpen(true);
      if (e.detail?.mode === 'guide') {
        startJourney();
      } else if (e.detail?.question) {
        sendMessage(e.detail.question);
      }
    };
    window.addEventListener('civicOpenChat', handleOpenChat);
    return () => window.removeEventListener('civicOpenChat', handleOpenChat);
  }, [lang, messages.length]);

  useEffect(() => {
    // Persist messages (limit to 20)
    const historyToSave = messages.slice(-20);
    sessionStorage.setItem('civicChatHistory', JSON.stringify(historyToSave));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('civicJourneyStep', journeyStep.toString());
    localStorage.setItem('civicJourneyActive', isJourneyActive.toString());
  }, [journeyStep, isJourneyActive]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const startJourney = () => {
    setIsJourneyActive(true);
    setIsOpen(true);
    
    // If we're starting fresh
    if (journeyStep === 0) {
      setJourneyStep(1);
      setMessages(prev => [...prev, {
        role: 'ai',
        isJourney: true,
        step: 1,
        text: `${t('journey.starting')} ${t('journey.step')} 1 ${t('journey.of')} 9: ${t('step1.title')}\n\n${t('step1.exp')}\n\n${t('journey.why')}: ${t('step1.imp')}`
      }]);
    } else if (journeyStep <= guidedSteps.length) {
      // Resume current step
      const stepKey = `step${journeyStep}`;
      setMessages(prev => [...prev, {
        role: 'ai',
        isJourney: true,
        step: journeyStep,
        text: `${t('journey.resuming')} ${t('journey.step')} ${journeyStep} ${t('journey.of')} 9: ${t(`${stepKey}.title`)}\n\n${t(`${stepKey}.exp`)}`
      }]);
    }
  };

  const nextJourneyStep = () => {
    const next = journeyStep + 1;
    if (next <= guidedSteps.length) {
      setJourneyStep(next);
      const stepKey = `step${next}`;
      setMessages(prev => [...prev, {
        role: 'ai',
        isJourney: true,
        step: next,
        text: `${t('journey.step')} ${next} ${t('journey.of')} 9: ${t(`${stepKey}.title`)}\n\n${t(`${stepKey}.exp`)}\n\n${t('journey.why')}: ${t(`${stepKey}.imp`)}`
      }]);
    } else {
      setIsJourneyActive(false);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: t('journey.congrats')
      }]);
    }
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
    
    // 1. Always show user message bubble first
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    // Trigger journey if keyword matched
    if (userText.toLowerCase().includes('walk me through the election process')) {
      startJourney();
      setLoading(false);
      return;
    }

    try {
      const persona = getProfile().selectedPersona || 'general';
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, persona, language: lang }),
      });
      
      const data = await res.json();
      
      // Handle CTAs based on keywords
      const lowerResp = data.response.toLowerCase();
      let timelineStage = null;
      if (lowerResp.includes('nomination')) timelineStage = 'nominations';
      if (lowerResp.includes('mcc') || lowerResp.includes('code of conduct')) timelineStage = 'mcc';
      if (lowerResp.includes('campaign')) timelineStage = 'campaigning';
      if (lowerResp.includes('polling')) timelineStage = 'polling';
      if (lowerResp.includes('counting')) timelineStage = 'counting';
      if (lowerResp.includes('result')) timelineStage = 'results';

      setMessages((prev) => [...prev, { 
        role: 'ai', 
        text: data.response || data.error || 'No response received.',
        grounded: data.grounded,
        references: data.references,
        timelineStage
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

  const handleClearChat = () => {
    setMessages([WELCOME]);
    sessionStorage.removeItem('civicChatHistory');
    setIsJourneyActive(false);
    setJourneyStep(0);
    localStorage.removeItem('civicJourneyActive');
    localStorage.removeItem('civicJourneyStep');
  };

  const handleViewTimeline = (stage) => {
    localStorage.setItem('selectedTimelineStage', stage);
    navigate('/timeline');
    setIsOpen(false);
  };

  const startListening = () => {
    if (!isSpeechSupported()) return;
    const recognition = getSpeechRecognition(lang);
    if (!recognition) return;
    setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-indigo-700 p-4 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md p-0.5 border border-white/20 shadow-xl overflow-hidden">
                <img src="/assistant-icon.jpg" alt="AI Icon" className="w-full h-full rounded-full object-cover" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">CivicSaarthi AI</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-[9px] opacity-90 font-bold uppercase tracking-wider">{t('journey.online')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleClearChat}
                className="hover:bg-white/10 p-1 rounded-full transition-colors group relative"
                aria-label="Clear chat"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                <span className="absolute -top-8 right-0 bg-slate-800 text-[8px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{t('journey.clear')}</span>
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-1 rounded-full transition-colors"
                aria-label="Close assistant"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50" aria-live="polite">
            {/* Journey Entry Card */}
            {!isJourneyActive && (
              <div className="bg-gradient-to-br from-primary/5 to-indigo-50 border border-primary/10 rounded-xl p-4 shadow-sm mb-4">
                <h4 className="text-xs font-bold text-primary mb-1">{t('journey.start_title')}</h4>
                <p className="text-[10px] text-slate-600 mb-3">{t('journey.start_subtitle')}</p>
                <button 
                  onClick={startJourney}
                  className="w-full py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  {t('journey.start_btn')}
                </button>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white border-primary rounded-tr-none' 
                    : 'bg-white text-on-surface border-slate-100 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  
                  {msg.role === 'ai' && !msg.isJourney && (
                    <div className="mt-2 flex justify-end">
                      <button 
                        onClick={() => speakText(msg.text, lang)}
                        className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1 text-[9px] uppercase font-bold tracking-widest"
                        title={t('journey.listen')}
                      >
                        <span className="material-symbols-outlined text-[12px]">volume_up</span>
                        {t('journey.listen')}
                      </button>
                    </div>
                  )}
                  
                  {/* Guided Journey Actions */}
                  {msg.isJourney && msg.step === journeyStep && (
                    <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                      <button 
                        onClick={nextJourneyStep}
                        className="bg-primary text-white px-2 py-1 rounded-md text-[9px] font-bold hover:bg-indigo-700"
                      >
                        {msg.step < 9 ? t('journey.next_btn') : t('journey.finish_btn')}
                      </button>
                      <button 
                        onClick={() => handleViewTimeline(guidedSteps[msg.step - 1].timelineId)}
                        className="bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-md text-[9px] font-bold hover:bg-slate-50"
                      >
                        {t('journey.view_timeline')}
                      </button>
                    </div>
                  )}

                  {/* Timeline CTA */}
                  {msg.timelineStage && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <button 
                        onClick={() => handleViewTimeline(msg.timelineStage)}
                        className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">timeline</span>
                        {t('journey.view_timeline_stage')}
                      </button>
                    </div>
                  )}

                  {msg.grounded && (
                    <div className="mt-3 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-1">
                      <div className="flex items-center gap-1 text-[9px] font-bold text-green-700 uppercase tracking-tighter mb-2">
                        <span className="material-symbols-outlined text-[12px]">verified</span>
                        {t('journey.grounded')}
                      </div>
                      {msg.references && msg.references.length > 0 && (
                        <div className="space-y-2">
                          {msg.references.slice(0, 2).map((ref, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-green-50/50 p-1.5 rounded-lg border border-green-100/50">
                              <span className="text-[9px] font-semibold text-green-800 truncate max-w-[120px]">{ref.title}</span>
                              {ref.sourceUrl && (
                                <a 
                                  href={ref.sourceUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[8px] font-bold text-primary hover:underline flex items-center gap-0.5"
                                >
                                  {t('journey.verify')}
                                  <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {msg.isFallback && (
                    <div className="mt-2 pt-2 border-t border-amber-100 flex items-center gap-1 text-[9px] font-bold text-amber-700 italic">
                      <span className="material-symbols-outlined text-[12px]">cloud_off</span>
                      {t('journey.local_fallback')}
                    </div>
                  )}
                </div>
                {msg.role === 'ai' && (
                  <span className="text-[8px] text-slate-400 mt-1 ml-1 px-1">{t('journey.stored_locally')}</span>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer / Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            {/* Suggested Chips */}
            <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
              {SUGGESTED.map(q => (
                <button 
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="whitespace-nowrap text-[10px] px-3 py-1.5 rounded-full border border-slate-200 hover:border-primary hover:text-primary transition-all bg-white font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  aria-label={`Ask: ${q}`}
                >
                  {q}
                </button>
              ))}
            </div>

            {validationError && (
              <p className="text-[10px] text-red-600 font-bold mb-2 animate-pulse">{validationError}</p>
            )}
            {privacyWarning && (
              <p className="text-[10px] text-amber-700 font-bold mb-2 p-2 bg-amber-50 rounded border border-amber-100">
                {t('journey.privacy_warn')}
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2 relative">
              <button
                type="button"
                onClick={startListening}
                disabled={loading || isListening}
                className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all shadow-md ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary'
                }`}
                title="Use microphone"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isListening ? 'mic_active' : 'mic'}
                </span>
              </button>
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('journey.placeholder')}
                className="flex-grow px-4 py-2.5 bg-slate-100 border-none rounded-full text-xs outline-none focus:ring-1 focus:ring-primary transition-all"
                disabled={loading}
              />
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="w-10 h-10 shrink-0 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 transition-all shadow-md hover:scale-105 active:scale-95"
              >
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="relative group">
        {!isOpen && (
          <div 
            className="absolute right-20 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none z-50"
            role="tooltip"
            id="bot-tooltip"
          >
            {t('journey.chat_with')}
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
          </div>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          title={t('journey.chat_with')}
          className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 overflow-hidden border-2 focus:ring-4 focus:ring-primary/20 outline-none ${
            isOpen ? 'bg-slate-100 border-slate-300' : 'bg-white border-primary shadow-[0_0_20px_rgba(26,35,126,0.3)]'
          }`}
          aria-label={t('journey.chat_with')}
          aria-describedby="bot-tooltip"
        >
          {isOpen ? (
            <span className="material-symbols-outlined text-slate-600 text-3xl">close</span>
          ) : (
            <img src="/assistant-icon.jpg" alt="" className="w-full h-full object-cover" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
