const fs=require('fs');const H=require('./harness_clone.cjs');
(async()=>{const run='34108';const f='Send_Back_Build.js';const a=await H.run(fs.readFileSync('pkgLIB/strip_S112L/patched/'+f,'utf8'),run,'Judge Enforcer Record');const b=await H.run(fs.readFileSync('pkgLIB/strip_EAD_on_S112L/patched/'+f,'utf8'),run,'Judge Enforcer Record');
const ai=a.flatMap(j=>(j.json.items||[]).map(x=>({seat:j.json.seat,...x}))),bi=b.flatMap(j=>(j.json.items||[]).map(x=>({seat:j.json.seat,...x})));
const sig=x=>x.seat+'|'+x.rule+'|'+x.item+'|'+x.line;const bm=new Map(bi.map(x=>[sig(x),x]));
for(const x of ai){const y=bm.get(sig(x));if(!y)continue;const X={...x},Y={...y};delete X.sid;delete Y.sid;for(const k of Object.keys(X))if(JSON.stringify(X[k])!==JSON.stringify(Y[k]))console.log(x.seat,x.sid,'->',y.sid,x.rule,k,'\n  A:',JSON.stringify(X[k]).slice(0,300),'\n  B:',JSON.stringify(Y[k]).slice(0,300));}})();
;(async()=>{const run='34108';const f='Send_Back_Build.js';const a=await H.run(fs.readFileSync('pkgLIB/strip_S112L/patched/'+f,'utf8'),run,'Judge Enforcer Record');const b=await H.run(fs.readFileSync('pkgLIB/strip_EAD_on_S112L/patched/'+f,'utf8'),run,'Judge Enforcer Record');
const ai=a.flatMap(j=>(j.json.items||[]).map(x=>j.json.seat+' '+x.rule+' '+x.item)),bi=b.flatMap(j=>(j.json.items||[]).map(x=>j.json.seat+' '+x.rule+' '+x.item));console.log(ai.length,bi.length);console.log(ai.filter(x=>!bi.includes(x)));console.log(bi.filter(x=>!ai.includes(x)));
const sa=a.map(j=>j.json.seat),sb=b.map(j=>j.json.seat);console.log(sa,sb);})();
