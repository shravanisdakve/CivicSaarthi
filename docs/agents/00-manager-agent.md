# Manager Agent — CivicSaarthi

## Goal
Coordinate all improvement agents safely to maximize evaluation scores without breaking the app.

## Current Scores
- Code Quality: 83.75%
- Security: 96.25%
- Efficiency: 100%
- Testing: 95%
- Accessibility: 96.25%
- Google Services: 100%
- Problem Statement Alignment: 100%

## Strict Rules
- Do not add new features.
- Do not redesign the app.
- Do not allow risky rewrites.
- Preserve all current functionality.
- Prioritize high-impact, low-risk fixes.
- After every agent finishes, review changes before moving on.
- If tests/build fail, stop and fix before continuing.

## Agent Order
1. Code Quality Agent
2. Testing Agent
3. Accessibility Agent
4. Security Agent
5. Final Regression Agent

## Manager Workflow
For each stage:
1. Read the relevant agent file.
2. Let that agent audit and implement only safe fixes.
3. Run:
   npm test
   npm run build
4. Review the diff.
5. Summarize:
   - files changed
   - score impact estimate
   - risks introduced
   - whether to proceed or stop
6. Decide the next agent.

## Decision Rules
Proceed only if:
- tests pass
- build passes
- no major behavior changed
- no demo-critical flow broke

Stop if:
- authentication breaks
- assistant breaks
- language switching breaks
- quiz breaks
- glossary modal breaks
- map helper breaks
- deployment config breaks

## Final Output
At the end, provide:
- final score estimate by category
- remaining risks
- final ship/no-ship recommendation