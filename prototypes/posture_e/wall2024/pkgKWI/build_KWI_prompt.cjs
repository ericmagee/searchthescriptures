// pkgKWI rev 2, prompt part (W1, 11-08): the K-W six-word sentence in every non-library copy, so the rule table (pkgRTB/rule_table.cjs)
// renders one text for all copies. Nodes: every live s68 node outside the library that holds the K-W "(six words in a row, or all of it when
// shorter)" text. The three enforcer nodes are taken from pkgKWI/patched (QUOTE FIRST already in), the rest from fetchback_live_s68.
// Run from wall2024/ after build_KWI.cjs: node pkgKWI/build_KWI_prompt.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s68.json','utf8'));const N=W.nodes||W.data.nodes;
const SUBS=require('./kwi_lib_subs.cjs').filter(s=>/^txt/.test(s[0]));
const ENF=['Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build'];
const plan=JSON.parse(fs.readFileSync('pkgKWI/plan_KWI.json','utf8'));plan.prompt={};
for(const n of N){if(n.name==='Shared Library'||!n.parameters||typeof n.parameters.jsCode!=='string')continue;const live=n.parameters.jsCode;
 if(!SUBS.some(([,a])=>live.includes(a)))continue;const file=n.name.replace(/[ ?]/g,'_')+'.js';
 const base=ENF.includes(n.name)?fs.readFileSync('pkgKWI/patched/'+file,'utf8'):live;let t=base;const hits=[];
 for(const [tag,a,b] of SUBS){const k=t.split(a).length-1;if(k){hits.push(tag+' x'+k);t=t.split(a).join(b);}}
 try{new Function('return async function(){'+t+'\n}')}catch(e){throw new Error(n.name+' syntax: '+e.message)}
 fs.writeFileSync('pkgKWI/patched/'+file,t);plan.prompt[n.name]={base:ENF.includes(n.name)?'pkgKWI/patched (QUOTE FIRST)':'fetchback_live_s68',live:h(live),before:h(base),after:h(t),hits};
 if(ENF.includes(n.name)){const e=plan.nodes.find(x=>x.node===n.name);e.after=h(t);}
 console.log(n.name,h(live),'->',h(t),hits.join(', '));}
fs.writeFileSync('pkgKWI/plan_KWI.json',JSON.stringify(plan,null,1));
