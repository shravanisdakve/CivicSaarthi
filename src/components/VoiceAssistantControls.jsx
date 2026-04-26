import { useState, useEffect } from 'react';
import { getSpeechRecognition, speakText, stopSpeech, isSpeechSupported } from '../utils/speech.js';

export default function VoiceAssistantControls({ onTranscript, lastResponse, language }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState('');

  if (!isSpeechSupported()) {
    return (
      <p className="text-[10px] text-slate-400 mt-2 italic">
        Voice mode is not supported in this browser. You can still type your question.
      </p>
    );
  }

  const startListening = () => {
    const recognition = getSpeechRecognition(language);
    if (!recognition) {
      setError('Recognition failed to start.');
      return;
    }

    setError('');
    setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setError(`Speech error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSpeakResponse = () => {
    if (!lastResponse) return;
    setIsSpeaking(true);
    speakText(lastResponse, language);
    
    // Approximate speaking state (speechSynthesis doesn't have a reliable 'speaking' event in all browsers)
    setTimeout(() => setIsSpeaking(false), 5000); 
  };

  const handleStop = () => {
    stopSpeech();
    setIsSpeaking(false);
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={startListening}
          disabled={isListening}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-white border border-slate-200 text-slate-700 hover:border-primary hover:text-primary'
          }`}
          aria-label="Speak your question"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isListening ? 'mic_active' : 'mic'}
          </span>
          {isListening ? 'Listening...' : 'Speak'}
        </button>

        {lastResponse && (
          <button
            type="button"
            onClick={isSpeaking ? handleStop : handleSpeakResponse}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
              isSpeaking 
                ? 'bg-primary text-white' 
                : 'bg-white border border-slate-200 text-slate-700 hover:border-primary hover:text-primary'
            }`}
            aria-label={isSpeaking ? 'Stop voice playback' : 'Read assistant answer aloud'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSpeaking ? 'stop_circle' : 'volume_up'}
            </span>
            {isSpeaking ? 'Stop' : 'Read Aloud'}
          </button>
        )}
      </div>
      
      {error && <p className="text-[10px] text-red-500 font-bold ml-2">{error}</p>}
      
      <p className="text-[10px] text-slate-400 ml-2">
        Voice input is processed by your browser’s speech features. CivicSaarthi does not store voice recordings.
      </p>
    </div>
  );
}
