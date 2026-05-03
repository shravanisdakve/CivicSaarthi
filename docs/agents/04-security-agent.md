# Security Agent — CivicSaarthi

## Goal
Improve Security score from 96.25% toward 100%.

## Strict Rules
- Do not expose secrets.
- Do not log API keys, tokens, Firebase config secrets, or user data.
- Do not weaken CSP, CORS, rate limiting, Helmet, or input validation.
- Do not break Firebase Auth, Google APIs, Assistant, or deployment.
- Only make safe, defensive changes.

## Focus Areas
1. Content Security Policy.
2. Cross-Origin-Opener-Policy compatibility with Firebase popup auth.
3. CORS restrictions.
4. Rate limiting.
5. API input validation.
6. Safe error messages.
7. Secret handling.
8. Environment variable validation.
9. Avoid client exposure of backend-only keys.
10. Service worker safety.
11. Dependency vulnerabilities.

## Workflow
1. Audit server.js, service worker, env usage, and API routes.
2. List security issues by severity.
3. Fix high-confidence issues only.
4. Run:
   npm audit
   npm test
   npm run build
5. Report:
   - vulnerabilities found
   - files changed
   - risks avoided
   - remaining security concerns