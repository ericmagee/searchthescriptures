// W3 grade of pkgKRO rev 2: each answer through Panel Cure Normalize 1 and Panel Cure Check (34108 luna, K-S3 item #1) on three libraries: live s103, pkgKRO rev 1, pkgKRO rev 2.
// usage: node pkgKRO/w3_grade/w3_plant_KRO2.cjs <GOOD|BAD> <json file>   (env L3 = rev 2 strip dir)
process.chdir('/home/claude/ericmagee/searchthescriptures/prototypes/posture_e/wall2024');
const fs=require('fs');const {harness}=require(process.cwd()+'/pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const L1='pkgLIB/strip_KCB_base/patched/',L2='pkgLIB/strip_KRO/patched/',L3=(process.env.L3||'pkgLIB/strip_KRO2')+'/patched/';const [,,LAB,FILE]=process.argv;
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const K='K-S3 S3 DEFENDER CR4: #1';const LINE=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+K+' |'));
const call=t=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=t;return c;};
const out=(L,text)=>{const n=harness('34108',{'Panel Cure Call 1 openrouter':[{json:call(text)}]})(R(L+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');return harness('34108',{'Panel Cure Normalize 1':n})(R(L+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;};
const isRow=r=>r.judge_model==='openai/gpt-6-luna'&&r.rule==='K-S3'&&/#1/.test(r.item);
const strip=o=>{const c=JSON.parse(JSON.stringify(o));for(const r of c.enforcer_log||[])if(isRow(r))delete r.cure_reason;return JSON.stringify(c);};
const rep=r=>T0.replace(LINE,()=>'RESPONSE: '+K+' | '+r);
let n=0,bad=0,diff=0,n1=0,n2=0,cured=0;for(const r of JSON.parse(R(FILE))){n++;const [a,b,c]=[L1,L2,L3].map(L=>out(L,rep(r)));const [ra,rb,rc]=[a,b,c].map(o=>(o.enforcer_log||[]).find(isRow)||{cure_status:'NO ROW'});
 const same=strip(b)===strip(c);if(!same)diff++;const why=String(rc.cure_reason||'');const k=(why.match(/NOTED/g)||[]).length;if(/strict reader/.test(why))n1++;if(k>1||/rev 7|whole.answer|second/i.test(why))n2++;
 const wrong=LAB==='GOOD'&&rc.cure_status!=='CURED';if(wrong)bad++;if(rc.cure_status==='CURED')cured++;
 console.log(LAB,'live',ra.cure_status.padEnd(8),'rev1',rb.cure_status.padEnd(8),'rev2',rc.cure_status.padEnd(8),'notes',k,same?'':'REV2 OUTPUT DIFFERS FROM REV1 BEYOND THE REASON',wrong?'WRONG':'',rc.cure_status==='CURED'&&!/^answered: the close concession is counted/.test(why)?'PREFIX LOST':'','|',JSON.stringify(r),'\n     reason:',why.slice(0,400));}
console.log(FILE+': '+n+' texts; rev 2 CURED '+cured+'; '+(LAB==='GOOD'?bad+' correct answers not CURED; ':'')+diff+' texts where rev 2 differs from rev 1 beyond the reason text');
