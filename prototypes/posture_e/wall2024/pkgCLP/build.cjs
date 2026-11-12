// pkgCLP measure-only (W1): strip a "CONCEDED --" (or "CONCEDED:" etc.) label in front of a barred DEFENDER/CHALLENGER row in a send-back change.
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const T0=T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c);if(T0!==T)throw new Error('serialisation differs');
const h=Lb.map((l,i)=>l.includes('/* pkgOAD, pkgOSP */')?i:-1).filter(i=>i>=0);if(h.length!==1)throw new Error('anchor '+h.length);const i=h[0];
const o='  to=to.replace(/^(?:[-';if(!Lb[i].startsWith(o))throw new Error('line start '+Lb[i].slice(0,40));
Lb[i]=String.raw`  to=to.replace(/^(?:[-•]\s+)?[*_]*\s*CONCEDED\s*[*_]*\s*(?::|--|-|–|—)\s*[*_]*\s*(?=(?:DEFENDER|CHALLENGER)\s*\|)/i,''); /* pkgCLP */`+Lb[i].slice(1);
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+require('crypto').createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('jsCode delta',N.parameters.jsCode.length-T.length,'line',i);
