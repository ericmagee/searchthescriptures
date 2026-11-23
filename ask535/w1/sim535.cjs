// ASK 535 simulation (W1). acx531_live.js = the live acx531* functions (engine 04450043, Library), verbatim.
// A demand in [CRn] (defender's round) is tested against the CHALLENGER's ASSUMES facts; a demand in [DRn] against the DEFENDER's.
const fs=require('fs');eval(fs.readFileSync(__dirname+'/acx531_live.js','utf8'));
// EXT: a fact's proper name also matches a word that begins with it (David -> Davidic), names of 4+ letters only.
function sameExt(fact,seg){const W=acx531Norm(seg).split(' ');const nm=acx531Names(fact);const S=new Set(W);
 const hit=w=>S.has(w)||(nm.includes(w)&&w.length>=4&&W.some(x=>x.startsWith(w)&&x.length<=w.length+3));
 const sh=acx531Content(fact).filter(hit);return sh.length>=2&&sh.some(w=>nm.includes(w));}
const C=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
for(const [j,rd,q,asks] of C.lines){const side=rd[0]==='C'?'CHALLENGER':'DEFENDER';const seg=q+' '+asks;
 const a=C.facts[side].filter(f=>acx531Same(f,seg)),b=C.facts[side].filter(f=>sameExt(f,seg));
 console.log('j'+j+' ['+rd+'] vs '+side+' facts | 531 test: '+(a.length?JSON.stringify(a):'none')+' | EXT: '+(b.length?JSON.stringify(b):'none')+' :: "'+q.slice(0,60)+'"');}
