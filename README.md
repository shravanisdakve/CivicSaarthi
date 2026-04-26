# CivicSaarthi

**A multilingual, privacy-first, official-source-guided election-readiness companion.**

CivicSaarthi helps citizens understand elections through a 9-step guided journey, grounded AI, visual timeline cross-linking, voter readiness checklist, glossary, quiz, downloadable readiness summary, Google Maps election office helper, and strict political neutrality guardrails.

## Judge Demo Flow (2-Minute Walkthrough)

Click **"Try 2-Minute Demo"** on the homepage to experience the full product in 2 minutes:

| Step | Feature | What to see |
|---|---|---|
| 1 | Welcome | Privacy-first, multilingual, official-source-guided overview |
| 2 | Guided Journey | 9-step AI-guided election process walkthrough |
| 3 | CivicSaarthi AI | Live or offline-fallback answer for "What is VVPAT?" |
| 4 | Timeline | Visual 9-phase election stage tracker with stage cross-links |
| 5 | Checklist | 7-step voter readiness checklist with localStorage persistence |
| 6 | Summary Export | One-click downloadable civic readiness summary |
| 7 | Google Maps | Election office/help center discovery (no booth assignment claims) |
| 8 | Neutrality | Partisan refusal: "Which party should I vote for?" → safe refusal |

## Problem Statement
Create an assistant that helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way.

## Chosen Vertical
Election process education for citizens.

## Main USP
CivicSaarthi is not just an election chatbot. It is a complete election-readiness companion that helps users understand, prepare, verify, and participate responsibly. Its **Guided Election Journey Mode** walks users through the 9 core stages of the election process, connecting AI guidance directly to the visual timeline and readiness checklist.

## User Personas
- First-Time Voter
- Student / Researcher
- Candidate
- Observer
- General Citizen

## Features
- **Guided Election Journey Mode**: An interactive, step-by-step walkthrough of the 9 core election stages.
- **Onboarding Intro**: A clear, 4-step interactive welcome experience explaining purpose, neutrality, and privacy.
- **Persona-based personalized guidance**: Tailored content for first-time voters, students, and more.
- **Visual election timeline tracker**: 9-stage phase-by-phase tracker from announcement to results.
- **Interactive voter readiness checklist**: 7-step actionable preparation to-dos.
- **Real downloadable Election Readiness Summary**: Turn civic learning into an actionable PDF artifact.
- **Neutral AI chatbot with Local Fallback**: Safe, non-partisan answers even if the API is offline.
- **Official-source grounding**: Grounded answers with direct links to verified portals.
- **Privacy-conscious architecture**: No collection of PII or political preferences.

## Approach & Logic
CivicSaarthi turns complex election information into an actionable journey. Instead of a simple Q&A bot, it guides users through preparation steps while offering an AI assistant for deep-dives.

## Google Services Used
- **Google Cloud Run**: Hosts the web application and backend.
- **Gemini API**: Powers the intelligent, neutral civic assistant.
- **Google Maps Platform**: Integrated for privacy-safe discovery of Election Offices and Help Centers.
- **Secret Manager**: Secures the Gemini API key.
- **Cloud Build / Artifact Registry**: Deployment pipeline.

## Evaluation Focus Mapping

| Evaluation Area | How CivicSaarthi addresses it |
|---|---|
| Code Quality | Centralized localization via LanguageProvider and useTranslation hook. Reusable React components, clean data files, readable structure. |
| Security & Privacy | Input normalization and privacy warnings reduce accidental sensitive data entry. Server-side Gemini key, no sensitive data collection, neutral AI guardrails. |
| Efficiency | Lightweight React app, no heavy assets, local fallback, small repo (~330KB JS bundle). No heavy PDF library required. |
| Practical Usability | Persona-based tracking, official-source grounding, and personalized readiness summary downloads. |
| Testing | Automated validation of Refusal patterns, knowledge matching, localization fallback, and architecture integrity. |
| Accessibility | Language toggle (EN, HI, MR), skip link, aria-live chat, focus-trapped modals, WCAG-focused contrast pass, and reduced-motion support. |
| Google Services | Cloud Run deployment, Gemini API, Google Maps (Election Office discovery), Secret Manager, Cloud Build, Artifact Registry |

