// ruling 428: records the enforcer's readings of the judges' ANSWER CHECK grades (E-ANS) and VOID rulings (E-VOID). RECORD-ONLY TRIAL: one
// debate_enforcer_log row per judge grade (kind enforcer_check); nothing goes back to a judge. Passes Enforcer Record's output on unchanged.
const PASS=$('Enforcer Record').first().json;
const B=$('Judge Enforcer Build').all().map(x=>x.json);const first=B[0]||{};
if(first.je_skip)return [{json:{...PASS,enf428:{skipped:true,why:first.why||''},enf428_rows:[]}}];
const T=new Date().toISOString();
const R=$input.all().map(x=>x.json);const V={};const errors=[];
R.forEach((r,i)=>{let txt='';try{txt=String(r.choices[0].message.content||'');}catch(e){errors.push('call '+(i+1)+': no reply ('+String(r.error&&r.error.message||r.message||'unknown').slice(0,120)+')');return;}
 for(const l of txt.split('\n')){const m=l.replace(/[*_`]+/g,'').trim().match(/^ENFORCER\s*:\s*(?:(?:ITEM|ANSWER|ID)\s+)?([BVKYHZ]\d+\.\d+)\s*(?:--|—|–|-)\s*(AGREE|DISAGREE|NO ANSWER)\s*(?:--|—|–|-)?\s*(?:RIGHT\s*:\s*(MEETS|MISSES|NOT VOID|VOID|BROKEN|STANDS|UNDERDETERMINED|TRUE|OVERSTATED)\s*(?:--|—|–|-)?)?\s*(.*)$/i);
  if(m)V[m[1].toUpperCase()]={v:m[2].toUpperCase(),right:(m[3]||'').toUpperCase(),why:m[4].trim()};}});
const tally={};for(const k of ['E-ANS','E-VOID','E-COL','E-SYN','E-HOLD','E-KEY'])tally[k]={AGREE:0,DISAGREE:0,'NO ANSWER':0,'NO VERDICT':0};const rows=[];
B.forEach((b,ci)=>{(b.ids||[]).forEach((x,k)=>{const v=V[x.id.toUpperCase()];const verdict=v?v.v:'NO VERDICT';tally[x.rule][verdict]=(tally[x.rule][verdict]||0)+1;
 let full=null;try{full=k===0?String(R[ci].choices[0].message.content||''):null;}catch(e){full=null;}
 rows.push({run_token:b.run_token,seat:x.seat,seat_role:x.rule==='E-SYN'?'synthesis':'panel',judge_model:b.model,kind:'enforcer_check',rule:x.rule,item:x.item,flagged_line:x.flagged_line,
  prompt_sent:k===0?b.body.messages[1].content:null,full_reply:full,reply_error:errors[ci]||null,response_line:x.response_line,cure_status:null,
  cure_reason:'ENFORCER '+verdict+(v&&v.right?' (right: '+v.right+')':'')+(v&&v.why?': '+v.why.slice(0,600):'')+' (judge wrote '+x.grade+'; RECORD-ONLY TRIAL, ruling 428)',at:T});});});
return [{json:{...PASS,enf428:{skipped:false,calls:B.length,counts:first.counts||{},not_checked:(first.not_checked||[]).length,tally,errors},enf428_rows:rows}}];
