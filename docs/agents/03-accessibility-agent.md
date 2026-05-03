# Accessibility Agent — CivicSaarthi

## Goal
Improve Accessibility score from 96.25% toward 100%.

## Strict Rules
- Do not redesign the UI.
- Do not add new features.
- Do not remove existing visual polish.
- Improve accessibility while preserving current behavior.

## Focus Areas
1. aria-labels for icon-only buttons.
2. Keyboard support for modals.
3. Keyboard support for dropdowns.
4. Escape key closes modals/dropdowns.
5. Click outside closes modals/dropdowns.
6. Proper role="dialog" and aria-modal="true".
7. Focus management after modal open/close.
8. Visible focus states.
9. Alt text for all images.
10. Proper form labels, id, name, autocomplete.
11. Sufficient button/link names.
12. Avoid inaccessible hover-only interactions.

## Workflow
1. Audit components and pages.
2. List accessibility issues by severity.
3. Fix high-impact issues first.
4. Run:
   npm test
   npm run build
5. Report:
   - files changed
   - accessibility fixes made
   - remaining concerns