// ruling 428: records the enforcer's readings of the judges' ANSWER CHECK grades (E-ANS) and VOID rulings (E-VOID). RECORD-ONLY TRIAL: one
// debate_enforcer_log row per judge grade (kind enforcer_check); nothing goes back to a judge. Passes Enforcer Record's output on unchanged.
const PASS=$('Enforcer Record').first().json;
const B=$('Judge Enforcer Build').all().map(x=>x.json);const first=B[0]||{};
const CODE=first.code_rows||[]; /* s434: code-checked violations of the verdict lines (ruling 443) */
if(first.je_skip)return [{json:{...PASS,enf428:{skipped:true,why:first.why||'',code_violations:CODE.length},enf428_rows:CODE}}];
const T=new Date().toISOString();
const R=$input.all().map(x=>x.json);const V={};const errors=[];const errAt={}; /* pkgJEC (a): each call's own error, by its index (33060: the labels shifted) */
R.forEach((r,i)=>{let txt='';try{txt=String(r.choices[0].message.content||'');}catch(e){const w='call '+(i+1)+': no reply ('+String(r&&r.error&&(r.error.message||JSON.stringify(r.error))||r&&r.message||('no message; reply keys: '+(Object.keys(r||{}).slice(0,8).join(',')||'none'))).slice(0,160)+')';errAt[i]=w;errors.push(w);return;}
 if(!txt.trim()){const w='call '+(i+1)+': empty content'+(r.choices[0].finish_reason?' (finish_reason '+r.choices[0].finish_reason+')':'');errAt[i]=w;errors.push(w);return;}
 for(const l of txt.split('\n')){const m=l.replace(/[*_`]+/g,'').trim().match(/^ENFORCER\s*:\s*(?:(?:ITEM|ANSWER|ID)\s+)?([BVKYHZPR]\d+\.\d+)\s*(?:--|—|–|-)\s*(AGREE|DISAGREE|NO ANSWER)\s*(?:--|—|–|-)?\s*(?:RIGHT\s*:\s*(MEETS|MISSES|NOT VOID|VOID|BROKEN|STANDS|UNDERDETERMINED|COUNTED|SPARED|DOES NOT FOLLOW|FOLLOWS|TRUE|OVERSTATED)\s*(?:--|—|–|-)?)?\s*(.*)$/i);
  if(m)V[m[1].toUpperCase()]={v:m[2].toUpperCase(),right:(m[3]||'').toUpperCase(),why:m[4].trim()};}});
const tally={};for(const k of ['E-ANS','E-VOID','E-COL','E-SYN','E-HOLD','E-KEY','E-PREM','E-RES'])tally[k]={AGREE:0,DISAGREE:0,'NO ANSWER':0,'NO VERDICT':0};const rows=[];
B.forEach((b,ci)=>{(b.ids||[]).forEach((x,k)=>{const v=V[x.id.toUpperCase()];const verdict=v?v.v:'NO VERDICT';tally[x.rule][verdict]=(tally[x.rule][verdict]||0)+1;
 let full=null;try{full=k===0?String(R[ci].choices[0].message.content||''):null;}catch(e){full=null;}
 rows.push({run_token:b.run_token,seat:x.seat,seat_role:x.rule==='E-SYN'?'synthesis':'panel',judge_model:b.model,kind:'enforcer_check',rule:x.rule,item:x.item,flagged_line:x.flagged_line,
  prompt_sent:k===0?b.body.messages[1].content:null,full_reply:full,reply_error:errAt[ci]||null,response_line:x.response_line,cure_status:null,
  cure_reason:'ENFORCER '+verdict+(v&&v.right?' (right: '+v.right+')':'')+(v&&v.why?': '+v.why.slice(0,600):'')+' (judge wrote '+x.grade+'; RECORD-ONLY TRIAL, ruling 428)',at:T});});});
/* pkgEAW (W3 2844) record half: an E-ANS DISAGREE with right MISSES whose reason says the answer is "only" a quoted X, where the answer block in the round
   goes on past X with a layer tag or with 12 or more words, is HELD: written "ENFORCER HELD (pkgEAW, not sent ...)", which the send-back filter
   (^ENFORCER DISAGREE|NO ANSWER) does not send. A bare "I grant it." with nothing after it is still sent. Rows of other rules are untouched. */
const EAW_STATUS='LIVE';
function eawHoldWhy(why,blk){if(!blk)return null;const m=String(why).match(/\b(?:says|states|gives|offers|grants|is)\s+only\s+["\u201c']([^"\u201d]{1,200}?)["\u201d'](?=[\s.,;:)]|$)|\bonly\s+(?:says|states|grants)\s+["\u201c']([^"\u201d]{1,200}?)["\u201d'](?=[\s.,;:)]|$)/i);if(!m)return null;
 const q=String(m[1]||m[2]).trim().replace(/[.,;:]+$/,'');if(q.length<2)return null;const lb=blk.toLowerCase();const at=lb.indexOf(q.toLowerCase());if(at<0)return null;
 const after=blk.slice(at+q.length);const lay=[...new Set(after.match(/\[L[1-4]\]/g)||[])];const words=after.replace(/[^A-Za-z\u00C0-\u024F0-9]+/g,' ').trim().split(' ').filter(Boolean).length;
 if(!lay.length&&words<12)return null;return 'the push says the answer is only "'+q+'", but the answer under the pressed verse goes on'+(lay.length?' with '+lay.join(', ')+',':'')+' '+words+' more words';}
const __eawBlk={};B.forEach(b=>(b.ids||[]).forEach(x=>{if(x&&x.rule==='E-ANS'&&typeof x.eaw_blk==='string'&&!(x.item in __eawBlk))__eawBlk[x.item]=x.eaw_blk;}));let __eawHeld=0;
for(const r of rows){if(r.rule!=='E-ANS')continue;const m=String(r.cure_reason||'').match(/^ENFORCER DISAGREE \(right: MISSES\): ([\s\S]*?) \(judge wrote /);if(!m)continue;const n=eawHoldWhy(m[1],__eawBlk[r.item]);if(!n)continue;__eawHeld++;const note=n.replace(/[()]/g,' ');
 r.cure_reason=EAW_STATUS==='LIVE'?r.cure_reason.replace(/^ENFORCER DISAGREE/,'ENFORCER HELD (pkgEAW, not sent; W3 2844: '+note+')'):r.cure_reason+' (TRIAL pkgEAW: would not be sent: '+note+')';}
rows.push(...CODE);
return [{json:{...PASS,enf428:{code_violations:CODE.length,skipped:false,calls:B.length,counts:first.counts||{},not_checked:(first.not_checked||[]).length,tally,errors},enf428_rows:rows}}];
