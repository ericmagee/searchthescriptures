// W1 grade of pkgKSL on s103: each plant through Panel Cure Normalize 1 and Panel Cure Check (34108 luna, K-S3 #1) on four libraries:
// live s103 (strip_KCB_base), KSL alone, KRO2 alone, KRO2+KSL. Labels (rule, note under KRO2+KSL) are in w1_plants_KSL.json, committed before the run.
process.chdir(__dirname+'/../..');const fs=require('fs');const {harness}=require(process.cwd()+'/pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const LIBS={live:'pkgLIB/strip_KCB_base',KSL:'pkgLIB/strip_s103_KSL',KRO2:'pkgLIB/strip_KRO2',KRO2_KSL:'pkgLIB/strip_KRO2_KSL'};
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const K='K-S3 S3 DEFENDER CR4: #1';const LINE=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+K+' |'));
const call=t=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=t;return c;};
const out=(L,text)=>{L+='/patched/';const n=harness('34108',{'Panel Cure Call 1 openrouter':[{json:call(text)}]})(R(L+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');return harness('34108',{'Panel Cure Normalize 1':n})(R(L+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;};
const isRow=r=>r.judge_model==='openai/gpt-6-luna'&&r.rule==='K-S3'&&/#1\b/.test(r.item);
const others=o=>JSON.stringify((o.enforcer_log||[]).filter(r=>!isRow(r)).map(r=>[r.item,r.rule,r.cure_status]));
let ok=0,bad=0;
for(const p of JSON.parse(R(__dirname+'/w1_plants_KSL.json'))){const res={};for(const [k,L] of Object.entries(LIBS)){const o=out(L,T0.replace(LINE,()=>'RESPONSE: '+K+' | '+p.t));const r=(o.enforcer_log||[]).find(isRow)||{cure_status:'NO ROW'};res[k]={st:r.cure_status,why:String(r.cure_reason||''),oth:others(o)};}
 const s=res.KRO2_KSL,noted=/NOTED/.test(s.why);const f=[];
 if(s.st!==p.rule)f.push('ruling '+s.st+' expected '+p.rule);if(p.note==='yes'&&!noted)f.push('no note');if(p.note==='no'&&noted)f.push('unexpected note');
 if(res.KSL.st!==res.live.st)f.push('KSL alone changes the live ruling');if(res.KRO2_KSL.st!==res.KRO2.st)f.push('KSL changes the KRO2 ruling');
 if(new Set(Object.values(res).map(x=>x.oth)).size!==1)f.push('another item row differs');
 f.length?bad++:ok++;console.log((f.length?'FAIL ':'OK   ')+p.id+' | live '+res.live.st+' | KSL '+res.KSL.st+' | KRO2 '+res.KRO2.st+(/NOTED/.test(res.KRO2.why)?'+N':'')+' | KRO2+KSL '+s.st+(noted?'+N':'')+' | '+JSON.stringify(p.t)+(f.length?'  <- '+f.join('; '):'')+'\n     '+p.why+'\n     KRO2+KSL reason: '+s.why.slice(0,300));}
console.log(ok+' OK, '+bad+' FAIL');
