// pkgOAD (W1): in sbApply2024 (Shared Library), a send-back change line that starts "OUT-OF-ROUND CONCESSIONS:" before
// "DEFENDER |" or "CHALLENGER |" loses that prefix before the row is matched. Before, the row reader returned NO_LINE_FORM and
// the counted change was not applied (run 35696, luna, defender close D5). Same line as pkgRI5B; no new library line.
// MAP lengths and the header sha are recomputed. Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const T0=T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c);if(T0!==T)throw new Error('serialisation differs from the parent');
const OLD=String.raw`  if(ri5IsRes2024(to,/^RESULT\s*:/i)){resTo={sid:x.sid,to};continue;} /* pkgRI5B */`;
const hits=Lb.map((l,i)=>l===OLD?i:-1).filter(i=>i>=0);if(hits.length!==1)throw new Error('anchor hits '+hits.length);
Lb[hits[0]]=String.raw`  to=to.replace(/^OUT-OF-ROUND CONCESSIONS\s*:\s*(?=(?:DEFENDER|CHALLENGER)\b)/i,''); /* pkgOAD */`+OLD.slice(1);
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+require('crypto').createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('lib line',hits[0],'jsCode delta',N.parameters.jsCode.length-T.length);
