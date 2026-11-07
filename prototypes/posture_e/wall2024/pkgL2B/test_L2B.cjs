// pkgL2B test. Run from wall2024/: node pkgL2B/test_L2B.cjs
// 1. Unit on L2C.tags from the patched Quote Report: the 33345 back-reference form, a normal forward tag, and "[L2]." with nothing before it.
// 2. Replay: Quote Report on every saved run, base s44 vs patched; every [L2] tag whose words or status change is listed.
// 3. Replay: the other 54 nodes on every saved run; any output change is listed.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const BASE='/mnt/project-files/wall2024/fetchback_live_s44.json';const W=JSON.parse(fs.readFileSync(BASE,'utf8'));
const plan=JSON.parse(fs.readFileSync(__dirname+'/patched.plan.json','utf8'));let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;out.push('OK '+m);}else{bad++;log('FAIL '+m);}};
const D='/mnt/project-files/wall2024/inputs/';const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).filter(r=>+r>=33218).sort();
const has=(RUN,n)=>fs.existsSync(D+RUN+'_'+n.replace(/ /g,'_')+'.json');
const inputOf=(RUN,n)=>{const f=feeder(BASE,n);return [...f.filter(x=>/Call/.test(x)),...f.filter(x=>!/Call/.test(x))].find(x=>has(RUN,x));};
const tagsOf=o=>{const q=(o[0]||{}).json||{};return (q.l2&&q.l2.tags)||[];};
let changed=0;
for(const RUN of runs){const n='Quote Report';if(!has(RUN,n))continue;const fin=inputOf(RUN,n);if(!fin)continue;const H=harness(RUN);
 const c0=W.nodes.find(z=>z.name===n).parameters.jsCode,c1=fs.readFileSync(__dirname+'/patched/Quote_Report.js','utf8');let a,b;
 try{a=H(c0,fin);b=H(c1,fin);}catch(e){log('both/err '+RUN+' '+e.message.slice(0,100));continue;}
 const A=tagsOf(a),B=tagsOf(b);T(A.length===B.length,RUN+' Quote Report: tag count '+A.length+' -> '+B.length);
 A.forEach((x,k)=>{const y=B[k]||{};const wa=(x.words||[]).map(w=>w.w).join('/'),wb=(y.words||[]).map(w=>w.w).join('/');if(wa!==wb||x.status!==y.status){changed++;log('CHANGE '+RUN+' '+x.round+' '+x.status+' ['+wa+'] -> '+y.status+' ['+wb+'] | seg now: '+String(y.seg).slice(0,160));}});}
log('Quote Report [L2] tags changed: '+changed);
// 3. other nodes
const diffs=[];for(const RUN of runs){const H=harness(RUN);for(const p of plan.nodes){if(p.name==='Quote Report'||!has(RUN,p.name))continue;const fin=inputOf(RUN,p.name);if(!fin)continue;
 const c0=W.nodes.find(z=>z.name===p.name).parameters.jsCode,c1=fs.readFileSync(__dirname+'/patched/'+p.file,'utf8');let a,b,e0=null,e1=null;try{a=H(c0,fin);}catch(e){e0=e.message.slice(0,80);}try{b=H(c1,fin);}catch(e){e1=e.message.slice(0,80);}
 if(e0||e1){if(e0!==e1){bad++;log('ERR '+RUN+' '+p.name+' '+e0+' | '+e1);}continue;}ok++;const sa=JSON.stringify(a),sb=JSON.stringify(b);if(sa!==sb){let i=0;while(sa[i]===sb[i])i++;diffs.push(RUN+' '+p.name+' @'+i+' base: '+sa.slice(Math.max(0,i-120),i+120)+' || patched: '+sb.slice(Math.max(0,i-120),i+160));}}}
log('other nodes changed outputs: '+diffs.length);for(const d of diffs)log('DIFF '+d);
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync(__dirname+'/test_L2B.txt',out.join('\n')+'\n');
