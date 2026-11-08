// pkgKCR v2 (W1, 11-08; W3 3009 + 3017, W2 2981). Restacked on pkgLIB_v13_GSU (live library layers: ... strip_KFN, strip_GSU).
// 1. cureLines: REASONING joins LAB (the cure ask names REASONING; 33482 gemini "RESTATED: REASONING: HELD. [L1] ...").
// 2. Narrow gate (W2 2981): a RESTATED line reaches the label branch with no readLines form ONLY when the reader found no spec form at all
//    (R.form==null && R.tried==='RESTATED', "RESTATED wraps no spec form"). A RESTATED KEYSTONE/RESULT/STANDING the reader tried and refused stays malformed.
//    Inside the branch the line must still open with a LAB label, so an unknown label stays malformed.
// 3. netKeeps (W3 ruling 3009): KEEP ("the restated line keeps the ground that a verse does not state the link") does not fire when the line carries
//    an explicit contradiction ground ("contradicted by", "cannot agree with") followed by [L1] and at least two layer kinds after it
//    (33497 gemini CHALLENGER CHAIN MARK: "C1 asserts an UNSTATED marital knowing ... contradicted by [L1] Matthew 1:25 ... [L2] ginosko").
// Run from wall2024/: node pkgKCR2/build_KCR2.cjs [out]  -> pkgLIB/strip_KCR2/patched (all 22 files; files without a change are copied).
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const TOP='pkgLIB/strip_GSU/patched/',BASE='pkgLIB/strip_KFN/patched/',OUT=(process.argv[2]||'pkgLIB/strip_KCR2/patched').replace(/\/?$/,'/');fs.mkdirSync(OUT,{recursive:true});
const R=[
 ["const LAB=/^(KEYSTONE|RESULT|","const LAB=/^(REASONING|KEYSTONE|RESULT|"],
 ["if(k[1]==='RESTATED'&&R.form&&f.restated){","if(k[1]==='RESTATED'&&((R.form&&f.restated)||(R.form==null&&R.tried==='RESTATED'))){ /* pkgKCR v2: a label RESTATED line (REASONING: ...) wraps no spec form */"],
 ["function netKeeps(text){","function netKeeps(text){{const __s=String(text||'').replace(/[*_`]+/g,''),__m=__s.match(/\\b(?:contradicted\\s+by|cannot\\s+agree\\s+with)\\b/i);if(__m){const __a=__s.slice(__m.index);if(/\\[L1\\]/.test(__a)&&drvKinds(__a).length>=2)return false;}} /* pkgKCR v2 (W3 3009): a contradiction ground with layers is the line's ground, not the stating phrase */"]];
const plan={base:'strip_KFN+strip_GSU',nodes:{}};
for(const f of fs.readdirSync(BASE).filter(f=>f.endsWith('.js')).sort()){const src=fs.existsSync(TOP+f)?TOP+f:BASE+f;let s=fs.readFileSync(src,'utf8');const s0=s;
 const c=R.map(([a])=>s.split(a).length-1);if(c.some(n=>n>1))throw new Error(f+': '+c);
 for(const [a,b] of R)if(s.includes(a))s=s.replace(a,()=>b);new Function('$','$input',s);fs.writeFileSync(OUT+f,s);
 if(s!==s0)plan.nodes[f]={from:src.split('/')[1],counts:c,base:h(s0),patched:h(s)};}
fs.writeFileSync('pkgKCR2/build_plan.json',JSON.stringify(plan,null,1));console.log(Object.keys(plan.nodes).length+' changed: '+Object.entries(plan.nodes).map(([k,v])=>k+' '+v.counts.join('')).join(', '));
