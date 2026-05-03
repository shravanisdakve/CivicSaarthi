import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import helmet from 'helmet';
import { Logging } from '@google-cloud/logging';
import { LanguageServiceClient } from '@google-cloud/language'; // Import LanguageServiceClient
import { TextToSpeechClient } from '@google-cloud/text-to-speech'; // Import TextToSpeechClient
import { OAuth2Client } from 'google-auth-library'; // Import OAuth2Client for Calendar API
import { google } from 'googleapis'; // Import google from googleapis
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { getKnowledgeContext, getSourceBadges } from './src/utils/knowledgeSearch.js';
import { getSystemInstruction } from './src/data/systemInstructions.js';
import { normalizeUserMessage, isValidChatMessage } from './src/utils/inputSafety.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(process.cwd(), 'dist');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 8080;

app.use(helmet({
  // Allow Firebase popup auth: default 'same-origin' blocks window.closed polling
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com", "https://apis.google.com", "https://www.gstatic.com", "https://*.firebaseapp.com", "https://*.firebase.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://maps.gstatic.com", "https://*.googleapis.com", "https://www.gstatic.com", "https://*.googleusercontent.com", "https://lh3.googleusercontent.com", "https://*.firebaseapp.com", "https://*.gstatic.com"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com", "https://r2cdn.perplexity.ai", "https://frontend-cdn.perplexity.ai"],
      connectSrc: ["'self'", "https://*.googleapis.com", "https://*.firebaseapp.com", "https://*.firebase.com", "https://civicsaarthi-6388d.firebaseapp.com", "https://oauth2.googleapis.com", "https://www.googleapis.com", "https://*.perplexity.ai", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "wss://*.firebaseio.com", "https://lh3.googleusercontent.com"],
      frameSrc: ["'self'", "https://*.firebaseapp.com", "https://*.google.com", "https://apis.google.com", "https://accounts.google.com"],
    }
  }
}));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  'https://civicsaarthi-civicsaarthi.asia-south1.run.app',
  'https://civicsaarthi-622394341721.asia-south1.run.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow if no origin (local/curl), if in allowed list, or if it's a civicsaarthi cloud run URL
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || (origin.includes('civicsaarthi') && origin.includes('.run.app'))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Static files - served after security middleware
app.use(express.static(distPath));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});
app.use(express.json());

// Cloud Logging — uses ADC automatically (gcloud auth application-default login)
let logger;
let isCloudLoggingConfigured = false;
try {
  const logging = new Logging();
  logger = logging.log('civicsaarthi-events');
  isCloudLoggingConfigured = true;
} catch (e) {
  console.warn('Cloud Logging not configured. Run `gcloud auth application-default login` or deploy to a GCP environment.');
}

// Google Cloud Natural Language API client — uses ADC automatically
let languageServiceClient;
let isNaturalLanguageConfigured = false;
try {
  // ADC is picked up automatically via gcloud auth application-default login
  // No need to check GOOGLE_APPLICATION_CREDENTIALS explicitly
  languageServiceClient = new LanguageServiceClient();
  isNaturalLanguageConfigured = true;
  console.log('Natural Language API client initialized (ADC).');
} catch (e) {
  console.error('Failed to initialize LanguageServiceClient (is ADC configured?):', e.message);
}

// Google Calendar API OAuth2Client
let googleAuthClient;
let isCalendarConfigured = false;
try {
  const CLIENT_ID = process.env.CALENDAR_CLIENT_ID;
  const CLIENT_SECRET = process.env.CALENDAR_CLIENT_SECRET;
  const REDIRECT_URI = process.env.CALENDAR_REDIRECT_URI || `http://localhost:${PORT}/api/calendar/oauth2callback`;

  if (CLIENT_ID && CLIENT_SECRET) {
    googleAuthClient = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    isCalendarConfigured = true;
  } else {
    console.warn('CALENDAR_CLIENT_ID or CALENDAR_CLIENT_SECRET not set. Google Calendar API will not be used.');
  }
} catch (e) {
  console.error('Failed to initialize Google Calendar OAuth2Client:', e.message);
}

