import { officialKnowledge } from '../data/officialKnowledge.js';

/**
 * Searches for relevant official knowledge based on the user's message.
 * @param {string} message - The user input message.
 * @returns {Array} - Array of matched knowledge entries.
 */
export function searchKnowledge(message) {
  if (!message) return [];

  const query = message.toLowerCase();

  // Scoring function based on keyword matches
  const results = officialKnowledge
    .map((entry) => {
      let score = 0;

      // Exact match in title
      if (query.includes(entry.title.toLowerCase())) score += 10;

      // Match in keywords
      entry.keywords.forEach((keyword) => {
        if (query.includes(keyword.toLowerCase())) {
          score += 5;
        }
      });

      // Partial match in summary
      if (query.includes(entry.summary.toLowerCase().substring(0, 20))) score += 2;

      return { ...entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return results.slice(0, 2); // Return top 2 matches
}

/**
 * Generates a text context string for the AI prompt.
 */
export function getKnowledgeContext(message) {
  const matches = searchKnowledge(message);
  if (matches.length === 0) return '';

  let context = '\n\nOFFICIAL KNOWLEDGE CONTEXT:\n';
  matches.forEach((m) => {
    context += `Topic: ${m.title}\n`;
    context += `Summary: ${m.summary}\n`;
    context += `Official Steps: ${m.steps.join('; ')}\n`;
    context += `Source: ${m.sourceName} (${m.sourceUrl})\n\n`;
  });

  return context;
}

/**
 * Returns formatted references for the UI.
 */
export function getSourceBadges(message) {
  const matches = searchKnowledge(message);
  return matches.map((m) => ({
    id: m.id,
    title: m.title,
    sourceName: m.sourceName,
    sourceUrl: m.sourceUrl,
    sourceLanguage: m.sourceLanguage || 'Unknown',
    sourceLanguageCode: m.sourceLanguageCode || 'unknown',
  }));
}
