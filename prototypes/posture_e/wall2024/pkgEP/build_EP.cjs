// pkgEP (W3 Wall 2446, E-ANS ruling 1 and E-PREM ruling 1): two enforcer prompt lines. Run from wall2024/: node pkgEP/build_EP.cjs
// Base: pkgCM/patched Judge Enforcer Build and Alt Judge Enforcer Build (no later package edits these two nodes). E-ANS and E-PREM stay
// RECORD-ONLY TRIAL; after the next run every item is read, and both are promoted only at zero false items (W3 2446).
// E-ANS (row 7483, gemini 33040, Matthew 1:19): an answer that quotes the verse's own words against the specific claim of the MEANS meets the
//   second limb, even when it closes with a bare assertion.
// E-PREM (rows 7804, 7807, 7808, 7809, sol 33040): a NARROWED premise that keeps its footing is SPARED; dropping a claim is not conceding the premise.
//   The judges' own rule that UNEXHIBITED fires when the narrowed link keeps words that still assert what was given up stays; the line says that
//   such a ruling quotes both the dropped claim and the kept words that still assert it.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const BASE=process.env.BASE||'pkgCM/patched';const OUT=process.env.OUT||'pkgEP';
const A1="or when it does not address the stated meaning. Then for each judge\\'s grade: AGREE when it matches the right grade, DISAGREE when it does not.\\n'";
const B1="or when it does not address the stated meaning. An answer that quotes the verse\\'s own words against the specific claim of the stated meaning (for example, the verse\\'s own stated grounds set against a claim that there were no grounds) shows why the meaning does not follow: it MEETS, even when it closes with a bare assertion such as \"It fits the link\". Then for each judge\\'s grade: AGREE when it matches the right grade, DISAGREE when it does not.\\n'";
const A2="NO ANSWER only when the judge\\'s line is not in its form.\\n'";
const B2="NO ANSWER only when the judge\\'s line is not in its form. A NARROWED premise (the side drops a claim and keeps the link on a narrower footing, with its [L1] and [L2] or [L3] exhibited) is SPARED: dropping a claim is not conceding the premise, and the dropped claim alone never makes the premise COUNTED. It is UNEXHIBITED only when the kept words still assert the very claim the side dropped; say so by quoting both the dropped claim and the kept words that still assert it.\\n'";
const plan={base:BASE,nodes:[]};fs.mkdirSync(OUT+'/patched',{recursive:true});
for(const f of ['Judge_Enforcer_Build.js','Alt_Judge_Enforcer_Build.js']){const b=fs.readFileSync(BASE+'/'+f,'utf8');let t=b;const ed=[];
 for(const [a,c,w] of [[A1,B1,'E-ANS second-limb line'],[A2,B2,'E-PREM NARROWED is SPARED line']]){const k=t.split(a).length-1;if(k!==1)throw new Error(f+' '+w+' x'+k);t=t.replace(a,()=>c);ed.push(w);}
 new Function('$','$input','$json',t);fs.writeFileSync(OUT+'/patched/'+f,t);plan.nodes.push({file:f,name:f.replace(/\.js$/,'').replace(/_/g,' '),base_sha:sha(b),final_sha:sha(t),edits:ed});}
fs.writeFileSync(OUT+'/plan_EP.json',JSON.stringify(plan,null,1));console.log(plan.nodes.map(n=>n.file+' '+n.base_sha+' -> '+n.final_sha).join('\n'));
