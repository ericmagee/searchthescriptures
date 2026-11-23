// ASK 535 simulation rev b (W1). Adds V2: a fact with no proper name matches on 3 or more shared content words (prefix rule as EXT).
const fs=require('fs');eval(fs.readFileSync(__dirname+'/acx531_live.js','utf8'));
function shared(fact,seg){const W=acx531Norm(seg).split(' ');const nm=acx531Names(fact);const S=new Set(W);
 const hit=w=>S.has(w)||(nm.includes(w)&&w.length>=4&&W.some(x=>x.startsWith(w)&&x.length<=w.length+3));
 return {sh:acx531Content(fact).filter(hit),nm};}
function sameExt(fact,seg){const {sh,nm}=shared(fact,seg);return sh.length>=2&&sh.some(w=>nm.includes(w));}
function sameV2(fact,seg){const {sh,nm}=shared(fact,seg);return nm.length?(sh.length>=2&&sh.some(w=>nm.includes(w))):sh.length>=3;}
const C=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
for(const [j,rd,q,asks] of C.lines){const side=rd[0]==='C'?'CHALLENGER':'DEFENDER';
 const r=f=>C.facts[side].filter(x=>f(x,q)).map(x=>'"'+x+'" ['+shared(x,q).sh.join(',')+']');
 console.log('j'+j+' ['+rd+'] '+side+' :: "'+q.slice(0,70)+'"\n   531(q): '+(r(acx531Same).join('; ')||'none')+'\n   EXT(q): '+(r(sameExt).join('; ')||'none')+'\n   V2(q):  '+(r(sameV2).join('; ')||'none'));}
