// W2: count the pkgDFR limit (negated differ/dispute read as open) in all stored text of the 12 exports, live s145 line 1898
const fs=require('fs');const D='/mnt/project-files/wall2024/';const X=JSON.parse(fs.readFileSync(D+'fetchback_live_s145.json','utf8'));const W=(X.data||X).workflow||(X.data||X);
const c=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const LIB=JSON.parse(c.slice(c.indexOf('\n/*LIB*/')+8,c.lastIndexOf('\n/*MAP*/')));
const O=new Function('return '+LIB[1898].trim().replace(/^const OPEN=/,'').replace(/;\s*$/,''))();
const NEG=/\b(?:not|never|no\s+longer|n't|nor)\s+(?:\w+\s+){0,2}(?:differ(?:s|ed|ing)?|disputing)\b/i;
let all=0,und=0,undNeg=0;const rows=new Set();
for(const e of fs.readdirSync(D).filter(x=>/^ex3\d+_full\.json$/.test(x))){const seen=new Set();
 const walk=v=>{if(typeof v==='string'){for(const l of v.split(/\n/)){const t=l.replace(/\\+"/g,'"');if(NEG.test(t)&&/differ|disputing/i.test(t))seen.add(t.trim().slice(0,400));}}else if(v&&typeof v==='object')for(const k in v)walk(v[k]);};
 walk(JSON.parse(fs.readFileSync(D+e,'utf8')).data.resultData.runData);
 for(const l of seen){all++;const u=/UNDERDETERMINED/.test(l);if(u)und++;if(u&&O.test(l)){undNeg++;}rows.add(e.slice(2,7)+(u?' [UNDERDET]':'')+(O.test(l)?' [OPEN reads]':'')+' '+l.slice(0,220));}}
console.log('distinct lines with a negated differ/disputing',all,'| in UNDERDETERMINED lines',und,'| of those read open by live line 1898',undNeg);[...rows].forEach(x=>console.log(' ',x));
