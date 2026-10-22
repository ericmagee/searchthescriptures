// 2c probe harness (Worker_A3): the ledger and broken-line call sites in Panel Payloads and Alternate Payloads run from each node's own
// lines with a parsed judge object v that carries the counted_premises arrays, on Gemini's stored text and the panel's sent text.
const fs=require('fs');const [dir,rep]=process.argv.slice(2);const md=fs.readFileSync(rep,'utf8');
const sec=h=>{const i=md.indexOf(h);const j=md.indexOf('\n## ',i+5);return md.slice(i,j);};const sent=md.slice(md.indexOf('## What the judges were sent'));
const T2=sent.slice(sent.indexOf('### Text 2'),sent.indexOf('### Cure call'));
for(const n of ['Panel_Payloads','Alternate_Payloads']){const s=fs.readFileSync(dir+'/'+n+'.js','utf8');const a=s.indexOf('const DRV_REF=');const c=s.indexOf('function drvCheck(');
 let e=s.indexOf('\n',c);while(true){const nx=s.indexOf('\n',e+1);if(/^[^\s}+\/]/.test(s.slice(e+1,nx)))break;e=nx;}
 const i=s.indexOf('let drvAsk=false;');const j=s.indexOf('p.drv_uncured=DRV.items.length;',i);const t=sec('## Panel judge 1: Gemini');
 const f=new Function('WT','jd','a','p','marks','v',s.slice(a,e)+'\n'+s.slice(i,j)+'\nreturn DRV.items.map(x=>x.rule+" "+x.link).concat(marks);');
 for(const [k,v] of [['covering',{counted_premises_defender:[1,3,6],counted_premises_challenger:[1,6]}],['short',{counted_premises_defender:[6],counted_premises_challenger:[1]}]]){
  try{console.log(n,k,f(t,{body:{messages:[{role:'user',content:T2}]}},{body:{messages:[{role:'user',content:T2}]}},{conceded_links:0,challenger_conceded_links:1,defense_standing:'SELF-SUPPORTED',challenge_standing:'PROP-DEPENDENT'},[],v).join(' | ').slice(0,600));}catch(x){console.log(n,k,'ERROR',x.message);}}}
