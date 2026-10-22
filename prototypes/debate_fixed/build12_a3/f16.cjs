// F16 harness (Worker_A3, BB-7397 rev 8 DoD 16): Alternate Merge of a node dir on stubs. Usage: node f16.cjs <node dir>
// Panel: the three stored judgments of row 6b95a298 (fx/judgments_27893.json, md5 f442649e), Grok removed (drv_uncured 1).
// F16.1 the alternate's call failed (the error text is constructed): Grok's stored judgment carries an AUDIT line naming GLM, its model,
//       NOT SEATED and the error text. F16.2 the alternate returned a judgment with no violation: it is seated; drv_removed is written as
//       now and Grok's judgment there carries the AUDIT line SEATED. F16.3 no alternate passed the guards (a skip): Grok's judgment
//       carries the AUDIT line with the skip reason. Prints the AUDIT lines found in the saved bodies and in drv_removed.
const fs=require('fs');const [,,dir]=process.argv;
const J=JSON.parse(fs.readFileSync('fx/judgments_27893.json','utf8'));
const pay=j=>({debate_id:j.debate_id,judge_seat:j.judge_seat,judge_api_model:j.judge_api_model,verdict_raw:j.verdict_raw,verdict_tag:j.verdict_tag,
 defense_standing:j.defense_standing,challenge_standing:j.challenge_standing,conceded_links:j.conceded_links,challenger_conceded_links:j.challenger_conceded_links,
 finish_reason:j.finish_reason,drv_uncured:j.drv_uncured});
const PCC={bodies:J.map(j=>JSON.stringify({payload:pay(j)})),summary:J.map(j=>({seat:j.judge_seat,api_model:j.judge_api_model,verdict_tag:j.verdict_tag,drv:[]}))};
const alt={idx:2,removed_seat:'grok',removed_api_model:'grok-4.7',qualify:false,seat:'glm',pool_seat:'glm',api_model:'z-ai/glm-5.3'};
const okBody=JSON.stringify({payload:{debate_id:J[0].debate_id,judge_seat:'glm',judge_api_model:'z-ai/glm-5.3',verdict_raw:'{"verdict_tag":"BROKEN"}\n\n[AUDIT v21: ALTERNATE JUDGE -- SEAT: glm; REPLACES: grok; MODEL: z-ai/glm-5.3]',
 verdict_tag:'BROKEN',defense_standing:'PROP-DEPENDENT',challenge_standing:'SELF-SUPPORTED',conceded_links:1,challenger_conceded_links:0,finish_reason:'stop',drv_uncured:0}});
const CASES={
 'F16.1 call failed':{AP:[{alt,ok:false,why:'call failed: Provider returned error {"code":502}',body:null,summary:null,drv:[]}],SK:[]},
 'F16.2 seated':{AP:[{alt,ok:true,why:null,body:okBody,summary:{seat:'glm',api_model:'z-ai/glm-5.3',verdict_tag:'BROKEN',drv:[]},drv:[]}],SK:[]},
 'F16.3 skip':{AP:null,SK:[{idx:2,removed_seat:'grok',removed_api_model:'grok-4.7',qualify:false,skip:'no pool model passes the guards: glm G3: z-ai/glm-5.3 already sits on this panel'}]}};
const NOT=n=>{throw new Error("Node '"+n+"' hasn't been executed");};
for(const [name,c] of Object.entries(CASES)){
 const $=n=>{switch(n){
  case 'Panel Cure Check':return {first:()=>({json:JSON.parse(JSON.stringify(PCC))})};
  case 'Init Seats':return {first:()=>({json:{}})};
  case 'Alternate Payloads':return c.AP?{isExecuted:true,all:()=>c.AP.map(x=>({json:x}))}:{isExecuted:false,all:()=>NOT(n)};
  case 'Alternate Build':return {isExecuted:true,first:()=>({json:{alt:c.AP?alt:{idx:null,skip:'no seat has an alternate'},skips:c.SK}})};
  default:return {isExecuted:false,first:()=>NOT(n),all:()=>NOT(n)};}};
 const o=new Function('$',fs.readFileSync(dir+'/Alternate_Merge.js','utf8'))($)[0].json;
 const au=s=>String(s||'').split('\n').filter(l=>l.startsWith('[AUDIT v21: ALTERNATE TRIED'));
 console.log(name+':');
 o.bodies.forEach(b=>{const p=JSON.parse(b).payload;console.log('  body',p.judge_seat,'AUDIT lines:',JSON.stringify(au(p.verdict_raw)));});
 (o.drv_removed||[]).forEach(r=>console.log('  drv_removed',r.seat,'replaced_by',r.replaced_by,'AUDIT lines:',JSON.stringify(au(r.verdict_raw))));
 console.log('  alternates_tried:',JSON.stringify((o.alternates_tried||[]).map(t=>({removed_seat:t.removed_seat,alternate:t.alternate,result:t.result,why:t.why}))));}
