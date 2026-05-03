import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getLocalResponse } from '../utils/localAssistant.js';
import { useTranslation } from '../hooks/useTranslation.js';
import { ASSISTANT_CONFIG, WELCOME_MESSAGES, SUGGESTED_QUESTIONS } from '../data/assistantConfig.js';
import {
  normalizeUserMessage,
  containsUnsafePersonalDataHint,
  isValidChatMessage,
} from '../utils/inputSafety.js';
import { getProfile } from '../utils/profileStorage.js';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import { getSpeechRecognition, speakText, stopSpeech, isSpeechSupported } from '../utils/speech.js';
import aiIllustration from '../assets/assistant_ai.png';
import FormattedMessage from '../components/FormattedMessage.jsx';

// Suggested questions moved to assistantConfig.js

// --- Mic Button (voice input) ---
function MicButton({ language, onTranscript, loading }) {
  const [listening, setListening] = useState(false);
  if (!isSpeechSupported()) return null;
  const handleMic = () => {
    const rec = getSpeechRecognition(language);
    if (!rec) return;
    setListening(true);
    rec.onresult = (e) => {
      onTranscript(e.results[0][0].transcript);
      setListening(false);
    };
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
      className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center shadow-sm transition-all ${
        listening
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-slate-100 border border-slate-200 text-slate-600 hover:border-primary hover:bg-blue-50 hover:text-primary'
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">
        {listening ? 'mic_active' : 'mic'}
      </span>
    </button>
  );
}

// --- Read Aloud Button (TTS) ---
function ReadAloudButton({ lastResponse, language, ttsAudio }) {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setSpeaking(false);
    }
  }, [ttsAudio]);

  if (!lastResponse || !isSpeechSupported()) return null;

  const handleToggle = () => {
    if (speaking) {
      if (audioRef.current) audioRef.current.pause();
      stopSpeech();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      if (ttsAudio) {
        if (!audioRef.current) {
          audioRef.current = new Audio(`data:audio/mp3;base64,${ttsAudio}`);
        }
        audioRef.current.play().catch(() => {});
      } else {
        speakText(lastResponse, language);
        // Reset state when speech ends (approximate) - for browser TTS
        const words = lastResponse.split(' ').length;
        const ms = Math.max(3000, words * 400);
        setTimeout(() => setSpeaking(false), ms);
      }
    }
  };
  return (
    <button
      type="button"
      onClick={handleToggle}
      title={speaking ? 'Stop reading' : 'Read last response aloud'}
      className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center shadow-sm transition-all ${
        speaking
          ? 'bg-primary text-white animate-pulse'
          : 'bg-slate-100 border border-slate-200 text-slate-600 hover:border-primary hover:bg-blue-50 hover:text-primary'
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">
        {speaking ? 'stop_circle' : 'volume_up'}
      </span>
    </button>
  );
}



