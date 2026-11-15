// ASK 300 test: run Assume Check Build + Assume Check Record (live s206 vs built) on 37113 and 37032 with the stored E-ASSUME DeepSeek replies (reasons cut to "x"; the parser reads only the ASSUME-CHECK line head and quotes in STATED lines)
const fs=require('fs');const R=require('../a287/runs.json'),RP=require('./replies.json');
const node=(W,nm)=>W.nodes.find(n=>n.name===nm).parameters.jsCode;
const run=(code,$,inp)=>new Function('$','$input','return (()=>{'+code+'\n})()')($,{first:()=>({json:inp}),all:()=>[{json:inp}]});
for(const f of process.argv.slice(2)){const W=JSON.parse(fs.readFileSync(f,'utf8'));console.log('== '+f);
 for(const tok in R){const {r,j}=R[tok];const F={...r,cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3,cr4:r.defender_r4,dr4:r.challenger_r4};const tab={'Final Output':F,'Resolve Seats':{deepseek:{api_model:'x'}},'Init Seats':{run_token:tok},'Judge Contradiction Record':{x:1},
  'Panel Payloads':{bodies:j.map(x=>JSON.stringify({payload:{judge_seat:x.judge_seat,verdict_raw:x.verdict_raw}})),summary:j.map(x=>({seat:x.judge_seat}))}};
  const $=nm=>{if(nm==='Regrade Load'||nm==='Extract Independent Verdict')return {isExecuted:false,first:()=>{throw new Error('not run')}};if(!(nm in tab))throw new Error('no stub '+nm);return {isExecuted:true,first:()=>({json:tab[nm]})};};
  const B=run(node(W,'Assume Check Build'),$,{})[0].json;tab['Assume Check Build']=B;
  const O=run(node(W,'Assume Check Record'),$,{choices:[{message:{content:RP[tok]}}]})[0].json;
  console.log(tok,'skip',!!O.acx.skipped,O.acx.why||'','prem',(B.prem||[]).length,'items',O.acx.items.length);
  for(const l of O.acx_log)console.log('  ',l.seat.padEnd(16),String(l.item).padEnd(40),String(l.cure_reason).split(' -- ')[0].slice(0,70),'|',/DG-8 FORBIDDEN \(pkgFBA[^"]*"[^"]*"/.exec(l.cure_reason)?.[0]?.slice(0,90)||'');}}
