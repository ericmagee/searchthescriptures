// applies W2's tightening (Wall 6350, c757a34b) to spc.js to make rev 2
const fs=require('fs');let p=fs.readFileSync('spc_rev1.js','utf8');const src=fs.readFileSync('w2_tighten.cjs','utf8');
const A="const CR=L2C.refsIn(tail).filter(k=>";const S0="(?<=[.!?;])[\"”'’)\\]]*\\s+(?=[\"“'‘(*_\\[]*[A-Z0-9])/)";const A3="for(const k of CR){if(hit.includes(k))continue;";
for(const a of [A,S0,A3])if(p.split(a).length!==2)throw 'anchor '+a;
const CUE=eval('String.raw`'+src.split('String.raw`')[1].split('`;\np=p.replace')[0]+'`');
p=p.replace(A,()=>CUE+"const CR=L2C.refsIn(tail).filter(k=>__cue(tail,k)&&")
 .replace(S0,()=>"(?<=[^.][.!?;]|[!?;])[\"”'’)\\]]*\\s+(?=[\"“'‘(*_\\[]*[A-Za-z0-9\\u00C0-\\u024F])/)")
 .replace(A3,()=>A3+"if(NM.some((o,jj)=>jj!==j&&(IX.V[k]||[]).some(r=>L2C.numOf(r.strongs_number)===o[1]+o[2])))continue;");
fs.writeFileSync('spc.js',p);console.log('spc.js',p.length);
