// pkgFMQ test. Run from wall2024/: node pkgFMQ/test_FMQ.cjs. Replay every saved run 33218+: base vs patched report; every changed line listed.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const BW='/mnt/project-files/wall2024/fetchback_live_s45.json';const D='/mnt/project-files/wall2024/inputs/';
const W=JSON.parse(fs.readFileSync(BW,'utf8'));const B=W.nodes.find(z=>z.name==='Format Markdown').parameters.jsCode,P=fs.readFileSync(__dirname+'/patched/Format_Markdown.js','utf8');
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;log('FAIL '+m);}};
const f=feeder(BW,'Format Markdown');const runs=fs.readdirSync(D).filter(x=>/^\d+_Format_Markdown\.json$/.test(x)).map(x=>x.split('_')[0]).filter(r=>+r>=33218).sort();
const md=o=>{const j=o[0]&&o[0].json||{};return String(j.markdown||j.report||j.md||JSON.stringify(j));};
for(const RUN of runs){const fin=f.find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));if(!fin)continue;let a,b;try{a=md(harness(RUN)(B,fin));b=md(harness(RUN)(P,fin));}catch(e){let e0=null;try{harness(RUN)(B,fin);}catch(x){e0=x.message;}T(e0===e.message,RUN+': base and patched throw the same ('+String(e.message).slice(0,80)+')');continue;}
 const la=a.split('\n'),lb=b.split('\n');const ch=[];for(let i=0;i<Math.max(la.length,lb.length);i++)if(la[i]!==lb[i])ch.push('   - '+String(la[i]).slice(0,170)+'\n   + '+String(lb[i]).slice(0,240));
 const cut=lb.filter(l=>/\\\s*$/.test(l)&&/WINS|UNDERDETERMINED/.test(l)).length;T(la.length===lb.length&&cut===0,RUN+': '+ch.length+' report line(s) changed, none left ending in a lone backslash'+(ch.length?'\n'+ch.join('\n'):''));}
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_FMQ.txt',out.join('\n')+'\n');
