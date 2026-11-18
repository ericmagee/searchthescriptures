// ASK 382 build (plan rev 3, Wall 8076/8082/8085): the [L2] gloss check reads every rendering row of a Strong's number, not the first 1000.
// Method (rev 2 item 2): the first page (offset 0, limit 1000, count=exact) is read as today, now ordered by id. Only when its exact count is above 1000
// does a second pass read offsets 1000, 2000, ... up to the count, with a ceiling of 10 pages a number. Wiring: a second plan and HTTP pass,
// three new nodes (L2 Gloss Pages Plan, L2 Gloss Pages Any, L2 Gloss Pages Read) between L2 Gloss Read and L2 Count Plan. Offline.
// Usage: node build382.cjs IN OUT
const fs=require('fs'),cr=require('crypto'),acorn=require('../tools/node_modules/acorn');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const N=nm=>{const n=d.nodes.find(x=>x.name===nm);if(!n)throw new Error('no node '+nm);return n;};
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
const rep=(nm,o,n)=>{const x=N(nm);const c=x.parameters.jsCode;if(c.split(o).length!==2)throw new Error(nm+': old text found '+(c.split(o).length-1));x.parameters.jsCode=c.replace(o,()=>n);P(x.parameters.jsCode);};
// 1. L2 Gloss Plan: the ren read is ordered by id (rev 2 item 1)
rep('L2 Gloss Plan',"url:SB+'kjv_word_map?select=kjv_word,book,chapter,verse,word_position&strongs_number=eq.'+n+'&limit=1000',prefer:'count=exact'}",
 "url:SB+'kjv_word_map?select=kjv_word,book,chapter,verse,word_position&strongs_number=eq.'+n+'&order=id&limit=1000',prefer:'count=exact'} /* ASK 382: order=id, a stable key for the pages */");
// 2. L2 Count Plan: join the pages for a number in offset order; build REN only when the joined rows equal the exact count
rep('L2 Count Plan',"const REN={};for(const x of pr.filter(y=>y.p.k==='ren')){",
 "const __PG382=(()=>{const o={};let P2=[],R2=[];try{const n=$('L2 Gloss Pages Plan');if(n.isExecuted)P2=n.all().map(i=>i.json);}catch(e){P2=[];}try{const n=$('L2 Gloss Pages Read');if(n.isExecuted)R2=n.all().map(i=>i.json);}catch(e){R2=[];}if(!P2.length||P2[0].none||R2.length!==P2.length)return o;const pg={};P2.forEach((p,i)=>{(pg[p.num]=pg[p.num]||[]).push({off:+p.offset,r:R2[i]});});for(const n of Object.keys(pg)){const L=pg[n].sort((a,b)=>a.off-b.off);if(L.every(x=>good(x.r)))o[n]=L.map(x=>x.r.body);}return o;})(); /* ASK 382: the further pages of each ren read, joined in offset order; a number with any failed page gets none, so it keeps the refusal */\n  const REN={};for(const x of pr.filter(y=>y.p.k==='ren')){");
rep('L2 Count Plan',"if(tt==null||x.r.body.length!==tt){REN[n]={why:'the read holds '+x.r.body.length+' of '+(tt==null?'an unknown number of':tt)+' rows (limit 1000)'};continue;}\n   const rows=x.r.body.slice().sort(",
 "const __b=x.r.body.concat(...(__PG382[n]||[])); /* ASK 382 */if(tt==null||__b.length!==tt){REN[n]={why:'the read holds '+__b.length+' of '+(tt==null?'an unknown number of':tt)+' rows ('+(__PG382[n]?(1+__PG382[n].length)+' pages of 1000':'limit 1000')+')'};continue;}\n   const rows=__b.slice().sort(");
// 3. three new nodes
const g=N('L2 Gloss Read'),a=N('L2 Gloss Any');const uid=s=>{const h=cr.createHash('sha1').update('ASK382 '+s).digest('hex');return h.slice(0,8)+'-'+h.slice(8,12)+'-5'+h.slice(13,16)+'-a'+h.slice(17,20)+'-'+h.slice(20,32);};
const PLAN=`/* ASK 382 (plan rev 3, Wall 8076/8082/8085): the second pass of the [L2] rendering read. For each ren read of L2 Gloss Plan whose first page holds 1000 rows of an exact count above 1000, one item per further page: offsets 1000, 2000, ... below the count, at most 9 more (10 pages a number). Same URL, ordered by id. No such number: one item {none:true}, and no read is made. */
let P=[],R=[];try{P=$('L2 Gloss Plan').all().map(i=>i.json);}catch(e){P=[];}try{const n=$('L2 Gloss Read');if(n.isExecuted)R=n.all().map(i=>i.json);}catch(e){R=[];}
const tot=r=>{const h=(r&&r.headers)||{};const m=String(h['content-range']||h['Content-Range']||'').match(/\\/(\\d+)\\s*$/);return m?+m[1]:null;};
const good=r=>!!r&&!r.error&&(r.statusCode===200||r.statusCode===206)&&Array.isArray(r.body);
const out=[];if(R.length===P.length)P.forEach((p,i)=>{if(!p||p.k!=='ren')return;const r=R[i];if(!good(r))return;const t=tot(r);if(t==null||t<=1000||r.body.length!==1000)return;for(let o=1000;o<t&&o<10000;o+=1000)out.push({k:'ren_page',num:p.num,offset:o,total:t,url:p.url+'&offset='+o,prefer:'count=exact'});});
if(!out.length)return [{json:{none:true}}];
return out.map(j=>({json:j}));`;
P(PLAN);
const nPlan={parameters:{jsCode:PLAN},id:uid('plan'),name:'L2 Gloss Pages Plan',type:'n8n-nodes-base.code',typeVersion:2,executeOnce:true,position:[9056,680]};
const nAny=JSON.parse(JSON.stringify(a));nAny.id=uid('any');nAny.name='L2 Gloss Pages Any';nAny.position=[9176,680];nAny.parameters.conditions.conditions[0].id='gloss-pages-any-382';
const nRead=JSON.parse(JSON.stringify(g));nRead.id=uid('read');nRead.name='L2 Gloss Pages Read';nRead.position=[9296,680];
d.nodes.push(nPlan,nAny,nRead);
// 4. wiring: L2 Gloss Read -> Pages Plan -> Pages Any -> (true) Pages Read -> L2 Count Plan; (false) -> L2 Count Plan
const C=d.connections;const link=n=>({node:n,type:'main',index:0});
if(JSON.stringify(C['L2 Gloss Read'])!==JSON.stringify({main:[[link('L2 Count Plan')]]}))throw new Error('L2 Gloss Read wiring changed');
C['L2 Gloss Read']={main:[[link('L2 Gloss Pages Plan')]]};C['L2 Gloss Pages Plan']={main:[[link('L2 Gloss Pages Any')]]};
C['L2 Gloss Pages Any']={main:[[link('L2 Gloss Pages Read')],[link('L2 Count Plan')]]};C['L2 Gloss Pages Read']={main:[[link('L2 Count Plan')]]};
fs.writeFileSync(OUT,JSON.stringify(d));console.log('changed: L2 Gloss Plan, L2 Count Plan; added:',[nPlan,nAny,nRead].map(n=>n.name+' '+n.id).join('; '));
