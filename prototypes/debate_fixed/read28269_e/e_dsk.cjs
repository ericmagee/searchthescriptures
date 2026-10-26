// Worker_E 8/9 check: run the live library (new12 = 75dcb465) on DeepSeek's 28269 cure reply. Usage: node e_dsk.cjs <lib dir> <r28269 dir>
const fs=require('fs');const [,,dir,rd]=process.argv;
const lib0=fs.readFileSync(dir+'/Cure_Check.js','utf8').split('\n');const e=lib0.findIndex(l=>l.startsWith('function cureProse'));
const L=new Function(lib0.slice(0,e+2).join('\n')+'\nreturn {cureVerdicts,cureFound,cureLines,cureCorrected};')();
const R=JSON.parse(fs.readFileSync(rd+'/rounds_fixed.json','utf8'));
const rep=fs.readFileSync(rd+'/transcript.md','utf8').split('\n');
const s=rep.findIndex(l=>l.startsWith('### Cure call, DeepSeek'));
const fi=rep.findIndex((l,i)=>i>s&&l==='FLAGGED ITEMS:');const items=[];
for(let i=fi+1;rep[i].trim();i++){const l=rep[i];const lab=l.slice(0,l.indexOf(':'));const rule=lab.split(' ')[0];const link=lab.slice(rule.length+1);
 items.push(rule==='K-G7'?{rule,side:'DEFENDER',link,line:l.slice(l.indexOf(': ')+2),premise:+link.match(/^D(\d+)/)[1],conc:0,st:'PROP-DEPENDENT',L:6}:{rule,side:'DEFENDER',link,line:l.slice(l.indexOf(': ')+2)});}
const rh=rep.findIndex((l,i)=>i>fi&&l.startsWith('**reply to the cure request**'));const a=rep.findIndex((l,i)=>i>rh&&l==='```text');const b=rep.findIndex((l,i)=>i>a&&l==='```');
const reply=rep.slice(a+1,b).join('\n');
const broken={DEFENDER:['D3 vs C1','D4 vs C2','D6 vs C3'],CHALLENGER:[]};
const v=L.cureVerdicts(items,{ok:true,text:reply},broken,R);
v.forEach(x=>console.log(x.rule,x.link,x.status,'|',x.why));
const o=L.cureLines(reply);
o.pressed.forEach(p=>console.log('PRESSED',p.link||'',p.round,'found in named round:',L.cureFound(p.q,R[p.round]),'| in DR2:',L.cureFound(p.q,R.DR2)));
(o.short||[]).forEach(p=>console.log('SHORT',p.link||'',p.round,'found:',L.cureFound(p.q,R[p.round])));
