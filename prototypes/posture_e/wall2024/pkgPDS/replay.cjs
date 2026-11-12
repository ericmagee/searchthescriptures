// pkgPDS replay on every stored export. For each group: (1) each member Build, re-run on the stored data, gives its stored output
// re-run with only the nodes that had run before the group's first Build (early) and with the whole run (late): the two outputs must be
// equal (the s146 code on both sides; runs without the group's first Build, before Close Enforcer existed, are left out); (2) the package's Batch Build lists the members' non-skipped items; the batch reply
// is taken as the stored replies of the member calls in that order (what one HTTP node returns for those requests); (3) each member's new
// Call Code node hands back exactly its stored Call output. (4) Time: each group's stored member call times, sum (today) and max (batch).
// Usage: node replay.cjs <pkg json>
const fs=require('fs');let W=JSON.parse(fs.readFileSync(process.argv[2]));W=W.data||W;W=W.workflow||W;
const wrap=items=>({isExecuted:true,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}});
const mk=(rd,over)=>name=>{if(over&&name in over)return over[name];const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const nd=W.nodes.find(n=>n.name===name)||{};return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:nd.parameters||{}};};
const run=async(rd,name,over,inp)=>{const $input={all:()=>inp,first:()=>inp[0],last:()=>inp[inp.length-1],item:inp[0]};return await new Function('$','$input','return (async()=>{\n'+W.nodes.find(n=>n.name===name).parameters.jsCode+'\n})();')(mk(rd,over),$input);};
const Z=o=>JSON.stringify(o).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,'T');
const G=[['Close Group',[['Close Enforcer','cec_skip','C'],['Anticheat','acx_skip','A'],['Assume Check','acx_skip','S']]],['Enforcer Group',[['Enforcer','enf_skip','E'],['Judge Enforcer','je_skip','J']]]];
(async()=>{const D='/mnt/project-files/wall2024/';const tot={builds:0,builds_eq:0,calls:0,calls_eq:0,save_s:0,runs:0};
 for(const f of fs.readdirSync(D).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const rd=JSON.parse(fs.readFileSync(D+f,'utf8')).data.resultData.runData;let line=f.slice(2,7);let runSave=0;
  for(const [g,M] of G){const over={};const sums=[];let ok=true;
   const fb=rd[M[0][0]+' Build'];const t0=fb?fb[0].startTime:0;const early={};for(const [k,v] of Object.entries(rd))if(v[0].startTime<t0)early[k]=v;
   for(const [X] of M){if(!rd[X+' Build']||!fb)continue;const inp=X==='Judge Enforcer'?rd['Enforcer Build'][0].data.main[0]:[];let a,b;try{a=await run(early,X+' Build',null,inp);}catch(e){a='ERR '+e.message;}try{b=await run(rd,X+' Build',null,inp);}catch(e){b='ERR '+e.message;}tot.builds++;const be=Z(a)===Z(b)&&typeof a!=='string';if(be)tot.builds_eq++;else{ok=false;console.log('   build differs',f,X,String(Z(a)).slice(0,150),'|',String(Z(b)).slice(0,150));}}
   const BB=await run(rd,g+' Batch Build',null,[]);
   const reply=BB.map(x=>{if(x.json.bt_skip)return null;const m=M.find(z=>z[2]===x.json.bt);const c=rd[m[0]+' Call deepseek'];return c?c[0].data.main[0][x.json.k]:{json:{error:'not in store'}};}).filter(Boolean);
   over[g+' Batch Build']=wrap(BB);over[g+' Batch Call deepseek']=wrap(reply);
   for(const [X] of M){const c=rd[X+' Call deepseek'];if(!c){continue;}const inp=rd[X+' Needed?'][0].data.main[0];const out=await run(rd,X+' Call deepseek',over,inp);tot.calls++;const ce=JSON.stringify(out.map(x=>x.json))===JSON.stringify(c[0].data.main[0].map(x=>x.json));if(ce)tot.calls_eq++;else ok=false;sums.push(c[0].executionTime/1000);}
   const save=sums.length?sums.reduce((a,b)=>a+b,0)-Math.max(...sums):0;runSave+=save;
   line+=' | '+g+': batch items '+BB.filter(x=>!x.json.bt_skip).length+', all equal '+ok+', calls '+JSON.stringify(sums.map(Math.round))+' s, saving '+Math.round(save)+' s';}
  tot.save_s+=runSave;tot.runs++;console.log(line+' | run saving '+(runSave/60).toFixed(1)+' min');}
 console.log('TOTAL',JSON.stringify(tot),'mean saving per run',(tot.save_s/tot.runs/60).toFixed(1),'min');})().catch(e=>{console.error(e);process.exit(1);});
