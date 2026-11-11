// pkgKSN (W1): after a confirmed DEFENDER closing contradiction, a KEYSTONE line that STANDS and whose reason speaks of links broken or intact
// gets a marked note in the recompute's trigger list (AUDIT v25 line) naming the links the contradiction broke; the KEYSTONE line itself is not replaced. The judge's words are kept; nothing is graded from the note (record-only).
// Wall 4808 Problem 2 (W2 4816, W4 4818, W3 4819). Shared Library line 1326 (cureRecompute). Base: W2's joint s130+NVR+CMX.
// Usage: node build.cjs <parent workflow json> <out json>
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const W=un(process.argv[2]);const N=W.nodes.find(n=>n.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const rep=(i,o,n)=>{if(Lb[i].split(o).length!==2)throw new Error('line '+i+' anchor not unique: '+o);Lb[i]=Lb[i].replace(o,()=>n);};
rep(1326,"'KEYSTONE '+__k[1]]);}}}","'KEYSTONE '+__k[1]]);}else if(__k){const __b=cecBroken2024().filter(x=>x.side==='DEFENDER').map(x=>x.link);if(__b.length&&/\\bno\\s+(?:other\\s+)?(?:defender\\s+|declared\\s+)?links?\\b[^.;]{0,30}\\bbroken\\b|\\b(?:all|every|each)\\s+(?:other\\s+)?(?:defender\\s+|declared\\s+)?links?\\b[^.;]{0,30}\\b(?:stands?|intact|unbroken)\\b/i.test(__K.raw))trig.push('STALE KEYSTONE REASON '+__k[1]+' (the reason was written before defender link'+(__b.length>1?'s ':' ')+__b.join(', ')+' broke by a confirmed closing contradiction)');}}} /* pkgKSN */");
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');for(const e in M)M[e].n=reb(e).length;
const LJ=JSON.stringify(Lb);N.parameters.jsCode=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+require('crypto').createHash('sha256').update(LJ).digest('hex').slice(0,16));
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('written',process.argv[3]);
