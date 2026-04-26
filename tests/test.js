import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { timelineStages } from '../src/data/timeline.js';
import { glossaryTerms } from '../src/data/glossary.js';
import { quizQuestions } from '../src/data/quiz.js';
import { getLocalResponse } from '../src/utils/localAssistant.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('Running CivicSaarthi Emergency Bug-Fix Test Suite...\n');

// 1. File existence checks
const requiredFiles = [
  'server.js',
  'src/App.jsx',
  'src/pages/Home.jsx',
  'src/pages/Assistant.jsx',
  'src/pages/MapHelper.jsx',
  'src/components/ElectionOfficeMap.jsx',
  'src/components/MapDisclaimer.jsx',
  'src/components/FloatingAssistant.jsx'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(ROOT_DIR, file));
  assert(exists, `Required file exists: ${file}`);
});

// 2. Routing checks
const appContent = fs.readFileSync(path.join(ROOT_DIR, 'src/App.jsx'), 'utf8');
assert(appContent.includes('path="/assistant"'), 'Assistant route registered in App.jsx');
assert(appContent.includes('path="/map"'), 'Map Helper route registered in App.jsx');

// 3. Quiz Persistence Logic checks
// ... (existing quiz tests)

// 4. Map Feature checks
const mapHelperContent = fs.readFileSync(path.join(ROOT_DIR, 'src/pages/MapHelper.jsx'), 'utf8');
assert(mapHelperContent.includes('Election Office & Help Center Map'), 'Map Helper page has correct title');

const mapDisclaimerContent = fs.readFileSync(path.join(ROOT_DIR, 'src/components/MapDisclaimer.jsx'), 'utf8');
assert(mapDisclaimerContent.includes('does **not** show your officially assigned polling booth'), 'Map disclaimer includes booth warning');
assert(mapDisclaimerContent.includes('does **not** collect Aadhaar'), 'Map privacy note includes data collection warning');

const mapsComponentContent = fs.readFileSync(path.join(ROOT_DIR, 'src/components/ElectionOfficeMap.jsx'), 'utf8');
assert(mapsComponentContent.includes('google.com/maps'), 'ElectionOfficeMap uses Google Maps logic');
assert(!mapsComponentContent.includes('navigator.geolocation'), 'No live geolocation usage in Map component');
const quizContent = fs.readFileSync(path.join(ROOT_DIR, 'src/pages/Quiz.jsx'), 'utf8');
assert(quizContent.includes('localStorage.getItem(\'civicsaarthi_quiz_progress\')'), 'Quiz attempts to load progress from localStorage');
assert(quizContent.includes('useState(() =>'), 'Quiz uses lazy state initialization for persistence');
assert(quizContent.includes('localStorage.setItem(\'civicsaarthi_quiz_progress\''), 'Quiz saves progress to localStorage');
assert(quizContent.includes('Reset Quiz Progress'), 'Quiz has Reset Quiz button');

// 4. Glossary ASK AI Logic checks
const glossaryContent = fs.readFileSync(path.join(ROOT_DIR, 'src/pages/Glossary.jsx'), 'utf8');
assert(glossaryContent.includes('/assistant?prompt='), 'Glossary ASK AI uses query parameters for navigation');
assert(glossaryContent.includes('encodeURIComponent'), 'Glossary ASK AI encodes prompts');

const assistantPageContent = fs.readFileSync(path.join(ROOT_DIR, 'src/pages/Assistant.jsx'), 'utf8');
assert(assistantPageContent.includes('useSearchParams'), 'Assistant page uses useSearchParams');
assert(assistantPageContent.includes('prompt'), 'Assistant page reads prompt from URL');

// 5. Bot FAB Tooltip Visual checks
const fabContent = fs.readFileSync(path.join(ROOT_DIR, 'src/components/FloatingAssistant.jsx'), 'utf8');
assert(fabContent.includes('Chat with CivicSaarthi AI'), 'FAB tooltip has correct text');
assert(fabContent.includes('group-hover:opacity-100'), 'FAB tooltip visible on hover');
assert(fabContent.includes('group-focus-within:opacity-100'), 'FAB tooltip visible on focus');
assert(fabContent.includes('z-50'), 'FAB tooltip has high z-index');

// 6. Content Integrity
assert(timelineStages.length === 9, 'Timeline data intact (9 stages)');
assert(quizQuestions.length === 5, 'Quiz data intact (5 questions)');

console.log(`\nTest Results: ${passed} Passed, ${failed} Failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('Emergency fixes verified! 🎉');
  process.exit(0);
}
