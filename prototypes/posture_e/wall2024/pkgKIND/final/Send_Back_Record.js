// ruling 428, the send-back half: reads each judge's SENDBACK lines and records one debate_enforcer_log row (kind send_back) per item: the
// judge's line, the enforcer's reason, and the judge's answer (KEEP or CHANGE TO, with its sentence). The judge keeps the decision. NOT BUILT
// here: a CHANGE does not yet recompute the judge's counts or result; it is recorded and printed in the run document.
const PASS=$('Judge Enforcer Record').first().json;
const B=$('Send Back Build').all().map(x=>x.json);const first=B[0]||{};const T=new Date().toISOString();
const ns=(first.sb_not_sent||[]).map(x=>({run_token:null,seat:x.seat,seat_role:'panel',judge_model:null,kind:'send_back',rule:x.rule,item:x.item||null,flagged_line:null,prompt_sent:null,full_reply:null,reply_error:'NOT SENT: '+x.why,response_line:null,cure_status:null,cure_reason:'SEND-BACK NOT SENT: '+x.why+' (ruling 428)',at:T}));
if(first.sb_skip)return [{json:{...PASS,sendback:{skipped:true,why:first.sb_why||'',not_sent:ns.length,tally:{}},sb_rows:ns,sb_items:[]}}];
const R=$input.all().map(x=>x.json);const rows=[...ns];const errors=[];const tally={KEEP:0,CHANGE:0,'NO ANSWER':0};const shown=[];const SIL={}; /* pkgSBS: seat -> silent S numbers */
B.forEach((b,ci)=>{let txt='',err=null;try{txt=String(R[ci].choices[0].message.content||'');}catch(e){err=String((R[ci]&&R[ci].error&&(R[ci].error.message||R[ci].error))||'no reply').slice(0,200);errors.push(b.seat+': '+err);}
 /* WALL-1963 reply 1965 DEFECT 1: a judge whose system message demands strict JSON may wrap its lines in a JSON string (run 32725, Panel Cure
  Call 2), so escaped line breaks and quotes are undone first and a SENDBACK line is read wherever it starts in a line. */
 const J=/^\s*[{\[]/.test(txt);const A={};const T2=txt.replace(/\\n/g,'\n').replace(/\\"/g,'"');for(const l0 of T2.split('\n')){const l=l0.replace(/[*_`]+/g,'').trim();/* WALL-2024 2243 A (run 32980: gemini wrote "SENDBACK: ITEM S1 || ..." on all 17 items, and every one was logged NO ANSWER): the id may
   follow "ITEM" or "#", the colon may be missing, and the S and its number may be spaced; KEEP and CHANGE TO in any case; a CHANGE TO with no closing "|| reason" is read to the end of
   its line (32980 gemini S1 to S7, S11, S12, S14 to S17). */
  const m=l.match(/SENDBACK\s*:?\s*(?:ITEM\s*)?#?\s*(S\s*\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i);if(m){m[1]=m[1].replace(/\s+/g,'');m[4]=m[4]||'';}
  if(m&&!A[m[1].toUpperCase()])A[m[1].toUpperCase()]={ans:/^KEEP$/i.test(m[2].trim())?'KEEP':'CHANGE',to:(m[3]||'').trim(),why:(J?m[4].replace(/"\s*,?\s*[}\]]*\s*$/,''):m[4]).trim(),line:l};}
 (b.items||[]).forEach((it,k)=>{const a=A[it.sid];const ans=a?a.ans:'NO ANSWER';tally[ans]++;
  const named=!a&&!err&&new RegExp('\\bS\\s*'+String(it.sid).replace(/^S/i,'')+'(?!\\d)').test(T2);const silent=!a&&!err&&!named;if(silent)(SIL[b.seat]=SIL[b.seat]||[]).push(it.sid); /* pkgSBS (W3 2274): silence counts; a written but unread answer does not */
  shown.push({seat:b.seat,sid:it.sid,rule:it.rule,item:it.item,line:it.line,reason:it.reason,ans,to:a?a.to:'',why:a?a.why:(err?'no reply: '+err:'no SENDBACK line for this item')});
  rows.push({run_token:b.run_token,seat:b.seat,seat_role:'panel',judge_model:b.api_model,kind:'send_back',rule:it.rule,item:it.item||null,flagged_line:String(it.line).slice(0,1500),
   prompt_sent:k===0?b.msg:null,full_reply:k===0?(txt||null):null,reply_error:err,response_line:a?a.line.slice(0,1500):null,cure_status:null,
   cure_reason:'SEND-BACK '+ans+(a&&a.to?' TO: '+a.to.slice(0,600):'')+(a&&a.why?' -- '+a.why.slice(0,600):'')+' | ENFORCER: '+String(it.reason).slice(0,600)+' (ruling 428; the judge keeps the decision)'+(silent?' | SILENT: no written answer; counted in drv_uncured (silence rule, WALL-2024 2274)':named?' | WRITTEN, NOT READ: the reply names '+it.sid+' but no SENDBACK line could be read; not silence, not counted':''),at:T});});});
let bodies=null,anySil=false;const silent_counted=[]; /* pkgSBS: add each seat's silent items to its drv_uncured, as Gate Record does for uncured gate items */
if(Object.keys(SIL).length){bodies=(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies).slice();
 for(const [seat,sids] of Object.entries(SIL)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  p.drv_uncured=(p.drv_uncured||0)+sids.length;anySil=true;silent_counted.push({seat,items:sids});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v40: SEND-BACK SILENCE -- SEAT: '+seat+'; ITEMS: '+sids.join(', ')+'; no written answer to '+(sids.length===1?'this send-back item':'these send-back items')+'; counted in drv_uncured (silence rule, WALL-2024 2274). REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}
return [{json:{...PASS,...(bodies?{bodies}:{}),alt_needed:!!PASS.alt_needed||anySil,sendback:{skipped:false,calls:B.length,not_sent:ns.length,tally,errors,silent_counted},sb_rows:rows,sb_items:shown}}];