export default function Assistant() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { language: lang } = useTranslation();

  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('civicChatHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [privacyWarning, setPrivacyWarning] = useState(false);
  const [geminiActive, setGeminiActive] = useState(false);
  const [imageFile, setImageFile] = useState(null); // New state for image file
  const [locationData, setLocationData] = useState(null); // New state for location data
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const profile = getProfile();
  const hasName = profile.name && profile.name !== 'Guest Citizen';

  const WELCOME = useMemo(() => ({
    role: 'ai',
    text: WELCOME_MESSAGES[lang] ? WELCOME_MESSAGES[lang](hasName ? profile.name : null) : WELCOME_MESSAGES.en(hasName ? profile.name : null),
    isWelcomeIllustration: true
  }), [lang, profile.name, hasName]);

  useEffect(() => {
    // Only reset if we only have the welcome message or no messages
    if (messages.length === 0) {
      setMessages([WELCOME]);
    } else if (messages.length === 1 && messages[0].isWelcomeIllustration && messages[0].text !== WELCOME.text) {
      // Language changed, update the welcome message text
      setMessages([WELCOME]);
    }

    // Check Gemini Status
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => setGeminiActive(data.geminiConfigured))
      .catch(() => setGeminiActive(false));
  }, [lang, profile.name, WELCOME, messages]);



  useEffect(() => {
    const historyToSave = messages.slice(-20);
    sessionStorage.setItem('civicChatHistory', JSON.stringify(historyToSave));
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    });
  };

  const sendMessage = useCallback(async (text, image = null, location = null) => { // Added image and location parameter
    const rawText = text || input;
    const userText = normalizeUserMessage(rawText);

    if (!isValidChatMessage(userText) && !image && !location) { // Allow empty text if image or location is present
      setValidationError('Min 2 characters, provide an image, or share location.');
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
    setImageFile(null); // Clear image after sending
    setLocationData(null); // Clear location after sending

    const userMessage = { role: 'user', text: userText };
    if (image) {
      userMessage.image = image; // Store base64 image in message
    }
    if (location) {
      userMessage.location = location; // Store location in message
    }
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const messageHistory = messages.slice(-10).map(msg => ({ // Send last 10 messages as history
      role: msg.role === 'ai' ? 'model' : 'user', // Gemini expects 'user' and 'model' roles
      parts: msg.image ? [{ text: msg.text || '' }, { inlineData: { mimeType: 'image/jpeg', data: msg.image } }] : [{ text: msg.text }],
    }));

    // Add the current user message to the history for the API call
    const currentMessageParts = [];
    if (userText) currentMessageParts.push({ text: userText });
    if (image) currentMessageParts.push({ inlineData: { mimeType: 'image/jpeg', data: image } });

    const currentMessageForHistory = {
      role: 'user',
      parts: currentMessageParts,
    };
    const fullHistory = [...messageHistory, currentMessageForHistory];

    try {
      const persona = getProfile().selectedPersona || 'general';
      const body = { message: userText, persona, language: lang, history: fullHistory, image: image };
      if (location) {
        body.location = location; // Pass location to backend
      }
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: data.response || data.error || 'No response received.',
          grounded: data.grounded,
          references: data.references,
          ttsAudio: data.ttsAudio, // Store base64 audio
          locationContext: data.locationContext, // Store location context if returned
        },
      ]);
    } catch {
      const fallback = getLocalResponse(userText);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: fallback,
          isFallback: true,
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, lang, messages]);

  // Handle query param or state prompt
  useEffect(() => {
    const prompt = searchParams.get('prompt') || location.state?.question;
    if (prompt) {
      // Check if this was already handled to avoid double sending
      const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
      if (lastUserMsg?.text !== prompt) {
        sendMessage(prompt);
      }
    }
  }, [searchParams, location.state, messages, sendMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input, imageFile, locationData); // Pass imageFile and locationData
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; // Get base64 content
        setImageFile(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 flex flex-col h-[calc(100dvh-100px)] lg:h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-sm overflow-hidden shrink-0">
              <img src="/assistant-icon.jpg" alt="AI Icon" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-['Public_Sans'] text-lg sm:text-xl font-bold text-slate-800 truncate">
              {ASSISTANT_CONFIG.name}
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setMessages([WELCOME]);
              sessionStorage.removeItem('civicChatHistory');
            }}
            className="text-xs py-1.5 px-4 h-auto shrink-0 rounded-full"
          >
            Clear Chat
          </Button>
        </div>

        {/* Status badges — horizontally scrollable */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 shrink-0 ${geminiActive ? 'bg-blue-50 text-blue-700 border border-blue-100/50' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
            <span className="material-symbols-outlined text-[14px]">{geminiActive ? 'psychology' : 'cloud_off'}</span>
            {geminiActive ? 'Gemini API Active' : 'Local Fallback'}
          </span>
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/50 uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 shrink-0">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Official-Source Grounded
          </span>
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100/50 uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 shrink-0">
            <span className="material-symbols-outlined text-[14px]">balance</span>
            Non-Partisan AI
          </span>
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100/50 uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 shrink-0">
            <span className="material-symbols-outlined text-[14px]">language</span>
            Multilingual Parity
          </span>
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200 uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 shrink-0">
            <span className="material-symbols-outlined text-[14px]">cloud</span>
            Powered by Google Cloud
          </span>
        </div>
      </div>


      <Card className="flex-grow flex flex-col overflow-hidden bg-white/50 backdrop-blur-sm border-slate-200">
        <div
          ref={messagesContainerRef}
          className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-5 scroll-smooth"
          aria-live="polite"
          aria-atomic="false"
        >
          {messages.map((msg, i) => {
            const isErrorMsg = msg.error || msg.isFallback || (msg.role === 'ai' && msg.text && msg.text.toLowerCase().includes('error generating response'));
            return (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-[24px] p-4 sm:p-5 text-sm leading-relaxed shadow-sm transition-all ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : isErrorMsg
                    ? 'bg-red-50 border border-red-100 rounded-tl-none text-red-800'
                    : 'bg-white border border-slate-100 rounded-tl-none text-slate-800'
                }`}
              >
                {msg.role === 'ai' && isErrorMsg && (
                  <div className="flex items-center gap-2 mb-2 font-bold text-red-700">
                     <span className="material-symbols-outlined text-[18px]">warning</span>
                     System Notification
                  </div>
                )}
                <FormattedMessage text={msg.text} />
                {msg.isWelcomeIllustration && (
                  <img src={aiIllustration} alt="Friendly AI Civic Guide" className="mt-4 w-48 h-auto drop-shadow-md rounded-lg" />
                )}
                {msg.image && (
                  <img
                    src={`data:image/jpeg;base64,${msg.image}`}
                    alt="User uploaded"
                    className="mt-2 max-w-full h-auto rounded-lg"
                  />
                )}

                {msg.role === 'ai' && (
                  <div className="mt-3 flex justify-start">
                    <button
                      onClick={() => {
                        if (msg.ttsAudio) {
                          new Audio(`data:audio/mp3;base64,${msg.ttsAudio}`).play().catch(() => {});
                        } else {
                          speakText(msg.text, lang);
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-[11px] font-bold border border-primary/20"
                      title="Listen to this response"
                    >
                      <span className="material-symbols-outlined text-[16px]">volume_up</span>
                      Listen
                    </button>
                  </div>
                )}

                {msg.grounded && msg.references && msg.references[0] ? (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-green-700 uppercase">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        Verified Source: {msg.references[0].sourceName.includes('ECI') ? 'ECI' : msg.references[0].sourceName} – {msg.references[0].sourceLanguage || 'language not specified'}
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        UI: {lang === 'hi' ? 'Hindi' : lang === 'mr' ? 'Marathi' : 'English'}
                      </span>
                    </div>
                    
                    {msg.references[0].sourceLanguageCode && !msg.references[0].sourceLanguageCode.includes(lang) && (
                      <div className="mb-3 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                        <p className="text-[10px] text-blue-700 font-medium">
                          {msg.references[0].sourceLanguage === 'Unknown' 
                            ? 'Source language is not specified. Ask AI to summarize it in your language?'
                            : `This source is in ${msg.references[0].sourceLanguage}. Summarize it in ${lang === 'hi' ? 'Hindi' : lang === 'mr' ? 'Marathi' : 'English'}?`}
                        </p>
                        <button
                          onClick={() => sendMessage(`Summarize the official source for me in ${lang === 'hi' ? 'Hindi' : lang === 'mr' ? 'Marathi' : 'English'}`)}
                          className="text-[9px] font-bold uppercase text-primary hover:underline shrink-0"
                        >
                          Summarize
                        </button>
                      </div>
                    )}
                    {msg.references && (
                      <div className="space-y-1.5">
                        {msg.references.slice(0, 2).map((ref, idx) => (
                          <a
                            key={idx}
                            href={ref.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[10px] text-primary hover:underline group"
                          >
                            <span className="material-symbols-outlined text-[12px] opacity-60">link</span>
                            <span className="truncate">{ref.title || 'View Official Document'}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : msg.role === 'ai' && !msg.isWelcomeIllustration && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">
                    <span className="material-symbols-outlined text-[12px]">info</span>
                    General civic guidance — no official source attached
                  </div>
                )}

                {msg.isFallback && (
                  <div className="mt-2 pt-2 border-t border-amber-100 flex items-center gap-1 text-[10px] font-bold text-amber-700 italic">
                    <span className="material-symbols-outlined text-[14px]">cloud_off</span>
                    Offline Mode Guidance
                  </div>
                )}

                {msg.role === 'ai' && !msg.isFallback && (
                  <p className="mt-3 pt-2 border-t border-slate-100/50 text-[10px] text-slate-400 italic">
                    Answer generated with Gemini + CivicSaarthi official knowledge base.
                  </p>
                )}
              </div>
            </div>
          );
          })}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white px-5 py-3 rounded-full border border-slate-100 flex gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 sm:p-5 bg-white border-t border-slate-100">
          <div className="flex gap-2.5 overflow-x-auto pb-2 mb-3 no-scrollbar snap-x">
            {SUGGESTED_QUESTIONS[lang].map((q) => (
              <button
                key={q.text}
                onClick={() => sendMessage(q.text)}
                disabled={loading}
                className="whitespace-nowrap snap-start flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border border-slate-200 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all bg-white shadow-sm shrink-0"
              >
                <span className="material-symbols-outlined text-[16px] text-primary/70">{q.icon}</span>
                {q.text}
              </button>
            ))}
          </div>

          {validationError && (
            <p className="text-xs text-red-600 font-bold mb-2">{validationError}</p>
          )}
          {privacyWarning && (
            <p className="text-xs text-amber-700 font-bold mb-2">
              Avoid sensitive data like Voter IDs.
            </p>
          )}

          {imageFile && ( // Display selected image preview
            <div className="mb-2 flex items-center justify-between p-2 border border-slate-200 rounded-lg">
              <img src={`data:image/jpeg;base64,${imageFile}`} alt="Selected" className="max-h-16 rounded-md" />
              <p className="text-sm text-slate-600 truncate ml-2">Image ready for upload</p>
              <button
                onClick={() => setImageFile(null)}
                className="ml-2 text-red-500 hover:text-red-700"
                title="Remove image"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              {/* Mic button */}
              <MicButton
                language={lang}
                onTranscript={(text) => {
                  setInput(text);
                  sendMessage(text, imageFile); // Pass imageFile
                }}
                loading={loading}
              />
              <input
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  lang === 'hi'
                    ? 'अपना प्रश्न लिखें...'
                    : lang === 'mr'
                      ? 'तुमचा प्रश्न लिहा...'
                      : 'Ask a question or share an image...'
                }
                className="flex-grow px-4 py-2.5 bg-slate-100 border-none rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all min-w-0 placeholder-slate-400"
                disabled={loading}
              />
              {/* Image Upload button */}
              <label
                htmlFor="image-upload"
                className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center shadow-sm transition-all cursor-pointer ${
                  loading ? 'bg-slate-300 text-slate-500' : 'bg-slate-100 border border-slate-200 text-slate-600 hover:border-primary hover:bg-blue-50 hover:text-primary'
                }`}
                title="Upload an image"
              >
                <span className="material-symbols-outlined text-[20px]">image</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={loading}
                />
              </label>
              {/* Read Aloud button */}
              <ReadAloudButton
                lastResponse={messages.filter((m) => m.role === 'ai').reverse()[0]?.text}
                language={lang}
                ttsAudio={messages.filter((m) => m.role === 'ai').reverse()[0]?.ttsAudio}
              />
              {/* Send button */}
              <button
                type="submit"
                disabled={loading || (!input.trim() && !imageFile)} // Disable if no text and no image
                className="w-11 h-11 shrink-0 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:brightness-110 disabled:opacity-50 transition-all"
                title="Send"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-3">
            CivicSaarthi AI provides non-partisan information. Your chat is stored locally in this
            session.
          </p>
        </div>
      </Card>
    </div>
  );
}
