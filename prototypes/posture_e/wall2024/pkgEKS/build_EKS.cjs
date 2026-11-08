// pkgEKS (W1, 11-08; Eric approved ASK 2, "yes" 11:40 CST; W3 grade_33750 "Next DeepSeek fix"): DeepSeek RULE K-S3 names NOT HELD, the third
// K-S3 answer the cure accepts (pkgKS3: NOT HELD with a reason quoting the flagged sentence = "the sentence is not a countable concession"), and says
// how to grade it. Before: the rule named only COUNTED and TOUCHES NO LINK, so DeepSeek wrote NO ANSWER on NOT HELD (33750 terra: 8 of 8) while the
// cure CURED them. The same drift EKN fixed for K-W.
// Nodes: Enforcer Build (live s64) and Alt / R2 Alt Judge Enforcer Build (on pkgRP10/patched, staged for s65, which is on the pkgOOS nodes live in s64).
// Run from wall2024/: node pkgEKS/build_EKS.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s64.json','utf8'));const N=W.nodes||W.data.nodes;
const A="A judge answers COUNTED, or TOUCHES NO LINK: <why>. Decide FIRST";
const A2="A judge answers in one of three forms, and all three are in the rule form: COUNTED; TOUCHES NO LINK: <why>; or NOT HELD: <why>, which says the flagged sentence is not a countable concession (it gives up nothing). Never write NO ANSWER because the judge wrote NOT HELD: grade it (pkgEKS). Decide FIRST";
const B="If it does, AGREE with COUNTED and DISAGREE with TOUCHES NO LINK; if it does not, the reverse.";
const B2="If it does, AGREE with COUNTED and DISAGREE with TOUCHES NO LINK or NOT HELD; if it does not, the reverse: DISAGREE with COUNTED, and AGREE with TOUCHES NO LINK or NOT HELD when its reason does not claim the sentence gives up a declared link or a listed premise (pkgEKS).";
const SRC={'Enforcer Build':()=>N.find(n=>n.name==='Enforcer Build').parameters.jsCode,
 'Alt Judge Enforcer Build':()=>fs.readFileSync('pkgRP10/patched/Alt_Judge_Enforcer_Build.js','utf8'),
 'R2 Alt Judge Enforcer Build':()=>fs.readFileSync('pkgRP10/patched/R2_Alt_Judge_Enforcer_Build.js','utf8')};
const plan=[];
for(const name of Object.keys(SRC)){let t=SRC[name]();const before=h(t);
 for(const [o,n] of [[A,A2],[B,B2]]){if(t.split(o).length!==2)throw new Error(name+': anchor count '+(t.split(o).length-1)+' for '+o.slice(0,60));t=t.replace(o,()=>n);}
 try{new Function('return async function(){'+t+'\n}')}catch(e){throw new Error(name+' syntax: '+e.message)}
 const file=name.replace(/ /g,'_')+'.js';fs.writeFileSync('pkgEKS/patched/'+file,t);plan.push({node:name,base:name==='Enforcer Build'?'s64':'pkgRP10/patched',file,before,after:h(t)});console.log(name,before,'->',h(t));}
fs.writeFileSync('pkgEKS/plan_EKS.json',JSON.stringify({nodes:plan},null,1));
