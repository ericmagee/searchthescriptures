// pkgRI5 part C (reader phase 2 item 5; W1, 11-08): the rest of item 5. Each read asks the shared reader first; where it reads no such form (or a
// RESTATED line), the old regex decides as before (pkgSBR rule).
//  - kcmtGrade2024 (30 nodes): on an ANSWER CHECK line, the grade word after the ANSWER field comes from the reader's grade (the old cut took the
//    segment after the last "ANSWER:", which an answer quoting "--" or "ANSWER:" moves).
//  - cureRecompute (26 nodes, scope: that function only): the RESULT word (x3: __r0421, held, r0), STANDING L (Lof), STANDING word and c (tv, tc),
//    KEYSTONE WITHDRAWN (kw), CLAUSE N and W, CONCEDED LINKS count (yc).
//  - Fix in part B's helper ri5Res2024: with no fallback regex it returned String(l).match(null), which matches the text "null"; now it returns null.
// Run from wall2024/: node pkgRI5/build_RI5C.cjs [base strip, default pkgLIB/strip_RI5B] [dest strip, default pkgLIB/strip_RI5C]
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_RI5B')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_RI5C')+'/patched/';
const PLAN='pkgRI5/plan_'+(process.argv[3]||'pkgLIB/strip_RI5C').replace(/\/$/,'').split('/').pop()+'.json';fs.rmSync(DST,{recursive:true,force:true});fs.mkdirSync(DST,{recursive:true});
const A0='function __kfM(';
const RD=String.raw`function ri5Rd2024(l){try{const r=__RL.readLine(String(l==null?'':l));return r&&r.form&&r.f&&!r.f.restated?r:null;}catch(e){return null;}}`;
const FN=String.raw`/* pkgRI5 part C (reader item 5): one reader field of a line, or null when the reader reads no such form (then the old regex decides) */
function ri5Fd2024(l,form,k){const r=ri5Rd2024(l);return r&&r.form===form&&r.f[k]!=null?r.f[k]:null;}
`;
const RESOLD=String.raw`function ri5Res2024(l,re){const r=ri5Rd2024(l);if(r&&r.form==='RESULT'&&r.f.result)return [l,r.f.result];return String(l==null?'':l).match(re);}`;
const RESNEW=String.raw`function ri5Res2024(l,re){const r=ri5Rd2024(l);if(r&&r.form==='RESULT'&&r.f.result)return [l,r.f.result];return re?String(l==null?'':l).match(re):null;} /* pkgRI5C: no regex, no match */`;
const RRE=String.raw`/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/`;
const K=[ // kcmtGrade2024
 ['ANSWER CHECK grade',String.raw`if(/^ANSWER CHECK\s*:/i.test(h)){const a=t.lastIndexOf('ANSWER:');`,String.raw`if(/^ANSWER CHECK\s*:/i.test(h)&&ri5Fd2024(l,'ANSWER CHECK','grade')!=null)t=ri5Fd2024(l,'ANSWER CHECK','grade'); /* pkgRI5C */ else if(/^ANSWER CHECK\s*:/i.test(h)){const a=t.lastIndexOf('ANSWER:');`,1]];
