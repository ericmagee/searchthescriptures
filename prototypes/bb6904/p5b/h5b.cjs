// BB-6904 5B flow harness (Worker_E): the three patched Code nodes with stubbed upstream nodes. Draft only.
// Usage: node h5b.cjs <p3 dir (Worker_A3, with data/panel771.json, data/panel771_noBROKEN.json)> <live details json (db281705)>
// Every check prints PASS or FAIL; the last line counts failures.
const fs=require('fs');const [P3,LIVE]=process.argv.slice(2);const OUT=__dirname+'/out/';
let fails=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fails++;};
// Panel Payloads, stubbed as Worker_A3's h_panel.cjs stubs it (live, not dry, no reserve, no regrade).
function payloads(rows){const slot=['Panel Judge 1 ','Panel Judge 2 ','Panel Judge 3 '];
 const judges=rows.map(([,seat,model])=>({seat,api_model:model,body:{messages:[{content:'... CITATION CHECK, PER SEAT ...'}]}}));
 const resp=rows.map(([,seat,,,text])=>seat==='gemini'?{candidates:[{content:{parts:[{text}]},finishReason:'STOP'}]}:{choices:[{message:{content:text},finish_reason:'stop'}]});
 const ranNames=new Set(rows.map(([,seat],i)=>slot[i]+seat));
 const $=n=>{const ex=ranNames.has(n);const i=rows.findIndex(([,seat],k)=>slot[k]+seat===n);
  const J={'Init Seats':{run_token:'tok',dry:false},'Panel Build':{debate_id:'d',judges},'Panel Check':{sub:null},'Final Output':{cr1:'',gr2:'',cr3:''}};
  if(n in J)return {first:()=>({json:J[n]}),isExecuted:true};
  if(n==='Regrade Load'||n==='Build Save Body')return {isExecuted:false,first:()=>{throw new Error('not run');}};
  return {isExecuted:ex,all:()=>ex?[{json:resp[i]}]:[],first:()=>({json:ex?resp[i]:{}})};};
 return {out:new Function('$',fs.readFileSync(OUT+'Panel_Payloads.js','utf8'))($)[0].json,judges};}
function cureCheck(PP,normal){const $=n=>{if(n==='Panel Payloads')return {first:()=>({json:PP}),isExecuted:true};
  if(n==='Panel Cure Normalize'){if(!normal)return {isExecuted:false,all(){throw new Error('not run');},first(){throw new Error('not run');}};return {isExecuted:true,all:()=>normal.map(j=>({json:j}))};}
  throw new Error('unstubbed '+n);};
 return new Function('$','$input',fs.readFileSync(OUT+'Panel_Cure_Check.js','utf8'))($,{first:()=>({json:PP}),all:()=>[{json:PP}]})[0].json;}
