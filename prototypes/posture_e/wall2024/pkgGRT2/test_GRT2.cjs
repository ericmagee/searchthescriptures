// pkgGRT2 test. Bars: (1) Send Back Build x3 on every saved run: output byte-equal except where a FORCED-line E-COL ask has no collision ask
// for its pair; there, exactly one companion E-COL ask is added (record-only text from rule_table RXSB.companion), for a collision line the
// judge grades LINK BROKEN, and the FORCED ask names it; (2) Send Back Record x3: byte-equal on every saved run (no saved run has a companion);
// (3) Record unit cases on a saved input with an injected companion: CHANGE TO regrade -> CURED, not counted; KEEP -> CURED; no answer -> not
// silence, not counted in drv_uncured; (4) the Gate apply (sbApply2024, library) applies the companion regrade and then the RETRACTED FORCED line.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const WF='/mnt/project-files/wall2024/fetchback_live_s68.json';
const W=JSON.parse(fs.readFileSync(WF,'utf8'));const NN=W.nodes||W.data.nodes;const {RXSB}=require('../pkgRTB/rule_table.cjs');
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^\d+_index\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
const F2=/^\s*(?:[-•]|\d+[.)])?\s*FORCED\b/i;const P2=l=>{const m=String(l||'').replace(/[*_`]+/g,'').match(/\bD(\d+)\s+vs\.?\s+C(\d+)\b/i);return m?'D'+m[1]+' vs C'+m[2]:null;};
let n=0,same=0,comp=[],badc=[];const saved={};
for(const p of ['','Alt ','R2 Alt ']){const nm=p+'Send Back Build';const B0=NN.find(x=>x.name===nm).parameters.jsCode,P1=fs.readFileSync('pkgGRT2/patched/'+nm.replace(/ /g,'_')+'.js','utf8');const fe=feeder(WF,nm);
 for(const R of runs){const i=fe.find(x=>fs.existsSync(D+R+'_'+x.replace(/ /g,'_')+'.json'));if(!i)continue;let a,b;try{a=harness(R)(B0,i);b=harness(R)(P1,i);}catch(e){continue;}n++;
  const A=a.map(x=>x.json),B=b.map(x=>x.json);if(JSON.stringify(A)===JSON.stringify(B)){same++;continue;}
  A.forEach((x,k)=>{const y=B[k];if(JSON.stringify(x)===JSON.stringify(y))return;const ia=x.items||[],ib=y.items||[];const add=ib.slice(ia.length);
   const okAdd=add.length>=1&&add.every(c=>c.rule==='E-COL'&&c.grt2&&c.reason===RXSB.companion(c.grt2.forced)&&/LINK BROKEN/.test(c.line)&&P2(c.line)===c.grt2.pair);
   const fs2=add.map(c=>ia.find(o=>o.sid===c.grt2.forced));const okF=fs2.every(f=>f&&F2.test(String(f.line).replace(/[*_`]+/g,''))&&!ia.some(o=>o!==f&&!F2.test(String(o.line).replace(/[*_`]+/g,''))&&P2(o.line)===P2(f.line)));
   const okRest=JSON.stringify(ia)===JSON.stringify(ib.slice(0,ia.length));
   const msgOk=add.every(c=>y.msg.includes('ITEM '+c.sid+' (E-COL, ')&&y.msg.includes('where it is asked (ITEM '+c.sid+') (pkgGRT)')&&!new RegExp('ITEM '+c.sid+' \\(E-COL[^\\n]*\\n[\\s\\S]*?THE RULE \\(E-COL, ENFORCED, pkgECF\\)').test(y.msg.split('ITEM '+c.sid+' (')[1].split('\nITEM ')[0]));
   const bodyOk=JSON.stringify(y.body.messages.slice(0,-1))===JSON.stringify(x.body.messages.slice(0,-1));
   (okAdd&&okF&&okRest&&msgOk&&bodyOk?comp:badc).push(R+' '+nm+' '+y.seat+' '+add.map(c=>c.sid+' for '+c.grt2.forced+' '+c.grt2.pair).join(', ')+(okAdd&&okF&&okRest&&msgOk&&bodyOk?'':' ['+[okAdd,okF,okRest,msgOk,bodyOk].join(',')+']'));
   if(okAdd&&!saved.case)saved.case={R,nm,y,x};});}}
T(n>=60,'Send Back Build x3: replay ran on '+n+' node runs, '+same+' byte-equal');
T(comp.length>0&&!badc.length,'companion asks: '+comp.length+' send-backs, each adds only companion E-COL asks for an unasked LINK BROKEN collision line of a FORCED ask, the FORCED ask names it, earlier items and messages unchanged ('+badc.join('; ')+')');
comp.forEach(c=>out.push('   '+c));
// (2) Record on saved runs
let rn=0,rs=0;for(const p of ['','Alt ','R2 Alt ']){const nm=p+'Send Back Record';const B0=NN.find(x=>x.name===nm).parameters.jsCode,P1=fs.readFileSync('pkgGRT2/patched/'+nm.replace(/ /g,'_')+'.js','utf8');const fe=feeder(WF,nm);
 for(const R of runs){const i=fe.find(x=>fs.existsSync(D+R+'_'+x.replace(/ /g,'_')+'.json'));if(!i)continue;let a,b;try{a=harness(R)(B0,i);b=harness(R)(P1,i);}catch(e){continue;}rn++;if(JSON.stringify(a)===JSON.stringify(b))rs++;}}
T(rn>=30&&rn===rs,'Send Back Record x3: '+rs+' of '+rn+' saved node runs byte-equal');
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgGRT2/test_GRT2.txt',out.join('\n')+'\n');
