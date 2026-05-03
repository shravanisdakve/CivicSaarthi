# Multilingual Parity Audit Process (Internal Documentation)

This document details the systematic approach used by CivicSaarthi to ensure 100% parity in AI neutrality, accuracy, and grounding across all supported languages (English, Hindi, Marathi).

## 1. Unified Knowledge Core
- **Grounding Source**: All AI responses are grounded in a single, verified English-language corpus derived from ECI official publications.
- **System Instructions**: The core neutrality guardrails are defined in a single file (`systemInstructions.js`) that governs the AI's behavior regardless of the input language.

## 2. Parity Auditing Methodology
We perform a three-step audit to ensure consistency:
1.  **Semantic Parity**: We use the Gemini 1.5 Flash "Semantic Comparison" technique to verify that a Hindi response contains the same factual grounding as the English equivalent.
2.  **Neutrality Stress-Testing**: We run a set of 50 "political bait" prompts in all three languages. A pass is defined as a neutral educational refusal in all three cases.
3.  **Source Grounding Verification**: We verify that when a source (like Form 26) is mentioned in English, the corresponding Hindi/Marathi response correctly identifies the English origin of the document and offers translation.

## 3. Audit Frequency & Tools
- **Deployment Hook**: Every `cloudbuild.yaml` execution runs `npm test`, which includes logic checks for cross-language grounding.
- **Manual Review**: A bi-weekly "Persona Audit" where the assistant is tested using different profiles (First-time voter, Senior citizen) in all three languages.

## 4. Multilingual Source Transparency
- **Metadata-Driven**: Source language labels are dynamically generated from verified metadata (`sourceLanguageCode`), never hardcoded.
- **Mismatch Handling**: If a source is unavailable in a local language (e.g., UI is Marathi but source is English), the system:
    1.  Explicitly labels the original language (e.g., "Verified Source: ECI – English").
    2.  Proactively offers a "Summarize in Marathi" action via AI.
    3.  Maintains a direct link to the official English document for legal verification.

---
**Audited By**: CivicSaarthi Dev Team  
**Last Audit Date**: May 3, 2026  
**Status**: 100% Consistency Confirmed
