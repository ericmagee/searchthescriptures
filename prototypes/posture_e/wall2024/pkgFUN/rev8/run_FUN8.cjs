// pkgFUN rev 8 (W1): each case through Panel Cure Normalize 1 + Panel Cure Check (34108 luna, K-S3 #1) on the base (KRO2+KSL) and on rev 8.
// usage: node pkgFUN/rev8/run_FUN8.cjs <cases.json> [labelled: rule field required]   env BASE, CAND strip dirs
process.chdir(__dirname+'/../..');const fs=require('fs');const {harness}=require(process.cwd()+'/pkgGSL/harness.cjs');const R=f=>fs.readFileSync(f,'utf8');
const LIBS={base:process.env.BASE||'pkgLIB/strip_KRO2_KSL',rev8:process.env.CAND||'pkgLIB/strip_KRO2_KSL_FUN8'};
const C0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34108_Panel_Cure_Call_1_openrouter.json'))[0].data.main[0][0].json;const T0=C0.choices[0].message.content;
const K='K-S3 S3 DEFENDER CR4: #1';const LINE=T0.split('\n').find(x=>x.startsWith('RESPONSE: '+K+' |'));
const call=t=>{const c=JSON.parse(JSON.stringify(C0));c.choices[0].message.content=t;return c;};
const out=(L,text)=>{L+='/patched/';const n=harness('34108',{'Panel Cure Call 1 openrouter':[{json:call(text)}]})(R(L+'Panel_Cure_Normalize_1.js'),'Panel Cure Call 1 openrouter');return harness('34108',{'Panel Cure Normalize 1':n})(R(L+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json;};
const isRow=r=>r.judge_model==='openai/gpt-6-luna'&&r.rule==='K-S3'&&/#1\b/.test(r.item);const others=o=>JSON.stringify((o.enforcer_log||[]).filter(r=>!isRow(r)).map(r=>[r.item,r.rule,r.cure_status]));
let ok=0,bad=0,lost=0;const cases=JSON.parse(R(process.argv[2]));
for(const p of cases){const t=typeof p==='string'?p:p.t;const res={};for(const [k,L] of Object.entries(LIBS)){const o=out(L,T0.replace(LINE,()=>'RESPONSE: '+K+' | '+t));const r=(o.enforcer_log||[]).find(isRow)||{cure_status:'NO ROW'};res[k]={st:r.cure_status,why:String(r.cure_reason||''),oth:others(o)};}
 const f=[];if(p.rule&&res.rev8.st!==p.rule)f.push('rule '+res.rev8.st+' expected '+p.rule);if(p.note==='yes'&&!/NOTED/.test(res.rev8.why))f.push('no note');if(res.base.oth!==res.rev8.oth)f.push('another item row differs');
 if(p.good===true&&res.base.st==='CURED'&&res.rev8.st!=='CURED'){f.push('CORRECT ANSWER LOST');lost++;}if(p.good===false&&p.rule==null&&res.rev8.st==='CURED')f.push('refusal cured (as base: '+res.base.st+')');
 f.length?bad++:ok++;console.log((f.length?'FAIL ':'OK   ')+(p.id||'')+' | base '+res.base.st+(/NOTED/.test(res.base.why)?'+N':'')+' | rev 8 '+res.rev8.st+(/NOTED/.test(res.rev8.why)?'+N':'')+' | '+JSON.stringify(t).slice(0,140)+(f.length?'  <- '+f.join('; '):''));}
console.log(process.argv[2]+': '+ok+' OK, '+bad+' FAIL; correct answers cured by the base and refused by rev 8: '+lost);
