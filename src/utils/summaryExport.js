import { translations } from '../data/translations.js';
import { getLanguage } from './language.js';

export function downloadReadinessSummary({
  persona,
  checklistItems = [],
  readinessPercent = 0,
  nextAction = '',
  lang = 'en', // Add lang parameter
}) {
  const completedSteps = checklistItems.filter((item) => item.completed);
  const pendingSteps = checklistItems.filter((item) => !item.completed);

  const t = (key) => {
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Generate HTML content
  const htmlContent = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t('summary.title')}</title>
  <style>
    :root {
      --primary: #3b82f6; /* Adjust to match app primary */
      --text: #334155;
      --bg: #ffffff;
      --border: #e2e8f0;
      --success: #22c55e;
      --warning: #f59e0b;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: var(--text);
      line-height: 1.6;
      background-color: #f8fafc;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .container {
      background: var(--bg);
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border-top: 6px solid var(--primary);
    }
    .print-note {
      text-align: center;
      background: #eff6ff;
      color: #1e3a8a;
      padding: 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      margin-bottom: 2rem;
      border: 1px solid #bfdbfe;
    }
    header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    h1 { color: var(--primary); margin: 0 0 0.5rem 0; }
    h2 { font-size: 1.25rem; margin-top: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
    .subtitle { color: #64748b; font-weight: 500; }
    .meta { font-size: 0.875rem; color: #94a3b8; margin-top: 1rem; }
    
    .stats-card {
      background: #f1f5f9;
      padding: 1.5rem;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
    }
    .stat { text-align: center; }
    .stat-value { font-size: 1.5rem; font-weight: bold; color: var(--primary); }
    .stat-label { font-size: 0.875rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
    
    ul { padding-left: 1.5rem; }
    li { margin-bottom: 0.5rem; }
    .completed { color: var(--success); }
    .pending { color: var(--warning); }
    
    .disclaimer-section {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px dashed var(--border);
      font-size: 0.875rem;
    }
    .disclaimer-box {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 1rem;
      margin-bottom: 1rem;
      color: #7f1d1d;
    }
    .neutrality-box {
      background: #f0fdf4;
      border-left: 4px solid #22c55e;
      padding: 1rem;
      margin-bottom: 1rem;
      color: #14532d;
    }
    .official-box {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 1rem;
      color: #78350f;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; border-top: none; }
      .print-note { display: none; }
    }
  </style>
</head>
<body>
  <div class="print-note">
    <strong>💡 Tip:</strong> You can print this page or save it as a PDF (Ctrl+P / Cmd+P).
  </div>
  
  <div class="container">
    <header>
      <h1>${t('summary.title')}</h1>
      <div class="subtitle">${t('summary.subtitle')}</div>
      <div class="meta">Generated on: ${dateStr}</div>
    </header>

    <div class="stats-card">
      <div class="stat">
        <div class="stat-value">${persona || t('summary.generalCitizen')}</div>
        <div class="stat-label">${t('summary.selectedPath')}</div>
      </div>
      <div class="stat">
        <div class="stat-value">${readinessPercent}%</div>
        <div class="stat-label">${t('summary.readinessScore')}</div>
      </div>
    </div>

    <h2>${t('summary.recoNextAction')}</h2>
    <p><strong>${nextAction || t('summary.recoNextActionDesc')}</strong></p>

    <h2>${t('summary.completedSteps')} (${completedSteps.length})</h2>
    ${
      completedSteps.length > 0
        ? `
      <ul>
        ${completedSteps.map((item) => `<li><span class="completed">✓</span> ${item.text || item.label || t('summary.task')}</li>`).join('')}
      </ul>
    `
        : `<p>${t('summary.noStepsCompleted')}</p>`
    }

    <h2>${t('summary.pendingSteps')} (${pendingSteps.length})</h2>
    ${
      pendingSteps.length > 0
        ? `
      <ul>
        ${pendingSteps.map((item) => `<li><span class="pending">○</span> ${item.text || item.label || t('summary.task')}</li>`).join('')}
      </ul>
    `
        : `<p>${t('summary.allStepsCompleted')}</p>`
    }

    <div class="disclaimer-section">
      <div class="disclaimer-box">
        <strong>${t('summary.privacyNoteTitle')}:</strong> ${t('summary.privacyNoteDesc')}
      </div>
      <div class="neutrality-box">
        <strong>${t('summary.neutralityNoteTitle')}:</strong> ${t('summary.neutralityNoteDesc')}
      </div>
      <div class="official-box">
        <strong>${t('summary.officialNoteTitle')}:</strong> ${t('summary.officialNoteDesc')}
      </div>
    </div>
  </div>
</body>
</html>
  `;

  // Create Blob and trigger download
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `civic-saarthi-readiness-summary.html`;
  document.body.appendChild(a);
  a.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
