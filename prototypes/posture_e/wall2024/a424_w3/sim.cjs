const fs=require('fs');const W=JSON.parse(fs.readFileSync('live.json'));
const c=W.nodes.find(x=>x.name==='D4 Build').parameters.jsCode;
const s=c.indexOf('const declared=F=>');const e=c.indexOf(';};',c.indexOf('return out.join',s))+3;
const declared=new Function('return ('+c.slice(s+'const declared='.length,e-1)+')')();
const g=c.slice(c.indexOf('const G1DECL='),c.indexOf('const G1CL='));console.log('G1DECL in D4 Build:\n'+g+'\n');
const T={
 '27665':'...the WHO question.\n\n**DECLARED CHAIN**\n\nD1: a — x.\nD2: b — x.\nD3: c — x.\nD4: d — x.\nD5: e — x.\nD6: Christ had a biological father — x.',
 '38661':'body\n\nDECLARED CHAIN\nD1: a — x.\nD2: b — x.\nD3: c — x.\nD4: d — x.\nD5: Christ had a biological father — x.\n',
 '39015':'body\n\nDECLARED CHAIN\nD1: a -- x.\nD2: b -- x.\nD3: c -- x.\nD4: Christ had a biological father -- x.',
 '39266':'body\n\nDECLARED CHAIN\nD1: a — x.\nD2: b — x.\nD3: c — x.\nD4: d — x.\nD5: Christ had a biological father — x.\n'};
for(const k in T){console.log('== '+k+'\n'+declared({cr1:T[k]}))}
