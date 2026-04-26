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
assert(mapHelperContent.includes('Polling Station Guidance Preview'), 'Map Helper page has correct title');

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

// --- DEMO MODE CHECKS ---
const demoComponentExists = fs.existsSync(path.join(ROOT_DIR, 'src/components/DemoMode.jsx'));
assert(demoComponentExists, 'DemoMode component exists');

if (demoComponentExists) {
  const demoContent = fs.readFileSync(path.join(ROOT_DIR, 'src/components/DemoMode.jsx'), 'utf8');
  assert(demoContent.includes('Try 2-Minute Demo') || demoContent.includes('2-Minute Demo'), 'Demo mode title present');
  assert(demoContent.includes('/assistant'), 'Demo links to Assistant');
  assert(demoContent.includes('/timeline'), 'Demo links to Timeline');
  assert(demoContent.includes('/checklist'), 'Demo links to Checklist');
  assert(demoContent.includes('/map'), 'Demo links to Map Helper');
  assert(demoContent.includes('goAssistant'), 'Demo opens Assistant or Journey steps');
}

const homeContent = fs.readFileSync(path.join(ROOT_DIR, 'src/pages/Home.jsx'), 'utf8');
assert(homeContent.includes('demo-mode-btn') || homeContent.includes('cta.tryDemo'), 'Home page has demo button');
assert(homeContent.includes('DemoMode'), 'Home page renders DemoMode component');

const swExists = fs.existsSync(path.join(ROOT_DIR, 'public/service-worker.js'));
assert(swExists, 'Service worker exists for PWA');

const manifestExists = fs.existsSync(path.join(ROOT_DIR, 'public/manifest.webmanifest'));
assert(manifestExists, 'PWA manifest exists');

const qualityExists = fs.existsSync(path.join(ROOT_DIR, 'src/pages/Quality.jsx'));
assert(qualityExists, 'Quality page exists');

const gpExists = fs.existsSync(path.join(ROOT_DIR, 'src/utils/guestProfile.js'));
assert(gpExists, 'guestProfile.js exists');

const npExists = fs.existsSync(path.join(ROOT_DIR, 'src/components/NamePromptModal.jsx'));
assert(npExists, 'NamePromptModal.jsx exists');

const modalContent = fs.readFileSync(path.join(ROOT_DIR, 'src/components/NamePromptModal.jsx'), 'utf8');
assert(modalContent.includes('What should CivicSaarthi call you?'), 'Name prompt text exists');
assert(modalContent.includes('stored only on this device'), 'Privacy storage disclaimer exists');

const navbarContent = fs.readFileSync(path.join(ROOT_DIR, 'src/components/Navbar.jsx'), 'utf8');
assert(!navbarContent.includes('Citizen Login'), 'Confusing Citizen Login terminology removed');
assert(navbarContent.includes('GuestProfileChip'), 'Navbar uses GuestProfileChip');

const ebExists = fs.existsSync(path.join(ROOT_DIR, 'src/components/ErrorBoundary.jsx'));
assert(ebExists, 'ErrorBoundary component exists');

const rlExists = fs.existsSync(path.join(ROOT_DIR, 'src/components/RouteLoader.jsx'));
assert(rlExists, 'RouteLoader component exists');

const indexContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
assert(indexContent.includes('serviceWorker'), 'Service worker registered in index.html');

// VOICE
const speechExists = fs.existsSync(path.join(ROOT_DIR, 'src/utils/speech.js'));
assert(speechExists, 'speech.js exists');
const voiceControlsExists = fs.existsSync(path.join(ROOT_DIR, 'src/components/VoiceAssistantControls.jsx'));
assert(voiceControlsExists, 'VoiceAssistantControls.jsx exists');
const voiceControlsContent = fs.readFileSync(path.join(ROOT_DIR, 'src/components/VoiceAssistantControls.jsx'), 'utf8');
assert(voiceControlsContent.includes('Speak your question'), 'Speak copy exists');
assert(voiceControlsContent.includes('Read assistant answer aloud'), 'Read aloud copy exists');
assert(voiceControlsContent.includes('processed by your browser'), 'Voice privacy disclaimer exists');

// EXPLAINERS
const explainersExists = fs.existsSync(path.join(ROOT_DIR, 'src/data/phaseExplainers.js'));
assert(explainersExists, 'phaseExplainers.js exists');
const explainersContent = fs.readFileSync(path.join(ROOT_DIR, 'src/data/phaseExplainers.js'), 'utf8');
const explainerCount = (explainersContent.match(/phaseId:/g) || []).length;
assert(explainerCount === 9, 'Exactly 9 explainers found');

// GAMIFICATION
const badgesExists = fs.existsSync(path.join(ROOT_DIR, 'src/data/badges.js'));
assert(badgesExists, 'badges.js exists');
const badgeEngineExists = fs.existsSync(path.join(ROOT_DIR, 'src/utils/badgeEngine.js'));
assert(badgeEngineExists, 'badgeEngine.js exists');
const badgesContent = fs.readFileSync(path.join(ROOT_DIR, 'src/data/badges.js'), 'utf8');
assert(badgesContent.includes('Voter Ready'), 'Voter Ready badge exists');
assert(!badgesContent.includes('Candidate Match'), 'No political scoring/matching in badges');

// SHARING
const shareExists = fs.existsSync(path.join(ROOT_DIR, 'src/components/ShareReadiness.jsx'));
assert(shareExists, 'ShareReadiness.jsx exists');
const shareTextExists = fs.existsSync(path.join(ROOT_DIR, 'src/utils/shareText.js'));
assert(shareTextExists, 'shareText.js exists');
const shareContent = fs.readFileSync(path.join(ROOT_DIR, 'src/utils/shareText.js'), 'utf8');
assert(shareContent.includes('Understand. Prepare. Verify. Vote.'), 'Share tagline exists');

// MAPS UPGRADE
const mapContent = fs.readFileSync(path.join(ROOT_DIR, 'src/pages/MapHelper.jsx'), 'utf8');
const previewPath = path.join(ROOT_DIR, 'src/components/PollingGuidancePreview.jsx');
const previewExists = fs.existsSync(previewPath);
assert(previewExists, 'PollingGuidancePreview.jsx exists');

const previewContent = fs.readFileSync(previewPath, 'utf8');
const fullMapLogic = mapContent + previewContent;

assert(fullMapLogic.includes('voters.eci.gov.in'), 'Official voter services link exists');
assert(fullMapLogic.includes('CivicSaarthi does not show your officially assigned polling booth'), 'Booth disclaimer exists');
assert(!fullMapLogic.includes('navigator.geolocation'), 'No geolocation usage in MapHelper');
assert(!fullMapLogic.includes('live data'), 'No "live data" text');
assert(!fullMapLogic.includes('4 booths found'), 'No "4 booths found" text');
assert(!fullMapLogic.includes('recommended booth') || fullMapLogic.includes('Example planning card'), 'No "recommended booth" unless marked example/demo');
assert(fullMapLogic.includes('google.com/maps'), 'Google Maps search link exists');

console.log(`\nTest Results: ${passed} Passed, ${failed} Failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('CivicSaarthi Final Top-10 Audit PASSED! 🏆🎉');
  process.exit(0);
}
