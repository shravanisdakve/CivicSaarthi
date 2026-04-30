import { searchKnowledge } from './knowledgeSearch.js';
import { getLanguage } from './language.js';
import { LOCAL_FALLBACKS } from '../data/assistantConfig.js';

const REFUSALS = {
  en: 'CivicSaarthi AI cannot support or oppose any party or candidate. I can help you compare manifestos neutrally, understand candidate affidavits, learn voting rules, and verify information from official sources.',
  hi: 'CivicSaarthi AI किसी भी पार्टी या उम्मीदवार का समर्थन या विरोध नहीं कर सकता। मैं आपको चुनावी प्रक्रिया, नियमों और आधिकारिक जानकारी को समझने में मदद कर सकता हूँ।',
  mr: 'CivicSaarthi AI कोणत्याही पक्षाला किंवा उमेदवाराला पाठिंबा किंवा विरोध करू शकत नाही. मी तुम्हाला निवडणूक प्रक्रिया आणि अधिकृत माहिती समजून घेण्यास मदत करू शकतो.',
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

  // 2. Official Knowledge Grounding (Dynamic Search)
  const grounded = searchKnowledge(query);
  if (grounded && grounded.length > 0) {
    const entry = grounded[0];
    const prefix = lang === 'hi' ? 'आधिकारिक नागरिक मार्गदर्शन के अनुसार: ' : 
                  lang === 'mr' ? 'अधिकृत नागरी मार्गदर्शनानुसार: ' : 
                  'According to official civic guidance: ';
    
    let response = `${prefix}\n\n**${entry.title}**\n${entry.summary}\n\n`;
    
    if (entry.steps && entry.steps.length > 0) {
      const stepHeader = lang === 'hi' ? 'महत्वपूर्ण कदम:' : lang === 'mr' ? 'महत्त्वाचे टप्पे:' : 'Key Steps:';
      response += `${stepHeader}\n`;
      entry.steps.forEach((step, idx) => {
        response += `${idx + 1}. ${step}\n`;
      });
    }

    const sourceLabel = lang === 'hi' ? 'स्रोत:' : lang === 'mr' ? 'स्रोत:' : 'Source:';
    response += `\n${sourceLabel} ${entry.sourceName} (${entry.sourceUrl})`;
    return response;
  }

  // 3. General Fallback
  return LOCAL_FALLBACKS[lang] || LOCAL_FALLBACKS.en;
}