// Google Custom Search API client
let customSearchClient;
let isCustomSearchConfigured = false;
try {
  if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_CSE_ID) {
    customSearchClient = google.customsearch('v1');
    isCustomSearchConfigured = true;
  } else {
    console.warn('GOOGLE_SEARCH_API_KEY or GOOGLE_CSE_ID not set. Google Custom Search API will not be used.');
  }
} catch (e) {
  console.error('Failed to initialize Google Custom Search API:', e.message);
}

// Google Cloud Text-to-Speech API client — uses ADC automatically
let textToSpeechClient;
let isTextToSpeechConfigured = false;
try {
  // ADC is picked up automatically via gcloud auth application-default login
  // No need to check GOOGLE_APPLICATION_CREDENTIALS explicitly
  textToSpeechClient = new TextToSpeechClient();
  isTextToSpeechConfigured = true;
  console.log('Text-to-Speech API client initialized (ADC).');
} catch (e) {
  console.error('Failed to initialize TextToSpeechClient (is ADC configured?):', e.message);
}

// Static files (already handled above, but kept here for logical grouping)
// app.use(express.static(distPath));

// API
app.get('/api/status', (req, res) => {
  res.json({
    ok: true,
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    firebaseConfigured: !!process.env.VITE_FIREBASE_API_KEY,
    mapsConfigured: !!process.env.VITE_GOOGLE_MAPS_API_KEY,
    naturalLanguageConfigured: isNaturalLanguageConfigured,
    calendarConfigured: isCalendarConfigured, // Add Calendar status
    cloudLoggingConfigured: isCloudLoggingConfigured, // Add Cloud Logging status
    textToSpeechConfigured: isTextToSpeechConfigured, // Add Text-to-Speech status
    customSearchConfigured: isCustomSearchConfigured // Add Custom Search status
  });
});

// OAuth URL creation endpoint
app.get('/api/calendar/createAuthUrl', (req, res) => {
  if (!isCalendarConfigured) {
    return res.status(400).json({ error: 'Google Calendar API is not configured.' });
  }

  const scopes = ['https://www.googleapis.com/auth/calendar.events'];
  const authUrl = googleAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
  res.json({ authUrl });
});

// OAuth2 Callback endpoint
app.get('/api/calendar/oauth2callback', async (req, res) => {
  if (!isCalendarConfigured) {
    return res.status(400).send('Google Calendar API is not configured.');
  }
  const { code } = req.query;
  try {
    const { tokens } = await googleAuthClient.getToken(code);
    googleAuthClient.setCredentials(tokens);
    // Securely handled: No logging of raw tokens in production
    res.send('Authorization successful! You can close this window.');
  } catch (error) {
    console.error('Error retrieving access token:', error.message);
    res.status(500).send('Error during authorization.');
  }
});

// Apply rate limiting to all requests
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 requests per windowMs
  message:
    "Too many requests from this IP, please try again after 15 minutes",
  validate: { xForwardedForHeader: false }, // Avoid validation errors behind Cloud Run proxy
});

// Endpoint to create a calendar event
app.post('/api/calendar/createEvent', apiLimiter, async (req, res) => {
  if (!isCalendarConfigured || !googleAuthClient.credentials) {
    // In a real app, retrieve tokens for the user making the request
    return res.status(400).json({ error: 'Calendar API not configured or user not authorized.' });
  }

  const { summary, description, start, end, timezone } = req.body;

  const event = {
    summary: summary || 'CivicSaarthi Event',
    description: description || 'Event from CivicSaarthi.',
    start: {
      dateTime: start,
      timeZone: timezone || 'America/Los_Angeles', // Default to a common timezone
    },
    end: {
      dateTime: end,
      timeZone: timezone || 'America/Los_Angeles',
    },
  };

  try {
    const calendar = google.calendar({ version: 'v3', auth: googleAuthClient });
    const response = await calendar.events.insert({
      calendarId: 'primary', // Users primary calendar
      resource: event,
    });
    res.json({ eventLink: response.data.htmlLink, eventId: response.data.id });
  } catch (error) {
    console.error('Error creating calendar event:', error.message);
    res.status(500).json({ error: 'Failed to create calendar event.' });
  }
});

