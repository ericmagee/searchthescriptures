// BB-6947 verify (Worker_A3): cases run against Worker_E's cure_lib.js. Usage: node mine.cjs <dir holding drv_block_0b3cbac.js and cure_lib.js>
const fs=require('fs');const D=process.argv[2];
const L=new Function(fs.readFileSync(D+'/drv_block_0b3cbac.js','utf8')+'\n'+fs.readFileSync(D+'/cure_lib.js','utf8')+'\nreturn {cureVerdicts,cureBroken,cureAsk,cureReport};')();
const K1={rule:'K-G1',side:'DEFENDER',link:'D6 vs C2',line:'D6 vs C2 (Matthew 1:25): DEFENDER LINK BROKEN -- the same unanswered timing witnesses.'};
const K3={rule:'K-G3',side:'DEFENDER',link:null,line:null};
const KB={rule:'K-B',side:'DEFENDER',link:'D4 vs C2',line:'D4 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- x.'};
const BR={DEFENDER:['D4 vs C2','D5 vs C2','D6 vs C2'],CHALLENGER:[]};
const ok=t=>({ok:true,text:t});
const cases=[
 ['K-G1 "I do not withdraw" must stay UNCURED',[K1],ok('K-G1 D6 vs C2: I do not withdraw the BROKEN grade; it stands.'),'UNCURED'],
 ['K-G1 "no withdrawal" must stay UNCURED',[K1],ok('K-G1 D6 vs C2: There is no withdrawal here.'),'UNCURED'],
 ['K-G3 "I will not withdraw" naming every link must stay UNCURED',[K3],ok('K-G3 DEFENDER: I will not withdraw D4 vs C2, D5 vs C2 or D6 vs C2.'),'UNCURED'],
 ['K-G1 plain WITHDRAW cures (control)',[K1],ok('K-G1 D6 vs C2: I withdraw the BROKEN grade on D6 vs C2.'),'CURED'],
 ['K-B cured line but grade changed to UNDERDETERMINED',[KB],ok('D4 vs C2: D4 vs C2 (Matthew 1:18): UNDERDETERMINED -- [L1] "before they came together" and [L3] Matthew 1:25.'),'UNCURED'],
 ['K-B restated on the line after its label',[KB],ok('D4 vs C2:\nD4 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- [L1] "before they came together" and [L3] Matthew 1:25.'),'CURED?'],
 ['K-G1 CORRECT with a quote not from any round (fabricated)',[K1],ok('K-G1 D6 vs C2: CONCEDED LINKS: 1. [DR2] pressed "words that no round ever said".'),'UNCURED?'],
];
for(const [n,items,reply,exp] of cases){const v=L.cureVerdicts(items,reply,BR)[0];console.log((v.status===exp.replace('?','')?'AS EXPECTED':'**DIFFERS**').padEnd(12),'|',n,'->',v.status,'|',v.why||'');}
const rep=L.cureReport('grok',L.cureVerdicts([KB],ok('D4 vs C2: D4 vs C2 (Matthew 1:18): DEFENDER LINK BROKEN -- [L1] "before they came together" and [L3] Matthew 1:25.'),BR));
console.log('report line:',rep[0]);console.log('a "]" inside the report line before its end:',rep[0].slice(0,-1).includes(']'));
