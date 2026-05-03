import { translations } from '../data/translations.js';
import { getLanguage } from './language.js';

export function getShareText(status = 'learning', name = null) {
  const lang = getLanguage();
  const t = (key) => {
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  const base = t('share.base');
  const ready = t('share.ready');

  let message = status === 'ready' ? ready : base;

  if (name) {
    message = `Hi, I'm ${name}. ` + message;
  }

  return message;
}

export function getLinkedInUrl(text, url) {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

export function getTwitterUrl(text, url) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

export async function shareNative(text, url) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'CivicSaarthi - My Election Readiness',
        text: text,
        url: url,
      });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
