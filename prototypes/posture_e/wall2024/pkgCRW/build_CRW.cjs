// pkgCRW (W1, 11-07): cureRewrite applies each changed line as a WHOLE LINE, not as a substring.
// 33411 gemini: the send-back changed "CONCEDED LINKS: 0" (S7). cureRewrite's rp list held that old line twice; the first j.replace hit the
// CONCEDED LINKS line, the second hit the "CONCEDED LINKS: 0" inside "CHALLENGER CONCEDED LINKS: 0", so the final text carried
// "CHALLENGER CONCEDED LINKS: 1 -- Premise 2 CONCEDED (stated): [CR3] ..." (a defender concession on the Oracle's line) while the stored field stayed 0.
// Same class as gemini 33040 (pkgPS b fixed Alternate Merge's build, not cureRewrite). Fix: a match must start at a line start; a whole-line match is
// taken first, else the first line-start match (the old behaviour when the line has trailing words). Base: the pkgLIB v4 full sources (pkgLIB/orig_stack).
// Run from wall2024/: node pkgCRW/build_CRW.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);const B='pkgCRW/base_v4/'; /* the pkgLIB v4 full sources (orig_stack at b815592; orig_stack now holds the CRW sources) */
const FN="function crwRep(h,o,n,enc){const st=k=>k===0||(enc?(h.slice(k-2,k)==='\\\\n'||h[k-1]==='\"'):h[k-1]==='\\n');const en=k=>k>=h.length||(enc?(h.slice(k,k+2)==='\\\\n'||h[k]==='\"'):h[k]==='\\n');let fb=-1;if(!o)return null;for(let k=h.indexOf(o);k>=0;k=h.indexOf(o,k+1)){if(!st(k))continue;if(en(k+o.length))return h.slice(0,k)+n+h.slice(k+o.length);if(fb<0)fb=k;}return fb<0?null:h.slice(0,fb)+n+h.slice(fb+o.length);} /* pkgCRW: a changed line replaces a whole line (33411 gemini: CONCEDED LINKS: 0 inside CHALLENGER CONCEDED LINKS: 0) */\n";
const R=[["function cureRewrite(raw,panel,R,seat,F0){",FN+"function cureRewrite(raw,panel,R,seat,F0){"],
 ["for(const [o0,n0] of R.rp){const e=enc(o0);if(j.includes(e))j=j.replace(e,()=>enc(n0));else miss=true;}","for(const [o0,n0] of R.rp){const e=enc(o0);const __r=crwRep(j,e,enc(n0),true);if(__r!=null)j=__r;else miss=true;}"],
 ["for(const [o0,n0] of R.rp)t=t.replace(o0,()=>n0);ob.reasoning=t;","for(const [o0,n0] of R.rp){const __r=crwRep(t,o0,n0,false);if(__r!=null)t=__r;}ob.reasoning=t;"],
 ["for(const [o0,n0] of R.rp)t=t.replace(o0,()=>n0);s=t+rest;","for(const [o0,n0] of R.rp){const __r=crwRep(t,o0,n0,false);if(__r!=null)t=__r;}s=t+rest;"]];
const plan={};for(const f of fs.readdirSync(B).filter(f=>f.endsWith('.js'))){let s=fs.readFileSync(B+f,'utf8');if(!s.includes('function cureRewrite('))continue;const s0=s;
 for(const [a,b] of R){const c=s.split(a).length-1;if(c!==1)throw new Error(f+': anchor count '+c+' for '+a.slice(0,50));s=s.replace(a,()=>b);}
 fs.writeFileSync('pkgCRW/patched/'+f,s);plan[f]={base:h(s0),patched:h(s)};console.log(f.padEnd(34),h(s0),'->',h(s));}
fs.writeFileSync('pkgCRW/patched.plan.json',JSON.stringify(plan,null,1));console.log(Object.keys(plan).length,'nodes');
