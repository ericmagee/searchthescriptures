// pkgP72 rev 2 replay: the new library code (taken from the built parent) run on the stored enforcer_check rows of every run that has a
// ruling-372 E-PREM push. V is read from cure_reason ("ENFORCER <AGREE|DISAGREE> (right: X)"). r372 for an E-PREM item is approximated
// from the stored rows: the verses of that judge's E-ANS items on the answering side that its own line graded MISSES or FAILS.
// usage: node pkgP72/replay_rev2.cjs <built parent> <rows file (tool result json)>
const fs=require('fs');const raw=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/');const Lb=JSON.parse(T.slice(a+8,b));
const l1=Lb.find(l=>l.includes('const __eM372=new Set()'));const vk=l1.slice(l1.indexOf('const __vk372='),l1.indexOf('const __eM372='));const mk=l1.slice(l1.indexOf('const __eM372='),l1.indexOf(' /* pkgP72 rev 2'));
const l2=Lb.find(l=>l.includes('pkgP72 rev 2, ASK 185'));const hs=l2.indexOf("{const __sd=");const he=l2.indexOf("if(/^\\s*\\(\\s*UNEXHIBITED",hs+10);const hold=l2.slice(hs,he);
const rt=JSON.parse(fs.readFileSync(process.argv[3],'utf8')).result;const rows=JSON.parse(rt.slice(rt.indexOf('\n[')+1,rt.lastIndexOf(']')+1))[0].json_agg;
const runs=[...new Set(rows.map(r=>r.t))];let push=0,held=0,kept=0;const out=[];
for(const t of runs){const R=rows.filter(r=>r.t===t);const B=[{ids:R.map(r=>({id:'X'+r.id,rule:r.r,item:r.i,seat:r.s}))}];const V={};
 for(const r of R){const m=String(r.c||'').match(/^ENFORCER (AGREE|DISAGREE|NO ANSWER)(?: \(right: ([A-Z ]+?)\))?:\s*([^]*)$/);if(m)V['X'+r.id]={v:m[1],right:m[2]||'',why:m[3]};}
 const __e372={};
 const f=new Function('B','V','__e372','R',vk+mk+";const vk=__vk372;for(const r of R){if(r.r!=='E-PREM')continue;const sd=/against the defender/.test(r.i)?'CR':/against the challenger/.test(r.i)?'DR':'';const vs=R.filter(y=>y.r==='E-ANS'&&y.s===r.s&&/ -- (?:FAILS|MISSES)\\b/.test(y.f||'')&&new RegExp('\\\\['+sd+'\\\\d').test(y.i)).map(y=>vk((String(y.i).match(/^ANSWER CHECK\\s+(.+?)\\s+\\[/)||[])[1])).filter(Boolean);if(vs.length)__e372[r.i+'|'+r.s]=[...new Set(vs)];}return (x,v)=>{"+hold+"return null;};");
 const H=f(B,V,__e372,R);
 for(const r of R){if(r.r!=='E-PREM')continue;const v=V['X'+r.id];if(!v||v.v!=='DISAGREE'||v.right!=='COUNTED')continue;push++;const x={rule:'E-PREM',item:r.i,seat:r.s};const h=H(x,v);
  if(h)held++;else kept++;out.push((h?'HELD ':'kept ')+t+' '+r.s+' "'+r.i+'" '+(/ruling 372/.test(v.why)?'[372] ':'')+(h?'-- '+h.slice(0,120):'-- why: '+v.why.slice(0,110)));}}
console.log('runs',runs.length,'| COUNTED pushes',push,'| held',held,'| kept',kept);out.forEach(x=>console.log(' ',x));
