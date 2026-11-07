// pkgKWT (W1, 11-07; W3 grade_33411 Fault 2, W2 2924): the K-W NOT HELD quote test also accepts the granted proposition without its leading "that",
// "how" or "whether". 33411 sol: flagged "I grant that two fatherhoods stand together there."; the test stripped "I grant" and kept the 6-word body
// "that two fatherhoods stand together there", which (6 words or fewer) must be quoted whole; sol quoted "two fatherhoods stand together there" and was
// falsely UNCURED, then removed. Fix: every body's runs ALSO include the runs of the body without a leading that/how/whether. Runs are only added, so a
// reason that passed before still passes (monotone); side-neutral. 19 library nodes; base = pkgLIB v6 full sources (pkgKWT/base_v6).
// Run from wall2024/: node pkgKWT/build_KWT.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);const B='pkgKWT/base_v6/';
const OLD="const __rn=b0=>b0.length<=6?[b0.join(' ')]:b0.slice(0,b0.length-5).map((_,i)=>b0.slice(i,i+6).join(' '));";
const NEW="const __rn0=b0=>b0.length<=6?[b0.join(' ')]:b0.slice(0,b0.length-5).map((_,i)=>b0.slice(i,i+6).join(' '));const __rn=b0=>{const r=__rn0(b0);if(b0.length>1&&/^(?:that|how|whether)$/.test(b0[0]))r.push(...__rn0(b0.slice(1)));return r;}; /* pkgKWT: \"I grant that X\" also takes X quoted whole (33411 sol) */";
const plan={};for(const f of fs.readdirSync(B).filter(f=>f.endsWith('.js'))){const s0=fs.readFileSync(B+f,'utf8');const c=s0.split(OLD).length-1;if(c!==1)throw new Error(f+': anchor count '+c);
 const s=s0.replace(OLD,()=>NEW);fs.writeFileSync('pkgKWT/patched/'+f,s);plan[f]={base:h(s0),patched:h(s)};console.log(f.padEnd(34),h(s0),'->',h(s));}
fs.writeFileSync('pkgKWT/patched.plan.json',JSON.stringify(plan,null,1));console.log(Object.keys(plan).length,'nodes');
