import { searchKnowledge } from './knowledgeSearch.js';
import { getLanguage } from './language.js';

const REFUSALS = {
  en: "CivicSaarthi AI cannot support or oppose any party or candidate. I can help you compare manifestos neutrally, understand candidate affidavits, learn voting rules, and verify information from official sources.",
  hi: "CivicSaarthi AI किसी भी पार्टी या उम्मीदवार का समर्थन या विरोध नहीं कर सकता। मैं आपको चुनावी प्रक्रिया, नियमों और आधिकारिक जानकारी को समझने में मदद कर सकता हूँ।",
  mr: "CivicSaarthi AI कोणत्याही पक्षाला किंवा उमेदवाराला पाठिंबा किंवा विरोध करू शकत नाही. मी तुम्हाला निवडणूक प्रक्रिया आणि अधिकृत माहिती समजून घेण्यास मदत करू शकतो."
};

/**
 * Provides a high-quality fallback response when Gemini is unavailable.
 */
export function getLocalResponse(query) {
  const q = query.toLowerCase();
  const lang = getLanguage();
  const refusal = REFUSALS[lang] || REFUSALS.en;

  // 1. Partisan / Political Persuasion Check
  if (
    q.includes('vote for') || 
    q.includes('which party') || 
    q.includes('convince me') || 
    q.includes('better party') ||
    q.includes('who is winning') ||
    q.includes('best candidate')
  ) {
    return refusal;
  }

  const prefix = "According to official civic guidance: ";

  // 2. High-Quality Fallbacks for common topics
  if (q.includes('polling station') || q.includes('find my booth') || q.includes('where to vote')) {
    return prefix + "To find your official polling station safely:\n1. Open the official Voter Services Portal (voters.eci.gov.in).\n2. Use the 'Search in Electoral Roll' feature with your EPIC number or personal details.\n3. Verify the assigned polling station shown there. \n\nImportant: Do not rely on forwarded messages or unverified links. CivicSaarthi does not collect Aadhaar, voter ID, phone number, address, or live location for your safety.";
  }

  if (q.includes('registration') || q.includes('how to register') || q.includes('voter id card')) {
    return prefix + "Voter registration is handled through Form 6. You can apply online via the Voter Helpline App or the official portal (voters.eci.gov.in). \n\nKey steps:\n- Keep a passport-sized photo, age proof, and address proof ready.\n- Your name must be in the electoral roll of your current residence.\n- Once submitted, a Booth Level Officer (BLO) will visit for verification.\n- You can track your application status using the reference ID provided.";
  }

  if (q.includes('vvpat') || q.includes('evm')) {
    return prefix + "VVPAT (Voter Verifiable Paper Audit Trail) is an independent system attached to the EVM. It ensures transparency by allowing you to verify your vote.\n\nHow it works:\n- When you press the button on the EVM, the VVPAT prints a slip.\n- The slip shows the serial number, name, and symbol of your chosen candidate.\n- The slip remains visible behind a glass window for 7 seconds.\n- It then falls into a sealed drop-box. You cannot take the slip home.";
  }

  if (q.includes('mcc') || q.includes('code of conduct')) {
    return prefix + "The Model Code of Conduct (MCC) is a set of guidelines issued by the ECI to regulate political parties and candidates during elections. \n\nIt covers:\n- Prohibiting the use of government resources for campaigning.\n- Guidelines for rallies, speeches, and processions.\n- Ensuring no communal or caste-based appeals are made.\n- Preventing 'freebies' or announcements that could influence voters unfairly.";
  }

  if (q.includes('polling day') || q.includes('what to carry')) {
    return prefix + "On polling day, remember these rules:\n- Carry your EPIC (Voter ID card).\n- If EPIC is unavailable, use one of the 12 approved alternatives (Aadhaar, PAN, MNREGA card, etc.).\n- Mobile phones, cameras, and laptops are strictly prohibited inside the booth.\n- Follow the queue and wait for the First Polling Officer to verify your name.";
  }

  if (q.includes('nota')) {
    return prefix + "NOTA (None of the Above) is an option on the EVM for voters who do not support any candidate in their constituency.\n\nKey Facts:\n- It protects your right to secrecy if you choose to reject all candidates.\n- Even if NOTA gets the highest votes, the candidate with the next highest votes is declared the winner.\n- It is a powerful tool for expressing collective dissatisfaction peacefully.";
  }

  // 3. Official Knowledge Grounding (Search the structured data)
  const grounded = searchKnowledge(query);
  if (grounded && grounded.length > 0) {
    const entry = grounded[0];
    return `According to official civic guidance: ${entry.summary}\n\nStep-by-step guidance:\n1. Understand the term: ${entry.title}.\n2. Check your status regarding this process.\n3. For official action, visit the provided source link.\n\nSource: ${entry.sourceName} (${entry.sourceUrl})`;
  }

  return "I'm CivicSaarthi AI. I can help you understand the election process, timelines, voter registration, and key terms like VVPAT or MCC. How can I assist you today?";
}
