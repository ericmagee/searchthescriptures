// ASK 531 criterion 4 (W4): psGrades narrow vs wide on two-digit premise numbers. No model call.
const fs=require('fs');const d=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const t=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const L=JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/')));
let e=L.findIndex((l,i)=>i>240&&/return module\.exports;\}\)\(\);/.test(l));
const src=L.slice(240,e+1).join('\n')+'\n'+L[888]+'\n'+L.slice(1376,1384).join('\n')+'\nreturn psGrades;';
const psGrades=new Function(src)();
const T=['CHALLENGER CONCEDED LINKS: 1 -- Premise 91: UNEXHIBITED. Premises 1-6 are spared.',
'CHALLENGER CONCEDED LINKS: 2 -- Premises 5 and 91: UNEXHIBITED. Premises 1, 2, 3, 4 and 6 are spared.',
'CHALLENGER CONCEDED LINKS: 1 -- Premise 5: UNEXHIBITED. Premises 1, 2, 3, 4 and 6 are spared.',
'CONCEDED LINKS: 2 -- Premises 2 and 4: UNEXHIBITED. Premises 1, 3 and 5 are spared.',
'CHALLENGER CONCEDED LINKS: 1 -- Premise 3: UNEXHIBITED; premise 12 is spared.'];
for(const s of T){const a=psGrades(s),b=psGrades(s,true);console.log(JSON.stringify(s)+'\n  narrow '+JSON.stringify(a&&a.g)+'\n  wide   '+JSON.stringify(b&&b.g));}
