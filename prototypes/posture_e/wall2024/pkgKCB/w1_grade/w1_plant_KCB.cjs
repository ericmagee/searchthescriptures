// W1 grade of pkgKCB: legitimate COUNTED answers whose reason describes the concession in words on pkgKCB's lists (34108 luna, K-S3 S3 DEFENDER CR4: #1).
process.chdir(require('path').resolve(__dirname,'../..'));
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const L1='pkgLIB/strip_KCB_base/patched/',L2='pkgLIB/strip_KCB/patched/';
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const K='K-S3 S3 DEFENDER CR4: #1';const LINE=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+K+' |'));
const call=t=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=t;return c;};
const norm=(L,text)=>harness('34108',{'Panel Cure Call 1 openrouter':[{json:call(text)}]})(R(L+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');
const check=(L,n)=>harness('34108',{'Panel Cure Normalize 1':n})(R(L+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;
const row=(L,n)=>check(L,n).enforcer_log.find(r=>r.judge_model==='openai/gpt-6-luna'&&r.rule==='K-S3'&&/#1/.test(r.item));
const rep=r=>T0.replace(LINE,'RESPONSE: '+K+' | '+r);
const A=['COUNTED: the defender withdrew D6 in his close round.','COUNTED. He retracted the keystone in [DR4].','COUNTED: the defender no longer holds D6 as declared.','COUNTED; the grant concedes what D6 had denied.','COUNTED: by this grant D6 does not stand.','COUNTED. The grant is a concession, though it came late.','COUNTED: the challenger disputed this and the defender gave way.','COUNTED. The defender objected earlier but granted it in the close.','COUNTED: the defender cannot hold husband and wife without conceding D6.','COUNTED. The grant is not a mere title; it gives up D6.'];
let n=0;for(const a of A){const b=row(L1,norm(L1,rep(a))),c=row(L2,norm(L2,rep(a)));const f=norm(L2,rep(a))[0].json.fum;console.log((b.cure_status!==c.cure_status?'CHANGED ':'same    ')+b.cure_status+' -> '+c.cure_status+(f?' (asked: '+f.asked.length+')':'')+' | '+a);if(b.cure_status!==c.cure_status)n++;}
console.log(n+' of '+A.length+' legitimate COUNTED answers change CURED to UNCURED');
