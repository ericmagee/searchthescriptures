// W3 grade of pkgKRO rev 1: answers through Panel Cure Normalize 1 and Panel Cure Check (34108 luna, K-S3 item #1), live library and pkgKRO.
// usage: node pkgKRO/w3_grade/w3_plant_KRO.cjs <GOOD|BAD> <json file> [candonly]
process.chdir('/home/claude/ericmagee/searchthescriptures/prototypes/posture_e/wall2024');
const fs=require('fs');const {harness}=require(process.cwd()+'/pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const L1='pkgLIB/strip_KCB_base/patched/',L2='pkgLIB/strip_KRO/patched/';const [,,LAB,FILE,ONLY]=process.argv;
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const K='K-S3 S3 DEFENDER CR4: #1';const LINE=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+K+' |'));
const call=t=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=t;return c;};
const norm=(L,text)=>harness('34108',{'Panel Cure Call 1 openrouter':[{json:call(text)}]})(R(L+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');
const check=(L,n)=>harness('34108',{'Panel Cure Normalize 1':n})(R(L+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;
const row=(L,n)=>check(L,n).enforcer_log.find(r=>r.judge_model==='openai/gpt-6-luna'&&r.rule==='K-S3'&&/#1/.test(r.item))||{cure_status:'NO ROW'};
const rep=r=>T0.replace(LINE,()=>'RESPONSE: '+K+' | '+r);
let bad=0,n=0,notes=0;for(const r of JSON.parse(R(FILE))){n++;const b=row(L2,norm(L2,rep(r)));const a=ONLY?null:row(L1,norm(L1,rep(r)));const note=/NOTED, record-only/.test(String(b.cure_reason));if(note)notes++;
 const wrong=LAB==='GOOD'?b.cure_status!=='CURED':false;if(wrong)bad++;console.log(LAB,(a?'live '+a.cure_status.padEnd(8):''),'KRO '+b.cure_status.padEnd(8),note?'+NOTE':'     ',wrong?'WRONG':'',/^answered: the close concession is counted/.test(String(b.cure_reason))||b.cure_status!=='CURED'?'':'PREFIX LOST','|',JSON.stringify(r));}
console.log(FILE+': '+n+' texts, '+(LAB==='GOOD'?bad+' correct answers not CURED':'')+' notes '+notes);
