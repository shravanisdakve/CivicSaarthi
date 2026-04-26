// Social Sharing Utilities
// No personal data inclusion by default.

export function getShareText(status = 'learning', name = null) {
  const base = "I’m building my election readiness with CivicSaarthi — a privacy-first, official-source-guided election learning companion. Understand. Prepare. Verify. Vote.";
  const ready = "I’m voter-ready with CivicSaarthi: checklist complete, quiz practiced, and official sources verified. Understand. Prepare. Verify. Vote.";
  
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
    } catch (err) {
      return false;
    }
  }
  return false;
}
