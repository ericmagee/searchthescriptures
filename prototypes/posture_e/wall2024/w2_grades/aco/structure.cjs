// W2 grade of pkgACO: structure (every node and every edge, old vs new) and a graph walk of every path.
const fs=require('fs'),crypto=require('crypto');const W='/mnt/project-files/wall2024/';
const rawA=fs.readFileSync(W+'fetchback_live_s135.json'),rawB=fs.readFileSync(W+'parent_s135_ACO.json');console.log('sha s135',crypto.createHash('sha256').update(rawA).digest('hex').slice(0,16),'ACO',crypto.createHash('sha256').update(rawB).digest('hex').slice(0,16));
const L=r=>{let d=JSON.parse(r);d=d.data||d;return d.workflow||d;};const A=L(rawA),B=L(rawB);
const nd=d=>new Map(d.nodes.map(n=>[n.name,JSON.stringify([n.type,n.typeVersion,n.parameters,n.onError,n.retryOnFail,n.maxTries,n.waitBetweenTries,n.disabled,n.executeOnce,n.alwaysOutputData])]));
const na=nd(A),nb=nd(B);console.log('nodes',na.size,nb.size,'node differences',[...na].filter(([k,v])=>nb.get(k)!==v).map(x=>x[0]).concat([...nb.keys()].filter(k=>!na.has(k))).join(',')||'none','| settings equal',JSON.stringify(A.settings)===JSON.stringify(B.settings));
const edges=d=>{const s=new Set();for(const [src,o] of Object.entries(d.connections))for(const [typ,brs] of Object.entries(o))(brs||[]).forEach((br,i)=>(br||[]).forEach(t=>s.add(src+' ['+typ+' '+i+'] -> '+t.node+' (in '+t.index+')')));return s;};
const ea=edges(A),eb=edges(B);console.log('edges',ea.size,eb.size);console.log('REMOVED:\n  '+[...ea].filter(x=>!eb.has(x)).join('\n  '));console.log('ADDED:\n  '+[...eb].filter(x=>!ea.has(x)).join('\n  '));
module.exports={A,B};
