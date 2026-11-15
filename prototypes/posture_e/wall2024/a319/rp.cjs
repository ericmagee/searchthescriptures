// ASK 319 replay: every stored E-ANS pkgABS CHANGE TO cure, live pwf vs rev 2 (pwf + condition 3), fit() stubbed as in t.cjs.
const fs=require('fs');const raw=JSON.parse(fs.readFileSync(process.argv[4],'utf8')).result;const s=raw.slice(raw.indexOf('[{"j"'),raw.lastIndexOf('}]')+2);const rows=JSON.parse(JSON.parse(s)[0].j?JSON.stringify(JSON.parse(s)[0].j):s);
const ld=f=>{const W=JSON.parse(fs.readFileSync(f));const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));};
const pre=L=>{const g=L.join('\n');const pick=re=>g.match(re)[0];return pick(/ const N=s=>String\(s==null\?'':s\)\.replace\(\/\\\\\+"\/g,'"'\);/)+pick(/ const AQ=\/ANSWER:[^\n]*?\$\/i;/);};
const fn=L=>{const s=L[2532];return s.slice(s.indexOf('function pwf'),s.indexOf(' function cure(it,a,ctx){'));};
const fitS=t=>/\[L1\]\s*(?:[1-3] )?[A-Z][a-z]+ \d{1,3}:\d{1,3}[^\[]*?["“]/.test(t)?'COUNTED':'NONE';
const mk=(L,nw)=>new Function('fit',pre(L)+fn(L)+';return (to,a,it)=>{if(/--\\s*(?:MISSES|FAILS)\\b/i.test(to))return "CURED misses";if(/^\\s*RETRACTED\\b/i.test(to))return "CURED retracted";if(/\\b(?:BROKEN|FORCED)\\b/.test(to))return "BREAK";const m=to.match(AQ);const f=fit(m?(m[1]+" || "+(m[3]||"")):to);if(f!=="COUNTED")return "UNCURED no fit";const g=pwf(to,a);if(g===null||fit(g)==="COUNTED"){'+(nw?'const c3=pwc3(to,it);if(c3)return "UNCURED c3";':'')+'return "CURED";}return "UNCURED pwf";};')(fitS);
const cN=mk(ld(process.argv[2]),1),cO=mk(ld(process.argv[3]),0);
const tally={};const diffs=[];
for(const r of rows){const x=r.resp.split(' || ');const to=(x.find(p=>/^CHANGE TO:/.test(p))||'').replace(/^CHANGE TO:\s*/,'');const why=x.slice(x.findIndex(p=>/^CHANGE TO:/.test(p))+1).join(' || ');const it={rule:'E-ANS',item:r.item};
 const o=cO(to,{why},it),n=cN(to,{why},it);const k=o+' -> '+n;tally[k]=(tally[k]||0)+1;if(o!==n)diffs.push({id:r.id,item:r.item,o,n,stored:r.st});
 if(r.id===40025)console.log('40025 replay:',o,'->',n);}
console.log('rows',rows.length);console.log(tally);console.log(JSON.stringify(diffs,null,1));
