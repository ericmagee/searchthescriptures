// W3 grade of pkgKSL: each answer (RESPONSE line plus the lines under it) through Panel Cure Normalize 1 and Panel Cure Check (34108 luna, K-S3 item #1)
// on four libraries: live s103, pkgKSL on s103, pkgKRO rev 2, pkgKRO rev 2 + pkgKSL.   usage: node w3_plant_KSL.cjs <GOOD|BAD> <json>
process.chdir('/home/claude/ericmagee/searchthescriptures/prototypes/posture_e/wall2024');
const fs=require('fs');const {harness}=require(process.cwd()+'/pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const LIBS=[['s103 strict','pkgLIB/strip_KCB_base'],['s103+KSL2','pkgLIB/strip_s103_KSL'],['LIVE s104','pkgLIB/strip_KRO2'],['s104+KSL2','pkgLIB/strip_KRO2_KSL']].map(([n,d])=>[n,d+'/patched/']);const [,,LAB,FILE]=process.argv;
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const K='K-S3 S3 DEFENDER CR4: #1';const LINE=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+K+' |'));
const out=(L,text)=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=text;const n=harness('34108',{'Panel Cure Call 1 openrouter':[{json:c}]})(R(L+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');return harness('34108',{'Panel Cure Normalize 1':n})(R(L+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;};
const isRow=r=>r.judge_model==='openai/gpt-6-luna'&&r.rule==='K-S3'&&/#1/.test(r.item);const others=o=>JSON.stringify((o.enforcer_log||[]).filter(r=>!isRow(r)).map(r=>[r.judge_model,r.rule,r.item,r.cure_status,r.cure_reason]));
let n=0,worse=0,oth=0,kd=0;for(const r of JSON.parse(R(FILE))){n++;const o=LIBS.map(([nm,L])=>out(L,T0.replace(LINE,()=>'RESPONSE: '+K+' | '+r)));const s=o.map(x=>((x.enforcer_log||[]).find(isRow)||{cure_status:'NO ROW'}));
 const w=LAB==='GOOD'&&s[0].cure_status==='CURED'&&s[1].cure_status!=='CURED';if(w)worse++;const od=others(o[0])!==others(o[1])||others(o[2])!==others(o[3]);if(od)oth++;const kdiff=s[2].cure_status!==s[3].cure_status;if(kdiff)kd++;
 console.log(LAB,LIBS.map(([nm],i)=>nm+' '+s[i].cure_status).join(' | '),w?'| WORSE THAN LIVE':'',s[0].cure_status!==s[1].cure_status?'| KSL CHANGES THE LIVE RULING':'',kdiff?'| KSL CHANGES THE KRO2 RULING':'',od?'| OTHER ROWS DIFFER':'','|',JSON.stringify(r),'\n     KRO2+KSL reason: '+String(s[3].cure_reason||'').slice(0,260));}
console.log(FILE+': '+n+' texts; correct answers cured on live and refused with pkgKSL: '+worse+'; texts where another log row differs: '+oth+'; texts where pkgKSL changes the pkgKRO rev 2 ruling: '+kd);
