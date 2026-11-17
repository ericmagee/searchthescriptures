// ASK 368 step 2 (W2 7737 plan, 7747 item 2 sentence): one sentence inserted after "or differs only in wording." in Close Enforcer Build and Judge Contradiction Build, byte-equal.
// Usage: node build368.cjs <base.json = live fetch> <out.json>
const fs=require('fs');const w=JSON.parse(fs.readFileSync(process.argv[2]));const W=w.nodes?w:(w.data||w.workflow);
const S=fs.readFileSync(__dirname+'/sentence.txt','utf8').trim();if(/['"`\\]/.test(S))throw new Error('sentence has a quote or backslash');
const K='or differs only in wording.\\n';const NODES=['Close Enforcer Build','Judge Contradiction Build'];
for(const nm of NODES){const n=W.nodes.find(x=>x.name===nm);const j=n.parameters.jsCode;if(j.split(K).length!==2)throw new Error(nm+' anchor count');if(j.includes(S))throw new Error(nm+' already has it');
 n.parameters.jsCode=j.replace(K,()=>K+S+'\\n');}
fs.writeFileSync(process.argv[3],JSON.stringify(w));console.log('patched',NODES.join(', '));