// Endpoint for frontend logging
// Apply rate limiting to writable endpoints
app.post('/api/log', apiLimiter, async (req, res) => {
  const { message, level = 'info', metadata = {} } = req.body;
  if (isCloudLoggingConfigured && logger) {
    const entry = logger.entry({ severity: level.toUpperCase(), ...metadata }, message);
    try {
      await logger.write(entry);
      res.status(200).json({ status: 'Log received' });
    } catch (e) {
      console.error('Error writing log to Cloud Logging:', e);
      res.status(500).json({ error: 'Failed to write log to Cloud Logging' });
    }
  } else {
    // Fallback: log to console if Cloud Logging is not configured
    const logFunc = console[level] || console.log;
    logFunc(`[FRONTEND LOG - ${level.toUpperCase()}]`, message, metadata);
    res.status(200).json({ status: 'Log received (console fallback)' });
  }
});

// --- Gemini Function Calling Setup ---

// Define the tool for getting the current date and time
const tools = [
  {
    function_declarations: [
      {
        name: 'getCurrentDateTime',
        description: 'Returns the current date and time.',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
      {
        name: 'searchInternet',
        description: 'Searches the internet for information on a given query. Use this for general knowledge questions, current events, or information not available in the internal knowledge base. Prioritize official and reputable sources.',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: {
              type: 'STRING',
              description: 'The search query to use for the internet search.',
            },
          },
          required: ['query'],
        },
      },
    ],
  },
];

// Map function names to their implementations
const tool_function_map = {
  getCurrentDateTime: () => {
    const now = new Date();
    return {
      datetime: now.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  },
  searchInternet: async ({ query }) => {
    if (!isCustomSearchConfigured || !customSearchClient) {
      return { error: 'Google Custom Search API is not configured.' };
    }
    try {
      const res = await customSearchClient.cse.list({
        cx: process.env.GOOGLE_CSE_ID,
        q: query,
        auth: process.env.GOOGLE_SEARCH_API_KEY,
        num: 3, // Limit to 3 results
      });

      const items = res.data.items || [];
      return items.map(item => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      }));
    } catch (error) {
      console.error('Error performing internet search:', error);
      return { error: `Failed to perform internet search: ${error.message}` };
    }
  },
};

