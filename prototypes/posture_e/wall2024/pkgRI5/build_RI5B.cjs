// pkgRI5 part B (reader phase 2 item 5; W1, 11-08): the field reads inside sbApply2024 (the gate/send-back apply step, 10 library nodes) ask
// the shared reader first; where it reads no such form (or a RESTATED line), the old regex decides as before (pkgSBR rule).
//  - RESULT: the "is the change a RESULT line" test, the judge's RESULT word (rw) and the text's RESULT word (res0; the same read in cureRecompute is swapped too).
//  - RETRACTED: the pair of "RETRACTED: Dn vs Cm" (reader pair only when the reader finds no reason after it, as the old regex required).
//  - FORCED pair of the flagged line (__fo, __pf) and the pair/FORCED tests of the collision-change check (pOf, FR).
//  - CHAIN MARK side of the change and the flagged line (ct, co).
//  - KEYSTONE link and grade (keyChecks m, km).
// Not here: kcmtGrade2024 and cureRecompute (part C).
// Run from wall2024/: node pkgRI5/build_RI5B.cjs [base strip, default pkgLIB/strip_RI5] [dest strip, default pkgLIB/strip_RI5B]
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_RI5')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_RI5B')+'/patched/';
const PLAN='pkgRI5/plan_'+(process.argv[3]||'pkgLIB/strip_RI5B').replace(/\/$/,'').split('/').pop()+'.json';fs.rmSync(DST,{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});
const A0='function __kfM(';
const FN=String.raw`/* pkgRI5 part B (reader item 5): reader-first field reads for sbApply2024; each returns the old regex's match shape, or the old regex's own result when the reader reads no such form */
function ri5Rd2024(l){try{const r=__RL.readLine(String(l==null?'':l));return r&&r.form&&r.f&&!r.f.restated?r:null;}catch(e){return null;}}
function ri5Res2024(l,re){const r=ri5Rd2024(l);if(r&&r.form==='RESULT'&&r.f.result)return [l,r.f.result];return String(l==null?'':l).match(re);}
function ri5IsRes2024(l,re){const r=ri5Rd2024(l);return (r&&r.form==='RESULT')||re.test(l);}
function ri5Rt2024(l,re){const r=ri5Rd2024(l);if(r&&r.form==='RETRACTED'&&r.f.pair&&!r.f.reason){const p=String(r.f.pair).match(/^(D\d+)\s+vs\.?\s+(C\d+)$/i);if(p)return p;}return String(l==null?'':l).match(re);}
function ri5Pair2024(l,re,forms){const r=ri5Rd2024(l);if(r&&forms.includes(r.form)&&r.f.pair){const p=String(r.f.pair).match(/^(D\d+)\s+vs\.?\s+(C\d+)$/i);if(p)return p;}return String(l==null?'':l).match(re);}
function ri5Cm2024(l,re){const r=ri5Rd2024(l);if(r&&r.form==='CHAIN MARK'&&r.f.side)return [l,r.f.side];return String(l==null?'':l).match(re);}
function ri5Key2024(raw,u,re,grades){const r=ri5Rd2024(raw);if(r&&r.form==='KEYSTONE'&&r.f.link&&grades.includes(r.f.grade))return [raw,r.f.link,r.f.grade];return String(u==null?'':u).match(re);}
`;
const R=[
 ['RESULT test',String.raw`if(/^RESULT\s*:/i.test(to)){resTo={sid:x.sid,to};continue;}`,String.raw`if(ri5IsRes2024(to,/^RESULT\s*:/i)){resTo={sid:x.sid,to};continue;} /* pkgRI5B */`,1],
 ['RETRACTED pair',String.raw`const __rt=nrm(to).match(/^RETRACTED\s*:\s*(D\d+)\s+VS\.?\s+(C\d+)\s*\.?$/i);`,String.raw`const __rt=ri5Rt2024(nrm(to),/^RETRACTED\s*:\s*(D\d+)\s+VS\.?\s+(C\d+)\s*\.?$/i); /* pkgRI5B */`,2],
 ['FORCED pair __fo',String.raw`const __fo=nrm(map.has(o)?map.get(o).to:o).match(/^\s*(?:[-\u2022]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*(D\d+)\s+VS\.?\s+(C\d+)\b/i);`,
  String.raw`const __fo=ri5Pair2024(nrm(map.has(o)?map.get(o).to:o),/^\s*(?:[-\u2022]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*(D\d+)\s+VS\.?\s+(C\d+)\b/i,['FORCED']); /* pkgRI5B */`,1],
 ['FORCED pair __pf',String.raw`const __pf=l=>{const m=nrm(l).match(__FO);return m?(m[1]+' VS '+m[2]).toUpperCase():null;};`,String.raw`const __pf=l=>{const m=ri5Pair2024(nrm(l),__FO,['FORCED']);return m?(m[1]+' VS '+m[2]).toUpperCase():null;};`,1],
 ['CHAIN MARK side',String.raw`const ct=nrm(to).match(CM),co=nrm(o).match(CM);`,String.raw`const ct=ri5Cm2024(nrm(to),CM),co=ri5Cm2024(nrm(o),CM); /* pkgRI5B */`,1],
 ['pair pOf',String.raw`const pOf=l=>{const m=nrm(l).match(PR);return m?(m[1]+' VS '+m[2]).toUpperCase():null;};`,String.raw`const pOf=l=>{const m=ri5Pair2024(nrm(l),PR,['FORCED','COLLISION']);return m?(m[1]+' VS '+m[2]).toUpperCase():null;}; /* pkgRI5B */`,1],
 ['FORCED test FR',String.raw`const ok=tp===pk&&(FR.test(nrm(to))?FR.test(nrm(o)):GR.test(to));`,String.raw`const ok=tp===pk&&(ri4IsF2024(nrm(to),FR)?ri4IsF2024(nrm(o),FR):GR.test(to)); /* pkgRI5B */`,1],
 ['KEYSTONE keyChecks',String.raw`const m=P.key.u.match(/^KEYSTONE\s*:\s*(D\d+)\s*(?:--|—|-|:)?\s*(STANDS|BROKEN|WITHDRAWN)\b/);`,String.raw`const m=ri5Key2024(P.key.raw,P.key.u,/^KEYSTONE\s*:\s*(D\d+)\s*(?:--|—|-|:)?\s*(STANDS|BROKEN|WITHDRAWN)\b/,['STANDS','BROKEN','WITHDRAWN']); /* pkgRI5B */`,1],
 ['KEYSTONE km',String.raw`const km=P0.key?P0.key.u.match(/^KEYSTONE\s*:\s*(D\d+)\s*(?:--|\u2014|-|:)?\s*(STANDS|BROKEN)\b/):null;`,String.raw`const km=P0.key?ri5Key2024(P0.key.raw,P0.key.u,/^KEYSTONE\s*:\s*(D\d+)\s*(?:--|\u2014|-|:)?\s*(STANDS|BROKEN)\b/,['STANDS','BROKEN']):null; /* pkgRI5B */`,1],
 ['RESULT res0',String.raw`const res0=P.result?((P.result.u.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null;`,String.raw`const res0=P.result?((ri5Res2024(P.result.raw,null)||P.result.u.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null; /* pkgRI5B */`,0],
 ['RESULT rw',String.raw`const rw=(U(resTo.to).match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null;`,String.raw`const rw=(ri5Res2024(resTo.to,null)||U(resTo.to).match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null; /* pkgRI5B */`,1]];
const plan={base:SRC,nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;const hits=[];
 for(const [k,a,b,want] of R){const n=s.split(a).length-1;if(!n)continue;if(want&&n!==want)throw new Error(f+' '+k+' anchor x'+n);s=s.split(a).join(b);hits.push(k);}
 if(hits.length){const core=hits.filter(k=>k!=='RESULT res0');if(core.length&&core.length!==R.length-1)throw new Error(f+' partial: '+hits.join(','));if(s0.split(A0).length!==2)throw new Error(f+' A0');s=s.replace(A0,()=>FN+A0);new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.nodes[f]={base:h(s0),patched:h(s),anchors:hits};}
 fs.writeFileSync(DST+f,s);}
const tally={};for(const v of Object.values(plan.nodes))for(const k of v.anchors)tally[k]=(tally[k]||0)+1;plan.tally=tally;
fs.writeFileSync(PLAN,JSON.stringify(plan,null,1));console.log(Object.keys(plan.nodes).length+' nodes patched;',JSON.stringify(tally));
