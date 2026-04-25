# CivicSaarthi

**Understand Elections Step by Step**

CivicSaarthi is an AI-powered, non-partisan web platform built to help Indian citizens navigate the electoral process. Designed with institutional reliability and accessibility at its core, it translates complex bureaucratic jargon into clear, actionable guidance.

## Problem Statement
Electoral processes can often feel opaque or overly bureaucratic, leading to voter apathy and confusion. Information is scattered across multiple portals, and finding simple answers to procedural questions is difficult.

## Chosen Vertical
**Civic Tech & Democratic Accessibility.** Focused specifically on voter education, transparent timeline tracking, and AI-driven clarification of complex legislative or procedural jargon.

## Approach and Logic
We employed a "Soft Minimalist" design philosophy, stripping away visual friction to keep the gravity of the civic duty central. The application uses **Progressive Disclosure**:
1. **Assess Eligibility**: Persona-based paths tailor the experience.
2. **Build Your Checklist**: Actionable, trackable steps ensuring readiness.
3. **Understand the Ballot**: AI translation layer explaining terms like VVPAT, MCC, and NOTA.

## Features
- **Persona-based Routing**: Tailored content for First-time Voters, Students, Observers, etc.
- **Interactive Election Timeline**: Tracks the 9 stages from announcement to result declaration.
- **Voter Readiness Checklist**: Saveable progress tracking with a final "Voter Ready" badge.
- **Election Glossary**: Searchable, categorised terminology database.
- **Civic Assistant (AI)**: Context-aware, strictly neutral chatbot for electoral queries.
- **Knowledge Quiz**: Gamified learning with immediate feedback.

## Google Cloud Services Used
- **Google Cloud Run**: Serverless compute scaling instantly from zero to handle election-day traffic spikes.
- **Gemini Pro API**: Powers the Civic Assistant, handling natural language queries with a strict system prompt enforcing non-partisanship.
- **Secret Manager**: Securely stores Gemini API keys away from application code.
- **Cloud Build & Artifact Registry**: Handles CI/CD pipelines and secure container storage.

## Security & Neutrality
- **Server-side API calls**: The Gemini API key is never exposed to the frontend; all requests proxy through the Express backend.
- **Strict Refusal Logic**: Both the AI system prompt and the local fallback mechanism are explicitly programmed to refuse political persuasion, candidate endorsements, or bias queries (e.g., "Who should I vote for?").
- **Local Fallback**: If the Gemini API is unreachable or keys are missing, the app gracefully falls back to a local, regex-based factual assistant.

## Accessibility
- WCAG 2.1 AA compliant color contrast (using Material Design 3 tokens).
- Semantic HTML and ARIA labels for chat live regions.
- Mobile-first responsive design for low-bandwidth networks.

## Testing
Run the automated test suite to verify module integrity:
\`\`\`bash
npm test
\`\`\`
*(Tests validate file structure, timeline stages, data integrity, AI refusal logic, and frontend key security).*

## Local Run Steps
1. Clone the repository and install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Configure environment variables:
   Copy \`.env.example\` to \`.env\` and add your Gemini API Key:
   \`\`\`env
   GEMINI_API_KEY=your_actual_key_here
   PORT=3001
   \`\`\`
3. Start the application (runs both backend and Vite frontend concurrently):
   \`\`\`bash
   npm run dev
   \`\`\`
4. Visit \`http://localhost:5173\` in your browser.

## Cloud Run Deployment Steps
1. Build the frontend for production:
   \`\`\`bash
   npm run build
   \`\`\`
   *(This outputs the static files to the \`/dist\` directory).*
2. Ensure your \`server.js\` is configured to serve static files from \`/dist\` in production mode.
3. Push code to Google Cloud Source Repositories or GitHub.
4. Set up **Cloud Build** to build the Docker image and push to **Artifact Registry**.
5. Deploy to **Cloud Run**, ensuring you pass the \`GEMINI_API_KEY\` via **Secret Manager**.

## Assumptions
- Users primarily access civic information via mobile devices on limited bandwidth networks.
- Voter apathy stems more from procedural confusion than lack of interest.
- Trust is paramount; hence the UI must feel authoritative, secure, and entirely unbiased.

---
*© 2024 CivicSaarthi. Built with institutional reliability. Powered by Google Cloud Run and Gemini.*