const pay=b=>JSON.parse(b).payload;
console.log('# Panel Payloads: every payload carries drv_uncured = that seat\'s items (fail-closed)');
const R=JSON.parse(fs.readFileSync(P3+'/data/panel771.json','utf8'));const {out:PP}=payloads(R);
PP.summary.forEach((s,i)=>ok(pay(PP.bodies[i]).drv_uncured===(s.drv||[]).length&&!(s.drv||[]).some(x=>x.rule==='K-G2'),'seat '+s.seat+': drv_uncured '+pay(PP.bodies[i]).drv_uncured+' = its '+(s.drv||[]).length+' items (K-B, K-G1, K-G3; no K-G2)'));
ok(PP.summary.some(s=>(s.drv||[]).length>0),'the fixture has at least one seat with items');
const R0=JSON.parse(fs.readFileSync(P3+'/data/panel771_noBROKEN.json','utf8'));const {out:PP0}=payloads(R0);
ok(PP0.bodies.every(b=>pay(b).drv_uncured===0),'no BROKEN line anywhere: every seat drv_uncured 0');
console.log('# Panel Cure Check: drv_uncured lowered to the UNCURED count');
const c0=cureCheck(PP,null);
ok(c0.bodies.every((b,i)=>pay(b).drv_uncured===(PP.summary[i].drv||[]).length),'cure path never reached Check with a reply (no Normalize run): every seat keeps its full count (6968 falsifier)');
const iA=PP.summary.findIndex(s=>(s.drv||[]).length>0);const sA=PP.summary[iA];
const kb=(sA.drv||[]).filter(x=>x.rule==='K-B');
const good=kb.map(x=>'RESTATED: '+String(x.line).trim()+' [L1] Luke 1:35 "The Holy Ghost shall come upon thee"; [L2] ἐπελεύσεται.').join('\n');
const nrm=[{cure:{who:'panel',idx:iA,seat:sA.seat,broken:{DEFENDER:[],CHALLENGER:[]},rounds:{}},reply:{ok:true,text:good}}];
const c1=cureCheck(PP,nrm);const cur=c1.summary[iA].cure;
ok(pay(c1.bodies[iA]).drv_uncured===cur.filter(x=>x.status!=='CURED').length,'seat '+sA.seat+': drv_uncured '+pay(c1.bodies[iA]).drv_uncured+' = its UNCURED items after the cure ('+cur.filter(x=>x.status==='CURED').length+' cured of '+cur.length+')');
ok(cur.filter(x=>x.status==='CURED').length>0,'the cure statement cured at least one item (the lowering is exercised)');
ok(c1.bodies.every((b,i)=>i===iA||pay(b).drv_uncured===(PP.summary[i].drv||[]).length),'seats without a reply keep their full count');
const c2=cureCheck(PP,[{cure:{who:'panel',idx:iA,seat:sA.seat},reply:{ok:false,text:null,why:'error: 503'}}]);
ok(pay(c2.bodies[iA]).drv_uncured===(sA.drv||[]).length,'failed cure call: full count kept');
const c3=cureCheck(PP0,null);ok(c3.bodies.every(b=>pay(b).drv_uncured===0),'no violations: Check passes 0 through');
console.log('# Failure Salvage: the cure report rides the salvage row');
const live=JSON.parse(fs.readFileSync(LIVE,'utf8')).workflow.nodes.find(n=>n.name==='Failure Salvage').parameters.jsCode;
const draft=fs.readFileSync(OUT+'Failure_Salvage.js','utf8');
ok(draft.replace(/const ivr=P\('Cure Check'[^\n]*?\/\/ 5B \(BB-6969\): the cure report rides the salvage row/,'X')===live.replace(/const ivr=P\('Extract Independent Verdict',j=>j.independent_verdict_raw\);const vt=P\('Extract Independent Verdict',j=>j.verdict_tag\);/,'X'),'draft minus the one edit equals live byte for byte');
const P=(nodes)=>(n,f)=>{try{if(!(n in nodes))throw 0;return f(nodes[n]);}catch(x){return null;}};
const pick=src=>new Function('P',src.match(/const ivr=[^\n]*?;const vt=[^\n]*?\);/)[0]+' return {ivr,vt};')
const fn=pick(draft);
let g=fn(P({'Cure Check':{independent_verdict_raw:'J\n[AUDIT v21: DEBATE RULE VIOLATION REPORT -- ITEM: D4 vs C2; RULE: K-B; RESULT: UNCURED]',verdict_tag:'BROKEN'},'Extract Independent Verdict':{independent_verdict_raw:'J',verdict_tag:'BROKEN'}}));
ok(/REPORT/.test(g.ivr)&&g.vt==='BROKEN','after a cure: the salvage row takes Cure Check\'s text (report lines kept)');
g=fn(P({'Extract Independent Verdict':{independent_verdict_raw:'J',verdict_tag:'HELD'}}));
ok(g.ivr==='J'&&g.vt==='HELD','Cure Check never ran (failure before it): falls back to the extractor');
g=fn(P({}));ok(g.ivr===null&&g.vt===null,'neither ran: null, as live');
console.log('failures',fails);
