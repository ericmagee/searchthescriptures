// node tpre.cjs <node.js> <exec.json>: runs preCheckSide on the stored closing lists
const fs=require('fs');const c=fs.readFileSync(process.argv[2],'utf8');const i=c.indexOf('function preCheckSide');const j=c.indexOf('function preCheckBlock');
const f=new Function(c.slice(i,j)+';return preCheckSide;')();const o=JSON.parse(fs.readFileSync(process.argv[3],'utf8')).data.resultData.runData['Build Save Body'][0].data.main[0][0].json;
const L=[].concat(f(o.gr2,[o.cr1,o.cr2],'CHALLENGER LIST [DR2]'),f(o.cr3,[o.gr1,o.gr2],'DEFENDER LIST [CR3]'));
L.forEach(l=>console.log(l.replace(/absent from its quote:.*?\|\|/,'||')));
