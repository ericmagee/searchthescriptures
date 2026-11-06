// Package A offline tests against W3's /mnt/project-files/w3/agreement_package_expectations.md (A1-A4, N1, N2). A5 moved to known limits (W3, 18:06 CST).
const fs=require('fs');const live=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).workflow;const LN={};live.nodes.forEach(n=>LN[n.name]=n.parameters&&n.parameters.jsCode||'');
const pat=n=>fs.readFileSync('patched/'+n.replace(/ /g,'_')+'.js','utf8');
const posture=src=>{const i=src.indexOf('const POSTURE=(()=>{');const j=src.indexOf('return {PART2,HEADS',i);const k=src.indexOf('})();',j);return new Function(src.slice(i,k+5)+'\nreturn POSTURE;')();};
const pick=(c,name)=>{const i=c.indexOf('function '+name+'(');const j=c.indexOf('\nfunction ',i+10);return c.slice(i,j<0?undefined:j);};
let fail=0;const ok=(id,cond,msg)=>{console.log((cond?'OK  ':'FAIL')+' '+id+' '+msg);if(!cond)fail++;};
// A1, A2 on every PART2 node
const P2=Object.keys(LN).filter(n=>LN[n].includes('const PART2="'));
for(const n of P2){const O=posture(LN[n]),P=posture(pat(n));
 if(n==='Accept Check'){const reply=k=>P.HEADS.slice(0,k).map(h=>h+' I hold to it.').join('\n')+'\n'+P.LINE;
  ok('A1',P.HEADS.length===10&&P.check(reply(9)).status==='FAULT'&&/heading 10 missing/.test(P.check(reply(9)).faults.join(';'))&&P.check(reply(10)).status==='ACCEPT',`${n}: HEADS ${P.HEADS.length}; 9-heading reply -> ${P.check(reply(9)).status} (${P.check(reply(9)).faults.join('; ')}); 10-heading reply -> ${P.check(reply(10)).status}`);
  const r10=reply(10);ok('A1b',O.check(r10.split('\n').filter(l=>!/^### Commitment 10|^Commitment 10/.test(l)).join('\n')).status==='ACCEPT','old check still accepts a 9-heading reply (baseline)');}
 ok('A2',JSON.stringify(P.HEADS.slice(0,9))===JSON.stringify(O.HEADS)&&O.HEADS.length===9,`${n}: headings 1-9 byte-identical; old ${O.HEADS.length}, new ${P.HEADS.length}`);
 ok('A2b',P.RULE_C['K-CON']===10&&P.PART2.startsWith(O.PART2),`${n}: RULE_C K-CON=10; new PART2 begins with the old PART2 byte for byte`);}
// K-CON: the patched kwLines421 + wpLines2024 + kconLines2024, from Panel Payloads
const pp=pat('Panel Payloads');const KW=new Function(pick(pp,'kwLines421')+'\n'+pick(pp,'wpLines2024')+'\n'+pick(pp,'kconLines2024')+'\nreturn kwLines421;')();
const lp=LN['Panel Payloads'];const KW0=new Function(pick(lp,'kwLines421')+'\n'+pick(lp,'wpLines2024')+'\nreturn kwLines421;')();
const R=f=>({CR1:f.cr1,DR1:f.gr1,CR2:f.cr2,DR2:f.gr2,CR3:f.cr3,DR3:f.dr3,CR4:f.cr4,DR4:f.dr4});
const f05=JSON.parse(fs.readFileSync('../fixtures/32905.json','utf8'));
for(const j of JSON.parse(fs.readFileSync('judgments/32905.json','utf8'))){const a=KW(j.verdict_raw,R(f05)),o=KW0(j.verdict_raw,R(f05));
 const kc=a.items.filter(x=>x.rule==='K-CON');ok('A3',kc.length===1,`32905 ${j.judge_seat}: K-CON misses ${kc.length}${kc[0]?' :: '+kc[0].line.slice(0,140):''}`);
 ok('N2',JSON.stringify(a.items.filter(x=>x.rule!=='K-CON'))===JSON.stringify(o.items)&&JSON.stringify(a.marks.filter(m=>!/K-CON/.test(m)))===JSON.stringify(o.marks),`32905 ${j.judge_seat}: K-W items and marks (incl. v31) unchanged`);}
const L='Matthew 1:19 shows Joseph reasoning as a man who knows the child is not his: he means to put her away privately.';
const syn={CONTRADICTION:`{"reasoning":"x\\nCONTRADICTION -- DEFENDER -- EARLIER (CR3, \\"I drop the clause that Joseph knew the child's origin before the angel spoke.\\") -- LATER (CR4, \\"${L}\\")\\ny"}`,
 'NOT HELD':`{"reasoning":"NOT HELD -- DEFENDER CR4 withdrawn in CR3 #1 -- \\"${L}\\" -- the step reads the plan, not knowledge"}`,
 'REASSERTED IN':`{"reasoning":"- REASSERTED IN CR4 \\"${L}\\""}`,
 'NONE FOUND':`{"reasoning":"CONTRADICTIONS: NONE FOUND"}`,
 'paraphrase only':`{"reasoning":"CONTRADICTION -- DEFENDER -- Joseph's knowledge came back in round four."}`};
for(const [k,t] of Object.entries(syn)){const n=KW(t,R(f05)).items.filter(x=>x.rule==='K-CON').length;const want=(k==='NONE FOUND'||k==='paraphrase only')?1:0;
 ok(k==='NONE FOUND'||k==='paraphrase only'?'A4x':'A4',n===want,`synthetic ${k}: K-CON misses ${n} (want ${want})`);}
// N1/N2 on the other fixtures with an empty judge text: no K-CON without a v31 mark; K-W unchanged
for(const id of ['32643','32677','32717','32791','32924']){const f=JSON.parse(fs.readFileSync(`../fixtures/${id}.json`,'utf8'));const a=KW('{"reasoning":"x"}',R(f)),o=KW0('{"reasoning":"x"}',R(f));
 ok('N1',a.items.filter(x=>x.rule==='K-CON').length===0&&JSON.stringify(a.items)===JSON.stringify(o.items),`${id}: K-CON 0, K-W items unchanged (${o.items.length})`);}
// ENF_STATUS
for(const n of Object.keys(LN).filter(n=>LN[n].includes('function kwLines421('))){const s=pat(n);ok('N1b',/'K-CON':'TRIAL'\}/.test(s),`${n}: ENF_STATUS has 'K-CON':'TRIAL'`);}
console.log(fail?`FAILED ${fail}`:'ALL OK');
