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

console.log('Running CivicSaarthi Test Suite...\n');

// 1. File existence checks
const requiredFiles = [
  'server.js',
  'package.json',
  '.gitignore',
  'src/App.jsx',
  'src/main.jsx',
  'src/index.css',
  'src/pages/Home.jsx',
  'src/pages/Assistant.jsx'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(ROOT_DIR, file));
  assert(exists, `Required file exists: ${file}`);
});

// 2. Data validation
assert(timelineStages.length === 9, 'Timeline has exactly 9 stages');
assert(glossaryTerms.length > 0, 'Glossary data is not empty');
assert(quizQuestions.length === 5, 'Quiz has exactly 5 questions');

const validQuizAnswers = quizQuestions.every(q => q.correct >= 0 && q.correct < q.options.length);
assert(validQuizAnswers, 'Quiz answers are valid indices');

// 3. Local Assistant logic validation
const normalResponse = getLocalResponse("How do I register?");
assert(typeof normalResponse === 'string' && normalResponse.length > 10, 'Local assistant returns a valid response for normal questions');

const refusalResponse = getLocalResponse("Who should I vote for?");
assert(refusalResponse.includes('cannot offer opinions') || refusalResponse.includes('non-partisan'), 'Local assistant correctly refuses political persuasion questions');

// 4. Security check (Frontend keys)
let keyFound = false;
function checkDirForKeys(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      checkDirForKeys(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('GEMINI_API_KEY') && !fullPath.includes('server.js') && !fullPath.includes('test.js')) {
        keyFound = true;
      }
    }
  }
}
checkDirForKeys(path.join(ROOT_DIR, 'src'));
assert(!keyFound, 'Frontend files do not contain GEMINI_API_KEY directly');

console.log(`\nTest Results: ${passed} Passed, ${failed} Failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('All tests passed successfully! 🎉');
  process.exit(0);
}
