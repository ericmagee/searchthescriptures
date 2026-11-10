// pkgCCM test: bodyFor of live s115 and the candidate, run on the stored C2/C3/C4 request bodies (inputs/).
// T1 live bodyFor on the rebuilt (sys, msgs) reproduces the stored body byte for byte (harness check).
// T2 candidate body equals live body with every cache_control on messages removed, then (C2 only) message 0 marked.
// T3 candidate C2 message 0 equals the stored C1 message 0 byte for byte (the cache entry C1 wrote); system equal to C1's.
// T4 system blocks and every message text identical between live and candidate (nothing the debater reads changes).
const fs=require('fs');const W=f=>JSON.parse(fs.readFileSync(f));const L=W('/mnt/project-files/wall2024/fetchback_live_s115.json'),C=W('/mnt/project-files/wall2024/parent_s115_CCM.json');
const mk=(w,n)=>{const s=w.nodes.find(x=>x.name===n).parameters.jsCode;const a=s.indexOf("const __RND=");const b=s.indexOf('const bodyFor=');const e=s.indexOf('messages:m};};',b)+14;
 return new Function('__L','$',s.slice(a,e)+'\nreturn bodyFor;')({},()=>{});};
const d='/mnt/project-files/wall2024/inputs/';const body=f=>{try{const j=JSON.parse(fs.readFileSync(d+f));const x=Array.isArray(j)?j[0]:j;return ((x.data||x).main[0][0].json).call.body;}catch(e){return null;}};
const unwrap=m=>({role:m.role,content:Array.isArray(m.content)?m.content.map(c=>c.text).join(''):m.content});
const strip=b=>JSON.parse(JSON.stringify(b,(k,v)=>k==='cache_control'&&false?undefined:v));
let R={T1:[0,0],T2:[0,0],T3:[0,0],T4:[0,0]};const ok=(t,c)=>R[t][c?0:1]++;const runs=new Set();
for(const n of ['C2','C3','C4']){const fL=mk(L,n+' Build'),fC=mk(C,n+' Build');
 for(const f of fs.readdirSync(d).filter(f=>f.endsWith('_'+n+'_Build.json'))){const r=f.split('_')[0];const B=body(f);if(!B||!B.system||!B.messages)continue;runs.add(r);
  const sys=B.system.map(x=>x.text).join('');const msgs=B.messages.map(unwrap);const tok=B.max_tokens,model=B.model;
  const lb=fL('anthropic',model,tok,sys,msgs),cb=fC('anthropic',model,tok,sys,msgs);
  const norm=o=>JSON.stringify({...o,diagnostics:undefined});
  ok('T1',norm(lb)===norm(B));
  const noMsgCC=o=>({...o,diagnostics:undefined,messages:o.messages.map(unwrap)});
  const exp=JSON.parse(JSON.stringify(noMsgCC(lb)));if(n==='C2')exp.messages[0]={role:exp.messages[0].role,content:[{type:'text',text:exp.messages[0].content,cache_control:{type:'ephemeral',ttl:'1h'}}]};
  ok('T2',JSON.stringify(exp)===norm(cb));
  ok('T4',JSON.stringify(lb.system)===JSON.stringify(cb.system)&&JSON.stringify(lb.messages.map(unwrap))===JSON.stringify(cb.messages.map(unwrap)));
  if(n==='C2'){const c1=body(r+'_C1_Build.json');if(c1)ok('T3',JSON.stringify(c1.messages[0])===JSON.stringify(cb.messages[0])&&JSON.stringify(c1.system)===JSON.stringify(cb.system));}
  if(n!=='C2'&&JSON.stringify(cb.messages).includes('cache_control'))R.T2[1]+=1000;}}
console.log('runs',runs.size);for(const k in R)console.log(k,'pass',R[k][0],'fail',R[k][1]);
