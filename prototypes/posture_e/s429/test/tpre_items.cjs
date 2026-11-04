const fs=require('fs');const o=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).data.resultData.runData['Build Save Body'][0].data.main[0][0].json;
const which=process.argv[3],n=+process.argv[4];const t=which==='C'?o.gr2:o.cr3;
const re=which==='C'?/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi:/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi;let i=-1;for(const m of t.matchAll(re))i=m.index;const L=t.slice(i);
const parts=L.split(/\n(?=\s*(?:\*\*)?\s*\d{1,2}[.)]\s)/);console.log(parts.find(p=>new RegExp('^\\s*(?:\\*\\*)?\\s*'+n+'[.)]\\s').test(p)).split(/PRESSED WITH/i)[0].slice(0,700));
