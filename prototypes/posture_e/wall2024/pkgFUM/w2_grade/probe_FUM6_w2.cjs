// W2 grade of pkgFUM rev 6: (1) W1 3608 inline card after the pipe; (2) a kept RESPONSE label that also names an unasked item of the same rule.
// Run from wall2024/: node pkgFUM/w2_grade/probe_FUM6_w2.cjs
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');const B='pkgLIB/strip_FUM/patched/';const R=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);c?ok++:bad++;};
const s=R(B+'Panel_Cure_Normalize_1.js');const grab=n=>{const i=s.indexOf('function '+n+'(');return s.slice(i,s.indexOf('\nfunction ',i+10));};
const f=new Function(['krulCards','krulMatch','fumKey2024','fumKeep2024'].map(grab).join('\n')+';return {krulCards,krulMatch,fumKeep2024};')();
// (1) W1 3608
{const items=[{rule:'K-RUL',link:'D1 vs C2',ruling:'D1 vs C2'}],others=[{rule:'K-RUL',link:'D2 vs C2',ruling:'D2 vs C2'}];
 const fu='RESPONSE: K-RUL D1 vs C2 | RULING -- D1, D2 vs C2 -- BROKEN CLAIM: x NAMED BY: NONE RULE: Commitment 11 -- "q" APPLIED: w';
 const k=f.fumKeep2024(fu,items,others);const c=f.krulCards(k).find(c=>f.krulMatch(c,'D2 vs C2',null));
 T(!c,'W1 3608: an inline card after the pipe naming the unasked D2 vs C2 is not read for D2 vs C2 (kept: '+JSON.stringify(k.slice(0,50))+')');}
// (2) terra 34016 Panel 2: quote removed from DEFENDER CR2 D3 #3 (asked, NO QUOTE). Follow-up line's label names D3 #3 and also the unasked D2 #2.
const MG=n=>JSON.parse(R('pkgFUM/plan_FUM.json')).nodes_added.find(z=>z.name==='FUM Merge Panel '+n).parameters.jsCode;
const c0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34016_Panel_Cure_Call_2_openrouter.json'))[0].data.main[0][0].json;const c=JSON.parse(JSON.stringify(c0));
c.choices[0].message.content=c0.choices[0].message.content.replace('\\"I grant that the verbs elsewhere carry power and presence\\" grants their use elsewhere','the grant concerns other uses of the verbs');
const q1=harness('34016',{'Panel Cure Call 2 openrouter':[{json:c}]})(R(B+'Panel_Cure_Normalize_2.js'),'Panel Cure Call 2 openrouter');
const run=ans=>{const mg=harness('34016',{'FUM Needed? Panel 2':q1,'FUM Call Panel 2 openrouter':[{json:{choices:[{finish_reason:'stop',message:{role:'assistant',content:ans}}]}}]})(MG(2),'FUM Call Panel 2 openrouter');
 const q2=harness('34016',{'FUM Merge Panel 2':mg,'Panel Cure Call 2 openrouter':[{json:c}]})(R(B+'Panel_Cure_Normalize_2.js'),'FUM Merge Panel 2');
 return {kept:q2[0].json.reply.text.split('\n\n')[0],log:harness('34016',{'Panel Cure Normalize 2':q2})(R(B+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json.enforcer_log.filter(r=>r.judge_model==='openai/gpt-6.1-terra')};};
const g=(L,it)=>L.find(r=>r.item===it)||{};
const base=harness('34016',{'Panel Cure Normalize 2':q1})(R(B+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json.enforcer_log.filter(r=>r.judge_model==='openai/gpt-6.1-terra');
console.log('  before follow-up: D2 #2',g(base,'DEFENDER CR2 D2 #2').cure_status,'| D3 #3',g(base,'DEFENDER CR2 D3 #3').cure_status);
for(const [nm,ans] of [
 ['control, D3 #3 only','RESPONSE: K-W DEFENDER CR2 D3 #3 | NOT HELD: "I grant that the verbs elsewhere carry power and presence" grants their use elsewhere.'],
 ['label "D3 #3 / K-W D2 #2"','RESPONSE: K-W DEFENDER CR2 D3 #3 / K-W DEFENDER CR2 D2 #2 | NOT HELD: "I grant that the verbs elsewhere carry power and presence" grants their use elsewhere.'],
 ['label "D3 #3, K-W D2 #2" with ACCEPTED','RESPONSE: K-W DEFENDER CR2 D3 #3, K-W DEFENDER CR2 D2 #2 | ACCEPTED: both withdrawals stand.']]){
 const o=run(ans);console.log('  ['+nm+'] kept: '+JSON.stringify(o.kept.slice(0,90)));
 console.log('     D2 #2: '+g(o.log,'DEFENDER CR2 D2 #2').cure_status+' ('+String(g(o.log,'DEFENDER CR2 D2 #2').cure_reason).slice(0,90)+')');
 T(g(o.log,'DEFENDER CR2 D2 #2').cure_status===g(base,'DEFENDER CR2 D2 #2').cure_status&&g(o.log,'DEFENDER CR2 D2 #2').cure_reason===g(base,'DEFENDER CR2 D2 #2').cure_reason,nm+': the unasked D2 #2 keeps its status and reason');}
console.log('TOTAL '+ok+' OK, '+bad+' FAIL');
