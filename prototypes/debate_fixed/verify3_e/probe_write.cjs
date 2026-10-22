const fs=require('fs');const s=fs.readFileSync(process.argv[2],'utf8');
const i=s.indexOf('\nfunction cureCorrected');const a=s.indexOf('function cureSet(');const b=s.indexOf('const cureCorrLine=');
const F=new Function(s.slice(0,i)+'\n'+s.slice(a,b)+'\n;return {cureVerdicts,cureSet};')();
const K=n=>({rule:'K-G6',side:'DEFENDER',link:'DEFENDER premise '+n,line:'premise '+n+': x NOT NAMED: y',conc:0,st:'SELF-SUPPORTED',L:6});
const items=[K(1),K(3)];const R={CR3:'and the defender wrote that the verse speaks of the house of David only'};
const text=['STATEMENT: K-G6 DEFENDER premise 1 | the round says "the verse speaks of the house of David only"','CORRECTED COUNT: DEFENDER 0','CORRECTED STANDING: DEFENDER COLLAPSED'].join('\n');
const v=F.cureVerdicts(items,{ok:true,text},{DEFENDER:[],CHALLENGER:[]},R);
console.log(v.map(x=>x.link+' '+x.status+' ('+x.why+')').join(' | '));
console.log('written to the row:',JSON.stringify(F.cureSet({ok:true,text},v)));
