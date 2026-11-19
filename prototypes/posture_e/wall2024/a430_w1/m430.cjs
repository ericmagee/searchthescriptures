// ASK 430 measure (W1): replay the L2 chain (a405_w4/chain.cjs, real REST reads, cached) on the stored runs, live against the ASK 430 patch.
// Usage (from the folder holding debates.json and cache.json): node <repo>/a430_w1/m430.cjs <live fetch-back.json> > ../a430_w1/m430_out.txt
// Checks: tags, e340.eng, e340.ok, the judges' __GLOSS line and every e340.gloss row are equal, except rows whose status moves to FOUND.
// Any other change is a FAIL. Every row that moves is listed in full (run, side, round, number, gloss part, old status) for the hand read (C3).
const fs=require('fs'),path=require('path');const {replay,save,net}=require('./chain430.cjs');const P=require('./p430.cjs');
let live=JSON.parse(fs.readFileSync(process.argv[2]));live=live.workflow||live.data||live;
const L=live.nodes.find(n=>n.name==='L2 Count Plan').parameters.jsCode;const T=P(L);
const D=JSON.parse(fs.readFileSync('debates.json')).filter(r=>!process.env.ONLY||new RegExp(process.env.ONLY).test(r.run_token));
const tot={runs:0,errors:0,moved:0,runs_moved:0,fail:0};const out=[],fails=[];
for(const r of D){let A,B;try{A=replay(live,r);B=replay(live,r,{'L2 Count Plan':T});}catch(e){tot.errors++;fails.push(r.run_token+' ERROR '+e.message);continue;}tot.runs++;
 const a=A['L2 Count Plan'][0].json,b=B['L2 Count Plan'][0].json;const ea=a.e340||{},eb=b.e340||{};
 const f=m=>{tot.fail++;fails.push(r.run_token+' FAIL '+m);};
 if(JSON.stringify(a.tags)!==JSON.stringify(b.tags))f('tags differ');
 if(JSON.stringify(a.gloss)!==JSON.stringify(b.gloss))f('__GLOSS differs');
 for(const k of new Set([...Object.keys(ea),...Object.keys(eb)]))if(k!=='gloss'&&JSON.stringify(ea[k])!==JSON.stringify(eb[k]))f('e340.'+k+' differs');
 const ga=ea.gloss||[],gb=eb.gloss||[];if(ga.length!==gb.length){f('gloss rows '+ga.length+' -> '+gb.length);continue;}
 let m=0;ga.forEach((x,i)=>{const y=gb[i];if(JSON.stringify(x)===JSON.stringify(y))return;
  const {status:s1,lexicon:l1,...x0}=x,{status:s2,lexicon:l2,...y0}=y;
  if(JSON.stringify(x0)!==JSON.stringify(y0)||s2!=='FOUND'||!(s1==='NOT IN THE KJV RENDERINGS'||s1==='LEXICON WORDING')){f('row '+i+' '+JSON.stringify(x).slice(0,200)+' -> '+JSON.stringify(y).slice(0,200));return;}
  m++;out.push([r.run_token,x.side,x.round,x.num,'"'+x.part+'"',s1+' -> FOUND','kjv(first 24): '+(x.kjv||[]).join(', ')].join(' | '));});
 tot.moved+=m;if(m)tot.runs_moved++;}
save();console.log(JSON.stringify(tot),'net',net());fails.forEach(l=>console.log(l));console.log('--- MOVED TO FOUND ('+out.length+')');out.forEach(l=>console.log(l));
