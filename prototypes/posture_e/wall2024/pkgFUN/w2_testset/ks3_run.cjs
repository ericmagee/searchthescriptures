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
const cases=R(__dirname+'/cases.txt').split('\n').filter(l=>l&&!l.startsWith('#')).map(l=>{const [exp,cat,ans,why]=l.split('|');return {exp,cat,ans:ans.replace(/\\n/g,'\n'),why};});
const dirs=process.argv.slice(2).map(d=>d.replace(/\/?$/,'/')+'patched/');
const out=[];const tally=dirs.map(()=>({match:0,miss:0,falseCure:0,falseRefuse:0}));
for(const c of cases){const r={...c,read:{}};dirs.forEach((L,i)=>{let s;try{const x=row(check(L,norm(L,T0.replace(LINE,()=>'RESPONSE: '+K+' | '+c.ans))));s=x?x.cure_status:'NO ROW';}catch(e){s='ERROR '+e.message.slice(0,60);}
 r.read[L]=s;if(s===c.exp)tally[i].match++;else{tally[i].miss++;if(s==='CURED')tally[i].falseCure++;else if(c.exp==='CURED')tally[i].falseRefuse++;}});out.push(r);}
for(const r of out)console.log(dirs.map(L=>(r.read[L]===r.exp?'ok  ':'MISS')+' '+String(r.read[L]).padEnd(8)).join(' | ')+' | exp '+r.exp.padEnd(8)+' '+r.cat.padEnd(18)+' '+JSON.stringify(r.ans));
dirs.forEach((L,i)=>console.log(L+': '+tally[i].match+' match, '+tally[i].miss+' miss ('+tally[i].falseRefuse+' correct answers refused, '+tally[i].falseCure+' refusals cured) of '+cases.length));
fs.writeFileSync(__dirname+'/ks3_results.json',JSON.stringify(out,null,1));
