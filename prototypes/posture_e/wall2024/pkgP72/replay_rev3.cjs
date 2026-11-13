// pkgP72 rev 3 replay (also runs rev 2 parents): the new library code (taken from the built parent) run on the stored enforcer_check rows of every run that has a
// ruling-372 E-PREM push. V is read from cure_reason ("ENFORCER <AGREE|DISAGREE> (right: X)"). r372 for an E-PREM item is approximated
// from the stored rows: the verses of that judge's E-ANS items on the answering side that its own line graded MISSES or FAILS.
// usage: node pkgP72/replay_rev2.cjs <built parent> <rows file (tool result json)>
const fs=require('fs');const raw=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/');const Lb=JSON.parse(T.slice(a+8,b));
const l1=Lb.find(l=>l.includes('const __eM372=new Set()'));const vk=l1.slice(l1.indexOf('const __vk372='),l1.indexOf('const __eM372='));const mk=l1.slice(l1.indexOf('const __eM372='),(l1.indexOf(' /* pkgP72 rev 3')>0?l1.indexOf(' /* pkgP72 rev 3'):l1.indexOf(' /* pkgP72 rev 2')));
const l2=Lb.find(l=>/pkgP72 rev [23], ASK 185/.test(l));const hs=l2.indexOf("{const __sd=");const he=l2.indexOf("if(/^\\s*\\(\\s*UNEXHIBITED",hs+10);const hold=l2.slice(hs,he);
const rt=JSON.parse(fs.readFileSync(process.argv[3],'utf8')).result;const rows=JSON.parse(rt.slice(rt.indexOf('\n[')+1,rt.lastIndexOf(']')+1))[0].json_agg;
if(process.argv[4]==='plant'){const P='PLANT-two-checks';const base=[
 {t:P,s:'argon',r:'E-ANS',i:'ANSWER CHECK Ezra 2:62 [CR3]',f:'ANSWER CHECK: Ezra 2:62 -- [CR3] -- MEANS: "a" -- ANSWER: "x" -- MISSES -- w',c:'ENFORCER DISAGREE (right: MEETS): fits',id:1},
 {t:P,s:'argon',r:'E-ANS',i:'ANSWER CHECK Ezra 2:62 [CR3]',f:'ANSWER CHECK: Ezra 2:62 -- [CR3] -- MEANS: "b" -- ANSWER: "y" -- MISSES -- w',c:'ENFORCER AGREE (right: MISSES): absence',id:2},
 {t:P,s:'argon',r:'E-PREM',i:'premise listed against the defender 6',f:'',c:'ENFORCER DISAGREE (right: COUNTED): (UNEXHIBITED: Ezra 2:62 unanswered, ruling 372) own check misses',id:3},
 {t:P+'-b',s:'luna',r:'E-ANS',i:'ANSWER CHECK John 5:1 [CR3]',f:'ANSWER CHECK: John 5:1 -- [CR3] -- MEANS: "a" -- ANSWER: "x" -- MISSES -- w',c:'ENFORCER DISAGREE (right: MEETS): fits',id:5},
 {t:P+'-b',s:'luna',r:'E-PREM',i:'premise listed against the defender 2',f:'',c:'ENFORCER DISAGREE (right: COUNTED): (UNEXHIBITED: 1 John 5:1 unanswered, ruling 372) own check misses',id:6},
 {t:P+'-c',s:'luna',r:'E-ANS',i:'ANSWER CHECK Luke 1:36 [CR3]',f:'ANSWER CHECK: Luke 1:36 -- [CR3] -- MEANS: "a" -- ANSWER: "x" -- MISSES -- w',c:'ENFORCER DISAGREE (right: MEETS): fits',id:7},
 {t:P+'-c',s:'luna',r:'E-PREM',i:'premise listed against the defender 3',f:'',c:'ENFORCER DISAGREE (right: COUNTED): (UNEXHIBITED: Luke 1:36 unanswered, ruling 372) own check misses',id:8}];rows.length=0;rows.push(...base);}
const runs=[...new Set(rows.map(r=>r.t))];let push=0,held=0,kept=0;const out=[];
for(const t of runs){const R=rows.filter(r=>r.t===t);const B=[{ids:R.map(r=>({id:'X'+r.id,rule:r.r,item:r.i,seat:r.s,grade:r.r==='E-ANS'?(/ -- (?:FAILS|MISSES)\b/.test(r.f||'')?'MISSES':/ -- MEETS\b/.test(r.f||'')?'MEETS':'?'):undefined}))}];const V={};
 for(const r of R){const m=String(r.c||'').match(/^ENFORCER (AGREE|DISAGREE|NO ANSWER)(?: \(right: ([A-Z ]+?)\))?:\s*([^]*)$/);if(m)V['X'+r.id]={v:m[1],right:m[2]||'',why:m[3]};}
 const __e372={};
 const f=new Function('B','V','__e372','R',vk+mk+";const vk=__vk372;for(const r of R){if(r.r!=='E-PREM')continue;const sd=/against the defender/.test(r.i)?'CR':/against the challenger/.test(r.i)?'DR':'';const vs=R.filter(y=>y.r==='E-ANS'&&y.s===r.s&&/ -- (?:FAILS|MISSES)\\b/.test(y.f||'')&&new RegExp('\\\\['+sd+'\\\\d').test(y.i)).map(y=>vk((String(y.i).match(/^ANSWER CHECK\\s+(.+?)\\s+\\[/)||[])[1])).filter(Boolean);if(vs.length)__e372[r.i+'|'+r.s]=[...new Set(vs)];}return (x,v)=>{"+hold+"return null;};");
 const H=f(B,V,__e372,R);
 for(const r of R){if(r.r!=='E-PREM')continue;const v=V['X'+r.id];if(!v||v.v!=='DISAGREE'||v.right!=='COUNTED')continue;push++;const x={rule:'E-PREM',item:r.i,seat:r.s};const h=H(x,v);
  if(h)held++;else kept++;out.push((h?'HELD ':'kept ')+t+' '+r.s+' "'+r.i+'" '+(/ruling 372/.test(v.why)?'[372] ':'')+(h?'-- '+h.slice(0,120):'-- why: '+v.why.slice(0,110)));}}
console.log('runs',runs.length,'| COUNTED pushes',push,'| held',held,'| kept',kept);out.forEach(x=>console.log(' ',x));
