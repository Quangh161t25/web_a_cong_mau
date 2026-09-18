import fs from 'fs';

const js = fs.readFileSync('assets/index-DibejzpH.js', 'utf8');

const idx = js.indexOf('path:"/tai-chinh"');
console.log('path:"/tai-chinh" idx:', idx);
if (idx !== -1) {
  console.log('Context:\n', js.substring(idx - 200, idx + 500));
}

// Find all tabs or components defined for finance
// Let's search for "tai-chinh" in routes
const allMatches = [];
let i = 0;
while ((i = js.indexOf('/tai-chinh', i + 1)) !== -1) {
  allMatches.push(js.substring(i - 50, i + 100));
}
console.log('\nAll /tai-chinh occurrences:\n', allMatches);
