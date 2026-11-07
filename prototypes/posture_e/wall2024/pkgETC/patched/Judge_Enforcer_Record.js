// ruling 428: records the enforcer's readings of the judges' ANSWER CHECK grades (E-ANS) and VOID rulings (E-VOID). RECORD-ONLY TRIAL: one
// debate_enforcer_log row per judge grade (kind enforcer_check); nothing goes back to a judge. Passes Enforcer Record's output on unchanged.
const PASS=$('Enforcer Record').first().json;
const B=$('Judge Enforcer Build').all().map(x=>x.json);const first=B[0]||{};
const CODE=first.code_rows||[]; /* s434: code-checked violations of the verdict lines (ruling 443) */
if(first.je_skip)return [{json:{...PASS,enf428:{skipped:true,why:first.why||'',code_violations:CODE.length},enf428_rows:CODE}}];
const T=new Date().toISOString();
/* pkgETC (W2; coordinator 14:20Z on Eric 08:19 CST; 33311 rows 13335, 13350): a DeepSeek enforcer verdict whose "right:" label contradicts the ruling its
   own reason concludes. Returns the concluded ruling (string) when they contradict, else null. Quoted words are masked first, so a quote is never read as
   the enforcer's conclusion. Only an explicit conclusion counts: "the correct/right ruling is R", or "so/therefore/thus/hence ... is R" not followed by "but". */
const ETC=(rule,tag,why)=>{if(!tag||!why)return null;
 const w=String(why).replace(/"[^"]*"|“[^”]*”/g,' ').replace(/(^|[\s(])'[^']{3,}?'(?=[\s,.;:)]|$)/g,'$1 ');
 const R='(?:not\\s+|does\\s+not\\s+)?(?:counted|unexhibited|spared|void|meets|misses|broken|stands|underdetermined|follows|follow|true|overstated)';
 const NX='\\b(?!\\s+(?:follows|does\\s+not\\s+follow))';
 const P=[new RegExp('(?:correct|right|proper|true)\\s+(?:ruling|grade|reading|result)\\s+(?:is|would\\s+be|was)\\s+('+R+')'+NX,'i'),
  new RegExp('\\b(?:so|therefore|thus|hence)\\b[^.;]{0,80}?\\b(?:is|are|stands|remains|should\\s+be|must\\s+be)\\s+('+R+')'+NX+'(?![^.;]*\\bbut\\b)','i'),
  new RegExp('\\b(?:so|therefore|thus|hence)\\b[^.;]{0,80}?\\b(?:it|the\\s+answer|the\\s+grade|the\\s+line|the\\s+keystone|the\\s+collision|the\\s+result|the\\s+conclusion)\\s+((?:does\\s+not\\s+)?(?:meets|misses|stands|follows|follow))'+NX+'(?![^.;]*\\bbut\\b)','i')];
 let c=null;for(const p of P){const m=w.match(p);if(m){c=m[1].toUpperCase().replace(/\s+/g,' ');break;}}if(!c)return null;
 const neg=/^(?:NOT|DOES NOT) /.test(c);const base=c.replace(/^(?:NOT|DOES NOT) /,'').replace(/^UNEXHIBITED$/,'COUNTED').replace(/^FOLLOW$/,'FOLLOWS');
 const B3=['BROKEN','STANDS','UNDERDETERMINED'];const F={'E-ANS':['MEETS','MISSES'],'E-COL':B3,'E-HOLD':B3,'E-KEY':B3,'E-PREM':['COUNTED','SPARED','VOID'],'E-RES':['FOLLOWS'],'E-SYN':['TRUE','OVERSTATED'],'E-VOID':['VOID']}[rule];
 if(!F||!F.includes(base))return null;const t=String(tag).toUpperCase().replace(/\s+/g,' ');
 if(neg)return base===t?c:null;
 if(base===t)return null;if(t==='NOT VOID'&&(base==='SPARED'||base==='COUNTED'))return null;return c;};
const R=$input.all().map(x=>x.json);const V={};const errors=[];const errAt={}; /* pkgJEC (a): each call's own error, by its index (33060: the labels shifted) */
R.forEach((r,i)=>{let txt='';try{txt=String(r.choices[0].message.content||'');}catch(e){const w='call '+(i+1)+': no reply ('+String(r&&r.error&&(r.error.message||JSON.stringify(r.error))||r&&r.message||('no message; reply keys: '+(Object.keys(r||{}).slice(0,8).join(',')||'none'))).slice(0,160)+')';errAt[i]=w;errors.push(w);return;}
 if(!txt.trim()){const w='call '+(i+1)+': empty content'+(r.choices[0].finish_reason?' (finish_reason '+r.choices[0].finish_reason+')':'');errAt[i]=w;errors.push(w);return;}
 for(const l of txt.split('\n')){const m=l.replace(/[*_`]+/g,'').trim().match(/^ENFORCER\s*:\s*(?:(?:ITEM|ANSWER|ID)\s+)?([BVKYHZPR]\d+\.\d+)\s*(?:--|—|–|-)\s*(AGREE|DISAGREE|NO ANSWER)\s*(?:--|—|–|-)?\s*(?:RIGHT\s*:\s*(MEETS|MISSES|NOT VOID|VOID|BROKEN|STANDS|UNDERDETERMINED|COUNTED|SPARED|DOES NOT FOLLOW|FOLLOWS|TRUE|OVERSTATED)\s*(?:--|—|–|-)?)?\s*(.*)$/i);
  if(m)V[m[1].toUpperCase()]={v:m[2].toUpperCase(),right:(m[3]||'').toUpperCase(),why:m[4].trim()};}});
const tally={};for(const k of ['E-ANS','E-VOID','E-COL','E-SYN','E-HOLD','E-KEY','E-PREM','E-RES'])tally[k]={AGREE:0,DISAGREE:0,'NO ANSWER':0,'NO VERDICT':0,CONTRADICTED:0};const rows=[];
B.forEach((b,ci)=>{(b.ids||[]).forEach((x,k)=>{const v=V[x.id.toUpperCase()];const __ec=v&&(v.v==='DISAGREE'||v.v==='NO ANSWER')?ETC(x.rule,v.right,v.why):null;const verdict=__ec?'CONTRADICTED':(v?v.v:'NO VERDICT');tally[x.rule][verdict]=(tally[x.rule][verdict]||0)+1;
 let full=null;try{full=k===0?String(R[ci].choices[0].message.content||''):null;}catch(e){full=null;}
 rows.push({run_token:b.run_token,seat:x.seat,seat_role:x.rule==='E-SYN'?'synthesis':'panel',judge_model:b.model,kind:'enforcer_check',rule:x.rule,item:x.item,flagged_line:x.flagged_line,
  prompt_sent:k===0?b.body.messages[1].content:null,full_reply:full,reply_error:errAt[ci]||null,response_line:x.response_line,cure_status:null,
  cure_reason:'ENFORCER '+verdict+(v&&v.right?' (right: '+v.right+')':'')+(v&&v.why?': '+v.why.slice(0,600):'')+(__ec?' [pkgETC: written '+v.v+' with right: '+v.right+', but its own reason concludes '+__ec+'; recorded, not sent back]':'')+' (judge wrote '+x.grade+'; RECORD-ONLY TRIAL, ruling 428)',at:T});});});
rows.push(...CODE);
return [{json:{...PASS,enf428:{code_violations:CODE.length,skipped:false,calls:B.length,counts:first.counts||{},not_checked:(first.not_checked||[]).length,tally,errors},enf428_rows:rows}}];
