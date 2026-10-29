// Step 4 verify of A3's step 3 (BB-8066): the live Quote Report (p8/final, a3cb28d8) and A3's new one (00f775a3) over run 29199's Quote Compare output.
// Find Words for 29199's 7 pending items returns 0 rows from kjv_verses (SQL in p11e/find.sql). DoD 9 and DoD 10 tested; two mutants of my own.
const fs=require('fs');const QC=JSON.parse(fs.readFileSync('qc29199.json'));const found=[];
const run=src=>{const $=n=>n==='Find Words'?{all:()=>found.map(json=>({json}))}:{first:()=>({json:QC})};return new Function('$',src)($)[0].json;};
const LIVE=fs.readFileSync('../p8/final/Quote_Report.js','utf8'),NEW=fs.readFileSync('new_Quote_Report_a3.js','utf8');
const d9=r=>r.items.filter(i=>i.ref==='1 Chronicles 28:6'&&i.status!=='MATCHES').map(i=>i.side+' '+i.round+' ['+i.status+']');
const d10=r=>r.items.filter(i=>i.ref==='Haggai 2:23').map(i=>i.side+' '+i.round+' ['+i.status+']');
// my mutants: (a) F1 bar lowered to 0 (would call any cited verse "differs"); (b) F2 keeps every cite_form false item, not only load-bearing ones
const Ma=NEW.replace('i.score>=0.75&&i.score>=bs','i.score>=0&&i.score>=bs');
const Mb=NEW.replace('(i.cite_form!==false||i.load_bearing===true)','true');
for(const [n,s] of [['LIVE',LIVE],['NEW',NEW],['MUT a: F1 bar 0',Ma],['MUT b: F2 all cite_form false',Mb]]){const r=run(s);
 console.log(n,'| checked',r.checked,'mism',r.mismatches,'| DoD9',JSON.stringify(d9(r)),'| DoD10',JSON.stringify(d10(r)));}
const L=run(LIVE),N=run(NEW);const K=i=>i.side+'|'+i.round+'|'+i.ref+'|'+i.quote;const lm=new Map(L.items.map(i=>[K(i),i]));
for(const i of N.items){const p=lm.get(K(i));if(!p)console.log('ADDED',i.load_bearing?'LB':'--',i.side,i.round,i.ref,'['+i.status+'] score',i.score,JSON.stringify(i.quote).slice(0,90));else if(p.status!==i.status)console.log('CHANGED',i.ref,p.status,'->',i.status);}
console.log('pending items:');for(const i of QC.items.filter(i=>i.status==='PENDING'))console.log(' ',i.side,i.round,i.ref,'score',i.score,'cite_form',i.cite_form,'LB',i.load_bearing,'opp',!!i.opp_words,!!i.opp_short);
