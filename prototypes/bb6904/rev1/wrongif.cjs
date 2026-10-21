// R4 wrong-if: for each replay row, the K-B items its verdict_raw flags must equal the items kb.cjs (form C, distinct
// layer kinds < 2) finds on the judge's own BROKEN collision lines, and each flagged item must carry one REPORT line
// with RESULT CURED or UNCURED. Fires (prints FIRED) on any difference, on a NULL verdict_raw, or on no rows.
const src=require('fs').readFileSync(__dirname+'/kb.cjs','utf8').split('\nconst L=JSON.parse')[0];
const exhibits=new Function(src+'\nreturn exhibits;')();
const rows=JSON.parse(require('fs').readFileSync(process.argv[2],'utf8'));
let fired=rows.length===0?['no rows']:[];
for(const r of rows){
  if(typeof r.verdict_raw!=='string'){fired.push(r.id+': verdict_raw NULL');continue;}
  const cut=r.verdict_raw.indexOf('\n\n[AUDIT v');const ans=cut>=0?r.verdict_raw.slice(0,cut):r.verdict_raw;
  let wt=ans;try{const j=JSON.parse(ans);wt=j.reasoning!=null?j.reasoning:(j.reason!=null?j.reason:ans);}catch(e){}
  const want=new Set();
  for(const line of String(wt).split('\n')){const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();
    const m=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m||!/^VS\.?\s/.test(m[2]))continue;
    const g=m[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);if(!g||g[1]==='UNDERDETERMINED')continue;
    const id=(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+m[1]])[1].replace(/\s+VS\.?\s+/,' vs ');
    if(exhibits(line,false,true,true)<2)want.add(id);}
  const got=new Set([...r.verdict_raw.matchAll(/\[AUDIT v21: DEBATE RULE VIOLATION -- (D\d+ vs C\d+) /g)].map(x=>x[1]));
  const miss=[...want].filter(x=>!got.has(x)),extra=[...got].filter(x=>!want.has(x));
  const norep=[...got].filter(x=>!new RegExp('ITEM: '+x+'; RULE: K-B; RESULT: (CURED|UNCURED)').test(r.verdict_raw));
  if(miss.length||extra.length||norep.length)fired.push(r.id+': missing '+JSON.stringify(miss)+' extra '+JSON.stringify(extra)+' no report '+JSON.stringify(norep));
  else console.log(r.id+': silent, '+want.size+' K-B item(s)');}
console.log(fired.length?'FIRED: '+fired.join(' | '):'SILENT');
