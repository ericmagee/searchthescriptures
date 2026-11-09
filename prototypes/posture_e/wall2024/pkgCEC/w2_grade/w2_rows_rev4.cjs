// W2 grade of pkgCEC rev 4: every log row both Record nodes can write, from many reply forms, checked against debate_enforcer_log's three checks.
// Writes w2_rows_rev4.json (distinct rows, prompt_sent/full_reply cut to 300 characters) for a rolled-back insert.
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');
const PAR=JSON.parse(fs.readFileSync(__dirname+'/../parent_s85_CEC4.json','utf8'));const code=n=>PAR.nodes.find(x=>x.name===n).parameters.jsCode;const J=x=>({json:x});
const run=async(c,over,inp)=>await harness('34108',over||{})('return (async()=>{\n'+c+'\n})();',inp||'Quote Report');
const reply=t=>[J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]})];
const D6E='I drop the wording "no biological father" as a bare statement.',D6C='Christ had no biological father.';
const L=(id,ans,er,eq,cq,lk,sd)=>`CLOSE-CONTRADICTION: ${id} -- ${sd||'DEFENDER'} -- LINK ${lk||6} -- ${ans} -- EARLIER [${er||'CR3'}] "${eq||D6E}" -- CLOSING [CR4] "${cq||D6C}" -- why.`;
const replies=[L('NEW','CONFIRMED'),L('NEW','NOT A CONTRADICTION'),L('NEW','CONFIRMED','CR4'),L('NEW','CONFIRMED',null,null,null,9),'CLOSE-CONTRADICTION: NONE','CLOSE-CONTRADICTION: garbled line','',
 L('X1','CONFIRMED')+'\n'+L('X1','NOT A CONTRADICTION'),L('NEW','CONFIRMED')+'\n'+L('NEW','CONFIRMED'),null];
const ALLOW={seat_role:['panel','reserve','alternate','single','synthesis'],cure_status:[null,undefined,'CURED','UNCURED'],kind:['cure','alternate_reply','failed_reply','enforcer_check','send_back']};
(async()=>{const rows=[];
 const B=(await run(code('Close Enforcer Build'),{}))[0].json;const BX={...B,cands:[{id:'X1',side:'DEFENDER',kind:'LINK',n:6},{id:'X2',side:'DEFENDER',kind:'LINK',n:1}]};
 for(const b of [B,BX,{cec_skip:true,why:'no DeepSeek model_config row',run_token:B.run_token}])for(const t of replies){
  const r=(await run(code('Close Enforcer Record'),{'Close Enforcer Build':[J(b)],'Close Enforcer Call deepseek':t==null?[J({error:{message:'timeout'}})]:reply(t)},'Close Enforcer Call deepseek'))[0].json;rows.push(...r.cec_log);}
 const JB=(await run(code('Judge Contradiction Build'),{}))[0].json;
 for(const t of replies.concat([L('J1','CONFIRMED','CR3','I grant that this is the ordinary means.','Genesis 4:1 therefore cannot supply the sequence for Matthew',1)])){
  const r=(await run(code('Judge Contradiction Record'),{'Judge Contradiction Build':[J(JB)],'Judge Contradiction Call deepseek':t==null?[J({error:{message:'timeout'}})]:reply(t)},'Judge Contradiction Call deepseek'))[0].json;rows.push(...(r.jcc_log||[]));}
 const r0=(await run(code('Judge Contradiction Record'),{'Judge Contradiction Build':[J({cec_skip:true,no_log:true,why:'x'})]},'Judge Contradiction Build'))[0].json;
 const bad=rows.filter(r=>!ALLOW.seat_role.includes(r.seat_role)||!ALLOW.cure_status.includes(r.cure_status)||!ALLOW.kind.includes(r.kind||'cure'));
 const lead=[...new Set(rows.map(r=>String(r.cure_reason||'').split(' -- ')[0].slice(0,40)))];
 const seen=new Set(),dist=[];for(const r of rows){const k=r.seat+'|'+String(r.cure_reason||'').split(' -- ')[0].slice(0,40);if(seen.has(k))continue;seen.add(k);dist.push({...r,prompt_sent:r.prompt_sent&&String(r.prompt_sent).slice(0,300),full_reply:r.full_reply&&String(r.full_reply).slice(0,300)});}
 fs.writeFileSync(__dirname+'/w2_rows_rev4.json',JSON.stringify(dist));
 console.log('rows '+rows.length+' (close enforcer '+rows.filter(r=>r.seat==='close enforcer').length+', judge contradiction enforcer '+rows.filter(r=>r.seat==='judge contradiction enforcer').length+'), failing a check: '+bad.length);
 console.log('JC skipped with no_log: '+((r0.jcc_log||[]).length)+' rows');
 console.log('answers leading cure_reason: '+lead.join(' | '));console.log('distinct rows written for the insert test: '+dist.length);})().catch(e=>console.log('ERROR '+e.stack));
