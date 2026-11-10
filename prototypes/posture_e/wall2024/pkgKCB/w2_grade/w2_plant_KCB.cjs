// W2 plants for pkgKCB on 34108 luna K-S3 #1 (same harness as probe_KCB). Base strip_KCB_base against strip_KCB.
process.chdir(require('path').resolve(__dirname,'../..'));
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const L1='pkgLIB/strip_KCB_base/patched/',L2='pkgLIB/strip_KCB/patched/';
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const K='K-S3 S3 DEFENDER CR4: #1';const LINE=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+K+' |'));
let ok=0,bad=0,fnd=[];const chk=(c,m)=>{if(c){ok++;console.log('OK   '+m);}else{bad++;console.log('FAIL '+m);}};
const call=t=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=t;return c;};
const norm=(L,t)=>harness('34108',{'Panel Cure Call 1 openrouter':[{json:call(t)}]})(R(L+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');
const check=(L,n)=>harness('34108',{'Panel Cure Normalize 1':n})(R(L+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;
const row=j=>j.enforcer_log.find(r=>r.judge_model==='openai/gpt-6-luna'&&r.rule==='K-S3'&&/#1/.test(r.item));
const rep=r=>T0.replace(LINE,'RESPONSE: '+K+' | '+r);const strip=r=>{const c={...r};delete c.at;return JSON.stringify(c);};
const st=r=>{const a=row(check(L1,norm(L1,rep(r)))),b=row(check(L2,norm(L2,rep(r))));return [a.cure_status,b.cure_status];};
// A. refusals worded outside the lists (README limit): report what they read
console.log('-- A. refusals in other words (stated limit; reported, not graded) --');
for(const r of ['COUNTED. The defender never granted this.','COUNTED. The defender did not concede it.','COUNTED. It should not have been.','COUNTED. Nothing in the round grants it.','COUNTED. I reverse that: it is not counted.','COUNTED. Strike that.','COUNTED. On reflection, no.']){const [a,b]=st(r);console.log('     '+r+' -> base '+a+', KCB '+b);if(b==='CURED')fnd.push(r);}
// B. refusals that must now read UNCURED
for(const r of ['COUNTED, but only in part.','COUNTED. That count is mistaken.','COUNTED; however, see D2.','COUNTED. I deny that it grants D6.','COUNTED. Not accepted.','COUNTED. The defender doesn\'t hold it.','COUNTED — wrongly; strike it.','COUNTED. It isn\'t valid.']){const [a,b]=st(r);chk(a==='CURED'&&b==='UNCURED','refusal "'+r+'": base '+a+', KCB '+b);}
// C. plain answers that must stay CURED, row equal
for(const r of ['COUNTED. The defender concedes D6 in [DR3].','COUNTED. There is no doubt.','COUNTED. I do not doubt it.','COUNTED; the grant stands as written.','COUNTED. Granted in full.']){const a=row(check(L1,norm(L1,rep(r)))),b=row(check(L2,norm(L2,rep(r))));chk(a.cure_status==='CURED'&&b.cure_status==='CURED'&&strip(a)===strip(b),'stays CURED "'+r+'"'+(b.cure_status!=='CURED'?' (KCB '+b.cure_status+')':''));}
// D. over-reads (stated limit: asked once): report
console.log('-- D. plain answers with a listed word (asked once; reported) --');
for(const r of ['COUNTED: no link survives the grant.','COUNTED. Nothing is wrong with it.','COUNTED, though late in the round.','COUNTED. The defender does not deny it.','COUNTED: the grant is not in dispute.','COUNTED. There is no error.']){const [a,b]=st(r);console.log('     '+r+' -> base '+a+', KCB '+b);}
// E. verdict bodies for a refusal answer before the follow-up: what changes
{const a=check(L1,norm(L1,rep('COUNTED, but that is wrong.'))),b=check(L2,norm(L2,rep('COUNTED, but that is wrong.')));console.log('-- E. bodies equal for a refusal answer before the follow-up: '+(JSON.stringify(a.bodies)===JSON.stringify(b.bodies)));}
fs.writeFileSync(__dirname+'/w2_rows.json',JSON.stringify([row(check(L2,norm(L2,rep('COUNTED. That count is mistaken.')))),row(check(L2,norm(L2,rep('COUNTED. The defender concedes D6 in [DR3].'))))].map(r=>({...r,run_token:'W2-ROLLBACK-TEST-KCB'}))));
console.log('stated-limit misses: '+fnd.length);console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
