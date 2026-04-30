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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(process.cwd(), 'dist');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com", "https://apis.google.com", "https://www.gstatic.com", "https://*.firebaseapp.com"],
      imgSrc: ["'self'", "data:", "https://maps.gstatic.com", "https://*.googleapis.com", "https://www.gstatic.com", "https://*.googleusercontent.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://r2cdn.perplexity.ai"],
      connectSrc: ["'self'", "https://*.googleapis.com", "https://*.firebaseapp.com", "https://civicsaarthi-6388d.firebaseapp.com", "https://oauth2.googleapis.com", "https://www.googleapis.com"], // Added OAuth and Calendar domains
      frameSrc: ["'self'", "https://*.firebaseapp.com", "https://accounts.google.com"], // Added Google Accounts for OAuth
    }
  }
}));
app.use(express.json());

// Cloud Logging
let logger;
let isCloudLoggingConfigured = false;
try {
  const logging = new Logging();
  logger = logging.log('civicsaarthi-events');
  isCloudLoggingConfigured = true;
} catch (e) {
  console.warn('Cloud Logging not configured. Ensure GOOGLE_APPLICATION_CREDENTIALS is set for logging, or it is running in a GCP environment.');
}

// Google Cloud Natural Language API client
let languageServiceClient;
let isNaturalLanguageConfigured = false;
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    languageServiceClient = new LanguageServiceClient();
    isNaturalLanguageConfigured = true;
  } else {
    console.warn('GOOGLE_APPLICATION_CREDENTIALS not set. Natural Language API will not be used.');
  }
} catch (e) {
  console.error('Failed to initialize LanguageServiceClient:', e.message);
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

// Google Cloud Text-to-Speech API client
let textToSpeechClient;
let isTextToSpeechConfigured = false;
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    textToSpeechClient = new TextToSpeechClient();
    isTextToSpeechConfigured = true;
  } else {
    console.warn('GOOGLE_APPLICATION_CREDENTIALS not set. Text-to-Speech API will not be used.');
  }
} catch (e) {
  console.error('Failed to initialize TextToSpeechClient:', e.message);
}

// Static files
app.use(express.static(distPath));

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
    // In a real application, you would securely store these tokens associated with the user
    // For this example, we'll store them in a temporary in-memory variable or session
    // req.session.calendarTokens = tokens; // Requires session middleware
    console.log('Calendar API tokens received:', tokens);
    res.send('Authorization successful! You can close this window.');
  } catch (error) {
    console.error('Error retrieving access token:', error);
    res.status(500).send('Error during authorization. Please check server logs.');
  }
});

// Endpoint to create a calendar event
app.post('/api/calendar/createEvent', async (req, res) => {
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
    res.status(500).json({ error: 'Failed to create calendar event.', details: error.message });
  }
});

// Endpoint for frontend logging
app.post('/api/log', async (req, res) => {
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

// Apply rate limiting to all requests
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 requests per windowMs
  message:
    "Too many requests from this IP, please try again after 15 minutes",
});
app.post('/api/chat', apiLimiter, async (req, res) => {
  const { message, persona, history, image } = req.body; // Expect persona, history, and image from frontend
  if (!process.env.GEMINI_API_KEY) {
    return res.json({ response: "AI is in local mode. Please configure GEMINI_API_KEY." });
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
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", tools: tools }); // Initialize model with tools
    const knowledge = getKnowledgeContext(message);
    const systemInstruction = `You are CivicSaarthi AI, a non-partisan guide to the democratic process. Provide clear, concise, and unbiased information. If the user asks for a summary or simplification, provide it. If they ask for detailed steps, list them clearly. Always prioritize official sources. Your goal is to educate and empower citizens. You have access to tools that can provide real-time information. Use the 'getCurrentDateTime' tool when asked about the current date or time. Use the 'searchInternet' tool when asked questions that require up-to-date information not present in your internal knowledge base, or for general queries that would benefit from external web search.`;

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
        const [response] = await textToSpeechClient.synthesizeSpeech({
          input: { text: geminiResponse.response.text() },
          voice: { languageCode: lang, ssmlGender: 'NEUTRAL' }, // Use detected language, default to neutral
          audioConfig: { audioEncoding: 'MP3' },
        });
        ttsAudio = Buffer.from(response.audioContent).toString('base64');
      } catch (ttsError) {
        console.error('Error synthesizing speech with Google Cloud TTS:', ttsError.message);
      }
    }

    res.json({
      response: geminiResponse.response.text(),
      references: getSourceBadges(message),
      sentimentScore,
      ttsAudio, // Include base64 encoded audio
    });
  } catch (e) {
    console.error('Error generating content with Gemini:', e); // Log the full error
    res.status(500).json({ error: e.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CivicSaarthi is live on port ${PORT}`);
});
