// pkgKWI (W1, 11-08; coordinator ask after 33828): DeepSeek RULE K-W checks the NOT HELD quote form, counting across inner quotation marks.
// 33828 grok, K-W [CR4] D5: the sentence "I grant the alarm and the form "fear not... for"" has 8 words after its verb; grok quoted
// "the alarm and the form" (5), stopping at the inner quotation mark. The cure check left it UNCURED and grok was removed; DeepSeek's K-W
// rule never named the quote form, so it had no duty to catch it. This adds a QUOTE FIRST step before DeepSeek grades a NOT HELD reason.
// Nodes: Enforcer Build, Alt Judge Enforcer Build, R2 Alt Judge Enforcer Build, base fetchback_live_s68 (not library nodes).
// Run from wall2024/: node pkgKWI/build_KWI.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s68.json','utf8'));const N=W.nodes||W.data.nodes;
const {A,A2}=require('./kwi_text.cjs');
const plan=[];
for(const name of ['Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){let t=N.find(n=>n.name===name).parameters.jsCode;const before=h(t);
 if(t.split(A).length!==2)throw new Error(name+': anchor count '+(t.split(A).length-1));t=t.replace(A,()=>A2);
 try{new Function('return async function(){'+t+'\n}')}catch(e){throw new Error(name+' syntax: '+e.message)}
 const file=name.replace(/ /g,'_')+'.js';fs.writeFileSync('pkgKWI/patched/'+file,t);plan.push({node:name,base:'fetchback_live_s68',file,before,after:h(t)});console.log(name,before,'->',h(t));}
fs.writeFileSync('pkgKWI/plan_KWI.json',JSON.stringify({nodes:plan},null,1));
