// D prototype (not a package): line 2668 also reads the other side's round of the same number before calling the answer not found.
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const o=String.raw`const miss=ps.filter(p=>!ks.some(k=>has(k,p)));`,n=String.raw`const miss=ps.filter(p=>!ks.some(k=>has(k,p)||has(k.replace(/^[CD]/,x=>x==='C'?'D':'C'),p)));`;
if(Lb[2668].split(o).length!==2)throw 1;Lb[2668]=Lb[2668].replace(o,()=>n);
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
N.parameters.jsCode=T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c);fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('delta',N.parameters.jsCode.length-T.length);
