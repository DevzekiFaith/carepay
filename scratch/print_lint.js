const fs = require('fs');
const data = JSON.parse(fs.readFileSync('lint_full.json', 'utf8'));
data.filter(d => d.errorCount > 0 || d.warningCount > 0).forEach(d => {
  console.log('=== ' + d.filePath.replace(process.cwd(), '') + ' ===');
  d.messages.forEach(m => {
    console.log(`  Line ${m.line}:${m.column} [${m.severity === 2 ? 'ERROR' : 'WARN'}] (${m.ruleId}) ${m.message}`);
  });
});
