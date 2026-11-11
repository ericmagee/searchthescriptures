// pkgNVR (W1): psGrades reads a negated grade word ("not void", "NOT VOID", "not unexhibited", "not conceded") as spared, like "not counted",
// and expands a range in words after "premises" ("Premises 1 through 6", "premises 2 to 4"). Shared Library lines 1379 and 1381 (from 0). MAP lengths recomputed.
// Also enf428Cure: line 2675 (the cure's own fallback reader) reads "premise N is not VOID" as SPARED; line 2678 reads the enforcer's own right grade "NOT VOID" as SPARED, not VOID.
// Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const rep=(i,o,n)=>{if(Lb[i].split(o).length!==2)throw new Error('line '+i+' anchor not unique: '+o);Lb[i]=Lb[i].replace(o,()=>n);};
rep(1379,".replace(/\\b(\\d)\\s*[–—-]\\s*(\\d)\\b/g,",".replace(/\\b(premises\\s+)(\\d)\\s+(?:through|to)\\s+(\\d)\\b/ig,'$1$2-$3').replace(/\\b(\\d)\\s*[–—-]\\s*(\\d)\\b/g,");
rep(1381,"(?:not|never)\\s+counted\\b","(?:not|never)\\s+(?:counted|void|unexhibited|conceded)\\b");
Lb[1381]+=' /* pkgNVR */';
rep(2675,"[^.;]{0,80}?\\\\b(VOID|UNEXHIBITED|CONCEDED|COUNTED|SPARED|SUPPORTED|NARROWED|STANDS)\\\\b','i'));if(z){const k=z[1].toUpperCase();","[^.;]{0,80}?\\\\b(not\\\\s+|never\\\\s+)?(VOID|UNEXHIBITED|CONCEDED|COUNTED|SPARED|SUPPORTED|NARROWED|STANDS)\\\\b','i'));if(z){const k=z[1]?'SPARED':z[2].toUpperCase();");
rep(2678,"const want=right&&/VOID/.test(right)?'VOID':right&&/COUNTED|UNEXHIBITED|CONCEDED/.test(right)?'COUNTED'","const want=right&&/^VOID/.test(right)?'VOID':right&&/^(?:COUNTED|UNEXHIBITED|CONCEDED)/.test(right)?'COUNTED'");
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
N.parameters.jsCode=T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c);
// check the original serialisation is reproduced byte for byte when nothing changes
const T0=T.slice(0,a+8)+JSON.stringify(JSON.parse(T.slice(a+8,b)))+T.slice(b,b+8)+JSON.stringify(JSON.parse(T.slice(b+8,c)))+T.slice(c);if(T0!==T)throw new Error('serialisation differs from the parent');
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
