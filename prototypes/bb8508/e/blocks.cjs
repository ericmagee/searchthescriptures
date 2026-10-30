const fs=require('fs');const load=f=>new Function(fs.readFileSync(f,'utf8')+'\nreturn PWL;')();
const F=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));const P=load(process.argv[2]);
const out=[];
out.push('roundBlock DR2-list: '+P.roundBlock(F.gr2,P.DEF_RE));
out.push('roundBlock CR3-list: '+P.roundBlock(F.cr3,P.CH_RE));
out.push('citedBlock challenger: '+P.citedBlock([['round 1',F.gr1],['round 2',F.gr2]],'THE CHALLENGER'));
out.push('citedBlock defender: '+P.citedBlock([['round 1',F.cr1],['round 2',F.cr2]],'THE DEFENDER'));
if(P.cList)out.push('cList: '+P.cList({dr3:F.dr3}));
console.log(out.join('\n'));
