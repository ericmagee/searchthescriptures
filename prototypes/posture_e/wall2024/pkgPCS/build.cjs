// pkgPCS (W1): psGrades splits a clause before ", and|but|while|whereas premise(s) <n>", so each part keeps its own grade word.
// A comma part with no grade word is joined to the next part (so "premises 1 and 6, and premises 2 to 5, are spared" reads as before).
// Shared Library lines 1381 (psGrades of Gate, Send Back, Alternate Merge stubs) and 1643 (the Cure Check / Panel Cure Check copy). MAP lengths recomputed.
// Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const T0=T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c);if(T0!==T)throw new Error('serialisation differs from the parent');
const OLD="for(const c0 of t.split(/;|\\.(?=\\s|$)/)){";
const NEW="for(const c0 of t.split(/;|\\.(?=\\s|$)/).flatMap(x=>x.split(/,\\s*(?=(?:and|but|while|whereas)\\s+premises?\\s+\\d)/i).reduce((o,y)=>{const l=o.length-1;if(l>=0&&!(W.lastIndex=0,W.test(o[l])))o[l]+=', '+y;else o.push(y);return o;},[]))){ /* pkgPCS */";
for(const i of [1381,1643]){if(Lb[i].split(OLD).length!==2)throw new Error('line '+i+' anchor not unique');Lb[i]=Lb[i].replace(OLD,()=>NEW);}
// Part 2 (pkgNVR gap, W1's own): line 1643 never received pkgNVR's negation rule, so Cure Check and Panel Cure Check read "not void" as VOID. Same text as line 1381.
{const O2="const c=c0.replace(/\\bnone\\s+counted\\b/ig,' ');",N2="const c=c0.replace(/\\bnone\\s+counted\\b/ig,' ').replace(/\\b(?:(?:are|is|were|was|be|been)\\s+)?(?:not|never)\\s+(?:counted|void|unexhibited|conceded)\\b|\\buncounted\\b/ig,' spared '); /* pkgPCS: pkgNVR rule */";
 if(Lb[1643].split(O2).length!==2)throw new Error('1643 part 2 anchor');if(!Lb[1381].includes(N2.slice(0,N2.indexOf(' /*'))))throw new Error('1381 does not hold the pkgNVR rule as copied');Lb[1643]=Lb[1643].replace(O2,()=>N2);}
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+require('crypto').createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3],'jsCode delta',N.parameters.jsCode.length-T.length,'per line',NEW.length-OLD.length);
