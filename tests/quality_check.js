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
  assert.ok(contextContent.includes('localStorage.getItem(\'civicLanguage\')'), 'Context does not read from localStorage');
  assert.ok(contextContent.includes('localStorage.setItem(\'civicLanguage\', newLang)'), 'Context does not save to localStorage');
  
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

try {
  checkLanguageArchitecture();
  checkAntiPatterns();
  checkGroundingData();
  checkInputSafety();
  checkAccessibilitySpecs();
  console.log('\n✨ ALL QUALITY CHECKS PASSED!');
} catch (err) {
  console.error('\n❌ QUALITY CHECK FAILED:');
  console.error(err.message);
  process.exit(1);
}
