// W2 ASK 432 measure: how often the Part B caps in live L2 Gloss Plan (engine 06967796) cut lines, on the stored runs.
// Caps: today's glosses 60 (gl.slice(0,60)); ASK 406 forms added only while <60 glosses and all numbers among the first 30;
// renderings read for the first 30 numbers (a gloss part of a later number becomes NO ANSWER "not read" in L2 Count Plan); candidate words 40.
const fs=require('fs');const {run}=require('./rp.cjs');const SH=require('./shim.cjs');
const LXr=JSON.parse(fs.readFileSync('lexall.json')).map(([strongs_number,original_script,transliteration,anchor_gloss])=>({strongs_number,original_script,transliteration,anchor_gloss}));
SH.setLex({get(url){const q=new URL(url).searchParams;const S=new Set(q.get('strongs_number').match(/^in\.\((.*)\)$/)[1].split(','));const sel=q.get('select').split(',');return LXr.filter(r=>S.has(r.strongs_number)).slice(0,+(q.get('limit')||1e9)).map(r=>{const o={};for(const c of sel)o[c]=r[c];return o;});}});
const wf=JSON.parse(fs.readFileSync('../eng06967796.json'));const D=JSON.parse(fs.readFileSync('debates.json'));
const L=wf.nodes.find(n=>n.name==='L2 Gloss Plan').parameters.jsCode;
const A="const G=gl.slice(0,60);",B="return {cand:[...cand].slice(0,40),gloss:G,n406:a406,d406};";
if(L.split(A).length!==2||L.split(B).length!==2)throw new Error('anchor');
const T=L.replace(A,"globalThis.__M432={gl:gl.map(g=>({nums:g.nums,parts:g.parts.length})),gl406:gl406.filter(g=>!seen.has(g.k)).map(g=>({nums:g.nums,parts:g.parts.length})),cand:cand.size};"+A)
 .replace(B,"globalThis.__M432.G=G.map(g=>({nums:g.nums,parts:g.parts.length}));globalThis.__M432.a406=a406;globalThis.__M432.d406=d406;"+B);
const tot={runs:0,err:0,r60:0,g60:0,p60:0,r406:0,g406:0,r30:0,n30:0,g30:0,p30:0,r40:0,c40:0,rAny:0};const lines=[];
for(const r of D){globalThis.__M432=null;let M;try{({M}=run(wf,r,SH.get,{'L2 Gloss Plan':T}));}catch(e){tot.err++;lines.push(r.run_token+' ERROR '+e.message);continue;}
 const live=run(wf,r,SH.get).M['L2 Gloss Plan'];const mine=M['L2 Gloss Plan'];if(JSON.stringify(live)!==JSON.stringify(mine)){lines.push(r.run_token+' PATCHED OUTPUT DIFFERS');tot.err++;}
 tot.runs++;const m=globalThis.__M432;if(!m){lines.push(r.run_token+' no gloss step');continue;}
 const g60=Math.max(0,m.gl.length-60),p60=m.gl.slice(60).reduce((s,g)=>s+g.parts,0);
 const N=[...new Set(m.G.flatMap(g=>g.nums))];const over=new Set(N.slice(30));
 const g30=m.G.filter(g=>g.nums.some(n=>over.has(n))).length;const p30=m.G.filter(g=>g.nums.some(n=>over.has(n))).reduce((s,g)=>s+g.parts,0);
 const c40=Math.max(0,m.cand-40);
 // uncapped: all of today's glosses plus every new-form gloss
 const NU=new Set(m.gl.concat(m.gl406).flatMap(g=>g.nums));
 if(g60){tot.r60++;tot.g60+=g60;tot.p60+=p60;}if(m.d406){tot.r406++;tot.g406+=m.d406;}if(over.size){tot.r30++;tot.n30+=over.size;tot.g30+=g30;tot.p30+=p30;}if(c40){tot.r40++;tot.c40+=c40;}
 if(g60||m.d406||over.size||c40)tot.rAny++;
 if(g60||m.d406||over.size||c40)lines.push(`${r.run_token} today ${m.gl.length} glosses (cut ${g60}, ${p60} parts) | new-form ${m.gl406.length} (kept ${m.a406}, cut ${m.d406}) | numbers ${N.length} (beyond 30: ${over.size}; ${g30} glosses, ${p30} parts NO ANSWER) | uncapped numbers ${NU.size} | candidates ${m.cand} (cut ${c40})`);
}
console.log(JSON.stringify(tot));lines.forEach(l=>console.log(l));
