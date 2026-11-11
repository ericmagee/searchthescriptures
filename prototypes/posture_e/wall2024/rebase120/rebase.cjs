// W2: rebase s119 candidates onto live s120 (s119 + pkgCLK rev 3). Copies each candidate's changed node parameters into s120; refuses if s120 changed the same node.
const fs=require('fs'),cr=require('crypto');const W='/mnt/project-files/wall2024/';const g=f=>JSON.parse(fs.readFileSync(W+f,'utf8'));
const B=g('fetchback_live_s119.json'),L=g('fetchback_live_s120.json');const key=n=>JSON.stringify(n.parameters);
const by=(W_,nm)=>W_.nodes.find(n=>n.name===nm);
const live=B.nodes.filter(n=>{const m=by(L,n.name);return !m||key(m)!==key(n);}).map(n=>n.name);console.log('s119->s120 nodes changed:',live, 'node counts',B.nodes.length,L.nodes.length,'conn equal',JSON.stringify(B.connections)===JSON.stringify(L.connections));
for(const [src,dst] of [['parent_s119_ALT.json','parent_s120_ALT.json'],['parent_s119_RCL2.json','parent_s120_RCL2.json'],['parent_s119_F1F2r2.json','parent_s120_F1F2r2.json'],['parent_s119_F2r2.json','parent_s120_F2r2.json'],['joint_s119_VP1B_KWN_G4Mr2.json','joint_s120_VP1B_KWN_G4Mr2.json'],['parent_s119_ACX.json','parent_s120_ACX.json']]){
 const C=g(src);const ch=C.nodes.filter(n=>key(n)!==key(by(B,n.name))).map(n=>n.name);const clash=ch.filter(n=>live.includes(n));
 const conn=JSON.stringify(C.connections)===JSON.stringify(B.connections);
 if(clash.length||!conn||C.nodes.length!==B.nodes.length){console.log(src,'CLASH',clash,'conn',conn);continue;}
 const O=JSON.parse(JSON.stringify(L));for(const nm of ch)by(O,nm).parameters=JSON.parse(JSON.stringify(by(C,nm).parameters));
 const s=JSON.stringify(O);fs.writeFileSync(W+dst,s);
 const dC=ch.reduce((a,nm)=>a+(by(C,nm).parameters.jsCode||'').length-(by(B,nm).parameters.jsCode||'').length,0);
 const dO=ch.reduce((a,nm)=>a+(by(O,nm).parameters.jsCode||'').length-(by(L,nm).parameters.jsCode||'').length,0);
 console.log(dst,'nodes',ch.join(', '),'| size on s119 +'+dC,'on s120 +'+dO,'| sha256',cr.createHash('sha256').update(s).digest('hex').slice(0,16));}
