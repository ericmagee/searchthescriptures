// F24 (1) (Worker_E, rev 9): cureReport on a constructed 700-character STATEMENT and JUDGE STATEMENT. Usage: node f24.cjs <node dir>
const fs=require('fs');const [,,dir]=process.argv;const lib0=fs.readFileSync(dir+'/Cure_Check.js','utf8').split('\n');const e=lib0.findIndex(l=>l.startsWith('function cureProse'));
const L=new Function(lib0.slice(0,e+2).join('\n')+'\nreturn {cureReport};')();
const st=Array.from({length:120},(_,i)=>'word'+i).join(' ').slice(0,700);
const out=L.cureReport('deepseek',[{rule:'K-G4',link:'D6 vs C3',status:'UNCURED',why:'test',line:'D6 vs C3 (Luke 1:35): DEFENDER LINK BROKEN',statement:st,judge_statement:st}])[0];
const g=k=>{const i=out.indexOf('; '+k+': ')+k.length+4;const j=out.indexOf(k==='STATEMENT'?'; JUDGE STATEMENT: ':']',i);return out.slice(i,j);};
for(const k of ['STATEMENT','JUDGE STATEMENT']){const v=g(k);console.log(k,'length',v.length,'ends',JSON.stringify(v.slice(-24)));}
