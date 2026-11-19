// ASK 436 measure (W1): replay the L2 chain (a430_w1/chain430.cjs, cached REST reads) on the stored runs: base = live L2 Count Plan with ASK 430 (p430.cjs),
// target = base with ASK 436 (p436.cjs). Usage (from the folder holding debates.json and cache.json): node <repo>/a436_w1/m436.cjs <live fetch-back.json> > ../a436_w1/m436_out.txt
// FAIL: tags, __GLOSS, any e340 field other than gloss, row count, or any gloss row field other than kjv differs; a changed list whose old list had under 24 words
// is not the same word set; a list of 25 entries whose last is not "and N more" (N>0) or whose first 24 are not the old words' superset rule. Every changed list is printed once per number.
const fs=require('fs');const {replay,save,net}=require('../a430_w1/chain430.cjs');const P430=require('../a430_w1/p430.cjs'),P436=require('./p436.cjs');
let live=JSON.parse(fs.readFileSync(process.argv[2]));live=live.workflow||live.data||live;
const L=live.nodes.find(n=>n.name==='L2 Count Plan').parameters.jsCode;const A0=P430(L),B0=P436(A0);
const D=JSON.parse(fs.readFileSync('debates.json')).filter(r=>!process.env.ONLY||new RegExp(process.env.ONLY).test(r.run_token));
const tot={runs:0,errors:0,rows_changed:0,runs_changed:0,cut_lists:0,fail:0};const fails=[],shown=new Map();
for(const r of D){let A,B;try{A=replay(live,r,{'L2 Count Plan':A0});B=replay(live,r,{'L2 Count Plan':B0});}catch(e){tot.errors++;fails.push(r.run_token+' ERROR '+e.message);continue;}tot.runs++;
 const a=A['L2 Count Plan'][0].json,b=B['L2 Count Plan'][0].json;const ea=a.e340||{},eb=b.e340||{};const f=m=>{tot.fail++;fails.push(r.run_token+' FAIL '+m);};
 if(JSON.stringify(a.tags)!==JSON.stringify(b.tags))f('tags differ');if(JSON.stringify(a.gloss)!==JSON.stringify(b.gloss))f('__GLOSS differs');
 for(const k of new Set([...Object.keys(ea),...Object.keys(eb)]))if(k!=='gloss'&&JSON.stringify(ea[k])!==JSON.stringify(eb[k]))f('e340.'+k+' differs');
 const ga=ea.gloss||[],gb=eb.gloss||[];if(ga.length!==gb.length){f('gloss rows '+ga.length+' -> '+gb.length);continue;}let m=0;
 ga.forEach((x,i)=>{const y=gb[i];const {kjv:k1,...x0}=x,{kjv:k2,...y0}=y;if(JSON.stringify(x0)!==JSON.stringify(y0)){f('row '+i+' fields other than kjv differ');return;}
  if(JSON.stringify(k1)===JSON.stringify(k2))return;m++;const o=k1||[],nw=k2||[];
  if(o.length<24){if(nw.length!==o.length||[...nw].sort().join()!==[...o].sort().join())f('row '+i+' '+x.num+' word set changed under 24');}
  else if(nw.length===25){const mm=/^and (\d+) more$/.exec(nw[24]);if(!mm||+mm[1]<1)f('row '+i+' '+x.num+' last entry '+nw[24]);else tot.cut_lists++;}
  else if(nw.length===24){if([...nw].sort().join()!==[...o].sort().join())f('row '+i+' '+x.num+' 24 words, set changed');}
  else f('row '+i+' '+x.num+' list length '+nw.length);
  if(!shown.has(x.num))shown.set(x.num,[r.run_token,x.status,'old: '+o.join(', '),'new: '+nw.join(', ')].join(' | '));});
 tot.rows_changed+=m;if(m)tot.runs_changed++;}
save();console.log(JSON.stringify(tot),'net',net());fails.forEach(l=>console.log(l));console.log('--- CHANGED LISTS, one per number ('+shown.size+')');for(const [n,l] of shown)console.log(n+' | '+l);
