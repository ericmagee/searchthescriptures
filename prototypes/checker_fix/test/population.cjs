// Population test for K-C: netLines old (base) and new over every debate_judgments.verdict_raw (the payload's reasoning) and every
// debate_results.independent_verdict_raw (the raw reply before the audit lines), read by SQL into data/population.json. Counts the marks
// (row, item) old and new, and prints the clause behind every mark removed or added, with the masked form the new code tests.
const fs=require('fs');const D=__dirname+'/../';const {netLib}=require('./lib.cjs');
const O=netLib(D+'base/Extract Independent Verdict.js'),N=netLib(D+'new/Extract Independent Verdict.js');
const src=fs.readFileSync(D+'new/Extract Independent Verdict.js','utf8');
const NM=new Function(src.slice(src.indexOf('const NET_STATE'),src.indexOf('function netLines'))+';return {netMask,NET_QUOTE,NET_STATE,NET_CONC};')();
const P=JSON.parse(fs.readFileSync(D+'data/population.json','utf8'));
function worked(x){let t=x.t||'';if(x.k[0]==='j'){const a=t.indexOf('{');if(a>=0){let d=0,q=false,e=-1;for(let i=a;i<t.length;i++){const c=t[i];if(q){if(c==='\\')i++;else if(c==='"')q=false;continue;}if(c==='"')q=true;else if(c==='{')d++;else if(c==='}'&&--d===0){e=i+1;break;}}
 if(e>0){try{const o=JSON.parse(t.slice(a,e));const w=o.reasoning!=null?o.reasoning:o.reason;if(typeof w==='string')return w;}catch(err){}}}}return t;}
let old=0,neu=0,rowsO=0,rowsN=0;const removed=[],added=[];
const SPLIT=/;|(?<=[.!?])\s+(?=[A-Z\[])|\s--\s|\s—\s/;
const oldClause=(line)=>line.split(SPLIT).find(cl=>O.NET_STATE.some(rx=>rx.test(cl)))||line;
for(const x of P){const w=worked(x);const a=O.netLines(w),b=N.netLines(w);old+=a.length;neu+=b.length;rowsO+=a.length>0;rowsN+=b.length>0;
 const key=m=>m.item+'\u0001'+m.line;const A=new Set(a.map(key)),B=new Set(b.map(key));
 for(const m of a)if(!B.has(key(m))){const cl=oldClause(m.line.replace(/[*_`]+/g,''));removed.push({row:x.k,item:m.item,clause:cl.trim(),hit:(cl.match(O.NET_STATE.find(rx=>rx.test(cl)))||[''])[0]});}
 for(const m of b)if(!A.has(key(m)))added.push({row:x.k,item:m.item,line:m.line.slice(0,300)});}
console.log('texts',P.length,'| old marks',old,'in',rowsO,'rows | new marks',neu,'in',rowsN,'rows | removed',removed.length,'| added',added.length);
const why=c=>{const q=c.replace(NM.NET_QUOTE,'"[quote]"');if(!NM.NET_STATE.some(rx=>rx.test(q)))return 'QUOTE';if(!NM.NET_STATE.some(rx=>rx.test(NM.netMask(c))))return 'ANSWER';return 'CONC';};
removed.forEach((r,i)=>console.log(`\n#${i+1} ${r.row} ${r.item} [${why(r.clause)}] hit "${r.hit}"\n   ${r.clause.slice(0,420)}`));
for(const a of added)console.log('ADDED',a.row,a.item,a.line);
