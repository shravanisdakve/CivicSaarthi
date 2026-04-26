import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { getKnowledgeContext, getSourceBadges } from './src/utils/knowledgeSearch.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// API Rate Limiting (Prevent Quota Exhaustion)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window
  message: { error: 'Too many requests from this IP, please try again after 15 minutes. This helps us ensure fair access for all voters.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

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

// System prompt enforcing neutrality and grounding
const SYSTEM_PROMPT = `You are CivicSaarthi AI, a neutral civic education assistant for Indian citizens.
When official knowledge context is provided, use it as the primary basis for your answer.
Do not invent live election dates, polling booth assignments, candidate claims, or constituency-specific facts.
Encourage users to verify critical details through official election sources.
Do not support or oppose any party or candidate. If asked for a recommendation, explain that you are non-partisan.
Keep responses concise, well-structured, and easy to read on mobile devices.
Base your answers strictly on the Election Commission of India's established procedures.`;

// Local Fallback Logic (updated to use official knowledge)
const POLITICAL_PATTERNS = [
  /who should i vote/i, /which party is best/i, /convince me to vote/i, /best candidate/i,
  /vote for (party|candidate|bjp|congress|aap|sp|bsp)/i, /who will win/i, /which party should/i, /endorse/i
];

function getLocalFallbackResponse(message) {
  for (const pattern of POLITICAL_PATTERNS) {
    if (pattern.test(message)) {
      return "I cannot support or oppose any party or candidate. I am designed to provide non-partisan information and cannot offer political persuasion. I can help you compare manifestos neutrally, explain voting rules, clarify the process, and point you to official sources for verification.";
    }
  }
  
  const knowledge = getKnowledgeContext(message);
  if (knowledge) {
    return `Based on official civic guidance: ${knowledge.substring(0, 500)}... For more details, please visit official election portals.`;
  }
  
  return "I can help explain rules, the voting process, verification, and point you to official sources. What specific information do you need?";
}

// Status and Health check endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    ok: true, 
    geminiConfigured: !!model && apiKey !== 'your_gemini_api_key_here',
    mode: (!!model && apiKey !== 'your_gemini_api_key_here') ? 'gemini' : 'local-fallback',
    env: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// POST /api/chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message, persona, language } = req.body;
  console.log('📩 Received chat request:', message?.substring(0, 50) + '...', `[Lang: ${language || 'en'}]`);

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message provided.' });
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message is too long. Please limit your query to 2000 characters for security and clarity.' });
  }

  // Search official knowledge base
  const knowledgeContext = getKnowledgeContext(message);
  const references = getSourceBadges(message);
  const grounded = references.length > 0;

  // If no Gemini, use local fallback
  if (!model) {
    console.log('ℹ️ Using local fallback (Gemini not initialized)');
    return res.json({ 
      response: getLocalFallbackResponse(message),
      source: 'local',
      grounded,
      references
    });
  }

  try {
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I will act as a non-partisan CivicSaarthi assistant and prioritize provided official knowledge.' }] },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // Add persona and knowledge context
    const personaContext = persona ? `\n[User Persona: ${persona}]` : '';
    const languageInstruction = (language === 'hi' || language === 'mr') 
      ? `\n[IMPORTANT: Answer strictly in ${language === 'hi' ? 'Hindi' : 'Marathi'} using simple, clear civic education language. Keep official terms such as EVM, VVPAT, EPIC, MCC readable and explain them simply.]`
      : '';
    
    const fullInput = `${message}${personaContext}${languageInstruction}${knowledgeContext}`;
    
    console.log('🤖 Sending to Gemini (Grounded:', grounded, ')...');
    const result = await chat.sendMessage(fullInput);
    const response = await result.response;
    const responseText = response.text();
    
    console.log('✅ Received response from Gemini');
    res.json({ 
      response: responseText,
      source: 'gemini',
      grounded,
      references
    });
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    
    // Fallback on error (Never expose Gemini stack trace to user)
    try {
      const fallback = getLocalFallbackResponse(message);
      res.json({ 
        response: fallback, 
        source: 'local-fallback-safe',
        grounded,
        references,
        error: 'Service temporarily unavailable. Using secure local fallback.' 
      });
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError.message);
      res.status(500).json({ error: 'Deep system error. Please try again later.' });
    }
  }
});

// Serve frontend build
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 CivicSaarthi Backend running on http://localhost:${PORT}`);
});
