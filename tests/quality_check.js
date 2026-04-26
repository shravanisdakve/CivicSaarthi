import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const WORKSPACE_ROOT = process.cwd();

console.log('🚀 Running Quality & Architecture Audit...');

// 1. Language Architecture Check
function checkLanguageArchitecture() {
  console.log('--- Checking Language Architecture ---');
  const contextPath = path.join(WORKSPACE_ROOT, 'src/context/LanguageContext.jsx');
  const hookPath = path.join(WORKSPACE_ROOT, 'src/hooks/useTranslation.js');
  
  assert.ok(fs.existsSync(contextPath), 'LanguageContext.jsx missing');
  assert.ok(fs.existsSync(hookPath), 'useTranslation.js missing');
  
  const contextContent = fs.readFileSync(contextPath, 'utf-8');
  assert.ok(contextContent.includes('localStorage.getItem(\'civicsaarthi_language\')'), 'Context does not read from localStorage');
  assert.ok(contextContent.includes('localStorage.setItem(\'civicsaarthi_language\', newLang)'), 'Context does not save to localStorage');
  
  console.log('✅ Language Context and Hook validated.');
}

// 2. Component Refactoring Check (Anti-pattern detection)
function checkAntiPatterns() {
  console.log('--- Checking for Anti-patterns ---');
  const components = [
    'src/components/Navbar.jsx',
    'src/pages/Home.jsx',
    'src/components/ReadinessDashboard.jsx',
    'src/components/FloatingAssistant.jsx',
    'src/pages/Checklist.jsx'
  ];
  
  components.forEach(comp => {
    const filePath = path.join(WORKSPACE_ROOT, comp);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const hasManualListener = content.includes('window.addEventListener(\'civicLanguageChanged\'');
    assert.strictEqual(hasManualListener, false, `Component ${comp} still has manual language listener!`);
    
    const usesHook = content.includes('useTranslation()');
    assert.ok(usesHook, `Component ${comp} does not use useTranslation hook!`);
  });
  
  console.log('✅ All core components refactored to use centralized translation hook.');
}

// 3. Grounding & Official Knowledge check
function checkGroundingData() {
  console.log('--- Checking Grounding Data ---');
  const knowledgePath = path.join(WORKSPACE_ROOT, 'src/data/officialKnowledge.js');
  const content = fs.readFileSync(knowledgePath, 'utf-8');
  
  assert.ok(content.includes('sourceUrl:'), 'officialKnowledge missing source URLs');
  
  const assistantPath = path.join(WORKSPACE_ROOT, 'src/components/FloatingAssistant.jsx');
  const assistantContent = fs.readFileSync(assistantPath, 'utf-8');
  assert.ok(assistantContent.includes('Grounded in official sources'), 'Assistant UI missing grounding branding');
  
  console.log('✅ Grounding data and UI references validated.');
}

// 4. Input Safety Utility Check
function checkInputSafety() {
  console.log('--- Checking Input Safety ---');
  const safetyPath = path.join(WORKSPACE_ROOT, 'src/utils/inputSafety.js');
  const content = fs.readFileSync(safetyPath, 'utf-8');
  
  assert.ok(content.includes('normalizeUserMessage'), 'normalizeUserMessage missing');
  assert.ok(content.includes('containsUnsafePersonalDataHint'), 'containsUnsafePersonalDataHint missing');
  
  console.log('✅ Input safety utilities validated.');
}

// 5. Accessibility & CSS check
function checkAccessibilitySpecs() {
  console.log('--- Checking Accessibility Specs ---');
  const cssPath = path.join(WORKSPACE_ROOT, 'src/index.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');
  
  assert.ok(cssContent.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced motion support missing in CSS');
  
  const badgePath = path.join(WORKSPACE_ROOT, 'src/components/Badge.jsx');
  const badgeContent = fs.readFileSync(badgePath, 'utf-8');
  assert.ok(badgeContent.includes('font-bold'), 'Badge text not bold for better readability');
  
  console.log('✅ Accessibility CSS specs validated.');
}

// 6. Google Services Visibility Check
function checkGoogleServicesVisibility() {
  console.log('--- Checking Google Services Visibility ---');
  
  const homeContent = fs.readFileSync(path.join(WORKSPACE_ROOT, 'src/pages/Home.jsx'), 'utf-8');
  assert.ok(homeContent.includes('Powered by Google Cloud'), 'Home missing Google Cloud branding');
  assert.ok(homeContent.includes('Cloud Run'), 'Home missing Cloud Run mention');
  assert.ok(homeContent.includes('Gemini AI'), 'Home missing Gemini AI mention');
  assert.ok(homeContent.includes('Maps Platform'), 'Home missing Maps Platform mention');
  
  assert.ok(homeContent.includes('Firebase'), 'Home missing Firebase mention');
  
  const qualityContent = fs.readFileSync(path.join(WORKSPACE_ROOT, 'src/pages/Quality.jsx'), 'utf-8');
  assert.ok(qualityContent.includes('Google Services Integration'), 'Quality page missing Google Services section');
  assert.ok(qualityContent.includes('Secret Manager'), 'Quality page missing Secret Manager mention');
  assert.ok(qualityContent.includes('Firebase Auth'), 'Quality page missing Firebase mention');
  
  const assistantContent = fs.readFileSync(path.join(WORKSPACE_ROOT, 'src/pages/Assistant.jsx'), 'utf-8');
  assert.ok(assistantContent.includes('Gemini API Active'), 'Assistant missing Gemini status badge');
  
  const mapContent = fs.readFileSync(path.join(WORKSPACE_ROOT, 'src/pages/MapHelper.jsx'), 'utf-8');
  assert.ok(mapContent.includes('Google Maps Platform Integration'), 'Map Helper missing Maps attribution');
  
  const readmeContent = fs.readFileSync(path.join(WORKSPACE_ROOT, 'README.md'), 'utf-8');
  assert.ok(readmeContent.indexOf('## Google Services Integration') < 500, 'README missing Google Services section near the top');
  assert.ok(readmeContent.includes('Firebase Authentication'), 'README missing Firebase mention');
  
  console.log('✅ Google Services visibility audit passed.');
}

try {
  checkLanguageArchitecture();
  checkAntiPatterns();
  checkGroundingData();
  checkInputSafety();
  checkAccessibilitySpecs();
  checkGoogleServicesVisibility();
  console.log('\n✨ ALL QUALITY CHECKS PASSED!');
} catch (err) {
  console.error('\n❌ QUALITY CHECK FAILED:');
  console.error(err.message);
  process.exit(1);
}
