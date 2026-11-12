// W2: expected next live = s158 + pkgGUR rev 2 + pkgSJO, then + pkgWVR rev 3. Merge by node name.
const fs=require('fs'),cr=require('crypto');const D='/mnt/project-files/wall2024/';const L=f=>JSON.parse(fs.readFileSync(D+f));
const live=L('fetchback_live_s158.json'),G=L('parent_s158_GUR2.json'),S=L('parent_s158_SJO.json'),W=L('parent_s158_WVR3.json');
const take=(base,src,name)=>{const i=base.nodes.findIndex(n=>n.name===name);const n=src.nodes.find(n=>n.name===name);if(i<0||!n)throw new Error('missing '+name);base.nodes[i]=JSON.parse(JSON.stringify(n));};
const A=JSON.parse(JSON.stringify(S));take(A,G,'Shared Library');
const B=JSON.parse(JSON.stringify(A));take(B,W,'Close Enforcer Build');
const sha=o=>cr.createHash('sha256').update(JSON.stringify(o)).digest('hex').slice(0,16);
fs.writeFileSync(D+'expected_s159_GUR_SJO.json',JSON.stringify(A));fs.writeFileSync(D+'parent_s159x_WVR3.json',JSON.stringify(B));
const m=x=>Object.fromEntries(x.nodes.map(n=>[n.name,JSON.stringify(n)]));const ML=m(live);
for(const [nm,o] of [['GUR+SJO',A],['GUR+SJO+WVR3',B]]){const M=m(o);console.log(nm,'nodes',o.nodes.length,'changed vs s158',Object.keys(M).filter(k=>M[k]!==ML[k]),'conn = SJO conn',JSON.stringify(o.connections)===JSON.stringify(S.connections));}
const code=(o,n)=>{const x=o.nodes.find(y=>y.name===n).parameters;return x.jsCode||'';};
console.log('Shared Library = GUR2',code(A,'Shared Library')===code(G,'Shared Library'),'| CEB = WVR3',code(B,'Close Enforcer Build')===code(W,'Close Enforcer Build'));
let t=0;for(const n of B.nodes)t+=(n.parameters&&n.parameters.jsCode||'').length;let tl=0;for(const n of live.nodes)tl+=(n.parameters&&n.parameters.jsCode||'').length;console.log('code total vs s158 +'+(t-tl));
