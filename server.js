import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Gemini (if key exists)
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
let model = null;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.0-flash' });
    console.log('✅ Gemini API initialized');
  } catch (err) {
    console.error('❌ Failed to initialize Gemini API:', err.message);
  }
} else {
  console.warn('⚠️ No valid GEMINI_API_KEY found in environment. Using local fallback assistant.');
}

// System prompt enforcing neutrality
const SYSTEM_PROMPT = `You are CivicSaarthi, a non-partisan, factual AI assistant helping Indian citizens understand the electoral process.
Your primary goals:
1. Provide accurate, easy-to-understand information about voter registration, polling booths, election timelines, and terminology (EVM, VVPAT, MCC, NOTA).
2. NEVER endorse any political party, candidate, or specific policy.
3. If asked who to vote for, or asked to convince the user to vote for a specific party, explicitly state that you cannot provide political endorsements or opinions, and remind the user that your purpose is solely to provide factual procedural guidance.
4. Keep responses concise, well-structured, and easy to read on mobile devices.
5. Base your answers on the Election Commission of India's established procedures.`;

// Local Fallback Logic (same as frontend utility but running on backend)
const POLITICAL_PATTERNS = [
  /who should i vote/i, /which party is best/i, /convince me to vote/i, /best candidate/i,
  /vote for (party|candidate|bjp|congress|aap|sp|bsp)/i, /who will win/i, /which party should/i, /endorse/i
];

function getLocalFallbackResponse(message) {
  for (const pattern of POLITICAL_PATTERNS) {
    if (pattern.test(message)) {
      return "I'm designed to provide non-partisan, factual information about the electoral process. I cannot offer opinions on candidates, parties, or voting choices. I can help you understand voting procedures, eligibility, how to find your polling station, or explain terms like VVPAT and MCC. What would you like to know?";
    }
  }
  
  if (/register/i.test(message)) return "To register as a voter in India, visit the National Voters' Service Portal at nvsp.in and fill out Form 6.";
  if (/polling/i.test(message)) return "You can find your polling station by visiting nvsp.in or the Voter Helpline App.";
  if (/vvpat/i.test(message)) return "VVPAT stands for Voter Verifiable Paper Audit Trail. After you press the button on the EVM, a paper slip appears behind a glass window for 7 seconds to verify your vote.";
  
  return "I can help with questions about voter registration, polling booths, EVMs, VVPATs, the Model Code of Conduct, candidate information, and election day procedures. What specific information do you need?";
}

// POST /api/chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message, persona } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message provided.' });
  }

  // If no Gemini, use local fallback
  if (!model) {
    return res.json({ response: getLocalFallbackResponse(message) });
  }

  try {
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I will act as a non-partisan CivicSaarthi assistant.' }] },
      ],
    });

    // Add persona context
    const personaContext = persona ? `\nContext: The user is currently browsing the guide as a '${persona}'. Tailor the tone accordingly if relevant.` : '';
    
    const result = await chat.sendMessage(message + personaContext);
    const responseText = result.response.text();
    
    res.json({ response: responseText });
  } catch (error) {
    console.error('Gemini API Error:', error);
    // Fallback on error
    res.json({ response: getLocalFallbackResponse(message) });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 CivicSaarthi Backend running on http://localhost:${PORT}`);
});
