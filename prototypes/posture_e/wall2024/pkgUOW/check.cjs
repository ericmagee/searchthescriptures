// pkgUOW check: every library user rebuilds, parses, and differs from live only in the OPEN line; all other nodes and connections identical; header sha matches.
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const get=f=>{const r=JSON.parse(fs.readFileSync(f,'utf8'));return (r.data||r).workflow||(r.data||r);};
const [, , a, b]=process.argv;const L=get(a),T=get(b);
const parts=W=>{const t=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const iL=t.indexOf('\n/*LIB*/'),iM=t.lastIndexOf('\n/*MAP*/'),iE=t.lastIndexOf('\n/*END*/');return {t,LIB:JSON.parse(t.slice(iL+8,iM)),MAP:JSON.parse(t.slice(iM+8,iE)),LJ:t.slice(iL+8,iM)};};
const rb=(L,m)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
const pl=parts(L),pt=parts(T);let ok=0,bad=[];
if(!pt.t.includes('// library sha '+sha(pt.LJ)))bad.push('header sha');
const dl=pl.LIB.map((x,i)=>x!==pt.LIB[i]?i:-1).filter(i=>i>=0);if(dl.length!==1||pl.LIB.length!==pt.LIB.length)bad.push('lib lines changed '+dl);
for(const k in pt.MAP){const s1=rb(pt.LIB,pt.MAP[k]),s0=rb(pl.LIB,pl.MAP[k]);if(s1.length!==pt.MAP[k].n)bad.push('len '+k);
 try{new Function(s1);}catch(e){bad.push('parse '+k+' '+e.message);} if(s1!==s0&&s1.replace(pt.LIB[dl[0]],pl.LIB[dl[0]])!==s0)bad.push('diff '+k); ok++;}
for(const n of L.nodes){const m=T.nodes.find(x=>x.name===n.name);if(!m){bad.push('missing '+n.name);continue;}if(n.name!=='Shared Library'&&JSON.stringify(n)!==JSON.stringify(m))bad.push('node '+n.name);}
if(L.nodes.length!==T.nodes.length)bad.push('node count');if(JSON.stringify(L.connections)!==JSON.stringify(T.connections))bad.push('connections');
console.log('MAP entries rebuilt and parsed:',ok,'| changed library line:',dl.join(','),'| faults:',bad.length?bad.join('; '):'NONE');
