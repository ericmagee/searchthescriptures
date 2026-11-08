// pkgRI3 part A (reader phase 2 item 3, W3 order; W1): the CONCEDED LINKS count-line finders ask the shared reader first.
// lineOf, __kg1lCount and ciCountSection find "the side's CONCEDED LINKS line" by their own regex. Now the shared reader decides first:
// a line it reads as CONCEDED (not RESTATED) counts for the side it names, and a CONCEDED line of the other side never does. Where the reader
// reads no CONCEDED form (no count, a prefix it does not know, any error), the old regex decides as before.
// The grade parsers behind the count (psGrades, drvCountLine, drvBroken, block, charges, gateCure2024) are part B.
// Run from wall2024/: node pkgRI3/build_RI3.cjs [base strip] [dest strip] [plan]
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC=(process.argv[2]||'pkgLIB/strip_RMR')+'/patched/',DST=(process.argv[3]||'pkgLIB/strip_RI3')+'/patched/',PLAN=process.argv[4]||'pkgRI3/plan_RI3.json';fs.mkdirSync(DST,{recursive:true});
const A0='function ciCountSection(';
const FN="/* pkgRI3 (reader item 3): true/false when the shared reader reads the line as a CONCEDED count line (for this side / the other side); null when it reads no CONCEDED form, so the old regex decides */\n"
 +"function ri3Count2024(l,side){try{const r=__RL.readLine(String(l==null?'':l));if(r&&r.form==='CONCEDED'&&r.f&&!r.f.restated&&(r.f.side==='DEFENDER'||r.f.side==='CHALLENGER'))return r.f.side===side;}catch(e){}return null;}\n";
const R=[
 ["const i=L.findIndex(l=>head.test(l));if(i<0)return null;const out=[L[i]];",
  "const i=L.findIndex(l=>{const rr=ri3Count2024(l,side);return rr===null?head.test(l):rr;});if(i<0)return null;const out=[L[i]];"],
 ["   if(sd==='CHALLENGER'?/^CHALLENGER\\s+CONCEDED LINKS\\s*:/i.test(u):/^(?:DEFENDER\\s+)?CONCEDED LINKS\\s*:/i.test(u))return u.trim();}return null;};",
  "   {const rr=ri3Count2024(u,sd);if(rr===null?(sd==='CHALLENGER'?/^CHALLENGER\\s+CONCEDED LINKS\\s*:/i.test(u):/^(?:DEFENDER\\s+)?CONCEDED LINKS\\s*:/i.test(u)):rr)return u.trim();}}return null;};"],
 [" const L=String(T||'').split('\\n').filter(l=>re.test(l.replace(/\\\\+/g,'').replace(/[*_\\x60]+/g,'').trim()));return L.length?[L[L.length-1].trim()]:[];}",
  " const L=String(T||'').split('\\n').filter(l=>{const c=l.replace(/\\\\+/g,'').replace(/[*_\\x60]+/g,'').trim();const rr=ri3Count2024(c,side);return rr===null?re.test(c):rr;});return L.length?[L[L.length-1].trim()]:[];}"]];
const plan={base:SRC,nodes:{}};
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;
 if(s0.includes(A0)){if(s0.split(A0).length!==2)throw new Error(f+' A0');let hit=0;
  for(const [a,b] of R){const n=s.split(a).length-1;if(n>1)throw new Error(f+' anchor x'+n+' '+a.slice(0,40));if(n===1){s=s.replace(a,()=>b);hit++;}}
  if(!s.includes("const i=L.findIndex(l=>{const rr=ri3Count2024"))throw new Error(f+' ciCountSection anchor missing');
  s=s.replace(A0,()=>FN+A0);new Function('$','$input',s);plan.nodes[f]={base:h(s0),patched:h(s),anchors:hit};}
 fs.writeFileSync(DST+f,s);}
fs.writeFileSync(PLAN,JSON.stringify(plan,null,1));console.log(Object.entries(plan.nodes).map(([k,v])=>k.replace('.js','')+':'+v.anchors).join(' '));
