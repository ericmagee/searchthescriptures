// pkgRI6 (reader phase 2 item 6, KEYSTONE; W1, 11-08): KEYSTONE reads ask the shared reader first; where it reads no such form (or a RESTATED line,
// or a value the old regex could not return), the old regex decides as before (pkgSBR rule). keyChecks was done in pkgRI5 part B.
//  - sbBrokenWord2024: CLAUSE N and W, KEYSTONE WITHDRAWN (the same reads pkgRI5C swapped in cureRecompute).
//  - kkLines: the KEYSTONE line and its reason.
//  - krulRulings: the KEYSTONE link (km), the graded collision line (pair + DEFENDER/CHALLENGER LINK BROKEN or WITHDRAWN), the RESTATED pair.
// Reader item 7 (CHAIN MARK) rides here: netLines' "CHAIN MARK: FOOTED" skip reads the reader's CHAIN MARK mark. k2Marks and postureBlock name
// CHAIN MARK only in section-end label lists (where a block stops), not as a line read, so they stay (inventory.md: "also a section-label list").
// Run from wall2024/: node pkgRI6/build_RI6.cjs [base strip, default pkgLIB/strip_RI5C] [dest strip, default pkgLIB/strip_RI6]
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_RI5C')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_RI6')+'/patched/';
const PLAN='pkgRI6/plan_'+(process.argv[3]||'pkgLIB/strip_RI6').replace(/\/$/,'').split('/').pop()+'.json';fs.rmSync(DST,{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});
const A0='function __kfM(';
const FN=String.raw`/* pkgRI6 (reader item 6, KEYSTONE): reader-first reads; each returns the old regex's match shape, or the old regex's result when the reader reads no such form */
function ri6Kk2024(l,re){const r=ri5Rd2024(l);if(r&&r.form==='KEYSTONE'&&r.f.link&&['STANDS','BROKEN','WITHDRAWN'].includes(r.f.grade))return [l,String(r.f.link).replace(/^D/i,''),r.f.grade,r.f.reason||''];return String(l==null?'':l).match(re);}
function ri6Col2024(l,re,grades){const r=ri5Rd2024(l);if(r&&r.form==='COLLISION'&&r.f.pair&&grades.includes(r.f.grade)){const p=String(r.f.pair).match(/^(D\d+)\s+vs\.?\s+(C\d+)$/i);if(p)return [l,p[1],p[2],r.f.grade];}return String(l==null?'':l).match(re);}
function ri6Rs2024(l,re){try{const r=__RL.readLine(String(l==null?'':l));if(r&&r.form==='COLLISION'&&r.f&&r.f.restated&&r.f.pair){const p=String(r.f.pair).match(/^(D\d+)\s+vs\.?\s+(C\d+)$/i);if(p)return p;}}catch(e){}return String(l==null?'':l).match(re);}
`;
const R={
 sbBrokenWord2024:[
  ['CLAUSE N and W',String.raw`const nN=(cl.match(/\bN\s*=\s*(\d+)/)||[])[1];const wN=(cl.match(/\bW\s*=\s*(\d+)/)||[])[1];`,String.raw`const nN=(P.clause&&ri5Fd2024(P.clause.raw,'CLAUSE','n')!=null)?ri5Fd2024(P.clause.raw,'CLAUSE','n'):(cl.match(/\bN\s*=\s*(\d+)/)||[])[1];const wN=(P.clause&&ri5Fd2024(P.clause.raw,'CLAUSE','w')!=null)?ri5Fd2024(P.clause.raw,'CLAUSE','w'):(cl.match(/\bW\s*=\s*(\d+)/)||[])[1]; /* pkgRI6 */`],
  ['KEYSTONE WITHDRAWN',String.raw`const kw=!!(P.key&&/^KEYSTONE\s*:\s*D\d+\s*(?:--|—|-|:)\s*WITHDRAWN\b/.test(P.key.u));`,String.raw`const kw=!!(P.key&&(ri5Fd2024(P.key.raw,'KEYSTONE','grade')!=null?ri5Fd2024(P.key.raw,'KEYSTONE','grade')==='WITHDRAWN':/^KEYSTONE\s*:\s*D\d+\s*(?:--|—|-|:)\s*WITHDRAWN\b/.test(P.key.u))); /* pkgRI6 */`]],
 kkLines:[
  ['KEYSTONE line',String.raw`const m=line.match(/^KEYSTONE\s*:\s*D(\d+)\s*(?:--|—|-|:)\s*(STANDS|BROKEN|WITHDRAWN)\b\s*(?:--|—|-|:)?\s*(.*)$/i);`,String.raw`const m=ri6Kk2024(line,/^KEYSTONE\s*:\s*D(\d+)\s*(?:--|—|-|:)\s*(STANDS|BROKEN|WITHDRAWN)\b\s*(?:--|—|-|:)?\s*(.*)$/i); /* pkgRI6 */`]],
 netLines:[
  ['CHAIN MARK FOOTED',String.raw`if(!item||NET_SKIP.test(u)||/^(?:DEFENDER|CHALLENGER) CHAIN MARK\s*:\s*FOOTED\b/.test(u))continue;`,String.raw`if(!item||NET_SKIP.test(u)||(ri5Fd2024(line,'CHAIN MARK','mark')!=null?ri5Fd2024(line,'CHAIN MARK','mark')==='FOOTED':/^(?:DEFENDER|CHALLENGER) CHAIN MARK\s*:\s*FOOTED\b/.test(u)))continue; /* pkgRI6 item 7 */`]],
 krulRulings:[
  ['KEYSTONE link',String.raw`const km=kl.match(/KEYSTONE\s*:\s*\**\s*(D\d+)\b/i);`,String.raw`const km=ri5Fd2024(kl,'KEYSTONE','link')!=null?[kl,ri5Fd2024(kl,'KEYSTONE','link')]:kl.match(/KEYSTONE\s*:\s*\**\s*(D\d+)\b/i); /* pkgRI6 */`],
  ['graded collision',String.raw`let m=l.match(/^\s*(?:[-•*]\s*|\d+[.)]\s*)?\**(D\d+)\s+vs\.?\s+(C\d+)\b(?:\s*\([^)\n]*\))?[^:\n(]*:\s*\**(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|WITHDRAWN)\b/);`,String.raw`let m=ri6Col2024(l,/^\s*(?:[-•*]\s*|\d+[.)]\s*)?\**(D\d+)\s+vs\.?\s+(C\d+)\b(?:\s*\([^)\n]*\))?[^:\n(]*:\s*\**(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|WITHDRAWN)\b/,['DEFENDER LINK BROKEN','CHALLENGER LINK BROKEN','WITHDRAWN']); /* pkgRI6 */`],
  ['RESTATED pair',String.raw`m=l.match(/^\s*(?:[-•*]\s*)?RESTATED\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/);`,String.raw`m=ri6Rs2024(l,/^\s*(?:[-•*]\s*)?RESTATED\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/); /* pkgRI6 */`]]};
