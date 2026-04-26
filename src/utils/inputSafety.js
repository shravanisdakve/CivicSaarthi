/**
 * Utility for sanitizing and validating user chat messages.
 */

const SENSITIVE_PATTERNS = [
  // Aadhaar (12 digits)
  /\d{4}\s?\d{4}\s?\d{4}/,
  // Phone numbers (approximate)
  /(\+91[\-\s]?)?[0]?[6789]\d{9}/,
  // Voter ID (EPIC) - roughly 3 letters + 7 digits or similar
  /[A-Z]{3}\d{7}/i,
];

/**
 * Normalizes user input by trimming and collapsing whitespace.
 */
export function normalizeUserMessage(message) {
  if (!message) return '';
  return message
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 1000); // Prevent extremely long messages
}

/**
 * Checks if a message is valid for sending.
 */
export function isValidChatMessage(message) {
  const normalized = normalizeUserMessage(message);
  return normalized.length >= 2;
}

/**
 * Returns true if the message likely contains sensitive data hints.
 */
export function containsUnsafePersonalDataHint(message) {
  return SENSITIVE_PATTERNS.some(pattern => pattern.test(message));
}
