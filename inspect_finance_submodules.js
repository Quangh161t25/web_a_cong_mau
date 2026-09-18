import fs from 'fs';

const js = fs.readFileSync('assets/index-DibejzpH.js', 'utf8');

const modules = [
  'danh-muc-tai-chinh',
  'tai-khoan',
  'de-xuat-chi-phi',
  'ke-hoach-chi-phi',
  'thu-chi',
  'bao-cao-tai-chinh'
];

modules.forEach(mod => {
  console.log(`\n========================================`);
  console.log(`SUBMODULE: [${mod}]`);
  console.log(`========================================`);
  
  let pos = 0;
  while ((pos = js.indexOf(mod, pos + 1)) !== -1) {
    if (pos > 1000000) {
      console.log('--- Found at pos', pos, '---');
      console.log(js.substring(pos - 100, pos + 400));
      break;
    }
  }
});