## Quality Improvements (Final Pass)
- **Centralized Localization**: Refactored language management into a React Context Provider and custom hook, ensuring DRY code and consistent persistence.
- **Official-Source Guided AI**: Grounded AI answers now feature polished reference cards with clickable links to verified portals.
- **Privacy-Aware Input Safety**: Added real-time input normalization and sensitive data detection to prevent accidental entry of PII (Aadhaar, IDs).
- **Reduced-Motion Support**: Implemented CSS support for users with motion sensitivity.
- **WCAG Contrast Pass**: Optimized badge and button colors to ensure 100% readable status indicators.
- **Architecture Validation**: Added a secondary quality-check test suite to verify code structure and data integrity.

## Language Accessibility
CivicSaarthi includes a lightweight language toggle for **English, Hindi, and Marathi**. 
- **Curated UI Translations**: Key navigation, safety warnings, and readiness labels are translated through a controlled local dictionary to ensure accuracy.
- **Localized AI Answers**: When Gemini is available, the assistant responds in the user's selected language using simple, clear civic terminology while keeping technical terms (EVM, VVPAT, etc.) readable.
- **Accessibility Fallback**: If a specific detailed guidance is only available in English, the app provides a clear localized disclaimer and encourages verification from official sources.

## Manual QA Checklist
- [x] Home page loads
- [x] Language toggle for English, Hindi, Marathi works
- [x] Choose Path works
- [x] Selected persona persists
- [x] Assistant answers common election questions
- [x] Assistant refuses political persuasion
- [x] Timeline stage selection works
- [x] Checklist progress persists
- [x] Glossary search works
- [x] Ask AI from glossary works
- [x] Quiz scoring works
- [x] Sources page links work
- [x] Polling Station Helper shows privacy disclaimer
- [x] Architecture page shows Google Services
- [x] Mobile layout checked
- [x] Keyboard navigation checked
- [x] Cloud Run deployed URL tested

## Final Submission Checklist
- [x] Public GitHub repo
- [x] One branch only: main
- [x] node_modules not committed
- [x] .env not committed
- [x] .env.yaml not committed
- [x] Repo size checked
- [x] npm test passed
- [x] npm run build passed
- [x] Cloud Run URL working
- [x] Gemini secret configured
- [x] LinkedIn post ready

## Authentication and Profile
CivicSaarthi features a polished, privacy-first authentication system:
- **Google Sign-In (Optional)**: If `VITE_GOOGLE_CLIENT_ID` is configured, users can sync their dashboard across devices.
- **Guest Mode**: Users can choose to stay anonymous. Progress is stored entirely on the local device.
- **My Civic Profile**: A comprehensive dashboard showing readiness scores, civic points, and recommended next steps.
- **Privacy Safeguards**: No sensitive data like Aadhaar, voter ID, phone number, or political preference is collected.

## Why no mandatory login?
Election-related apps must be privacy-conscious to build trust. CivicSaarthi keeps login optional, letting users access critical civic guidance without ever needing to provide personally identifiable information.

## Official-Source Grounding
CivicSaarthi includes a lightweight curated knowledge base for common election topics. User questions are matched against this knowledge base before the Gemini prompt is generated. This helps reduce hallucination risk and makes answers more transparent by providing direct official references.

## Why not full RAG?
For the hackathon prototype, CivicSaarthi uses a lightweight structured knowledge base instead of large PDF ingestion or vector databases. This keeps the repository small, highly reliable, and deployable under the challenge size constraints while still demonstrating the value of grounded AI answers.

## Deployment Guide (Google Cloud Run)

CivicSaarthi is optimized for Google Cloud Run. Follow these steps to deploy:

1. **Build and Push to Artifact Registry**:
   ```bash
   gcloud builds submit --tag gcr.io/[PROJECT_ID]/civic-saarthi
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy civicsaarthi \
     --source . \
     --region asia-south1 \
     --allow-unauthenticated \
     --set-secrets GEMINI_API_KEY=gemini-api-key:latest \
     --set-env-vars GEMINI_MODEL=gemini-2.0-flash
   ```

3. **Verify Deployment**:
   The service will provide a public URL. Ensure `GEMINI_API_KEY` is correctly mapped from Secret Manager.

## Assumptions
- Users primarily access civic information via mobile devices on limited bandwidth networks.
- Voter apathy stems more from procedural confusion than lack of interest.
- Trust is paramount; hence the UI must feel authoritative, secure, and entirely unbiased.

---
*Built for PromptWars Challenge 2. Powered by Google Cloud Run + Gemini.*
