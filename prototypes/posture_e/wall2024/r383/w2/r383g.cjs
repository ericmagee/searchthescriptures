const fs=require('fs');const [,,fR,f7,f6]=process.argv;
const ld=f=>{const W=JSON.parse(fs.readFileSync(f,'utf8'));return W.nodes||W.data.nodes;};
const parts=ns=>{const T=ns.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/');return {LIB:JSON.parse(T.slice(a+8,b)),MAPtxt:T.slice(b+8),head:T.slice(0,a)};};
const R=parts(ld(fR)),S7=parts(ld(f7)),S6=parts(ld(f6));
console.log('LIB lens',R.LIB.length,S7.LIB.length,S6.LIB.length,'head eq',R.head===S7.head);
const d7=[],d6=[],d76=[];for(let i=0;i<R.LIB.length;i++){if(R.LIB[i]!==S7.LIB[i])d7.push(i);if(R.LIB[i]!==S6.LIB[i])d6.push(i);if(S7.LIB[i]!==S6.LIB[i])d76.push(i);}
console.log('R vs s207:',d7.join(','));console.log('R vs s206:',d6.join(','));console.log('s207 vs s206:',d76.join(','));
for(const i of d7)console.log(i,'s207',S7.LIB[i].length,'R',R.LIB[i].length,'s206',S6.LIB[i].length,'R==s206',R.LIB[i]===S6.LIB[i]);
fs.writeFileSync(process.env.OUT||'/dev/null',JSON.stringify({R:R.LIB,S7:S7.LIB,S6:S6.LIB,MR:R.MAPtxt,M7:S7.MAPtxt}));
console.log('MAP txt len',R.MAPtxt.length,S7.MAPtxt.length, R.MAPtxt.slice(0,300));
