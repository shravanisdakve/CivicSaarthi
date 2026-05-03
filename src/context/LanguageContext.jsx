import { createContext, useState, useCallback } from 'react';
import { translations } from '../data/translations.js';

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('civicsaarthi_language') || 'en';
  });

  const setLanguage = (newLang) => {
    setLanguageState(newLang);
    localStorage.setItem('civicsaarthi_language', newLang);
    // Dispatch event for any non-react listeners if needed
    window.dispatchEvent(new CustomEvent('civicLanguageChanged', { detail: newLang }));
  };

  const t = useCallback(
    (key) => {
      const dictionary = translations[language] || translations.en;
      return dictionary[key] || translations.en[key] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
