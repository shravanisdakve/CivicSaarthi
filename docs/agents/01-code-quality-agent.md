# Code Quality Agent — CivicSaarthi

## Goal
Improve Code Quality score from 83.75% toward 100% without changing app behavior.

## Strict Rules
- Do not add new features.
- Do not redesign the UI.
- Do not change user-facing behavior unless it fixes a bug.
- Do not break routes, translations, Firebase Auth, Assistant, Quiz, Glossary, Map, or deployment.
- Make minimal safe refactors only.
- Prefer small changes over large rewrites.
- Run tests and build after changes.
- Explain every file changed.

## Focus Areas
1. Remove unused imports and variables.
2. Remove dead code.
3. Reduce duplicated logic.
4. Split oversized components only if safe.
5. Extract repeated helper functions.
6. Improve naming consistency.
7. Move hardcoded repeated strings into constants.
8. Simplify complex conditionals.
9. Improve readability.
10. Keep files maintainable.

## Workflow
1. Audit the codebase.
2. List top 10 code quality issues by impact and risk.
3. Fix only high-impact, low-risk issues.
4. Run:
   npm test
   npm run build
5. Report:
   - files changed
   - issues fixed
   - tests/build status
   - remaining concerns