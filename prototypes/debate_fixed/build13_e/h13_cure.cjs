// Rev 9 cure-reader harness (Worker_E, BB-7397 DoD 19). Usage: node h13_cure.cjs <node dir>. The library is read from <dir>/Cure_Check.js up to cureProse.
// F19  DeepSeek D6 vs C3 K-G4 on 28269 (as A3's f8_ds.cjs: rounds fx/rounds28269.json, md5-equal to the row; reply and item line from fx/report28269.md).
// F19a D3 vs C1 on 28269 (PRESSED names [DR1], words are [DR2]'s).
// F19b the F19 SHORT quote moved so that it ends one character before the widened window: built from CR3 by cutting it in front of the window.
// F19c F15c (27893 single judge K-G1 D6 vs C3, stored cure rebuilt from its REPORT line, A3's f15.cjs method), cases .1 and .2.
// F19d the 7194 defect 1 cases on 27433 (bb6904 rev8 harness_rev8.cjs cases 2, rounds fx/rounds27433.json from five.json md5 73ae11e1).
const fs=require('fs');const [,,dir]=process.argv;
const lib0=fs.readFileSync(dir+'/Cure_Check.js','utf8').split('\n');const e=lib0.findIndex(l=>l.startsWith('function cureProse'));
const L=new Function(lib0.slice(0,e+2).join('\n')+'\nreturn {cureVerdicts,cureNamed,cureFound,cureLines,cureRefs};')();
const show=v=>v.map(x=>x.status+' | '+x.why).join(' || ');
// 28269
const X=JSON.parse(fs.readFileSync('fx/rounds28269.json','utf8'));const R=X;
const rep=fs.readFileSync('fx/report28269.md','utf8').split('\n');
const c0=rep.findIndex(l=>l.startsWith('### Cure call, DeepSeek'));const r0=rep.findIndex((l,i)=>i>c0&&l.startsWith('**reply to the cure request**'));
const a=rep.findIndex((l,i)=>i>r0&&l==='```text');const b=rep.findIndex((l,i)=>i>a&&l==='```');const reply=rep.slice(a+1,b).join('\n');
const fl=k=>{const l=rep.find((l,i)=>i>c0&&l.startsWith(k+': '));return l.slice(k.length+2);};
const BR={DEFENDER:['D3 vs C1','D4 vs C2','D6 vs C3'],CHALLENGER:[]};
const it6={rule:'K-G4',side:'DEFENDER',link:'D6 vs C3',line:fl('K-G4 D6 vs C3')};const it3={rule:'K-G4',side:'DEFENDER',link:'D3 vs C1',line:fl('K-G4 D3 vs C1')};
console.log('F19  28269 DeepSeek D6 vs C3 =>',show(L.cureVerdicts([it6],{ok:true,text:reply},BR,R)));
console.log('F19a 28269 DeepSeek D3 vs C1 =>',show(L.cureVerdicts([it3],{ok:true,text:reply},BR,R)));
const s6=L.cureLines(reply).short.find(s=>s.link==='D6 vs C3');const q=s6.q;
// F19b: CR3 rebuilt so the SHORT quote's text sits further before the verse: the quote's raw occurrence is moved to end at (first naming pos - 300 - q.length - 1).
const raw=R.CR3;const qa=raw.indexOf(q.slice(0,60));const nm=L.cureRefs(raw).filter(r=>r.key==='mat 1:18'||r.key==='luk 1:35').map(r=>r.pos);
console.log('F19 geometry: quote chars',q.length,'| raw quote start',qa,'| namings',JSON.stringify(nm));
console.log('F19 quote found in CR3 whole:',L.cureFound(q,R.CR3));
// F19b / F19b2: a 60-character SHORT quote cut from CR3 at the window's left edge for the first naming in the LINK block that holds it
// (lo = max(block start, naming - 300)). F19b ends two characters before lo (no overlap); F19b2 ends at the first letter at or after lo (a space at the edge is stripped by the reader,
// so the overlap is taken on a letter; corrected after the first run, see RUN_new13 notes).
{const hr=/^[ \t>*#_-]*LINK\s+\d+/gmi;const H=[];let h;while((h=hr.exec(raw)))H.push(h.index);const p0=nm.find(x=>x>7000);const a0=Math.max(...H.filter(x=>x<=p0));const lo=Math.max(a0,p0-300);
 const mk=(end)=>raw.slice(end-60,end);const esc=x=>x.replace(/"/g,'\\"');
 const rp=(qq)=>reply.split('\n').map(l=>/^SHORT: D6 vs C3 \|/.test(l)?'SHORT: D6 vs C3 | [CR3] | "'+esc(qq)+'" | the answer relabels the rows and does not meet them':l).join('\n');
 for(const [nmF,end] of [['F19b  ends before the window (no overlap)',lo-1],['F19b2 ends inside the window (its last letter is the first letter at or after lo)',(()=>{let e=lo;while(!/[A-Za-z]/.test(raw[e]))e++;return e+1;})()]]){const qq=mk(end);
  console.log(nmF+': naming',p0,'block',a0,'lo',lo,'quote',JSON.stringify(qq),'=>',show(L.cureVerdicts([it6],{ok:true,text:rp(qq)},BR,R)));}}
// 27893 F15c
const X2=JSON.parse(fs.readFileSync('fx/rounds27893.json','utf8'));const R2={CR1:X2.cr1,DR1:X2.gr1,CR2:X2.cr2,DR2:X2.gr2,CR3:X2.cr3,DR3:X2.dr3};
const row=JSON.parse(fs.readFileSync('fx/row_27893.json','utf8'));
const rl=row.independent_verdict_raw.split('\n').find(l=>l.includes('VIOLATION REPORT')&&l.includes('RULE: K-G1'));
const g=(k,n)=>{const i=rl.indexOf('; '+k+': ');const j=n?rl.indexOf('; '+n+': ',i+1):-1;return rl.slice(i+k.length+4,j>0?j:undefined);};
const unb=s=>s.replace(/\((L[1-4]|[CD]R[1-3])\)/g,'[$1]');
const r1=unb(g('STATEMENT','JUDGE STATEMENT')).split(' / ').join('\n');const it1=[{rule:'K-G1',side:'DEFENDER',link:'D6 vs C3',line:unb(g('LINE','STATEMENT'))}];
console.log('F19c.1 (F15c.1) =>',show(L.cureVerdicts(it1,{ok:true,text:r1},null,R2)));
const r2=r1.split('\n').map(l=>{const m=l.match(/^(PRESSED: .*?\| ")(.*)("$)/);return m?m[1]+m[2].replace(/"/g,'\\"')+m[3]:l;}).join('\n');
console.log('F19c.2 (F15c.2) =>',show(L.cureVerdicts(it1,{ok:true,text:r2},null,R2)));
// 27433, 7194 defect 1
const Y=JSON.parse(fs.readFileSync('fx/rounds27433.json','utf8'));const RR={CR1:Y.dr1,CR2:Y.dr2,CR3:Y.dlink,DR1:Y.cr1,DR2:Y.cr2,DR3:Y.clink};
const sent=(s)=>{const m=String(s).replace(/\s+/g,' ').match(/[A-Z][^.?!"“”*#\[\]]{40,140}[.?!]/);return m?m[0]:null;};const dq=sent(RR.DR1);
const nmB=L.cureNamed('D4 vs C2 (Luke 3:23): DEFENDER LINK BROKEN',RR.CR3);const blk=(nmB[0]||{blocks:['']}).blocks[0];
const cq=(()=>{const m=blk.match(/Luke 3:23, whole: "([^"]+)"/);return m?m[1]:null;})();const uq='I take thee, O Zerubbabel, my servant, the son of Shealtiel.';
const line='D4 vs C2 (Luke 3:23): DEFENDER LINK BROKEN — [L1] Luke 3:23 says "being (as was supposed) the son of Joseph"; [CR3] never answers.';
const item={rule:'K-G4',side:'DEFENDER',link:'D4 vs C2',line};const B={DEFENDER:['D4 vs C2'],CHALLENGER:[]};
const ua=RR.CR3.indexOf(uq.slice(0,40));const lp=L.cureRefs(RR.CR3).filter(r=>r.key==='luk 3:23').map(r=>r.pos);
console.log('F19d geometry: unrelated sentence at',ua,'length',uq.length,'| Luke 3:23 namings',JSON.stringify(lp));
const T=(name,rp,exp)=>{const v=L.cureVerdicts([item],{ok:true,text:rp},B,RR)[0];console.log('F19d '+name+' => '+v.status+' (base expectation '+exp+') | '+v.why);};
T('SHORT from the answer block',`PRESSED: D4 vs C2 | [DR1] | "${dq}"\nSHORT: D4 vs C2 | [CR3] | "${cq}" | the link round restates the register and never shows why supposed does not overturn it`,'CURED');
T('SHORT quoting the unrelated sentence (7194 defect 1)',`PRESSED: D4 vs C2 | [DR1] | "${dq}"\nSHORT: D4 vs C2 | [CR3] | "${uq}" | it falls short of the text`,'UNCURED');
T('PRESSED true, no SHORT',`PRESSED: D4 vs C2 | [DR1] | "${dq}"`,'UNCURED');
T('SHORT with a false quote',`PRESSED: D4 vs C2 | [DR1] | "${dq}"\nSHORT: D4 vs C2 | [CR3] | "nothing like this is in the link round text" | it falls short of the text`,'UNCURED');
