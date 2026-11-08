// ruling 421 (TRIAL): the DeepSeek enforcer's verdicts, one debate_enforcer_log row (kind enforcer_check) per judge answer; the panel cure output
// passes through unchanged (Alternate Needed? and every later node read it as before). A failed or unread call is recorded, never thrown.
const PCC=$('Panel Cure Check').first().json;const B=$('Enforcer Build').first().json;const T=new Date().toISOString();
let rep=null;try{if($('Enforcer Call deepseek').isExecuted)rep=$('Enforcer Call deepseek').first().json;}catch(e){rep=null;}
const env=j=>{if(j&&Array.isArray(j.choices)&&j.choices[0]&&j.choices[0].message&&typeof j.choices[0].message.content==='string')return {ok:true,text:j.choices[0].message.content};
 if(j&&j.error){const e=j.error;return {ok:false,why:String(typeof e==='string'?e:(e.message||JSON.stringify(e))).slice(0,300)};}return {ok:false,why:j?'no reply text ('+Object.keys(j).join(',')+')':'no call made'};};
const rows=[];let tally=null;
if(!B.enf_skip){const e=env(rep);const V={},GV={};
 if(e.ok)for(const l of String(e.text).split('\n')){const m=l.replace(/[*_`]+/g,'').trim().match(/^ENFORCER\s*:\s*(?:(?:ITEM|ANSWER|ID)\s+)?(A\d+\.\d+)\s*(?:--|—|–|-)\s*(AGREE|DISAGREE|NO ANSWER)\s*(?:--|—|–|-)?\s*(.*)$/i);if(m)V[m[1].toUpperCase()]={v:m[2].toUpperCase(),why:m[3].trim()};
  else{const g=l.replace(/[*_`]+/g,'').trim().match(/^ENFORCER\s*:\s*(?:(?:ITEM\s+)?G(\d+)|(\d+))\s*(?:--|—|–|-)\s*(AGREE|DISAGREE|NO ANSWER)\s*(?:--|—|–|-)?\s*(.*)$/i);if(g){const gk=g[1]||g[2];if(!GV[gk])GV[gk]={v:g[3].toUpperCase(),why:g[4].trim()};} /* pkgEGL v2: G<k> or bare <k> */}}
 /* pkgEGL (33497): an item-label verdict (G<k>) is applied to the item's answers only when none has its own line and all open with one form */
 const FORM=s=>{const m=String(s||'').replace(/[*_`"\u201c]+/g,'').trim().match(/^(COUNTED|TOUCHES NO LINK|STANDS WITHOUT IT|CONCEDED|NOT HELD|REASSERTED)\b/i);return m?m[1].toUpperCase():null;};
 for(const [k,gv] of Object.entries(GV)){const A=(B.ids||[]).filter(x=>new RegExp('^A'+k+'\\.\\d+$','i').test(x.id));if(!A.length||A.some(x=>V[x.id.toUpperCase()]))continue;const f=A.map(x=>FORM(x.response_line));
  if(f[0]&&f.every(z=>z===f[0]))for(const x of A)V[x.id.toUpperCase()]={v:gv.v,why:gv.why+' [pkgEGL: the enforcer answered item '+k+' as a whole; applied to each of its '+A.length+' answers, all '+f[0]+']'};
  else for(const x of A)V[x.id.toUpperCase()]={v:'NO VERDICT',why:'group-labelled reply, answers differ (pkgEGL)'};}
 tally={AGREE:0,DISAGREE:0,'NO ANSWER':0,'NO VERDICT':0};
 (B.ids||[]).forEach((x,k)=>{const v=V[x.id.toUpperCase()];const verdict=v?v.v:'NO VERDICT';tally[verdict]=(tally[verdict]||0)+1;
  rows.push({run_token:B.run_token,seat:x.seat,seat_role:x.seat_role||'panel',judge_model:B.model,kind:'enforcer_check',rule:x.rule,item:x.item,flagged_line:x.flagged_line,
   prompt_sent:k===0?(B.body&&B.body.messages?B.body.messages[1].content:null):null,full_reply:k===0&&e.ok?e.text:null,reply_error:e.ok?null:e.why,response_line:x.response_line,
   cure_status:null,cure_reason:'ENFORCER '+verdict+(v&&v.why?': '+v.why.slice(0,600):'')+' (judge cure '+(x.cure_status||'?')+'; TRIAL, ruling 421)',at:T});});}
return [{json:{...PCC,enf421:{skipped:!!B.enf_skip,why:B.why||null,groups:B.groups||0,answers:(B.ids||[]).length,tally},enf421_rows:rows}}];
