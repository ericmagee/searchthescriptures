// Population test for the K-C cure test (netKeeps): every stored K-C report whose STATEMENT holds a RESTATED line (stored cut at 600
// characters), read by SQL into data/kc_reports.json. Old: NET_STATE on the restated text; new: netKeeps. Prints every changed verdict.
const fs=require('fs');const D=__dirname+'/../';const RL=require('./replay_lib.cjs');
const s=fs.readFileSync(D+'new/Cure Check.js','utf8');const K=new Function(s.slice(s.indexOf('const NET_STATE'),s.indexOf('function netLines'))+';return {netKeeps,NET_STATE};')();
const R=JSON.parse(fs.readFileSync(D+'data/kc_reports.json','utf8'));let n=0,o=0,w=0;const ch=[];
for(const x of R){const m=x.l.match(/; STATEMENT: (.*?)(?=; JUDGE STATEMENT: )/);if(!m)continue;
 for(const st of RL.unbr(m[1]).split(' / ')){const r=st.match(/^RESTATED:\s*(?:(?:REASONING|KEYSTONE|RESULT|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*[:\-–—]+\s*)?(.*)$/i);if(!r)continue;
  n++;const a=K.NET_STATE.some(rx=>rx.test(r[1])),b=K.netKeeps(r[1]);o+=a;w+=b;if(a!==b)ch.push({k:x.k,stored:(x.l.match(/RESULT: (\w+)/)||[])[1],why:(x.l.match(/WHY: (.*?);/)||[])[1],old:a,new:b,text:r[1].slice(0,700)});}}
console.log('restated lines',n,'| keeps-ground old',o,'new',w,'| changed',ch.length);
ch.forEach((c,i)=>console.log(`\n#${i+1} ${c.k} stored ${c.stored} (${c.why||''}) old ${c.old} new ${c.new}\n   ${c.text}`));
