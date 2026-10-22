const fs=require('fs');const s=fs.readFileSync(process.argv[2],'utf8');
const i=s.indexOf('\nfunction cureCorrected');const a=s.indexOf('function cureSet(');const b=s.indexOf('const cureCorrLine=');
const F=new Function(s.slice(0,i)+'\n'+s.slice(a,b)+'\n;return {cureVerdicts,cureSet};')();
// the judge already counted premises 1 and 3 (count 2, word-first form), so the check raised both falsely
const K=n=>({rule:'K-G6',side:'DEFENDER',link:'DEFENDER premise '+n,line:'premise '+n+': x NOT NAMED: y',conc:2,st:'PROP-DEPENDENT',L:6});
const items=[K(1),K(3)];
for(const reply of [['CORRECTED COUNT: DEFENDER 2','CORRECTED STANDING: DEFENDER PROP-DEPENDENT'],['CORRECTED COUNT: DEFENDER 4','CORRECTED STANDING: DEFENDER PROP-DEPENDENT']]){
 const v=F.cureVerdicts(items,{ok:true,text:reply.join('\n')},{DEFENDER:[],CHALLENGER:[]},{});
 console.log(reply[0].padEnd(28),'=>',v.map(x=>x.link+' '+x.status+' ('+x.why+')').join(' | '));}
