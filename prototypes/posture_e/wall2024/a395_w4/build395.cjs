// ASK 395 build (plan rev 4, Wall 8221): one text of __RL. Text I (library L240-285, L2635, L287-288, L290-309, L2636, L312-318, L2637, L320-328)
// becomes text L (library L240-328) in every stub that carries it, and the same text-I block inline in code nodes becomes the text-L block, byte for byte.
// Usage: node build395.cjs IN OUT
const fs=require('fs');const acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const U=T.unpack(d);const L=U.L,M=U.M;
const IP=[[240,285],2635,[287,288],[290,309],2636,[312,318],2637,[320,328]];const LP=[[240,328]];
const idx=k=>Array.isArray(k)?Array.from({length:k[1]-k[0]+1},(_,j)=>k[0]+j):[k];
const I=IP.flatMap(idx).map(i=>L[i]).join('\n'),Lt=LP.flatMap(idx).map(i=>L[i]).join('\n');
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);const stubs=[];
for(const [k,m] of Object.entries(M)){for(let j=0;j+IP.length<=m.p.length;j++){if(IP.every((e,t)=>eq(m.p[j+t],e))){m.p.splice(j,IP.length,...LP);stubs.push(k);break;}}}
const nodes=[];for(const n of d.nodes){if(n.name==='Shared Library')continue;const j=n.parameters&&n.parameters.jsCode;if(typeof j!=='string')continue;const c=j.split(I).length-1;if(!c)continue;if(c!==1)throw new Error(n.name+': text I found '+c+' times');n.parameters.jsCode=j.replace(I,()=>Lt);nodes.push(n.name);}
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=U.hdr+'\n/*LIB*/'+JSON.stringify(L)+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});for(const k of Object.keys(M))P(T.rb(L,M[k]));for(const n of d.nodes){const j=n.parameters&&n.parameters.jsCode;if(nodes.includes(n.name))P(j);}
fs.writeFileSync(OUT,JSON.stringify(d));
console.log('stubs moved to text L',stubs.length,stubs.join('; '));console.log('inline nodes moved to text L',nodes.length,nodes.join('; '));console.log('MAP lengths changed',ch.length);
