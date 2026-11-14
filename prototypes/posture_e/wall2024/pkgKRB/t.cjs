// ASK 294 test on the REBUILT node source, in stub line order: Panel Cure Check and Alternate Merge Seat library parts are run up to the node's main code, with a stubbed $ (Final Output = stored rounds; Close Enforcer Record = the run's confirmed close contradictions). cureRecompute is called as the no-cure path calls it, on each stored final judgment of 37113 and 37032.
const fs=require('fs');const st=require(__dirname+'/stub.cjs');const R=JSON.parse(fs.readFileSync(__dirname+'/../a287/runs.json','utf8'));
const CEC={'ODV1-37113-vaaf3hwh':[{side:'DEFENDER',link:2,closing_round:'CR4',closing_q:'x'}],'ODV1-37032-m7yxtyxj':[]};
for(const f of [__dirname+'/../a296/target.json',__dirname+'/target.json'])for(const node of ['Panel Cure Check','Alternate Merge Seat']){const d=st(f,node);const main=d.own.filter(o=>o[0]>0).map(o=>o[0])[0];
 const mk=new Function('$','$input','items',d.S.slice(0,main).join('\n')+'\nreturn {cureRecompute,cureJText};');
 for(const [tok,{r,j}] of Object.entries(R)){const F={cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,cr4:r.defender_r4,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3,dr4:r.challenger_r4};
  const $=nm=>nm==='Final Output'?{isExecuted:true,first:()=>({json:F})}:nm==='Close Enforcer Record'?{isExecuted:true,first:()=>({json:{cec:{confirmed:CEC[tok]}}})}:{isExecuted:false,first:()=>({json:{}}),all:()=>[]};
  let fx;try{fx=mk($,null,[]);}catch(e){console.log(node,'stub error',e.message);break;}
  for(const x of j){const t=String(x.verdict_raw).replace(/\\n/g,'\n').replace(/\\"/g,'"');let rc;try{rc=fx.cureRecompute(x.judge_seat,fx.cureJText(t,true),{},[],[],null);}catch(e){rc={err:e.message};}
   const k=(t.match(/KEYSTONE\s*:[^\n]{0,60}/)||[''])[0];const kr=rc&&rc.rp?rc.rp.filter(p=>/KEYSTONE/.test(p[2])).map(p=>p[1]):[];
   console.log(f.endsWith('a294/target.json')?'NEW':'OLD',node.slice(0,14),tok.slice(5,10),x.judge_seat,'|',k.slice(0,40),'| trig',rc&&rc.trig?rc.trig.filter(z=>/KEYSTONE|CLOSE/.test(z)).join('; '):JSON.stringify(rc).slice(0,120),'|',kr.join(' ').slice(0,230));}}}
