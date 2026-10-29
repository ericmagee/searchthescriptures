// DoD 9/10 at the judges' block: the published Panel Build's citation block (p8/final/Panel_Build.js, from "const KJVC=" to its closing "})();"),
// run as written over the live and A3's new Quote Report output for run 29199. Same block in Build Independent Verdict is checked for equality.
const fs=require('fs');const QC=JSON.parse(fs.readFileSync('qc29199.json'));
const qr=src=>{const $=n=>n==='Find Words'?{all:()=>[]}:{first:()=>({json:QC})};return new Function('$',src)($)[0].json;};
const grab=f=>{const t=fs.readFileSync('../p8/final/'+f,'utf8');const a=t.indexOf('const KJVC=');const b=t.indexOf('})();',a)+5;return t.slice(a,b);};
const NLD="const NL=String.fromCharCode(10);\n";const PB0=grab("Panel_Build.js"),BIV0=grab("Build_Independent_Verdict.js");const PB=NLD+PB0;console.log("block in Panel Build == block in Build Independent Verdict:",PB0===BIV0,PB0.length);
for(const [n,f] of [['LIVE','../p8/final/Quote_Report.js'],['NEW','new_Quote_Report_a3.js']]){const out=qr(fs.readFileSync(f,'utf8'));
 const K=new Function('$',PB+'\nreturn KJVC;')(()=>({first:()=>({json:out})}));
 console.log('=== '+n+' ===');console.log(K);}
