const ex=JSON.parse(require('fs').readFileSync('/mnt/project-files/wall2024/ex35173_full.json','utf8'));
const rd=(ex.data&&ex.data.resultData&&ex.data.resultData.runData)||ex.resultData?.runData||ex.runData;
const names=Object.keys(rd).filter(n=>/^Alt/i.test(n));console.log(names.join(' | '));
for(const n of names){const s=JSON.stringify(rd[n]);
 for(const re of [/D5 vs C6[^\\"]{0,90}/g,/CLOSE-CONTRADICTION D5[^\\"]{0,90}/g]){const set=new Set();for(const m of s.matchAll(re))set.add(m[0]);if(set.size)console.log('--',n,[...set].slice(0,8));}}
