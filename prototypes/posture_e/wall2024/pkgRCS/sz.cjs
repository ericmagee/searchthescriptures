const fs=require('fs');const names=fs.readFileSync('names.txt','utf8').trim().split('|');
const j=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const rd=(j.data||j).resultData.runData;
let tot=0,cnt=0,calls=0;for(const n of names){if(!rd[n])continue;cnt++;for(const r of rd[n]){tot+=JSON.stringify(r.data||{}).length;calls++;}}
console.log('nodes executed',cnt,'runs',calls,'output bytes',tot);
