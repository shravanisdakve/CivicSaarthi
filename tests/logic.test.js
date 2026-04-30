import { searchKnowledge } from '../src/utils/knowledgeSearch.js';
import { normalizeUserMessage, containsUnsafePersonalDataHint } from '../src/utils/inputSafety.js';
import assert from 'node:assert';

console.log('🧪 Running CivicSaarthi Functional Logic Tests...\n');

// 1. Knowledge Grounding Tests
console.log('--- Testing Knowledge Search Logic ---');
const vvpatResult = searchKnowledge('What is VVPAT?');
assert.ok(vvpatResult.length > 0, 'Should find results for VVPAT');
assert.ok(vvpatResult[0].title.includes('VVPAT'), 'First result should be VVPAT related');
console.log('✅ Grounding: Correctly matched "VVPAT" keywords.');

const irrelevantResult = searchKnowledge('How to bake a cake?');
assert.strictEqual(
  irrelevantResult.length,
  0,
  'Should return no results for irrelevant civic queries'
);
console.log('✅ Grounding: Correctly ignored irrelevant queries.');

// 2. Input Safety Tests
console.log('\n--- Testing Input Safety & Privacy ---');
const piiMessage = 'My Aadhaar number is 1234 5678 9012';
assert.strictEqual(
  containsUnsafePersonalDataHint(piiMessage),
  true,
  'Should detect 12-digit Aadhaar pattern'
);
console.log('✅ Safety: Detected Aadhaar PII pattern.');

const epicMessage = 'My EPIC is ABC1234567';
assert.strictEqual(
  containsUnsafePersonalDataHint(epicMessage),
  true,
  'Should detect EPIC/Voter ID pattern'
);
console.log('✅ Safety: Detected Voter ID PII pattern.');

const safeMessage = 'How do I register to vote?';
assert.strictEqual(
  containsUnsafePersonalDataHint(safeMessage),
  false,
  'Should NOT flag safe queries'
);
console.log('✅ Safety: Permitted safe civic query.');

// 3. Normalization Tests
console.log('\n--- Testing Input Normalization ---');
const messyInput = '  Hello   CivicSaarthi  ';
assert.strictEqual(
  normalizeUserMessage(messyInput),
  'Hello CivicSaarthi',
  'Should trim and collapse whitespace'
);
console.log('✅ Normalization: Cleaned whitespace correctly.');

console.log('\n✨ ALL FUNCTIONAL LOGIC TESTS PASSED! (100% Logic Validation)');
