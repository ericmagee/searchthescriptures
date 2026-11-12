const {ld}=require('./src.cjs');const L=ld('fetchback_live_s146.json'),J=ld(process.argv[2]||'parent_s146_PDS.json');
const by=w=>Object.fromEntries(w.nodes.map(n=>[n.name,n]));const bl=by(L),bj=by(J);console.log('nodes',L.nodes.length,J.nodes.length);
for(const n in bj)if(!bl[n])console.log('NEW',n,bj[n].type,(bj[n].parameters.jsCode||'').length||'',bj[n].onError||'',JSON.stringify(bj[n].parameters.options||{}).slice(0,120));
for(const n in bj)if(bl[n]){if(bl[n].type!==bj[n].type)console.log('TYPE',n,bl[n].type,'->',bj[n].type,(bj[n].parameters.jsCode||'').length,'onError',bl[n].onError,'->',bj[n].onError);else if(JSON.stringify(bl[n].parameters)!==JSON.stringify(bj[n].parameters))console.log('CHANGED',n);}
const ce=w=>{const s=new Set();for(const src in w.connections)for(const t in w.connections[src])w.connections[src][t].forEach((arr,oi)=>(arr||[]).forEach(c=>s.add(src+' ['+oi+'] -> '+c.node)));return s;};
const cl=ce(L),cj=ce(J);for(const c of cj)if(!cl.has(c))console.log('+',c);for(const c of cl)if(!cj.has(c))console.log('-',c);
