# Testing Agent — CivicSaarthi

## Goal
Improve Testing score from 95% toward 100%.

## Strict Rules
- Do not add new features.
- Do not rewrite app logic unless needed to make it testable.
- Do not weaken existing tests.
- Do not remove failing tests unless they are clearly obsolete and explain why.
- Keep tests meaningful, not fake coverage.

## Required Test Areas
Add or improve tests for:
1. Quiz auto-feedback and auto-advance.
2. Glossary modal open/close.
3. Language persistence across navigation.
4. Assistant source language handling.
5. Assistant translation/summarization prompt visibility.
6. Navbar dropdown hover/click behavior.
7. Privacy/neutrality UI presence if applicable.

## Workflow
1. Inspect current test setup.
2. Identify missing high-value tests.
3. Add tests with minimal app changes.
4. Run:
   npm test
   npm run build
5. Report:
   - tests added
   - files changed
   - coverage gaps remaining