const fnBody=(s,name)=>{const i=s.indexOf('function '+name+'(');if(i<0)return null;const j=s.indexOf('\nfunction ',i+10);return [i,j<0?s.length:j];};
const plan={base:SRC,nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;const hits=[];
 for(const name of Object.keys(R)){const b=fnBody(s,name);if(!b)continue;let body=s.slice(b[0],b[1]);
  for(const [k,a,r] of R[name]){const n=body.split(a).length-1;if(n!==1)throw new Error(f+' '+name+' '+k+' anchor x'+n);body=body.replace(a,()=>r);hits.push(name+': '+k);}
  s=s.slice(0,b[0])+body+s.slice(b[1]);}
 if(hits.length){if(!s.includes('function ri5Fd2024('))throw new Error(f+' lacks ri5Fd2024 (build on strip_RI5C)');if(s.split(A0).length!==2)throw new Error(f+' A0');
  s=s.replace(A0,()=>FN+A0);new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.nodes[f]={base:h(s0),patched:h(s),anchors:hits};}
 fs.writeFileSync(DST+f,s);}
const tally={};for(const v of Object.values(plan.nodes))for(const k of v.anchors)tally[k]=(tally[k]||0)+1;plan.tally=tally;
fs.writeFileSync(PLAN,JSON.stringify(plan,null,1));console.log(Object.keys(plan.nodes).length+' nodes patched;',JSON.stringify(tally));
