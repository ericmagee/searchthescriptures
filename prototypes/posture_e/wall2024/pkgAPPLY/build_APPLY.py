# pkgAPPLY: E-APPLY in Alternate Merge (WALL-2024 rulings 2236, 2237). Base: merged_PWQ (= live 68fe69cd + pkgP + pkgW + pkgQ2). Offline only.
import os,json,hashlib
B='../merged_PWQ/Alternate_Merge.js';OUT='patched';os.makedirs(OUT,exist_ok=True)
s=open(B).read();o=s
FN=open('sb_apply.js').read()
ANCH="const bodies=PP.bodies.slice();const summary=(PP.summary||[]).map(s=>({...s}));const removed=[];const tried=[];const seated=[];const at=new Date().toISOString();\n"
assert s.count(ANCH)==1
APPLY=("// E-APPLY: each panel seat's send-back CHANGE TO answers, applied to its body before any seat is replaced (a removed seat keeps them in its record).\n"
"const sb_apply=[];try{if($('Send Back Record').isExecuted){const SBI=$('Send Back Record').first().json.sb_items||[];summary.forEach((sm,i)=>{const its=SBI.filter(x=>x.seat===sm.seat);if(!its.length)return;\n"
" const b=JSON.parse(bodies[i]);const t0=b.payload.verdict_tag;const F0={verdict_tag:b.payload.verdict_tag,defense_standing:b.payload.defense_standing,conceded_links:b.payload.conceded_links,challenge_standing:b.payload.challenge_standing,challenger_conceded_links:b.payload.challenger_conceded_links};\n"
" const R=sbApply2024(sm.seat,b.payload.verdict_raw,F0,its);if(!R)return;b.payload.verdict_raw=cureRewrite(b.payload.verdict_raw,true,R,sm.seat,F0);Object.assign(b.payload,R.fields);b.payload.verdict_raw=cureSupHead(b.payload.verdict_raw,t0,b.payload.verdict_tag);\n"
" bodies[i]=JSON.stringify(b);sm.sb_applied={applied:R.applied,items:R.items,fields:R.fields,result:R.result,from:F0};sb_apply.push({seat:sm.seat,applied:R.applied,items:R.items,before:t0,after:R.fields.verdict_tag,result:R.result});});}}catch(e){sb_apply.push({error:String(e&&e.message||e).slice(0,300)});}\n")
s=s.replace(ANCH,ANCH+APPLY)
FA="function cureRewrite(raw,panel,R,seat,F0){"
assert s.count(FA)==1
s=s.replace(FA,FN+FA)
RET="return [{json:{...PP,enforcer_log,"
assert s.count(RET)==1
LOGROWS=("{const __T=new Date().toISOString();sb_apply.forEach(a=>{if(a.error){enforcer_log.push({run_token:S.run_token,seat:null,seat_role:'panel',judge_model:null,kind:'send_back_apply',rule:'E-APPLY',item:'ERROR',flagged_line:null,prompt_sent:null,full_reply:null,reply_error:a.error,response_line:null,cure_status:null,cure_reason:'E-APPLY failed; the changes were not applied',at:__T});return;}\n"
" enforcer_log.push({run_token:S.run_token,seat:a.seat,seat_role:'panel',judge_model:null,kind:'send_back_apply',rule:'E-APPLY',item:'APPLIED '+(a.applied.join(', ')||'none'),flagged_line:null,prompt_sent:null,full_reply:null,reply_error:null,response_line:null,cure_status:null,cure_reason:'verdict '+a.before+' to '+a.after+'; derived RESULT '+a.result+' (WALL-2024 2236, 2237)',at:__T});\n"
" a.items.forEach(z=>enforcer_log.push({run_token:S.run_token,seat:a.seat,seat_role:'panel',judge_model:null,kind:'send_back_apply',rule:'E-APPLY',item:z.sid+' '+z.kind,flagged_line:String(z.to||'').slice(0,1500),prompt_sent:null,full_reply:null,reply_error:null,response_line:null,cure_status:'UNCURED',cure_reason:'RECORD-ONLY (no further call; it removes no seat): '+z.why,at:__T}));});}\n")
s=s.replace(RET,LOGROWS+RET.replace("enforcer_log,","enforcer_log,sb_apply,"))
open(OUT+'/Alternate_Merge.js','w').write(s)
sha=lambda x:hashlib.sha256(x.encode()).hexdigest()[:16]
json.dump({'base':'merged_PWQ','nodes':[{'file':'Alternate_Merge.js','name':'Alternate Merge','base_sha':sha(o),'final_sha':sha(s)}]},open('plan_APPLY.json','w'),indent=1)
print('ok',len(o),len(s))