const C=[ // cureRecompute only
 ['RESULT word',`P.result?((P.result.u.match(${RRE})||[])[1]||null):null`,`P.result?((ri5Res2024(P.result.raw,null)||P.result.u.match(${RRE})||[])[1]||null):null`,3],
 ['STANDING L',String.raw`const Lof=k=>{const x=P.st[k];const m=x&&x.u.match(/\bL\s*=\s*(\d+)/);return m?+m[1]:null;};`,String.raw`const Lof=k=>{const x=P.st[k];const __l5=x?ri5Fd2024(x.raw,'STANDING','L'):null;if(__l5!=null)return __l5;const m=x&&x.u.match(/\bL\s*=\s*(\d+)/);return m?+m[1]:null;}; /* pkgRI5C */`,1],
 ['KEYSTONE WITHDRAWN',String.raw`const kw=!!(P.key&&/^KEYSTONE\s*:\s*D\d+\s*(?:--|—|-|:)\s*WITHDRAWN\b/.test(P.key.u));`,String.raw`const kw=!!(P.key&&(ri5Fd2024(P.key.raw,'KEYSTONE','grade')!=null?ri5Fd2024(P.key.raw,'KEYSTONE','grade')==='WITHDRAWN':/^KEYSTONE\s*:\s*D\d+\s*(?:--|—|-|:)\s*WITHDRAWN\b/.test(P.key.u))); /* pkgRI5C */`,1],
 ['STANDING word and c',String.raw`const tv=x?(x.u.match(/STANDING\s*:\s*([A-Z-]+)/)||[])[1]:null,tc=x?(x.u.match(/\bC\s*=\s*(\d+)/)||[])[1]:null;`,String.raw`const tv=x?(ri5Fd2024(x.raw,'STANDING','standing')||(x.u.match(/STANDING\s*:\s*([A-Z-]+)/)||[])[1]):null,tc=x?(ri5Fd2024(x.raw,'STANDING','c')!=null?ri5Fd2024(x.raw,'STANDING','c'):(x.u.match(/\bC\s*=\s*(\d+)/)||[])[1]):null; /* pkgRI5C */`,1],
 ['CLAUSE N and W',String.raw`const nN=(cl.match(/\bN\s*=\s*(\d+)/)||[])[1];const wN=(cl.match(/\bW\s*=\s*(\d+)/)||[])[1];`,String.raw`const nN=(P.clause&&ri5Fd2024(P.clause.raw,'CLAUSE','n')!=null)?ri5Fd2024(P.clause.raw,'CLAUSE','n'):(cl.match(/\bN\s*=\s*(\d+)/)||[])[1];const wN=(P.clause&&ri5Fd2024(P.clause.raw,'CLAUSE','w')!=null)?ri5Fd2024(P.clause.raw,'CLAUSE','w'):(cl.match(/\bW\s*=\s*(\d+)/)||[])[1]; /* pkgRI5C */`,1],
 ['CONCEDED count',String.raw`const yc=y?(y.u.match(/^(?:CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:\s*(\d+)/)||[])[1]:null;`,String.raw`const yc=y?(ri5Fd2024(y.raw,'CONCEDED','n')!=null?ri5Fd2024(y.raw,'CONCEDED','n'):(y.u.match(/^(?:CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:\s*(\d+)/)||[])[1]):null; /* pkgRI5C */`,1]];
const fnBody=(s,name)=>{const i=s.indexOf('function '+name+'(');if(i<0)return null;const j=s.indexOf('\nfunction ',i+10);return [i,j<0?s.length:j];};
const plan={base:SRC,nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;const hits=[];
 for(const [name,R] of [['kcmtGrade2024',K],['cureRecompute',C]]){const b=fnBody(s,name);if(!b)continue;let body=s.slice(b[0],b[1]);
  for(const [k,a,r,want] of R){const n=body.split(a).length-1;if(n!==want)throw new Error(f+' '+name+' '+k+' anchor x'+n);body=body.split(a).join(r);hits.push(k);}
  s=s.slice(0,b[0])+body+s.slice(b[1]);}
 if(hits.length){if(s.split(RESOLD).length===2)s=s.replace(RESOLD,()=>RESNEW);if(s.split(A0).length!==2)throw new Error(f+' A0');
  s=s.replace(A0,()=>(s.includes('function ri5Rd2024(')?'':RD+'\n')+FN+A0);new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.nodes[f]={base:h(s0),patched:h(s),anchors:hits};}
 fs.writeFileSync(DST+f,s);}
const tally={};for(const v of Object.values(plan.nodes))for(const k of v.anchors)tally[k]=(tally[k]||0)+1;plan.tally=tally;
fs.writeFileSync(PLAN,JSON.stringify(plan,null,1));console.log(Object.keys(plan.nodes).length+' nodes patched;',JSON.stringify(tally));
