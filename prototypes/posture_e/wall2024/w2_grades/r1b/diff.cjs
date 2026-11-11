// W2 R1b grade step 1: independent size, structure and source equality (live s119 vs parent_s119_R1b.json)
const fs=require('fs');const {rebuild}=require('../../pkgLIB/unpack.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const A=g('/mnt/project-files/wall2024/fetchback_live_s119.json'),B=g('/mnt/project-files/wall2024/parent_s119_R1b.json');
const code=W=>W.nodes.reduce((s,n)=>s+(typeof n.parameters?.jsCode==='string'?n.parameters.jsCode.length:0),0);
const nonc=W=>W.nodes.reduce((s,n)=>{const p={...n.parameters};delete p.jsCode;return s+JSON.stringify(p).length;},0);
console.log('nodes',A.nodes.length,B.nodes.length,'code',code(A),code(B),'diff',code(B)-code(A),'non-code params',nonc(A),nonc(B));
console.log('connections equal',JSON.stringify(A.connections)===JSON.stringify(B.connections));
const la=A.nodes.find(n=>n.name==='Shared Library').parameters.jsCode,lb=B.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const isStub=s=>typeof s==='string'&&s.includes('\nreturn await new Function(');
const eff=(s,lib)=>isStub(s)?rebuild(s,lib):s;
let ch=0,eq=0,neq=[],other=[];const changed=[];
for(const a of A.nodes){const b=B.nodes.find(x=>x.name===a.name);if(!b){other.push('missing '+a.name);continue;}
 const pa={...a,parameters:{...a.parameters}},pb={...b,parameters:{...b.parameters}};delete pa.parameters.jsCode;delete pb.parameters.jsCode;
 if(JSON.stringify(pa)!==JSON.stringify(pb))other.push('non-code change '+a.name);
 const sa=a.parameters.jsCode,sb=b.parameters.jsCode;if(sa===sb||a.name==='Shared Library')continue;ch++;changed.push(a.name);
 let ea,eb;try{ea=eff(sa,la);eb=eff(sb,lb);}catch(x){neq.push(a.name+' ERR '+x.message);continue;}
 if(ea===eb)eq++;else neq.push(a.name+' live '+ea.length+' r1b '+eb.length);}
// also: unchanged stubs must rebuild the same under the new library
let us=0,usBad=[];for(const a of A.nodes){const b=B.nodes.find(x=>x.name===a.name);if(a.name==='Shared Library'||a.parameters.jsCode!==b.parameters.jsCode||!isStub(a.parameters.jsCode))continue;us++;if(rebuild(a.parameters.jsCode,la)!==rebuild(b.parameters.jsCode,lb))usBad.push(a.name);}
console.log('changed nodes (excl. library)',ch,'effective source equal',eq,'not equal',JSON.stringify(neq));
console.log('unchanged stubs',us,'rebuild differently under new library',JSON.stringify(usBad));
console.log('other',JSON.stringify(other));
fs.writeFileSync(__dirname+'/changed.json',JSON.stringify(changed));
// stub template params
const s1=B.nodes.find(n=>n.name===changed[0]).parameters.jsCode;console.log('stub sample:\n'+s1);
