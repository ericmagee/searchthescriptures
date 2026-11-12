// pkgGUR (W2): the pkgGUB check reads the gate change's reason too. __gub cures a gate change of an E-APPLY UNDERDETERMINED line through
// UND.cure, but passed only the line (to). Since pkgUOR the open point and the [L1] may stand in the reason after "||"; the gate row
// carries that reason as x.reason. Library line of __gub: {ans:'CHANGE',to:x.to} -> {ans:'CHANGE',to:x.to,why:x.reason}.
// rev 2 builds on live s157 and re-packs (recorded lengths, library sha).
// Usage: node build_GUR.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');const W=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const N=W.nodes.find(z=>z.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
if(T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)!==T)throw new Error('serialisation differs');
const X="return UND.cure(it,{ans:'CHANGE',to:x.to},",Y="return UND.cure(it,{ans:'CHANGE',to:x.to,why:x.reason},";
const h=Lb.map((l,i)=>l.includes(X)?i:-1).filter(i=>i>=0);if(h.length!==1||Lb[h[0]].split(X).length!==2)throw new Error('anchor hits '+h.length);
Lb[h[0]]=Lb[h[0]].replace(X,()=>Y)+'';Lb[h[0]]=Lb[h[0]].replace('/* pkgGUB:','/* pkgGUR: the reason after "||" is read too (pkgUOR) */ /* pkgGUB:');
// rev 2 (W3 F1, Wall 5319): re-pack as pkgUOR does: each node's recorded length and the library sha follow the edited line
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');const n0={};for(const e in M)n0[e]=M[e].n;for(const e in M)M[e].n=reb(e).length;
for(const e in M)if(M[e].n!==n0[e])console.log('  rebuilt',e,n0[e],'->',M[e].n);
const LJ=JSON.stringify(Lb);const T2=(T.slice(0,a+8)+LJ+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)).replace(/(\/\/ library sha )[0-9a-f]{16}/,(x,h)=>h+crypto.createHash('sha256').update(LJ).digest('hex').slice(0,16));N.parameters.jsCode=T2;fs.writeFileSync(process.argv[3],JSON.stringify(W));
console.log(JSON.stringify({line:h[0],delta:T2.length-T.length,sha:crypto.createHash('sha256').update(fs.readFileSync(process.argv[3])).digest('hex').slice(0,16)}));
