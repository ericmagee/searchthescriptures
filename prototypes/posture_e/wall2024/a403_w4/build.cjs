// ASK 403 build (plan W1 8615): the engine's result tags and comments cite engine_manual by section, not by version. Offline; applies by text.
// Usage: node a403/build.cjs IN OUT engine|child
const fs=require('fs'),cr=require('crypto');const acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [IN,OUT,KIND]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const A='engine_manual v184 section 8',B='engine_manual section 8';
const U=T.unpack(d);const L=U.L,M=U.M;let nl=0;const lines=[];
for(let i=0;i<L.length;i++){const k=String(L[i]).split(A).length-1;if(k){nl+=k;lines.push(i+'x'+k);L[i]=L[i].split(A).join(B);}}
if(nl!==6)throw new Error('library count '+nl+' (want 6)');
let na=0;if(KIND==='engine'){const am=d.nodes.find(n=>n.name==='Alternate Merge');const c=am.parameters.jsCode;na=c.split(A).length-1;if(na!==1)throw new Error('Alternate Merge count '+na);am.parameters.jsCode=c.split(A).join(B);}
const other=d.nodes.filter(n=>n.name!=='Shared Library'&&n.name!=='Alternate Merge'&&JSON.stringify(n).includes(A)).map(n=>n.name);if(other.length)throw new Error('other nodes carry the text: '+other);
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});for(const k of Object.keys(M))P(T.rb(L,M[k]));
if(JSON.stringify(d.nodes).includes(A))throw new Error('text remains in nodes'); // activeVersion (the published copy) is not written by wgen
fs.writeFileSync(OUT,JSON.stringify(d));console.log(KIND,'library lines',lines.join(' '),'| Alternate Merge',na,'| MAP lengths changed',ch.length,'| lib sha',lsha);
