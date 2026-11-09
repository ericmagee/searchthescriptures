process.chdir('/home/claude/searchthescriptures/prototypes/posture_e/wall2024');
const fs=require('fs');const {harness}=require('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/pkgGSL/harness.cjs');const L='pkgLIB/strip_VP1_s84/patched/';const R=f=>fs.readFileSync(f,'utf8');
const N1=R(L+'Panel_Cure_Normalize_1.js'),PCC=R(L+'Panel_Cure_Check.js');const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const k3='K-S3 S3 DEFENDER CR4: #1';const l=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+k3+' |'));
for(const rep of ['RESPONSE: '+k3+' | TOUCHES NO LINK: it grants titles only.','RESPONSE: '+k3+' | TOUCHES NO LINK: it grants the legal titles husband and wife, not a declared link or listed premise.',l]){
 const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=T0.replace(l,rep);const n=harness('34108',{'Panel Cure Call 1 openrouter':[{json:c}]})(N1,'Panel Cure Call 1 openrouter');
 const o=harness('34108',{'Panel Cure Normalize 1':n})(PCC,'Panel Cure Normalize 3');const r=o[0].json.enforcer_log.find(r=>r.judge_model==='openai/gpt-6-luna'&&r.rule==='K-S3'&&/#1/.test(r.item));console.log(r.cure_status,'|',String(r.cure_reason).slice(0,260),'| fum:',!!n[0].json.fum);}
