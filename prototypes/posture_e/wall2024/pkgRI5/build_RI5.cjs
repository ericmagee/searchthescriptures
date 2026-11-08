// pkgRI5 part A (reader phase 2 item 5, RESTATED / RETRACTED / RESULT / COLLISION; W3 order; W1, 11-08): the line-LABEL reads ask the shared
// reader first; where it reads no form (or a RESTATED one, for the labels), the old regex decides as before (pkgSBR/pkgSBX rule).
//  - sbLabel0 (gate apply, 10 nodes): pair / KEYSTONE / CONCEDED LINKS / CHALLENGER CONCEDED LINKS / DEFENSE|CHALLENGE STANDING / CLAUSE.
//  - lab (superseded-line audit, 26 nodes): the same labels plus RESULT.
//  - krulRestated (22 nodes): the pair of a RESTATED collision line in the cure reply.
// Part B (not here): sbApply2024's RESULT / RETRACTED / FORCED-pair / KEYSTONE / count field reads, kcmtGrade2024 and cureRecompute.
// Run from wall2024/: node pkgRI5/build_RI5.cjs [base strip, default pkgLIB/strip_RI4] [dest strip, default pkgLIB/strip_RI5]
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_RI4')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_RI5')+'/patched/';
const PLAN='pkgRI5/plan_'+(process.argv[3]||'pkgLIB/strip_RI5').replace(/\/$/,'').split('/').pop()+'.json';fs.rmSync(DST,{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});
const A0='function __kfM(';
const FN=String.raw`/* pkgRI5 (reader item 5): a line's label from the reader (null: no form, a RESTATED line, or a form with no label here); the old regex decides on null */
function ri5Lab2024(l,res){let r=null;try{r=__RL.readLine(String(l==null?'':l));}catch(e){r=null;}if(!r||!r.form||!r.f||r.f.restated)return null;const f=r.f;
 if(r.form==='COLLISION'&&f.pair)return f.pair.replace(/\s+vs\.?\s+/i,' VS ').toUpperCase();if(r.form==='KEYSTONE')return 'KEYSTONE';if(r.form==='CLAUSE')return 'CLAUSE';
 if(r.form==='CONCEDED'&&f.side)return f.side==='CHALLENGER'?'CHALLENGER CONCEDED LINKS':'CONCEDED LINKS';if(r.form==='STANDING'&&f.side)return f.side+' STANDING';if(res&&r.form==='RESULT')return 'RESULT';return null;}
function ri5Restated2024(l){let r=null;try{r=__RL.readLine(String(l==null?'':l));}catch(e){r=null;}return r&&r.form==='COLLISION'&&r.f&&r.f.restated&&/^D\d+\s+vs\.?\s+C\d+$/i.test(String(r.f.pair||''))?r.f.pair.match(/^(D\d+)\s+vs\.?\s+(C\d+)$/i):null;}
`;
const R=[
 ['sbLabel0',String.raw`function sbLabel0(l){const u=`,String.raw`function sbLabel0(l){{const __r=ri5Lab2024(l,false);if(__r)return __r;} /* pkgRI5 */const u=`,1],
 ['lab',String.raw`const lab=l=>{const u=rcOne(l)`,String.raw`const lab=l=>{{const __r=ri5Lab2024(rcOne(l),true);if(__r)return __r;} /* pkgRI5 */const u=rcOne(l)`,1],
 ['krulRestated',String.raw`const m=l.replace(/[*`+'`'+String.raw`]+/g,'').match(/^\s*(?:[-•]\s*)?RESTATED\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/i);if(!m)continue;`,
  String.raw`const m=ri5Restated2024(l)||l.replace(/[*`+'`'+String.raw`]+/g,'').match(/^\s*(?:[-•]\s*)?RESTATED\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/i);if(!m)continue; /* pkgRI5 */`,1]];
const plan={base:SRC,nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;const hits=[];
 for(const [k,a,b,want] of R){const n=s.split(a).length-1;if(!n)continue;if(n!==want)throw new Error(f+' '+k+' anchor x'+n);s=s.split(a).join(b);hits.push(k);}
 if(hits.length){if(s0.split(A0).length!==2)throw new Error(f+' A0');s=s.replace(A0,()=>FN+A0);new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.nodes[f]={base:h(s0),patched:h(s),anchors:hits};}
 fs.writeFileSync(DST+f,s);}
const tally={};for(const v of Object.values(plan.nodes))for(const k of v.anchors)tally[k]=(tally[k]||0)+1;plan.tally=tally;
fs.writeFileSync(PLAN,JSON.stringify(plan,null,1));console.log(Object.keys(plan.nodes).length+' nodes patched;',JSON.stringify(tally));
