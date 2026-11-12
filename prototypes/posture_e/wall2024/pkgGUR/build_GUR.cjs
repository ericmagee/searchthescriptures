// pkgGUR (W2): the pkgGUB check reads the gate change's reason too. __gub cures a gate change of an E-APPLY UNDERDETERMINED line through
// UND.cure, but passed only the line (to). Since pkgUOR the open point and the [L1] may stand in the reason after "||"; the gate row
// carries that reason as x.reason. Library line of __gub: {ans:'CHANGE',to:x.to} -> {ans:'CHANGE',to:x.to,why:x.reason}.
// Usage: node build_GUR.cjs <parent workflow json> <out json>
const fs=require('fs'),crypto=require('crypto');const W=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const N=W.nodes.find(z=>z.name==='Shared Library');const T=N.parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
if(T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c)!==T)throw new Error('serialisation differs');
const X="return UND.cure(it,{ans:'CHANGE',to:x.to},",Y="return UND.cure(it,{ans:'CHANGE',to:x.to,why:x.reason},";
const h=Lb.map((l,i)=>l.includes(X)?i:-1).filter(i=>i>=0);if(h.length!==1||Lb[h[0]].split(X).length!==2)throw new Error('anchor hits '+h.length);
Lb[h[0]]=Lb[h[0]].replace(X,()=>Y)+'';Lb[h[0]]=Lb[h[0]].replace('/* pkgGUB:','/* pkgGUR: the reason after "||" is read too (pkgUOR) */ /* pkgGUB:');
const T2=T.slice(0,a+8)+JSON.stringify(Lb)+T.slice(b,b+8)+JSON.stringify(M)+T.slice(c);N.parameters.jsCode=T2;fs.writeFileSync(process.argv[3],JSON.stringify(W));
console.log(JSON.stringify({line:h[0],delta:T2.length-T.length,sha:crypto.createHash('sha256').update(fs.readFileSync(process.argv[3])).digest('hex').slice(0,16)}));
