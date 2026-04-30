/**
 * Assistant Configuration and Localized Content
 */

export const ASSISTANT_CONFIG = {
  name: 'CivicSaarthi AI',
  avatar: 'smart_toy',
  primaryColor: '#1A237E',
};

export const WELCOME_MESSAGES = {
  en: (name) => name 
    ? `Hi ${name.split(' ')[0]}, I'm CivicSaarthi AI. I can help you understand the election process step by step.` 
    : "Hi, I'm CivicSaarthi AI. I can help you understand the election process step by step.",
  hi: (name) => name 
    ? `नमस्ते ${name.split(' ')[0]}! मैं CivicSaarthi हूँ। मैं चुनावी प्रक्रिया को समझने में आपकी सहायता कर सकता हूँ।` 
    : "नमस्ते! मैं CivicSaarthi हूँ। मैं चुनावी प्रक्रिया को समझने में आपकी सहायता कर सकता हूँ।",
  mr: (name) => name 
    ? `नमस्कार ${name.split(' ')[0]}! मी CivicSaarthi आहे. मी तुम्हाला निवडणुका समजून घेण्यास मदत करू शकतो.` 
    : "नमस्कार! मी CivicSaarthi आहे. मी तुम्हाला निवडणुका समजून घेण्यास मदत करू शकतो.",
};

export const SUGGESTED_QUESTIONS = {
  en: [
    { text: 'How do I register to vote?', icon: 'how_to_reg' },
    { text: 'What is VVPAT?', icon: 'fact_check' },
    { text: 'Check election dates', icon: 'event' },
    { text: 'Compare candidate affidavits', icon: 'account_circle' },
  ],
  hi: [
    { text: 'वोट देने के लिए पंजीकरण कैसे करें?', icon: 'how_to_reg' },
    { text: 'VVPAT क्या है?', icon: 'fact_check' },
    { text: 'चुनाव की तारीखें जांचें', icon: 'event' },
    { text: 'उम्मीदवारों के हलफनामों की तुलना करें', icon: 'account_circle' },
  ],
  mr: [
    { text: 'मतदान नोंदणी कशी करावी?', icon: 'how_to_reg' },
    { text: 'VVPAT म्हणजे काय?', icon: 'fact_check' },
    { text: 'निवडणुकीच्या तारखा तपासा', icon: 'event' },
    { text: 'उमेदवारांच्या प्रतिज्ञापत्रांची तुलना करा', icon: 'account_circle' },
  ],
};

export const LOCAL_FALLBACKS = {
  en: "I'm CivicSaarthi AI. I can help you understand the election process, timelines, voter registration, and key terms like VVPAT or MCC. How can I assist you today?",
  hi: "मैं CivicSaarthi AI हूँ। मैं आपको चुनावी प्रक्रिया, समयसीमा, मतदाता पंजीकरण और VVPAT या MCC जैसे प्रमुख शब्दों को समझने में मदद कर सकता हूँ। मैं आज आपकी क्या सहायता कर सकता हूँ?",
  mr: "मी CivicSaarthi AI आहे. मी तुम्हाला निवडणूक प्रक्रिया, वेळापत्रक, मतदार नोंदणी आणि VVPAT किंवा MCC यांसारख्या महत्त्वाच्या संज्ञा समजून घेण्यास मदत करू शकतो. मी तुम्हाला कशी मदत करू शकतो?"
};
