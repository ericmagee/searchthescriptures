// W1 regrade of pkgFUM rev 4 (Wall 3597): clean follow-up, full repeat (A) and unasked-item change (B) on luna 34016 Panel Cure 1. Run from wall2024/: node pkgFUM/w1_grade/fum_rev4.cjs
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');const B='pkgLIB/strip_FUM/patched/';const R=f=>fs.readFileSync(f,'utf8');
let t=Date.now();const lap=m=>{console.log(m,Date.now()-t);t=Date.now();};
const H=harness('34016');const MG=JSON.parse(R('pkgFUM/plan_FUM.json')).nodes_added.find(n=>n.name==='FUM Merge Panel 1').parameters.jsCode;lap('plan');
const b1=H(R(B+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');lap('norm1 fum='+!!b1[0].json.fum);
const ans='RESPONSE: K-W CHALLENGER DR3 LINK 3 #3 | NOT HELD: the challenger writes "I drop the limb that names what Joseph knew of the cause", which withdraws one limb only.';
const mg=harness('34016',{'FUM Needed? Panel 1':b1,'FUM Call Panel 1 openrouter':[{json:{choices:[{finish_reason:'stop',message:{role:'assistant',content:ans}}]}}]})(MG,'FUM Call Panel 1 openrouter');lap('merge');
const n2=harness('34016',{'FUM Merge Panel 1':mg})(R(B+'Panel_Cure_Normalize_1.js'),'FUM Merge Panel 1');lap('norm2');
const o=harness('34016',{'Panel Cure Normalize 1':n2})(R(B+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;lap('check');
const first=b1[0].json.reply.text;
const step=(ans,tag)=>{t=Date.now();const mg=harness('34016',{'FUM Needed? Panel 1':b1,'FUM Call Panel 1 openrouter':[{json:{choices:[{finish_reason:'stop',message:{role:'assistant',content:ans}}]}}]})(MG,'FUM Call Panel 1 openrouter');lap(tag+' merge');
 const n2=harness('34016',{'FUM Merge Panel 1':mg})(R(B+'Panel_Cure_Normalize_1.js'),'FUM Merge Panel 1');lap(tag+' norm2 len '+n2[0].json.reply.text.length);};
step(first.slice(0,1000)+'\n'+ans,'A1000');
step(first.slice(0,2500)+'\n'+ans,'A2500');
step(first.slice(0,4000)+'\n'+ans,'A4000');
step(first.replace('RULING -- keystone',ans+'\n\nRULING -- keystone'),'Afull');
{const mg=harness('34016',{'FUM Needed? Panel 1':b1,'FUM Call Panel 1 openrouter':[{json:{choices:[{finish_reason:'stop',message:{role:'assistant',content:first.replace('RULING -- keystone',ans+'\n\nRULING -- keystone')}}]}}]})(MG,'FUM Call Panel 1 openrouter');
const n2=harness('34016',{'FUM Merge Panel 1':mg})(R(B+'Panel_Cure_Normalize_1.js'),'FUM Merge Panel 1');console.log('kept follow-up:',JSON.stringify(n2[0].json.reply.text.slice(0,n2[0].json.reply.text.length-first.length)));t=Date.now();
const o=harness('34016',{'Panel Cure Normalize 1':n2})(R(B+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;lap('Afull check');
console.log(o.enforcer_log.filter(r=>r.judge_model==='openai/gpt-6-luna'&&r.cure_status!=='CURED').map(r=>r.rule+' '+r.item+' '+r.cure_status).join('; ')||'luna all cured');}
{const B2=ans+'\nRESPONSE: K-W DEFENDER CR2 D2 #2 | ACCEPTED: the defender withdrew D2.\nRETRACTED: D2 vs C2 -- [CR2] "I grant that born of a woman is said of men with fathers"\nCORRECTED RESULT: BROKEN-1';
const mg=harness('34016',{'FUM Needed? Panel 1':b1,'FUM Call Panel 1 openrouter':[{json:{choices:[{finish_reason:'stop',message:{role:'assistant',content:B2}}]}}]})(MG,'FUM Call Panel 1 openrouter');
const n2=harness('34016',{'FUM Merge Panel 1':mg})(R(B+'Panel_Cure_Normalize_1.js'),'FUM Merge Panel 1');console.log('B kept:',JSON.stringify(n2[0].json.reply.text.slice(0,n2[0].json.reply.text.length-first.length)));
const o=harness('34016',{'Panel Cure Normalize 1':n2})(R(B+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;
console.log('B luna:',o.enforcer_log.filter(r=>r.judge_model==='openai/gpt-6-luna'&&r.cure_status!=='CURED').map(r=>r.rule+' '+r.item+' '+r.cure_status).join('; ')||'all cured');
const d2=o.enforcer_log.find(r=>r.judge_model==='openai/gpt-6-luna'&&r.item==='DEFENDER CR2 D2 #2');console.log('D2 #2:',d2&&d2.cure_status);}
