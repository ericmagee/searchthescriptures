// pkgAMG (W1): the E-ANS cure reader (enf428Cure, Shared Library line 2669). When the judge graded the answer MISSES or FAILS,
// DeepSeek said (right: MEETS), and the send-back reply changes the line to MEETS on the same answer, the cure is the grade itself:
// CURED. Before, the "quotes the flagged answer again" test (written for a MEETS line that must cite a fuller answer) refused it.
// A flagged MEETS line keeps the old test. MAP lengths and the header sha are recomputed.
// Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const T0=T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c);if(T0!==T)throw new Error('serialisation differs from the parent');
const rep=(i,o,n)=>{if(Lb[i].split(o).length!==2)throw new Error('line '+i+' anchor not unique');Lb[i]=Lb[i].replace(o,()=>n);};
rep(2669,String.raw`const fa=N(f[4]),ta=N(t[4]);if(ta===fa||fa.includes(ta))return res(false,`,
 String.raw`const fa=N(f[4]),ta=N(t[4]);if(ta===fa||fa.includes(ta)){if(!/^MEETS$/i.test(f[5])&&/\(right:\s*MEETS\b/i.test(String(it.reason||'')))return res(true,'CHANGE TO MEETS, the grade the enforcer gave, on the same answer (pkgAMG)');}if(ta===fa||fa.includes(ta))return res(false,`);
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+require('crypto').createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3],'jsCode delta',N.parameters.jsCode.length-T.length);