app.post('/api/chat', apiLimiter, async (req, res) => {
  const { message, persona, history, image, language: lang = 'en-IN' } = req.body;
  
  // Backend Input Validation
  const sanitizedMessage = normalizeUserMessage(message);
  if (message && !isValidChatMessage(sanitizedMessage)) {
    return res.status(400).json({ error: "Invalid message format or too short." });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('CRITICAL: GEMINI_API_KEY is not defined.');
    return res.status(503).json({ error: "Service temporarily unavailable." });
  }

  let sentimentScore = null;
  if (isNaturalLanguageConfigured) {
    try {
      const document = {
        content: message,
        type: 'PLAIN_TEXT',
      };
      const [result] = await languageServiceClient.analyzeSentiment({ document });
      sentimentScore = result.documentSentiment.score;
      console.log(`Sentiment Score for "${message}": ${sentimentScore}`);
    } catch (e) {
      console.error('Error analyzing sentiment with Natural Language API:', e.message);
    }
  }

  try {
    const selectedPersona = persona || 'general'; // Use persona from request body
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    const modelName = (process.env.GEMINI_MODEL || 'gemini-flash-latest').trim();
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName, tools: tools });
    const knowledge = getKnowledgeContext(message);
    const systemInstruction = getSystemInstruction(selectedPersona, lang) + knowledge;

    let chat;
    let geminiResponse;
    const historyWithSystemInstruction = [
      {
        role: 'user',
        parts: [{ text: systemInstruction }],
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I will provide accurate, unbiased civic information and utilize tools when necessary.' }],
      },
      ...(history || []), // Append existing history after initial system instruction
    ];

    const currentPromptParts = [];
    if (message) currentPromptParts.push({ text: message });
    if (image) currentPromptParts.push({ inlineData: { mimeType: 'image/jpeg', data: image } });
    currentPromptParts.push({ text: knowledge });


    if (historyWithSystemInstruction.length > 0) {
      chat = model.startChat({ history: historyWithSystemInstruction });
      // The current user message text is now within currentPromptParts
      geminiResponse = await chat.sendMessage(currentPromptParts);
    } else {
      // Fallback for first message or no history (should not happen with system instruction)
      geminiResponse = await model.generateContent(currentPromptParts);
    }

    const functionCalls = geminiResponse.response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      const toolResults = await Promise.all(
        functionCalls.map(async (fnCall) => {
          const { name, args } = fnCall;
          if (tool_function_map[name]) {
            const result = await tool_function_map[name](args);
            return {
              toolResponse: {
                name: name,
                content: JSON.stringify(result), // Stringify the object for the model
              },
            };
          } else {
            console.warn(`Function ${name} not found in tool_function_map.`);
            return {
              toolResponse: {
                name: name,
                content: JSON.stringify({ error: `Function ${name} not found.` }),
              },
            };
          }
        })
      );
      // Send tool results back to Gemini and get final response
      geminiResponse = await chat.sendMessage(toolResults);
    }
    
    // --- Google Cloud Text-to-Speech Integration ---
    let ttsAudio = null;
    if (isTextToSpeechConfigured && geminiResponse.response.text()) {
      try {
        const langMap = {
          'en': 'en-IN',
          'hi': 'hi-IN',
          'mr': 'mr-IN'
        };
        const voiceLang = langMap[lang] || 'en-IN';
        const [response] = await textToSpeechClient.synthesizeSpeech({
          input: { text: geminiResponse.response.text() },
          voice: { languageCode: voiceLang, ssmlGender: 'NEUTRAL' },
          audioConfig: { audioEncoding: 'MP3' },
        });
        ttsAudio = Buffer.from(response.audioContent).toString('base64');
      } catch (ttsError) {
        console.error('Error synthesizing speech with Google Cloud TTS:', ttsError.message);
      }
    }

    let geminiText = '';
    try {
      geminiText = geminiResponse.response.text();
    } catch (textErr) {
      console.warn('Could not extract text from Gemini response (possibly blocked or empty):', textErr.message);
      geminiText = "I'm sorry, I couldn't generate a response for that query. It might be due to safety filters or an internal issue.";
    }

    res.json({
      response: geminiText,
      references: getSourceBadges(message),
      sentimentScore,
      ttsAudio, // Include base64 encoded audio
    });
  } catch (e) {
    console.error('Error generating content with Gemini:', e.message); 
    res.status(500).json({ error: "Internal server error while generating response." });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Generic Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).send('Something broke on the server!');
});

// Critical Environment Variable Validation
const REQUIRED_ENV_VARS = [
  'GEMINI_API_KEY',
  'VITE_FIREBASE_API_KEY',
  'VITE_GOOGLE_MAPS_API_KEY'
];

REQUIRED_ENV_VARS.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`CRITICAL SECURITY ALERT: Missing required environment variable ${varName}`);
    // In production, we might want to process.exit(1), but for this audit we'll just log loudly
  } else if (process.env[varName].length < 10) {
     console.error(`CRITICAL SECURITY ALERT: Environment variable ${varName} looks suspiciously short or invalid.`);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CivicSaarthi is live on port ${PORT}`);
});
