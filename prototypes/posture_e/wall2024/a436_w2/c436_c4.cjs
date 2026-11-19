// ASK 438 C2 (W2): live 2d40e6ad against target, L2 Gloss Plan replay on the stored runs (rp.cjs, shim.cjs).
const fs=require('fs');const {run}=require('./rp.cjs');const SH=require('./shim.cjs');
const LXr=JSON.parse(fs.readFileSync('lexall.json')).map(([strongs_number,original_script,transliteration,anchor_gloss])=>({strongs_number,original_script,transliteration,anchor_gloss}));
SH.setLex({get(url){const q=new URL(url).searchParams;const S=new Set(q.get('strongs_number').match(/^in\.\((.*)\)$/)[1].split(','));const sel=q.get('select').split(',');return LXr.filter(r=>S.has(r.strongs_number)).slice(0,+(q.get('limit')||1e9)).map(r=>{const o={};for(const c of sel)o[c]=r[c];return o;});}});
const [LV,TG]=process.argv.slice(2);const L=JSON.parse(fs.readFileSync(LV)),T=JSON.parse(fs.readFileSync(TG));const D=JSON.parse(fs.readFileSync('debates.json'));
// ASK 436 grade (W2): L2 Count Plan replay, ASK 430 target against ASK 436 target, on 3 runs. Renderings sets (ren_c4.json) and per-word counts
// (ct_c4.json) from today's kjv_word_map by SQL, injected in place of the REN builder in both; col and kjv reads answered as failed in both.
const REN=JSON.parse(fs.readFileSync('../a438/ren_c4.json')),CT=JSON.parse(fs.readFileSync('../a438/ct_c4.json'));
const cl=x=>JSON.parse(JSON.stringify(x));const A0="const REN={};for(const x of pr.filter(y=>y.p.k==='ren')){";
function cp(wf,M){const node=n=>wf.nodes.find(x=>x.name===n);let src=node('L2 Count Plan').parameters.jsCode;
 const E=src.includes('REN[n]={W,PH,CT};}')?'REN[n]={W,PH,CT};}':'REN[n]={W,PH};}';const a=src.indexOf(A0),b=src.indexOf(E,a);if(a<0||b<0)throw new Error('REN builder not found');
 src=src.slice(0,a)+"const REN={};for(const x of pr.filter(y=>y.p.k==='ren')){const n=x.p.num;const z=globalThis.__REN[n];REN[n]=z?{W:new Set(z.W||[]),PH:new Set(z.PH||[]),CT:globalThis.__CT[n]||{}}:{why:'not in dump'};}"+src.slice(b+E.length);
 globalThis.__REN=REN;globalThis.__CT=CT;
 const $=n=>{if(n==='Shared Library'){const x=node(n);return {params:x.parameters,isExecuted:false,first:()=>{throw new Error('ne')},all:()=>{throw new Error('ne')}};}const it=M[n];return it?{isExecuted:true,all:()=>cl(it),first:()=>cl(it[0])}:{isExecuted:false,all:()=>{throw new Error('Node not executed: '+n)},first:()=>{throw new Error('Node not executed: '+n)}};};
 const inp=M['L2 Gloss Plan'];return new Function('$','$input','$execution','$workflow','require',src)($,{all:()=>cl(inp),first:()=>cl(inp[0])},{id:'replay',customData:{set(){},get(){}}},{id:'moMxiV4Irg1uRBZN'},require);}
for(const t of ['ODV1-37510-6gpyl6l8','ODV1-36677-0hxbzcd2','ODV1-35526-l5l9ej2s']){const r=D.find(x=>x.run_token===t);const o={};
 for(const [lab,W] of [['live',L],['target',T]]){const M=run(W,r,SH.get).M;M['L2 Gloss Read']=M['L2 Gloss Plan'].map(i=>({json:i.json.k==='ren'?{statusCode:200,body:[],headers:{'content-range':'*/0'}}:{statusCode:500,body:null,headers:{}}}));M['L2 Gloss Pages Plan']=[{json:{none:true}}];o[lab]=cp(W,M)[0].json;}
 const A=o.live.e340.gloss,B=o.target.e340.gloss;let diff=0,bad=0,other=0,printed=0;const shown=new Set();
 if(JSON.stringify({...o.live,e340:{...o.live.e340,gloss:0}})!==JSON.stringify({...o.target,e340:{...o.target.e340,gloss:0}}))other++;if(A.length!==B.length)other++;
 A.forEach((g,i)=>{const h=B[i];if(JSON.stringify({...g,kjv:0})!==JSON.stringify({...h,kjv:0}))other++;if(JSON.stringify(g.kjv)===JSON.stringify(h.kjv))return;diff++;if(h.status!=='FOUND')printed++;const n=g.num,W=REN[n].W.length;const exp=Object.entries(CT[n]||{}).sort((a,b)=>b[1]-a[1]||(a[0]<b[0]?-1:a[0]>b[0]?1:0)).map(x=>x[0]).slice(0,24).concat(W>24?['and '+(W-24)+' more']:[]);if(JSON.stringify(exp)!==JSON.stringify(h.kjv))bad++;if(W<=24&&JSON.stringify([...g.kjv].sort())!==JSON.stringify([...h.kjv].sort()))bad++;if(!shown.has(n)){shown.add(n);console.log(t,n,'('+W+' renderings, '+h.status+'):',h.kjv.join(', '));}});
 console.log(t,'| rows',A.length,'| kjv lists changed',diff,'(printed rows, not FOUND:',printed+') | wrong lists',bad,'| other differences',other);}
