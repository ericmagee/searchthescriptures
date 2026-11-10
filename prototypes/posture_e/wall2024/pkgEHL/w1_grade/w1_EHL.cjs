// W1 grade runner for pkgEHL (labels labels_EHL_w1.md). Offline. Usage from wall2024/: node pkgEHL/w1_grade/w1_EHL.cjs
const fs=require('fs');const IN='/mnt/project-files/wall2024/inputs/';
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const LIVE=g('/mnt/project-files/wall2024/fetchback_live_s108.json'),CAND=g('pkgEHL/parent_s108_EHL.json');
const cl=x=>JSON.parse(JSON.stringify(x));const store={};
const saved=(run,n)=>{const k=run+'|'+n;if(k in store)return store[k];const f=IN+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return store[k]=null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[d.length-1]:d;const m=(r&&r.data&&r.data.main)||(r&&r.main);return store[k]=(m&&m[0])||[];};
const run=async(W,RUN,node,inputNode,over)=>{const get=n=>over&&n in over?over[n]:(n==='Shared Library'?[]:saved(RUN,n));const code=n=>W.nodes.find(z=>z.name===n).parameters.jsCode;
 const mk=n=>{const it=get(n);const params={get jsCode(){return code(n);}};if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,params};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params};};
 const inp=(inputNode&&get(inputNode))||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp)};
 const RD=Date,FIX=new RD('2026-11-07T03:10:18.511Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;
 try{return await new Function('$','$input','$json','$execution','$workflow',"return (async()=>{\n"+code(node)+"\n})();")(mk,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'});}finally{global.Date=RD;}};
const out=[];const T=(c,m)=>{const s=(c?'OK   ':'FAIL ')+m;out.push(s);console.log(s);};
const withLine=(C,ci,re,lines)=>{const c=cl(C);const t=c[ci].json.choices[0].message.content.split('\n');const k=t.findIndex(l=>re.test(l));t.splice(k,1,...lines);c[ci].json.choices[0].message.content=t.join('\n');return c;};
const tal=async(W,r,rec,call,C,key)=>{const o=await run(W,r,rec,call,{[call]:C});const j=o[0].json;return JSON.stringify(j.enf428.tally[key])+' errors '+JSON.stringify(j.enf428.errors);};
(async()=>{
 const r='34108',call='Judge Enforcer Call deepseek',rec='Judge Enforcer Record';const C=saved(r,call);const re=/^ENFORCER: B3\.1 /;const L0=C[0].json.choices[0].message.content.split('\n').find(l=>re.test(l));const body=L0.replace(/^ENFORCER: B3\.1 -- DISAGREE -- /,'');
 const base=await tal(LIVE,r,rec,call,C,'E-ANS');console.log('headed on live: '+base);
 const P=async(l)=>[await tal(LIVE,r,rec,call,withLine(C,0,re,[l]),'E-ANS'),await tal(CAND,r,rec,call,withLine(C,0,re,[l]),'E-ANS')];
 for(const l of ['B3.1 -- DISAGREE -- '+body,'- B3.1 -- DISAGREE -- '+body,'• B3.1 -- DISAGREE -- '+body,'> B3.1 -- DISAGREE -- '+body,'**B3.1** -- DISAGREE -- '+body,'B3.1 — DISAGREE — '+body,'B3.1 (luna) -- DISAGREE -- '+body]){const [a,b]=await P(l);T(b===base,'H1 read: "'+l.slice(0,30)+'" live '+a.slice(0,70)+' | cand '+b.slice(0,70));}
 for(const l of ['1. B3.1 -- DISAGREE -- '+body,'B3.1: DISAGREE -- '+body,'ITEM B3.1 -- DISAGREE -- '+body,'luna (B3.1) -- DISAGREE -- '+body]){const [a,b]=await P(l);console.log('   H2 "'+l.slice(0,30)+'" '+(b===base?'read':'not read')+' | cand '+b.slice(0,80));}
 for(const l of ['B3.1 is answered by the layer named, '+body,'B3.1 -- the answer grants the press. '+body,'D6 -- STANDS -- '+body,'B999.1 -- DISAGREE -- '+body]){const [a,b]=await P(l);T(a===b,'H3 not read as live: "'+l.slice(0,30)+'" cand '+b.slice(0,80));}
 {const H=(v,h)=>(h?'ENFORCER: ':'')+'B3.1 -- '+v+' -- '+(v==='AGREE'?'RIGHT: MEETS':'RIGHT: MISSES')+' -- '+body;
  const hh=await tal(CAND,r,rec,call,withLine(C,0,re,[H('AGREE',1),H('DISAGREE',1)]),'E-ANS'),hn=await tal(CAND,r,rec,call,withLine(C,0,re,[H('AGREE',1),H('DISAGREE',0)]),'E-ANS');
  const hh2=await tal(CAND,r,rec,call,withLine(C,0,re,[H('DISAGREE',1),H('AGREE',1)]),'E-ANS'),nh=await tal(CAND,r,rec,call,withLine(C,0,re,[H('DISAGREE',0),H('AGREE',1)]),'E-ANS');
  T(hh===hn&&hh2===nh,'H4 order rule as two headed lines: headed+headed '+hh.slice(0,60)+' = headed+headless '+hn.slice(0,60)+'; reversed '+(hh2===nh));}
 // H5 Alt W line
 {const ra='33644',ca='Alt Judge Enforcer Call deepseek',rr='Alt Judge Enforcer Record';const A=saved(ra,ca);const rw=/^ENFORCER: W1\.1 /;const a0=await tal(CAND,ra,rr,ca,A,'K-S3');
  const l=A[4].json.choices[0].message.content.split('\n').find(l=>rw.test(l)).replace(/^ENFORCER: /,'');const lv=await tal(LIVE,ra,rr,ca,withLine(A,4,rw,[l]),'K-S3'),cv=await tal(CAND,ra,rr,ca,withLine(A,4,rw,[l]),'K-S3');
  T(cv===a0&&lv!==a0,'H5 Alt headless W1.1: headed '+a0.slice(0,70)+' | live headless '+lv.slice(0,70)+' | cand headless '+cv.slice(0,70));}
 // H6 retry build unchanged
 {const rb='Judge Enforcer Retry Build';const heads=C[0].json.choices[0].message.content.split('\n').filter(l=>/^ENFORCER: [A-Z]\d+\.\d+ /.test(l));const two=heads.slice(0,2);
  const mk=n=>{const c=cl(C);let t=c[0].json.choices[0].message.content;for(const l of heads.slice(0,n))t=t.replace(l,l.replace(/^ENFORCER: /,''));c[0].json.choices[0].message.content=t;return c;};
  for(const n of [0,1,2,heads.length]){const a=JSON.stringify(await run(LIVE,r,rb,call,{[call]:mk(n)}).catch(e=>'ERR '+e.message)),b=JSON.stringify(await run(CAND,r,rb,call,{[call]:mk(n)}).catch(e=>'ERR '+e.message));
   const w=(s)=>(s.match(/"esr_why":"[^"]*"/g)||[]).join(';').slice(0,120)||'no retry';T(a===b,'H6 Retry Build with '+n+' of '+heads.length+' lines headless in call 1: live = cand; '+w(b));}}
 console.log(out.filter(x=>x.startsWith('OK')).length+' OK, '+out.filter(x=>x.startsWith('FAIL')).length+' FAIL');})().catch(e=>console.log('ERROR '+e.stack));
