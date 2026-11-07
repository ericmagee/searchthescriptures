// pkgKCR (W1, 11-07; 33482 gemini removed by K-C REASONING). The cure ask tells a judge: "RESTATED: <for a K-C item on a REASONING, RESULT, KEYSTONE,
// STANDING, CONCEDED or CHAIN MARK line ...: that label, a colon, then the whole regraded sentence>". gemini wrote exactly that:
// "RESTATED: REASONING: HELD. [L1] ... [L2] ... [L3] ...". cureLines read it as malformed for two reasons: (1) its label list LAB has no REASONING;
// (2) the label branch is reached only when readLines already gave the line a form, and readLines has no REASONING form. So no K-C REASONING item
// could be cured by a RESTATED line; gemini's only uncured item, it removed the seat.
// Change in cureLines: REASONING joins LAB, and a RESTATED line whose text starts with a LAB label reaches the label branch even with no readLines form.
// Base: pkgLIB v13 full sources (pkgLIB_v13/orig_stack/patched). Ships as pkgLIB_v14. Run from wall2024/.
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);const B='pkgLIB_v13/orig_stack/patched/';
const R=[["const LAB=/^(KEYSTONE|RESULT|","const LAB=/^(REASONING|KEYSTONE|RESULT|"],
 ["if(k[1]==='RESTATED'&&R.form&&f.restated){","if(k[1]==='RESTATED'&&((R.form&&f.restated)||LAB.test(r))){ /* pkgKCR: a label RESTATED line (REASONING: ...) has no readLines form */"]];
const plan={};for(const f of fs.readdirSync(B).filter(f=>f.endsWith('.js'))){let s=fs.readFileSync(B+f,'utf8');const s0=s;const c=R.map(([a])=>s.split(a).length-1);
 if(c.every(n=>n===0)){fs.writeFileSync('pkgKCR/patched/'+f,s);continue;}if(!c.every(n=>n===1))throw new Error(f+': '+c);
 for(const [a,b] of R)s=s.replace(a,()=>b);new Function('$','$input',s);fs.writeFileSync('pkgKCR/patched/'+f,s);plan[f]={base:h(s0),patched:h(s)};}
fs.writeFileSync('pkgKCR/patched.plan.json',JSON.stringify(plan,null,1));console.log(Object.keys(plan).length+' nodes patched: '+Object.keys(plan).join(', '));
