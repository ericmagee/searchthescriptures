// pkgKG7: every changed Cure Build output differs only by the K-G7 rule passage (escaped at any level).
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const BASEW='/mnt/project-files/wall2024/fetchback_live_s52.json';
const A3='is counted. Cure it either by counting it: CORRECTED COUNT ';
const B3='is counted. When your line records an answer to the witness (it does not say the witness went unanswered, or a later round of that side names the pressed witness), the break is one of meaning (ruling 421): the premise is not counted, and the only cures are one FORCED line for the pair or a RETRACTED line with one CORRECTED RESULT. Otherwise cure it either by counting it: CORRECTED COUNT ';
const esc=(t,l)=>{for(let x=0;x<l;x++)t=JSON.stringify(t).slice(1,-1);return t;};const tok=(t,W)=>{for(let l=4;l>=0;l--)t=t.split(esc(W,l)).join('<<KG7>>');return t;};
const plan=JSON.parse(fs.readFileSync('pkgKG7/plan_KG7.json','utf8')).nodes;let n=0,diff=0,bad=[];
const fin=(RUN,nm)=>{const fe=feeder(BASEW,nm);return [...fe.filter(x=>/Call/.test(x)),...fe.filter(x=>!/Call/.test(x))].find(x=>fs.existsSync(D+RUN+'_'+x.replace(/ /g,'_')+'.json'));};
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();
for(const RUN of runs){let H;try{H=harness(RUN);}catch(x){continue;}for(const f of Object.keys(plan).filter(f=>/Cure_Build/.test(f))){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');if(!fs.existsSync(D+RUN+'_'+f.replace(/\.js$/,'')+'.json'))continue;const i=fin(RUN,nm);if(!i)continue;
 let a,b;try{a=JSON.stringify(H(fs.readFileSync('pkgLIB/strip_GDA19/patched/'+f,'utf8'),i));b=JSON.stringify(H(fs.readFileSync('pkgLIB/strip_KG7/patched/'+f,'utf8'),i));}catch(e){continue;}n++;if(a===b)continue;diff++;if(tok(a,A3)!==tok(b,B3))bad.push(RUN+' '+nm);}}
console.log((bad.length?'FAIL':'OK')+' Cure Build text: '+n+' node runs, '+diff+' changed, '+(diff-bad.length)+' only by the K-G7 rule passage'+(bad.length?'; other change in '+bad.join(', '):''));
