// pkgEGL test (run from wall2024/): base s52 vs patched Enforcer Record and Enforcer Build on every saved run with Enforcer Record saved.
// Record: identical output on every run whose reply uses answer ids; on 33497 (item labels G1..G24) the tally and the fanned rows are printed.
// Build: identical once the pkgEGL sentence is removed.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');
const F='/mnt/project-files/wall2024/fetchback_live_s52.json';let ok=0,bad=0;
const RS="\nThe answer id is the A<item>.<n> label in front of each judge's answer (A1.1, A1.2, ...). An ITEM label (G1, G2, ...) is never an answer id: write one line for each judge answer under the item, even when they agree (pkgEGL).";
(async()=>{const runs=[...new Set(fs.readdirSync(D).filter(x=>/^33\d{3}_Enforcer_Record\.json$/.test(x)).map(x=>x.slice(0,5)))].sort();
 for(const node of ['Enforcer Record','Enforcer Build']){const f=node.replace(/ /g,'_')+'.js';const A=rd('pkgEGL/base_s52/'+f),B=rd('pkgEGL/patched/'+f);const IN=feeder(F,node)[0];
  for(const R of runs){const run=async c=>{try{return await harness(R)('return (async()=>{'+c+'\n})()',IN);}catch(e){return 'ERR '+e.message;}};
   const a=await run(A),b=await run(B);let sa=JSON.stringify(a),sb=JSON.stringify(b);
   if(node==='Enforcer Build')sb=sb.split(JSON.stringify(RS).slice(1,-1)).join('');
   if(sa===sb){ok++;continue;}
   if(node==='Enforcer Record'&&typeof a!=='string'&&typeof b!=='string'){const ta=a[0].json.enf421.tally,tb=b[0].json.enf421.tally;const fan=b[0].json.enf421_rows.filter(r=>/pkgEGL/.test(r.cure_reason));
    const strip=o=>JSON.stringify(o[0].json.enf421_rows.map(r=>({...r,cure_reason:null})));
    console.log(R+' Record: tally '+JSON.stringify(ta)+' -> '+JSON.stringify(tb)+'; fanned rows '+fan.length+'; rows otherwise same: '+(strip(a)===strip(b)));
    if(fan[0])console.log('  e.g. '+fan[0].seat+' '+fan[0].item+': '+fan[0].cure_reason.slice(0,260));
    if(R==='33497'&&strip(a)===strip(b))ok++;else{bad++;console.log('FAIL '+R+' Record changed');}continue;}
   bad++;let i=0;while(sa[i]===sb[i])i++;console.log('FAIL '+R+' '+node+' at '+i+': '+sa.slice(i-80,i+80)+' | '+sb.slice(i-80,i+80));}}
 console.log('node runs ok '+ok+', failed '+bad);console.log(bad===0?'OK':'FAIL');})();
