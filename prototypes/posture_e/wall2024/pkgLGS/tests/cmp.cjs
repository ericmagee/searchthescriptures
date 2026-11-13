const fs=require('fs');
const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;j=j.workflowData||j.workflow||j;const T=j.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const R={};for(const e in M)R[e]=M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');return {j,R,T};};
const A=load(process.argv[2]),B=load(process.argv[3]);
const ks=new Set([...Object.keys(A.R),...Object.keys(B.R)]);const diff=[];
for(const k of ks){if(A.R[k]!==B.R[k])diff.push(k+' '+(A.R[k]||'').length+' -> '+(B.R[k]||'').length);}
console.log('map entries live',Object.keys(A.R).length,'new',Object.keys(B.R).length,'differ:');diff.forEach(d=>console.log(' ',d));
const nA={},nB={};A.j.nodes.forEach(n=>nA[n.name]=JSON.stringify(n));B.j.nodes.forEach(n=>nB[n.name]=JSON.stringify(n));
const nd=[];for(const k of new Set([...Object.keys(nA),...Object.keys(nB)]))if(nA[k]!==nB[k])nd.push(k+(nA[k]?'':' (new)'));console.log('nodes differ:',nd.join(' | '));
const cA=JSON.stringify(A.j.connections),cB=B.j.connections;const cd=[];for(const k of new Set([...Object.keys(A.j.connections),...Object.keys(cB)]))if(JSON.stringify(A.j.connections[k])!==JSON.stringify(cB[k]))cd.push(k);console.log('connections differ:',cd.join(' | '));
const S=process.env.LGS_DIR||(__dirname+'/out/');const U=process.env.LIVE_UN||(__dirname+'/live_un/');fs.mkdirSync(S+'new',{recursive:true});fs.mkdirSync(U,{recursive:true});for(const k in A.R)fs.writeFileSync(U+k.replace(/[^A-Za-z0-9]+/g,'_')+'.js',A.R[k]);for(const k in B.R)if(A.R[k]!==B.R[k])fs.writeFileSync(S+'new/'+k.replace(/[^A-Za-z0-9]+/g,'_')+'.js',B.R[k]);
