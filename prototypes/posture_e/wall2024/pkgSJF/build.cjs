// pkgSJF: the single judge's FULL re-ask also fires when the extractor flags "COLLISION MAP: NO COLLISION POINTS SECTION".
// Base: live s136 (fetchback_live_s136.json). Two nodes: SJ Re-ask? (If) and SJ Re-ask Build (Code). Nothing else changes.
const fs=require('fs'),crypto=require('crypto');const W='/mnt/project-files/wall2024/';
const B0=JSON.parse(fs.readFileSync(W+'fetchback_live_s136.json','utf8'));let D=B0.data||B0;D=D.workflow||D;
const P=JSON.parse(JSON.stringify(D));
const rep=(s,a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('anchor x'+n+': '+a.slice(0,80));return s.replace(a,()=>b);};
const ifn=P.nodes.find(n=>n.name==='SJ Re-ask?');const cond=ifn.parameters.conditions.conditions[0];
cond.leftValue=rep(cond.leftValue,"(j.audit_prompt==='ODV1-A2'&&(!j.defender_chain_mark||!j.challenger_chain_mark))",
 "(j.audit_prompt==='ODV1-A2'&&(!j.defender_chain_mark||!j.challenger_chain_mark||/COLLISION MAP: NO COLLISION POINTS SECTION/.test(String(j.independent_verdict_raw||''))))");
const bn=P.nodes.find(n=>n.name==='SJ Re-ask Build');let c=bn.parameters.jsCode;
c=rep(c,"if(E.audit_prompt==='ODV1-A2'){","const noCP=E.audit_prompt==='ODV1-A2'&&/COLLISION MAP: NO COLLISION POINTS SECTION/.test(String(E.independent_verdict_raw||''));if(noCP)miss.push('no COLLISION POINTS section');\nif(E.audit_prompt==='ODV1-A2'){");
c=rep(c,"const full=!E.verdict_tag||E.verdict_tag==='UNKNOWN';","const full=!E.verdict_tag||E.verdict_tag==='UNKNOWN'||noCP;");
bn.parameters.jsCode=c;
const out=JSON.stringify(B0.data?{...B0,data:B0.data.workflow?{...B0.data,workflow:P}:P}:(B0.workflow?{...B0,workflow:P}:P));
fs.writeFileSync(W+'parent_s136_SJF.json',out);
const code=x=>x.nodes.reduce((s,n)=>s+(n.parameters.jsCode||'').length,0);
const ifl=x=>x.nodes.filter(n=>n.type==='n8n-nodes-base.if').reduce((s,n)=>s+JSON.stringify(n.parameters).length,0);
const cl=x=>{const n=x.nodes.find(n=>n.name==='SJ Re-ask?');return n.parameters.conditions.conditions[0].leftValue.length;};
console.log('SJ Re-ask Build code',bn.parameters.jsCode.length-D.nodes.find(n=>n.name==='SJ Re-ask Build').parameters.jsCode.length);
console.log('SJ Re-ask? expression',cl(P)-cl(D));
console.log('total Code-node jsCode',code(P)-code(D));
let diff=[];for(const n of P.nodes){const o=D.nodes.find(z=>z.name===n.name);if(JSON.stringify(o)!==JSON.stringify(n))diff.push(n.name);}
console.log('nodes changed',diff,'node count',P.nodes.length,D.nodes.length,'connections equal',JSON.stringify(P.connections)===JSON.stringify(D.connections));
console.log('sha256',crypto.createHash('sha256').update(out).digest('hex').slice(0,16));
