// Step 8 diagnosis (Worker_A3, BB-7397 rev 8): DeepSeek's D6 vs C3 K-G4 cure on run 28269, through the published library (new12/Cure_Check.js).
// Rounds: the judges' Text 1 in the Drive report (step8/report28269.md, md5 89fc9d23), split at its === [XRn] markers. Reply: the report's
// "reply to the cure request" block under "Cure call, DeepSeek". Item line: the report's FLAGGED ITEMS line for K-G4 D6 vs C3.
const fs=require('fs');const [,,dir]=process.argv;
const lib0=fs.readFileSync(dir+'/Cure_Check.js','utf8').split('\n');const e=lib0.findIndex(l=>l.startsWith('function cureProse'));
const L=new Function(lib0.slice(0,e+2).join('\n')+'\nreturn {cureVerdicts,cureNamed,cureFound,cureLines,cureRefs};')();
const rep=fs.readFileSync('step8/report28269.md','utf8').split('\n');
const t0=rep.findIndex(l=>l.startsWith('=== [CR1]'));const t1=rep.findIndex((l,i)=>i>t0&&l==='```');
const R={};let k=null;for(let i=t0;i<t1;i++){const m=rep[i].match(/^=== \[(CR[1-3]|DR[1-3])\]/);if(m){k=m[1];R[k]=[];continue;}if(k)R[k].push(rep[i]);}
for(const x in R)R[x]=R[x].join('\n').trim();
const c0=rep.findIndex(l=>l.startsWith('### Cure call, DeepSeek'));const r0=rep.findIndex((l,i)=>i>c0&&l.startsWith('**reply to the cure request**'));
const a=rep.findIndex((l,i)=>i>r0&&l==='```text');const b=rep.findIndex((l,i)=>i>a&&l==='```');const reply=rep.slice(a+1,b).join('\n');
const fl=rep.find((l,i)=>i>c0&&l.startsWith('K-G4 D6 vs C3: '));const line=fl.slice('K-G4 D6 vs C3: '.length);
const item={rule:'K-G4',side:'DEFENDER',link:'D6 vs C3',line};
const v=L.cureVerdicts([item],{ok:true,text:reply},{DEFENDER:['D3 vs C1','D4 vs C2','D6 vs C3'],CHALLENGER:[]},R);
console.log('as printed:',v[0].status,'|',v[0].why);
const o=L.cureLines(reply);const s=o.short.find(s=>s.link==='D6 vs C3');console.log('SHORT parsed, quote chars:',s.q.length);
console.log('quote found in CR3 whole:',L.cureFound(s.q,R.CR3));
const nm=L.cureNamed(line,R.CR3);console.log('verses of the line named in CR3:',JSON.stringify(nm.map(n=>n.ref)));
nm.forEach(n=>console.log(' ',n.ref,'blocks:',n.blocks.length,'quote found in a block:',n.blocks.some(bk=>L.cureFound(s.q,bk))));
// The same quote cut to its last sentence (the part that names Matthew 1:18):
const q2="Matthew 1:18 narrates when she 'was found with child' and names covenant origin.";
console.log('last sentence alone found in a block:',nm.some(n=>n.blocks.some(bk=>L.cureFound(q2,bk))));
const p3=o.pressed.find(p=>p.link==='D3 vs C1');console.log('D3 PRESSED names',p3.round,'| found in DR1:',L.cureFound(p3.q,R.DR1),'| in DR2:',L.cureFound(p3.q,R.DR2));
const v3=L.cureVerdicts([{rule:'K-G4',side:'DEFENDER',link:'D3 vs C1',line:rep.find((l,i)=>i>c0&&l.startsWith('K-G4 D3 vs C1: ')).slice(15)}],{ok:true,text:reply},{DEFENDER:['D3 vs C1','D4 vs C2','D6 vs C3'],CHALLENGER:[]},R);
console.log('D3 as printed:',v3[0].status,'|',v3[0].why);
