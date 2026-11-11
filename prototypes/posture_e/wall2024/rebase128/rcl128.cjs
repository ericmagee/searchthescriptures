// W2: pkgRCL rev 3 on s128 (after pkgEAF AU). s128 differs from s127 only where listed; RCL's Close Enforcer Build text is reused when that node is unchanged.
const fs=require('fs'),cr=require('crypto');const W='/mnt/project-files/wall2024/';const g=f=>{let d=JSON.parse(fs.readFileSync(W+f));d=d.data||d;return d.workflow||d;};
const A=g('fetchback_live_s127.json'),B=g('fetchback_live_s128.json');
const diff=B.nodes.filter(n=>{const a=A.nodes.find(x=>x.name===n.name);return !a||JSON.stringify(a.parameters)!==JSON.stringify(n.parameters);}).map(n=>n.name);
console.log('nodes changed s127 -> s128:',diff.join(', '),'| node count',A.nodes.length,B.nodes.length,'| connections equal',JSON.stringify(A.connections)===JSON.stringify(B.connections));
const code=X=>X.nodes.reduce((a,n)=>a+(n.parameters.jsCode||'').length,0);console.log('s128 code',code(B),'s127',code(A),'=',code(B)-code(A));
const t0=B.nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;if(t0!==A.nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode)throw new Error('Close Enforcer Build changed in s128');
const t=fs.readFileSync('rebase127/t_rcl.js','utf8');const O=JSON.parse(JSON.stringify(B));O.nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode=t;const s=JSON.stringify(O);fs.writeFileSync(W+'parent_s128_RCL3.json',s);
const P=g('parent_s127_RCL3.json');const d2=O.nodes.filter(n=>JSON.stringify(n.parameters)!==JSON.stringify(P.nodes.find(x=>x.name===n.name).parameters)).map(n=>n.name);
console.log('parent_s128_RCL3.json sha',cr.createHash('sha256').update(s).digest('hex').slice(0,16),'| code',code(B),'->',code(O),'=',code(O)-code(B),'| prompt 0 | connections equal',JSON.stringify(O.connections)===JSON.stringify(B.connections),'| differs from parent_s127_RCL3 only in:',d2.join(', '));
