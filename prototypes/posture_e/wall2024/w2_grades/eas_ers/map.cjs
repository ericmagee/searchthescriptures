const fs=require('fs');const D='/mnt/project-files/wall2024/';
const ld=f=>{const X=JSON.parse(fs.readFileSync(D+f,'utf8'));return (X.data||X).workflow||(X.data||X);};
const L=ld('fetchback_live_s146.json'),J=ld('parent_s146_JOINT_ESS_ERS.json');
const by=w=>Object.fromEntries(w.nodes.map(n=>[n.name,n]));const bl=by(L),bj=by(J);
console.log('nodes live',L.nodes.length,'joint',J.nodes.length);
for(const n in bj)if(!bl[n])console.log('NEW',n,bj[n].type,JSON.stringify(bj[n].parameters).length, bj[n].onError||'', JSON.stringify({retry:bj[n].retryOnFail,max:bj[n].maxTries,always:bj[n].alwaysOutputData,exec:bj[n].executeOnce}));
for(const n in bl)if(!bj[n])console.log('GONE',n);
for(const n in bj)if(bl[n]){const a=JSON.stringify(bl[n].parameters),b=JSON.stringify(bj[n].parameters);if(a!==b)console.log('CHANGED',n,b.length-a.length);const o=['onError','retryOnFail','maxTries','alwaysOutputData','executeOnce','typeVersion'];for(const k of o)if(JSON.stringify(bl[n][k])!==JSON.stringify(bj[n][k]))console.log('  prop',n,k,bl[n][k],'->',bj[n][k]);}
const ce=w=>{const s=new Set();for(const src in w.connections)for(const t in w.connections[src])w.connections[src][t].forEach((arr,oi)=>(arr||[]).forEach(c=>s.add(src+' ['+oi+'] -> '+c.node+' ('+c.index+')')));return s;};
const cl=ce(L),cj=ce(J);for(const c of cj)if(!cl.has(c))console.log('+',c);for(const c of cl)if(!cj.has(c))console.log('-',c);
