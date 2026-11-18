// ASK 381 child copy: the child's Shared Library parameters := the engine target's (byte-equal). Base child must equal live s262's library.
const fs=require('fs');const [ENG_BASE,ENG_T,CH,OUT]=process.argv.slice(2);
const rd=p=>{let x=JSON.parse(fs.readFileSync(p));if(x.result)x=x.result;if(x.data&&x.data.nodes)x=x.data;return x;};
const B=rd(ENG_BASE),T=rd(ENG_T),C=rd(CH);
const sl=w=>w.nodes.find(n=>n.name==='Shared Library');
if(JSON.stringify(sl(C).parameters)!==JSON.stringify(sl(B).parameters))throw new Error('child base library differs from engine base');
sl(C).parameters=JSON.parse(JSON.stringify(sl(T).parameters));
fs.writeFileSync(OUT,JSON.stringify(C));
const others=C.nodes.filter(n=>n.name!=='Shared Library').length;
console.log('child nodes',C.nodes.length,'| library replaced; other nodes untouched',others,'| child id',C.id||'(none)');
