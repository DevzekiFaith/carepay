const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('lib/products.ts', 'utf8');

// Parse products
const items = [];
const blocks = content.split(/id:\s*['"](sp-[^'"]+)['"]/);

for (let i = 1; i < blocks.length; i += 2) {
  const id = blocks[i];
  const rest = blocks[i + 1] || '';
  
  const nameMatch = rest.match(/name:\s*['"]([^'"]+)['"]/);
  const imgMatch = rest.match(/image:\s*['"]([^'"]+)['"]/);
  
  const name = nameMatch ? nameMatch[1] : 'Unknown';
  const img = imgMatch ? imgMatch[1] : '';
  
  const fullPath = path.join('public', img.replace(/^\//, ''));
  const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).size > 100;
  
  items.push({ id, name, img, fullPath, exists, size: exists ? fs.statSync(fullPath).size : 0 });
}

console.log('--- PRODUCT AUDIT ---');
let missing = 0;
for (const p of items) {
  if (!p.exists) {
    console.log('[FAIL] ID:', p.id, '| Name:', p.name, '| Img:', p.img);
    missing++;
  } else {
    console.log('[PASS] ID:', p.id, '| Img:', p.img, `(${p.size} B)`);
  }
}
console.log(`\nTotal products: ${items.length} | Passing: ${items.length - missing} | Failing: ${missing}`);
