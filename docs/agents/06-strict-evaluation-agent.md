# Strict Evaluation Agent — CivicSaarthi

## Goal
Evaluate CivicSaarthi across all official scoring criteria without editing anything.

Give two scores for every category:
1. Strict Technical Score — based on actual implementation quality.
2. PromptWar-Likely Score — based on what the official AI evaluator will probably reward.

## Previous Scores
- Code Quality: 83.75%
- Security: 96.25%
- Efficiency: 100%
- Testing: 95%
- Accessibility: 96.25%
- Google Services: 100%
- Problem Statement Alignment: 98%

## Hard Rules
- READ ONLY.
- Do not edit files.
- Do not create files.
- Do not refactor.
- Do not deploy.
- Be strict and critical.
- Do not give 100 unless it is truly deserved.
- Identify real deductions with exact files.

## Allowed Commands
Run only safe checks:

```bash
npm test
npm run build
npm run lint
npm audit