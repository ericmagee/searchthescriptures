const fs=require('fs');const L=require('./lib2.cjs');
const live=L('/mnt/project-files/wall2024/fetchback_live_s183.json').fns, nw=L('/mnt/project-files/w1/pkgCGR/parent_s183_CGR2.json').fns;
const rows=JSON.parse(fs.readFileSync(process.argv[2]));

console.log('rounds',rows.length,'fns',typeof live.kffPairs,typeof live.__kfLB,typeof live.krulNorm);
let np=0,chg=0,ex=[];for(const r of rows){let pl,pn;try{const t=live.__kfLB?live.__kfLB(r.t):r.t;pl=live.kffPairs(t);pn=nw.kffPairs(nw.__kfLB?nw.__kfLB(r.t):r.t);}catch(e){console.log('err',r.rt,r.k,e.message);continue;}
 np+=(pl||[]).length;if(JSON.stringify(pl)!==JSON.stringify(pn)){chg++;ex.push(r.rt+' '+r.k);}
 for(const p of (pl||[])){for(const q of Object.values(p).filter(v=>typeof v==='string')){if(live.krulNorm(q)!==nw.krulNorm(q)){ex.push('NORM '+r.rt+' '+r.k+' '+q.slice(0,80));}}}}
console.log('pairs',np,'rounds with changed pairs',chg);console.log(ex.slice(0,20).join('\n'),'\nnorm changes',ex.filter(x=>x.startsWith('NORM')).length);
