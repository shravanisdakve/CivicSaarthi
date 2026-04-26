import { translations } from '../data/translations.js';

const LANG_KEY = 'civicLanguage';

/**
 * Gets the currently selected language from localStorage.
 */
export function getLanguage() {
  try {
    return localStorage.getItem(LANG_KEY) || 'en';
  } catch {
    return 'en';
  }
}

/**
 * Saves the selected language to localStorage and dispatches an event.
 */
export function setLanguage(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
    window.dispatchEvent(new CustomEvent('civicLanguageChanged', { detail: lang }));
  } catch (err) {
    console.error('Failed to save language:', err);
  }
}

/**
 * Translates a key based on the current language.
 */
export function t(key) {
  const lang = getLanguage();
  const dict = translations[lang] || translations.en;
  return dict[key] || translations.en[key] || key;
}
