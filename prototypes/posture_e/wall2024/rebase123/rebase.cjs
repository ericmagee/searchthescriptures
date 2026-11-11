// W2: rebase pkgRCL rev 3 (built on s120) onto live s123 (f3eab117 = s120 + pkgALT + ASK 60 + ASK 61). Copies changed node parameters; refuses if live changed the same node.
const fs=require('fs'),cr=require('crypto');const W='/mnt/project-files/wall2024/';const g=f=>{let d=JSON.parse(fs.readFileSync(W+f,'utf8'));d=d.data||d;return d.workflow||d;};
const B=g('fetchback_live_s120.json'),L=g('fetchback_live_s123.json');const key=n=>JSON.stringify(n.parameters);const by=(W_,nm)=>W_.nodes.find(n=>n.name===nm);
const live=B.nodes.filter(n=>{const m=by(L,n.name);return !m||key(m)!==key(n);}).map(n=>n.name);console.log('s120->s123 nodes changed:',live,'counts',B.nodes.length,L.nodes.length,'conn equal',JSON.stringify(B.connections)===JSON.stringify(L.connections));
const code=W_=>W_.nodes.reduce((s,n)=>s+(n.parameters.jsCode||'').length,0);
for(const [src,dst] of [['parent_s120_RCL3.json','parent_s123_RCL3.json']]){const C=g(src);const ch=C.nodes.filter(n=>key(n)!==key(by(B,n.name))).map(n=>n.name);const clash=ch.filter(n=>live.includes(n));
 const conn=JSON.stringify(C.connections)===JSON.stringify(B.connections);console.log(src,'changes',ch,'clash',clash,'conn',conn);if(clash.length||!conn)continue;
 const O=JSON.parse(JSON.stringify(L));for(const nm of ch)by(O,nm).parameters=JSON.parse(JSON.stringify(by(C,nm).parameters));const s=JSON.stringify(O);fs.writeFileSync(W+dst,s);
 console.log(dst,'sha',cr.createHash('sha256').update(s).digest('hex').slice(0,16),'size vs s120 base',code(C)-code(B),'size vs s123',code(O)-code(L),'s123 code',code(L));}
