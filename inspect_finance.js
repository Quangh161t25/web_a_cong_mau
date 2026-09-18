import fs from 'fs';

const code = fs.readFileSync('index.formatted.js', 'utf8');

console.log('Searching for /tai-chinh routes and sub-modules...');

// 1. Find all routes starting with /tai-chinh
const pathRegex = /path:\s*["'](\/tai-chinh[^"']*)["']/g;
let match;
const financeRoutes = new Set();
while ((match = pathRegex.exec(code)) !== null) {
  financeRoutes.add(match[1]);
}
console.log('\n--- Finance Routes ---');
console.log(Array.from(financeRoutes));

// 2. Search for Finance tabs (Thu chi, Quỹ tiền mặt, Ngân hàng, Công nợ phải thu, Công nợ phải trả, Ngân sách, Báo cáo tài chính, Hóa đơn...)
const financeKeywords = [
  'thuChi', 'soQuy', 'taiKhoanNganHang', 'congNoPhaiThu', 'congNoPhaiTra',
  'nganSach', 'baoCaoTaiChinh', 'hoaDon', 'pnl', 'cashflow', 'bangCanDoi'
];

console.log('\n--- Searching for Finance i18n keys and tabs ---');
const lines = code.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('"taiChinh.') || line.includes('thuChi.') || line.includes('congNo.') || line.includes('nganSach.')) {
    if (idx < 50000) {
      // console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
