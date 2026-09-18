import fs from 'fs';

const vi = JSON.parse(fs.readFileSync('src/locales/vi.json', 'utf8'));

console.log('Searching all finance keys in vi.json...');

const financeKeys = Object.entries(vi).filter(([k, v]) => {
  return k.startsWith('taiChinh') || k.startsWith('thuChi') || k.startsWith('congNo') || k.startsWith('nganSach') || k.startsWith('soQuy') || k.startsWith('baoCaoTaiChinh') || k.startsWith('hoaDon') || k.startsWith('nganHang');
});

console.log(`Found ${financeKeys.length} finance keys in vi.json:`);

// Group by top prefix
const groups = {};
financeKeys.forEach(([k, v]) => {
  const top = k.split('.')[0];
  if (!groups[top]) groups[top] = [];
  groups[top].push({ key: k, value: v });
});

Object.entries(groups).forEach(([groupName, items]) => {
  console.log(`\n=== Group: [${groupName}] (${items.length} keys) ===`);
  // Print tabs or titles
  items.slice(0, 15).forEach(it => console.log(`   ${it.key}: "${it.value}"`));
});
