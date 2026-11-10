// Plants for the K2, K3, K5 guards (W1, bloat check). Chain replay of 34626 from Panel Cure Check with a hook on its output.
// P1: every judge's D6 collision lines lose the engine mark (as if the judge had written DEFENDER LINK BROKEN itself, which cureRecompute leaves unmarked); the stored replies then change them.
// P2: every judge's D6 collision and FORCED lines are removed (a confirmed closing break on a link no collision line names).
// Usage: KEYNOLINE=1 node pkgKSR/plants_KSR.cjs <SET> <P1|P2>
const chain=require('./chain.cjs');const [SET,P]=process.argv.slice(2);
const MK=/ -- \[AUDIT: LINK 6 BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- DEFENDER -- EARLIER(?:(?!\\n|\n).)*?\\*"\]/g;
const walk=(v,f)=>typeof v==='string'?f(v):Array.isArray(v)?v.map(x=>walk(x,f)):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,walk(x,f)])):v;
const dropD6=s=>s.split(/(\n|\\n)/).filter((l,i,a)=>!/^\s*(?:FORCED:\s*)?\**D6 vs C\d/.test(l)).join('');
let n=0;const hook=(nm,over)=>{if(nm!=='Panel Cure Check')return;over[nm]=[over[nm][0].map(it=>({json:{...it.json,bodies:walk(it.json.bodies,s=>{const t=P==='P1'?s.replace(MK,()=>{n++;return ' -- the defender contradicted himself in closing';}):dropD6(s);if(P==='P2'&&t!==s)n++;return t;})}}))];};
(async()=>{const r=await chain(SET,'Panel Cure Check',null,hook);if(r.err){console.log('ERROR '+r.err);return;}console.log(SET+' '+P+': strings changed by the plant: '+n);
 const b=r.over['Replay Rows'][0][0].json.body;const rows=(typeof b==='string'?JSON.parse(b):b).p_rows;
 for(const w of rows){const raw=String(w.verdict_raw).replace(/\\n/g,'\n');console.log('== '+w.judge_seat+' | '+((raw.match(/(?:^|\n)\s*KEYSTONE: D6 -- [^\n]{0,90}/)||['KEYSTONE none'])[0].trim())+' | RESULT '+w.result_line+' | drv_uncured '+JSON.stringify(w.drv_uncured));
  for(const l of raw.split('\n').filter(l=>/KEYSTONE/.test(l)&&/AUDIT v(3[5-9]|4\d)|E-KEY|K-RECHK|D38|SEND-BACK ITEM/.test(l)))console.log('   '+l.slice(0,300));}})();
