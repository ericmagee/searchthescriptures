// F12, F15, F15c harness (Worker_A3, BB-7397 rev 8, 7555 as amended 7558). Usage: node f15.cjs <node dir>
// Inputs, all stored text, none retyped:
//  fx/report27893.md (the Drive copy, md5 de6a7448): Grok's FLAGGED ITEMS lines and its "reply to the cure request" block, extracted by script.
//  fx/rounds27893.json (the six rounds of row 6b95a298).
//  fx/row_27893.json (row 6b95a298, read by SQL, md5 87b40317): the single judge's K-G1 REPORT line in independent_verdict_raw.
// The shared cure library is read from the dir's Cure_Check.js, as far as cureProse.
const fs=require('fs');const crypto=require('crypto');const [,,dir]=process.argv;
const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const lib0=fs.readFileSync(dir+'/Cure_Check.js','utf8').split('\n');const e=lib0.findIndex(l=>l.startsWith('function cureProse'));
const L=new Function(lib0.slice(0,e+2).join('\n')+'\nreturn {cureVerdicts,cureFound,cureLines,cureQ};')();
const X=JSON.parse(fs.readFileSync('fx/rounds27893.json','utf8'));const R={CR1:X.cr1,DR1:X.gr1,CR2:X.cr2,DR2:X.gr2,CR3:X.cr3,DR3:X.dr3};
const rep=fs.readFileSync('fx/report27893.md','utf8').split('\n');
// Grok's cure exchange: the FLAGGED ITEMS block whose lines name D6 vs C1 (Matthew 1:18) alone, then the next reply block.
const k4=rep.findIndex(l=>l.startsWith('K-G4 D6 vs C1: D6 vs C1 (Matthew 1:18): DEFENDER LINK BROKEN'));
const k7=k4+1;if(!rep[k7].startsWith('K-G7 D6 vs C1: D6 vs C1 (Matthew 1:18): DEFENDER LINK BROKEN'))throw new Error('K-G7 line not next to K-G4');
const rh=rep.findIndex((l,i)=>i>k7&&l.startsWith('**reply to the cure request**'));
const a=rep.findIndex((l,i)=>i>rh&&l==='```text');const b=rep.findIndex((l,i)=>i>a&&l==='```');
const reply=rep.slice(a+1,b).join('\n');fs.writeFileSync('fx/f15_grok_reply.txt',reply);
const line=s=>s.slice(s.indexOf(': ')+2);
console.log('F15 source: report lines',k4+1,k7+1,'(items),',a+2,'to',b,'(reply);',reply.length,'chars, md5',md5(reply),'; backslash-quotes',(reply.match(/\\"/g)||[]).length);
const items=[{rule:'K-G4',side:'DEFENDER',link:'D6 vs C1',line:line(rep[k4])},
 {rule:'K-G7',side:'DEFENDER',link:'D6 vs C1',line:line(rep[k7]),premise:6,conc:2,st:'PROP-DEPENDENT',L:6}];
const show=v=>JSON.stringify(v.map(x=>({rule:x.rule,status:x.status,why:x.why})));
console.log('F15 Grok 27893 reply as printed =>',show(L.cureVerdicts(items,{ok:true,text:reply},null,R)));
// F12 (rev 8): both of Grok's PRESSED lines for D6 vs C1 found in DR1.
const P=L.cureLines(reply).pressed;
P.forEach((p,i)=>console.log('F12 PRESSED',i+1,'['+p.round+'] found in DR1:',L.cureFound(p.q,R.DR1)));
// F15c: the single judge's stored K-G1 cure, rebuilt from its REPORT line in independent_verdict_raw (the report writer turns [ ] into
// ( ) and joins the reply lines with " / "; both undone here). Case 2: the same with its inner quotation marks backslash-escaped.
const row=JSON.parse(fs.readFileSync('fx/row_27893.json','utf8'));
const rl=row.independent_verdict_raw.split('\n').find(l=>l.includes('VIOLATION REPORT')&&l.includes('RULE: K-G1'));
const g=(k,n)=>{const i=rl.indexOf('; '+k+': ');const j=n?rl.indexOf('; '+n+': ',i+1):-1;return rl.slice(i+k.length+4,j>0?j:undefined);};
const unb=s=>s.replace(/\((L[1-4]|[CD]R[1-3])\)/g,'[$1]');
const r1=unb(g('STATEMENT','JUDGE STATEMENT')).split(' / ').join('\n');
const it1=[{rule:'K-G1',side:'DEFENDER',link:'D6 vs C3',line:unb(g('LINE','STATEMENT'))}];
console.log('F15c.1 single judge K-G1 stored cure =>',show(L.cureVerdicts(it1,{ok:true,text:r1},null,R)));
const r2=r1.split('\n').map(l=>{const m=l.match(/^(PRESSED: .*?\| ")(.*)("$)/);return m?m[1]+m[2].replace(/"/g,'\\"')+m[3]:l;}).join('\n');
console.log('F15c.2 same, inner quotation marks escaped =>',show(L.cureVerdicts(it1,{ok:true,text:r2},null,R)));
// F15b anchor: the reader's fold on an escaped sample.
console.log('fold sample:',JSON.stringify(L.cureQ('a \\"b\\" c\\\\d\\ne\\tf\\rg')));
