// ASK 438 C2 (W2): live 2d40e6ad against target, L2 Gloss Plan replay on the stored runs (rp.cjs, shim.cjs).
const fs=require('fs');const {run}=require('./rp.cjs');const SH=require('./shim.cjs');
const LXr=JSON.parse(fs.readFileSync('lexall.json')).map(([strongs_number,original_script,transliteration,anchor_gloss])=>({strongs_number,original_script,transliteration,anchor_gloss}));
SH.setLex({get(url){const q=new URL(url).searchParams;const S=new Set(q.get('strongs_number').match(/^in\.\((.*)\)$/)[1].split(','));const sel=q.get('select').split(',');return LXr.filter(r=>S.has(r.strongs_number)).slice(0,+(q.get('limit')||1e9)).map(r=>{const o={};for(const c of sel)o[c]=r[c];return o;});}});
const [LV,TG]=process.argv.slice(2);const L=JSON.parse(fs.readFileSync(LV)),T=JSON.parse(fs.readFileSync(TG));const D=JSON.parse(fs.readFileSync('debates.json'));
// ASK 438 C4 (W2): L2 Count Plan replay, live 2d40e6ad against target, on 3 cut runs. Limits: renderings sets W/PH for the numbers are
// today's kjv_word_map (ren_c4.json, built by SQL the same way the node builds them) and injected in place of the REN builder; the
// transliteration column (col) and KJV word (kjv) reads are answered as failed in both, so TF is null in both.
const REN=JSON.parse(fs.readFileSync('../a438/ren_c4.json'));globalThis.__REN=REN;
const cl=x=>JSON.parse(JSON.stringify(x));
const OLDREN_A='const REN={};for(const x of pr.filter(y=>y.p.k===\'ren\')){';
function cp(wf,M){const node=n=>wf.nodes.find(x=>x.name===n);let src=node('L2 Count Plan').parameters.jsCode;
 const a=src.indexOf(OLDREN_A),b=src.indexOf('REN[n]={W,PH};}',a);if(a<0||b<0)throw new Error('REN builder not found');
 src=src.slice(0,a)+"const REN={};for(const x of pr.filter(y=>y.p.k==='ren')){const n=x.p.num;const z=globalThis.__REN[n];REN[n]=z?{W:new Set(z.W||[]),PH:new Set(z.PH||[])}:{why:'not in dump'};}"+src.slice(b+'REN[n]={W,PH};}'.length);
 const $=n=>{if(n==='Shared Library'){const x=node(n);return {params:x.parameters,isExecuted:false,first:()=>{throw new Error('ne')},all:()=>{throw new Error('ne')}};}const it=M[n];return it?{isExecuted:true,all:()=>cl(it),first:()=>cl(it[0])}:{isExecuted:false,all:()=>{throw new Error('Node not executed: '+n)},first:()=>{throw new Error('Node not executed: '+n)}};};
 const inp=M['L2 Gloss Plan'];return new Function('$','$input','$execution','$workflow','require',src)($,{all:()=>cl(inp),first:()=>cl(inp[0])},{id:'replay',customData:{set(){},get(){}}},{id:'moMxiV4Irg1uRBZN'},require);}
const res={};
for(const t of ['ODV1-37510-6gpyl6l8','ODV1-36677-0hxbzcd2','ODV1-35526-l5l9ej2s']){const r=D.find(x=>x.run_token===t);const out={};
 for(const [lab,W] of [['live',L],['target',T]]){const M=run(W,r,SH.get).M;M['L2 Gloss Read']=M['L2 Gloss Plan'].map(i=>({json:i.json.k==='ren'?{statusCode:200,body:[],headers:{'content-range':'*/0'}}:{statusCode:500,body:null,headers:{}}}));M['L2 Gloss Pages Plan']=[{json:{none:true}}];
  const o=cp(W,M);out[lab]=o[0].json.e340;}
 const key=g=>g.side+'|'+g.round+'|'+g.word+'|'+g.num+'|'+g.part;const A=new Map(out.live.gloss.map(g=>[key(g),g]));const B=new Map(out.target.gloss.map(g=>[key(g),g]));
 let changed=0,lost=0;for(const [k,g] of A){if(!B.has(k)){lost++;console.log(t,'LOST',k);continue;}const h=B.get(k);if(g.status!==h.status){changed++;console.log(t,'MOVED',k,g.status,'->',h.status);}}
 const st={};for(const [k,g] of B)if(!A.has(k))st[g.status]=(st[g.status]||0)+1;
 const ls={};for(const g of out.live.gloss)ls[g.status]=(ls[g.status]||0)+1;const ts={};for(const g of out.target.gloss)ts[g.status]=(ts[g.status]||0)+1;
 console.log(t,'rows live',A.size,'target',B.size,'| pre-existing rows lost',lost,'status changed',changed,'| new rows by status',JSON.stringify(st),'| live all',JSON.stringify(ls),'| target all',JSON.stringify(ts),'| eng equal',JSON.stringify(out.live.eng)===JSON.stringify(out.target.eng),'| why',JSON.stringify(out.target.why||'').slice(0,120));}
