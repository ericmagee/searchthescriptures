// ASK 373 replay: every stored line that begins RESTATED, read by the live s252 reader and the target, in the library and the 6 node copies.
const fs=require('fs');const {unpack,rb,load}=require('../tools/lib.cjs');
const A=JSON.parse(fs.readFileSync('../rdf/fetchback_s252.json')),Bw=JSON.parse(fs.readFileSync('target_373.json'));
const $=()=>({isExecuted:false,all:()=>[],first:()=>({json:{}})});
const NODES=['Build Save Body','Format Markdown','Enforcer Build','Judge Enforcer Retry Build','Alt Judge Enforcer Retry Build','R2 Alt Judge Enforcer Retry Build'];
const libX=w=>{const u=unpack(w);return load(rb(u.L,u.M['Cure Normalize']),$);};
const libJ=w=>{const u=unpack(w);return load(rb(u.L,u.M['Judge Enforcer Build']),$);};
const nodeX=(w,nm)=>{const s=w.nodes.find(n=>n.name===nm).parameters.jsCode;const i=s.indexOf('const __RL=');const j=s.indexOf('return module.exports;})();',i)+'return module.exports;})();'.length;return new Function('$','return '+s.slice(i+'const __RL='.length,j).replace(/;$/,''))($);};
const O={lib:libX(A),libJ:libJ(A),nodes:NODES.map(n=>nodeX(A,n))},N={lib:libX(Bw),libJ:libJ(Bw),nodes:NODES.map(n=>nodeX(Bw,n))};
const sum=r=>r?JSON.stringify({form:r.form||null,tried:r.tried||null,code:r.code||null,restated:!!(r.f&&r.f.restated),link:r.f&&(r.f.link||r.f.pair)||null,grade:r.f&&r.f.grade||null}):'null';
const cure=(X,l)=>{const o=X.cureLines(l);return JSON.stringify({restated:o.restated.map(r=>[r.link,r.grade]),malformed:o.malformed.length,prose:o.prose.length});};
const read=(X,l)=>{const out={lib:sum(X.lib.__RL.readLine(l)),libJ:sum(X.libJ.__RL.readLine(l))};NODES.forEach((n,i)=>out[n]=sum(X.nodes[i].readLine(l)));out.cure=cure(X.lib,l);return out;};
const src=JSON.parse(fs.readFileSync('src373.json'));
const lines=process.argv[2]==='plants'?JSON.parse(fs.readFileSync('plants.json')).map(l=>({line:l,ids:['plant'],kinds:[]})):src.lines;
let changed=[],same=0,incons=0;
for(const x of lines){const o=read(O,x.line),n=read(N,x.line);
 const vo=new Set(Object.entries(o).filter(([k])=>k!=='cure'&&k!=='libJ').map(e=>e[1])),vn=new Set(Object.entries(n).filter(([k])=>k!=='cure'&&k!=='libJ').map(e=>e[1]));if(vo.size>1||vn.size>1)incons++;
 if(JSON.stringify(o)===JSON.stringify(n)){same++;if(process.argv[2]==='plants')console.log('UNCHANGED',o.lib,o.cure,'::',x.line.slice(0,90));continue;}
 changed.push({ids:x.ids,kinds:x.kinds,line:x.line.slice(0,160),old:o.lib,new:n.lib,oldJ:o.libJ,newJ:n.libJ,oldCure:o.cure,newCure:n.cure});}
console.log('lines',lines.length,'unchanged',same,'changed',changed.length,'copies disagree',incons);
for(const c of changed)console.log(JSON.stringify(c,null,1));
if(process.argv[3]==='dis'){for(const x of lines){for(const [nm,X] of [['old',O],['new',N]]){const r=read(X,x.line);const v=Object.entries(r).filter(([k])=>k!=='cure'&&k!=='libJ');if(new Set(v.map(e=>e[1])).size>1)console.log(nm,x.line.slice(0,50),JSON.stringify(v.map(([k,s])=>k+'='+JSON.parse(s).form)))}}}
