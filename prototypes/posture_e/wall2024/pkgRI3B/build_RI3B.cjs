// pkgRI3 part B (reader phase 2 item 3, W3 order; W1, 11-08): the remaining CONCEDED LINKS / STANDING form reads in the 22 library nodes ask
// the shared reader first; where it reads no such form (or reads it RESTATED), the old regex decides as before (pkgSBR/pkgSBX rule).
//  - psGrades (21 nodes): the count-line head (side and count) from the reader; the grade clauses after it keep their own parse (the reader's
//    CONCEDED entries read only "premise N STATE" and would drop the prose grades psGrades reads).
//  - drvCountLine (3): the side's count line, line by line, reader first (as pkgRI3 part A's lineOf).
//  - drvBroken (3): DEFENSE / CHALLENGE STANDING "L = n", reader STANDING form first.
//  - gateCure2024 (6): the K-G1 "CHALLENGER CONCEDED LINKS: >=1" test and the count it prints.
//  - NOT block: in Extract Independent Verdict and Alternate Merge it sits in the pkgCSP wrapper (__CSP), outside the scope that holds
//    __RL and ri3Count2024 (a first build failed there with "ri3Count2024 is not defined"); it moves with part C.
// Not here (part C): charges and the block copies in the 4 Send Back nodes (outside the library).
// Run from wall2024/: node pkgRI3B/build_RI3B.cjs [base strip] [dest strip] [plan]
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_RI3')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_RI3B')+'/patched/',PLAN=process.argv[4]||((process.argv[3]&&!/strip_RI3B\/?$/.test(process.argv[3]))?'pkgRI3B/plan_'+process.argv[3].replace(/\/$/,'').split('/').pop()+'.json':'pkgRI3B/plan_RI3B.json'); /* a stacked build never overwrites the part B plan (W2 3234) */fs.mkdirSync(DST,{recursive:true});
const A0='function ciCountSection(';
const FN=String.raw`/* pkgRI3 part B: the reader's CONCEDED head {side,n} (null: no CONCEDED form, or RESTATED); the first line giving the side's STANDING L (reader STANDING first, else the old one-line regex) */
function ri3Head2024(l){try{const r=__RL.readLine(String(l==null?'':l));if(r&&r.form==='CONCEDED'&&r.f&&!r.f.restated&&(r.f.side==='DEFENDER'||r.f.side==='CHALLENGER'))return {side:r.f.side,n:r.f.n};}catch(e){}return null;}
function ri3StandL2024(T,side,re){for(const l of String(T==null?'':T).split('\n')){let r=null;try{r=__RL.readLine(l);}catch(e){r=null;}
 if(r&&r.form==='STANDING'&&r.f&&!r.f.restated){if(r.f.side===side&&r.f.L!=null)return [l,String(r.f.L)];continue;}const m=l.match(re);if(m)return m;}return null;}
`;
const R=[
 ['psGrades head',String.raw`const m=t.match(/^\s*(?:[-•]\s*|\d+[.)]\s*)?(DEFENDER\s+|CHALLENGER\s+)?CONCEDED LINKS\s*:\s*(\d+)?\s*(?:--|—|–)?/i);if(!m)return null;t=t.slice(m[0].length);`,
  String.raw`const __h=ri3Head2024(t);const m=t.match(/^\s*(?:[-•]\s*|\d+[.)]\s*)?(DEFENDER\s+|CHALLENGER\s+)?CONCEDED LINKS\s*:\s*(\d+)?\s*(?:--|—|–)?/i);if(!m&&!__h)return null;t=m?t.slice(m[0].length):t.replace(/^.*?CONCEDED LINKS\s*:\s*(\d+)?\s*(?:--|—|–)?/i,''); /* pkgRI3B */`],
 ['psGrades return',String.raw` return {side:m[1]&&/^CHALLENGER/i.test(m[1])?'CHALLENGER':'DEFENDER',n:m[2]!=null?+m[2]:null,g};}`,
  String.raw` return {side:__h?__h.side:(m[1]&&/^CHALLENGER/i.test(m[1])?'CHALLENGER':'DEFENDER'),n:__h?__h.n:(m[2]!=null?+m[2]:null),g};} /* pkgRI3B */`],
 ['drvCountLine',String.raw`const drvCountLine=(T,side)=>{const m=T.match(side==='DEFENDER'?/^[ \t>#-]*CONCEDED LINKS[ \t]*:.*$/im:/^[ \t>#-]*CHALLENGER CONCEDED LINKS[ \t]*:.*$/im);return m?m[0]:null;};`,
  String.raw`const drvCountLine=(T,side)=>{const re=side==='DEFENDER'?/^[ \t>#-]*CONCEDED LINKS[ \t]*:.*/i:/^[ \t>#-]*CHALLENGER CONCEDED LINKS[ \t]*:.*/i;for(const l of String(T).split('\n')){const rr=ri3Count2024(l,side);if(rr===null?re.test(l):rr)return rr===null?l.match(re)[0]:l.match(/^.*/)[0];}return null;}; /* pkgRI3B */`],
 ['drvBroken DEFENSE L',String.raw`const lm=T.match(/^[ \t>#-]*DEFENSE STANDING[ \t]*:[^\n]*?\bL\s*=\s*(\d+)/im);`,String.raw`const lm=ri3StandL2024(T,'DEFENSE',/^[ \t>#-]*DEFENSE STANDING[ \t]*:[^\n]*?\bL\s*=\s*(\d+)/i); /* pkgRI3B */`],
 ['drvBroken CHALLENGE L',String.raw`const cm=T.match(/^[ \t>#-]*CHALLENGE STANDING[ \t]*:[^\n]*?\bL\s*=\s*(\d+)/im);`,String.raw`const cm=ri3StandL2024(T,'CHALLENGE',/^[ \t>#-]*CHALLENGE STANDING[ \t]*:[^\n]*?\bL\s*=\s*(\d+)/i); /* pkgRI3B */`],
 ['gateCure2024 K-G1 test',String.raw`/^(?:[-•]|\d+[.)])?\s*CHALLENGER CONCEDED LINKS\s*:\s*[1-9]/i.test(String(a.to||'').replace(/\\+/g,'').replace(/[*_\x60"“”]+/g,'').trim())`,
  String.raw`(__c=>{const __h=ri3Head2024(__c);return __h?(__h.side==='CHALLENGER'&&__h.n>=1):/^(?:[-•]|\d+[.)])?\s*CHALLENGER CONCEDED LINKS\s*:\s*[1-9]/i.test(__c);})(String(a.to||'').replace(/\\+/g,'').replace(/[*_\x60"“”]+/g,'').trim()) /* pkgRI3B */`],
 ['gateCure2024 count printed',String.raw`((String(a.to).match(/CONCEDED LINKS\s*:\s*(\d+)/i)||[])[1])`,
  String.raw`((__h=>__h?String(__h.n):(String(a.to).match(/CONCEDED LINKS\s*:\s*(\d+)/i)||[])[1])(ri3Head2024(String(a.to||'').replace(/\\+/g,'').replace(/[*_\x60"“”]+/g,'').trim())))`]];
const plan={base:SRC,nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;const hits=[];
 if(!s0.includes('function ri3Count2024('))throw new Error(f+': not on pkgRI3 part A');
 for(const [k,a,b] of R){const n=s.split(a).length-1;if(n>1)throw new Error(f+' '+k+' anchor x'+n);if(n===1){s=s.replace(a,()=>b);hits.push(k);}}
 if(hits.length){if(s0.split(A0).length!==2)throw new Error(f+' A0');s=s.replace(A0,()=>FN+A0);new Function('$','$input','return (async()=>{\n'+s+'\n})();');plan.nodes[f]={base:h(s0),patched:h(s),anchors:hits};}
 fs.writeFileSync(DST+f,s);}
const tally={};for(const v of Object.values(plan.nodes))for(const k of v.anchors)tally[k]=(tally[k]||0)+1;plan.tally=tally;
fs.writeFileSync(PLAN,JSON.stringify(plan,null,1));console.log(Object.keys(plan.nodes).length+' nodes patched;',JSON.stringify(tally));
