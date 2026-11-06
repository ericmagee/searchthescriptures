// pkgECF feed replay: Judge Enforcer Build pkgJEC vs pkgECF on inputs/<run>_*.json. Lists every E-COL item, new ones marked. Run from wall2024/.
const fs=require('fs');
module.exports=function feed(run){
 const I=n=>{const f='/mnt/project-files/wall2024/inputs/'+run+'_'+n+'.json';if(!fs.existsSync(f))return null;return JSON.parse(fs.readFileSync(f,'utf8'))[0].main[0].map(x=>x.json);};
 const nodes={'Panel Cure Check':I('Panel_Cure_Check'),'Init Seats':I('Init_Seats')||[{run_token:'r'}],'Resolve Seats':[{deepseek:{api_model:'stub'}}]};
 for(const k of [1,2,3]){const v=I('Panel_Cure_Normalize_'+k);if(v)nodes['Panel Cure Normalize '+k]=v;}
 const $=n=>{const it=nodes[n];if(!it)return {isExecuted:false,first:()=>{throw new Error(n);},all:()=>{throw new Error(n);}};return {isExecuted:true,first:()=>({json:it[0]}),all:()=>it.map(j=>({json:j}))};};
 const go=pkg=>new Function('$','$input','$json',fs.readFileSync(pkg+'/patched/Judge_Enforcer_Build.js','utf8'))($,{first:()=>({json:{}}),all:()=>[],item:{json:{}}},{}).map(x=>x.json);
 const ec=o=>o.flatMap(c=>c.ids||[]).filter(x=>x.rule==='E-COL').map(x=>({seat:x.seat,item:x.item,grade:x.grade,line:x.flagged_line}));
 const A=go('pkgJEC'),B=go('pkgECF');const k=x=>x.seat+'|'+x.line;const ka=new Set(ec(A).map(k));
 const strip=o=>JSON.stringify(o.flatMap(c=>c.ids||[]).filter(x=>x.rule!=='E-COL').map(x=>[x.rule,x.seat,x.item]));
 return {a:ec(A),b:ec(B),added:ec(B).filter(x=>!ka.has(k(x))),lost:ec(A).filter(x=>!new Set(ec(B).map(k)).has(k(x))),otherSame:strip(A)===strip(B),callsA:A.length,callsB:B.length};};
if(require.main===module)for(const run of process.argv.slice(2)){const r=module.exports(run);console.log('== '+run+': E-COL items '+r.a.length+' -> '+r.b.length+' (added '+r.added.length+', lost '+r.lost.length+'); other items identical: '+r.otherSame+'; calls '+r.callsA+' -> '+r.callsB);
 r.added.forEach(x=>console.log('  + '+x.seat.padEnd(8)+' '+String(x.item).padEnd(22)+' '+x.grade.padEnd(12)+' '+x.line.slice(0,140).replace(/\n/g,' ')));}
