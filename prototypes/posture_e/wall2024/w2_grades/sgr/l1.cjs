const fs=require('fs');const ld=f=>{const D=JSON.parse(fs.readFileSync(f,'utf8'));const W=(D.data||D).workflow||(D.data||D);return W;};
const A=ld('/mnt/project-files/wall2024/fetchback_live_s142.json'),J=ld('/mnt/project-files/wall2024/parent_s141_JOINT_PCS_ECS_RRT.json'),S=ld('/mnt/project-files/wall2024/fetchback_live_s141.json');
console.log('versionId',A.versionId,'nodes',A.nodes.length,J.nodes.length);
const m=W=>Object.fromEntries(W.nodes.map(n=>[n.name,JSON.stringify(n.parameters)]));const a=m(A),j=m(J),s=m(S);
const dj=Object.keys({...a,...j}).filter(k=>a[k]!==j[k]);const ds=Object.keys({...a,...s}).filter(k=>a[k]!==s[k]);
console.log('live s142 vs joint parent: params differ in',dj.length,dj.slice(0,10));console.log('live s142 vs s141: params differ in',ds.length);
console.log('connections equal joint',JSON.stringify(A.connections)===JSON.stringify(J.connections));
const crypto=require('crypto');const lib=W=>W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;console.log('library sha live',crypto.createHash('sha256').update(lib(A)).digest('hex').slice(0,16),'joint',crypto.createHash('sha256').update(lib(J)).digest('hex').slice(0,16));
