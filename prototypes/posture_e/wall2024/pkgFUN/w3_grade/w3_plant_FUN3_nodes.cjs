process.chdir('/home/claude/ericmagee/searchthescriptures/prototypes/posture_e/wall2024');
const fs=require('fs');const {harness}=require(process.cwd()+'/pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const L1='pkgLIB/strip_KCB_base/patched/',L2='pkgLIB/'+(process.env.CAND||'strip_FUN')+'/patched/';
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const K='K-S3 S3 DEFENDER CR4: #1';const LINE=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+K+' |'));
const call=t=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=t;return c;};
const norm=(L,text)=>harness('34108',{'Panel Cure Call 1 openrouter':[{json:call(text)}]})(R(L+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');
const check=(L,n)=>harness('34108',{'Panel Cure Normalize 1':n})(R(L+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;
const row=(L,n)=>check(L,n).enforcer_log.find(r=>r.judge_model==='openai/gpt-6-luna'&&r.rule==='K-S3'&&/#1/.test(r.item));
const rep=r=>T0.replace(LINE,'RESPONSE: '+K+' | '+r);
const GOOD=JSON.parse(R('pkgFUN/w3_grade/w3_good3.json'));
const BAD=JSON.parse(R('pkgFUN/w3_grade/w3_bad3.json'));
let w=0;for(const r of GOOD){const a=row(L1,norm(L1,rep(r))),b=row(L2,norm(L2,rep(r)));if(b.cure_status!=='CURED')w++;console.log('GOOD',b.cure_status==='CURED'?'ok  ':'WRONG','live '+a.cure_status,'cand '+b.cure_status,'|',r);}
for(const r of BAD){const a=row(L1,norm(L1,rep(r))),b=row(L2,norm(L2,rep(r)));console.log('BAD ',b.cure_status==='UNCURED'?'ok  ':'reads CURED','live '+a.cure_status,'cand '+b.cure_status,'|',r);}
console.log(w+' of '+GOOD.length+' correct answers read UNCURED');
