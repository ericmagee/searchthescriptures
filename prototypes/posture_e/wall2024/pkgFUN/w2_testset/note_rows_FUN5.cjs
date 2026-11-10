// W2 independent K-S3 COUNTED test set. Usage: node pkgFUN/w2_testset/ks3_run.cjs <strip dir> [<strip dir> ...]
// Each case replaces 34108 luna's K-S3 S3 DEFENDER CR4: #1 RESPONSE line and runs Panel Cure Normalize 1 then Panel Cure Check.
// Expected readings are labeled from the judge rulebook (K-S3), not from any build's rule.
const path=require('path');process.chdir(path.resolve(__dirname,'../..'));
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const K='K-S3 S3 DEFENDER CR4: #1';const LINE=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+K+' |'));
const call=t=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=t;return c;};
const norm=(L,t)=>harness('34108',{'Panel Cure Call 1 openrouter':[{json:call(t)}]})(R(L+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');
const check=(L,n)=>harness('34108',{'Panel Cure Normalize 1':n})(R(L+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;
const row=j=>j.enforcer_log.find(r=>r.judge_model==='openai/gpt-6-luna'&&r.rule==='K-S3'&&/#1/.test(r.item));
// pkgFUN rev 5 (W1): node-level check of the NOTED reason and the rows for the rolled-back insert.
const L='pkgLIB/strip_FUN5/patched/';const T=['COUNTED. The defender granted it. I retract my count of it.','COUNTED. I do not count it after all.','COUNTED. The defender calls it courtesy. It is not.'];const rows=[];
for(const a of T){const x=row(check(L,norm(L,T0.replace(LINE,()=>'RESPONSE: '+K+' | '+a))));console.log(x.cure_status+' | '+a+'\n   '+x.cure_reason);rows.push(x);}
fs.writeFileSync(__dirname+'/../rows_FUN5.json',JSON.stringify(rows.slice(0,2).map(r=>({...r,run_token:'W1-ROLLBACK-TEST-FUN5',prompt_sent:r.prompt_sent==null?null:String(r.prompt_sent).slice(0,100),full_reply:r.full_reply==null?null:String(r.full_reply).slice(0,100)}))));
