// Joint base for one write: s110 + pkgGFC rev s + pkgQRD rev 5 + pkgF3A rev 2s, by node swap (W4 4249 method). Checks each package differs from s110 only in its own nodes.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const S=g('/mnt/project-files/wall2024/fetchback_live_s110.json');const P={GFC:g('/mnt/project-files/wall2024/parent_s110_GFS.json'),QRD:g('pkgQRD/parent_s110_QRD.json'),F3A:g('pkgF3A/parent_s110_F3A2s_ALL.json')};
const by=w=>Object.fromEntries(w.nodes.map(n=>[n.name,n]));const sb=by(S);const J=JSON.parse(JSON.stringify(P.GFC));const jb=by(J);
for(const [k,w] of Object.entries(P)){const b=by(w);const ch=Object.keys(b).filter(n=>JSON.stringify(b[n].parameters)!==JSON.stringify((sb[n]||{}).parameters));const same=JSON.stringify(w.connections)===JSON.stringify(S.connections)&&w.nodes.length===S.nodes.length;
 console.log(k+': nodes changed vs s110: '+ch.join(', ')+'; connections and node count equal: '+same);if(k!=='GFC')for(const n of ch)jb[n].parameters=JSON.parse(JSON.stringify(b[n].parameters));}
const code=w=>w.nodes.filter(n=>n.parameters&&typeof n.parameters.jsCode==='string').reduce((a,n)=>a+n.parameters.jsCode.length,0);
console.log('joint Code text '+code(J)+' (s110 '+code(S)+', +'+(code(J)-code(S))+')');fs.writeFileSync(process.argv[2],JSON.stringify(J));
