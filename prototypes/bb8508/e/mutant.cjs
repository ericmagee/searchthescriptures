const fs=require('fs');const load=f=>new Function(fs.readFileSync(f,'utf8')+'\nreturn PWL;')();
const dr3='**LINK 1: SUPPORTED**\n[L1] Matthew 1:24-25: "x". Also Matthew 1:31 and Luke 1:24-2:5 and Deuteronomy 22:23-24 then (1:19).\n';
const cases=[['range then colon reads whole',o=>o.includes('Matthew 1:24-25')],['verse past chapter end dropped',o=>!o.includes('Matthew 1:31')],['chapter range still refused',o=>o.includes('Luke 1:24,')||/Luke 1:24(?!-)/.test(o)],['bare ref not listed under a wrong book',o=>!o.includes('Deuteronomy 1:19')]];
for(const f of process.argv.slice(2)){const o=load(f).cList({dr3});console.log(f, cases.map(([n,t])=>(t(o)?'PASS':'FAIL')+' '+n).join(' | '));}
