/**
 * Utility to generate and download a personalized Election Readiness Summary.
 * Generates a clean HTML file locally in the browser without backend calls or heavy PDF libraries.
 */

export function downloadReadinessSummary({ persona, checklistItems = [], readinessPercent = 0, nextAction = '' }) {
  const completedSteps = checklistItems.filter(item => item.completed);
  const pendingSteps = checklistItems.filter(item => !item.completed);
  
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Generate HTML content
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CivicSaarthi Election Readiness Summary</title>
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
      <h1>CivicSaarthi Election Readiness Summary</h1>
      <div class="subtitle">Understand. Prepare. Verify. Vote.</div>
      <div class="meta">Generated on: ${dateStr}</div>
    </header>

    <div class="stats-card">
      <div class="stat">
        <div class="stat-value">${persona || 'General Citizen'}</div>
        <div class="stat-label">Selected Path</div>
      </div>
      <div class="stat">
        <div class="stat-value">${readinessPercent}%</div>
        <div class="stat-label">Readiness Score</div>
      </div>
    </div>

    <h2>Recommended Next Action</h2>
    <p><strong>${nextAction || 'Review your pending steps below to complete your readiness journey.'}</strong></p>

    <h2>Completed Steps (${completedSteps.length})</h2>
    ${completedSteps.length > 0 ? `
      <ul>
        ${completedSteps.map(item => `<li><span class="completed">✓</span> ${item.text || item.label || 'Task'}</li>`).join('')}
      </ul>
    ` : '<p>No steps completed yet. Let\'s get started!</p>'}

    <h2>Pending Steps (${pendingSteps.length})</h2>
    ${pendingSteps.length > 0 ? `
      <ul>
        ${pendingSteps.map(item => `<li><span class="pending">○</span> ${item.text || item.label || 'Task'}</li>`).join('')}
      </ul>
    ` : '<p>All steps completed! You are fully prepared.</p>'}

    <div class="disclaimer-section">
      <div class="disclaimer-box">
        <strong>Privacy Note:</strong> CivicSaarthi does not collect Aadhaar, voter ID, phone number, address, political preference, or live location.
      </div>
      <div class="neutrality-box">
        <strong>Neutrality Note:</strong> CivicSaarthi explains election processes and does not support or oppose any party or candidate.
      </div>
      <div class="official-box">
        <strong>Official Verification Reminder:</strong> Always verify registration status, polling station, voting dates, and candidate information through official election sources.
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
