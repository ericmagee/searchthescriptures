const fs=require('fs');const S=JSON.parse(fs.readFileSync('cs_out.json'));const K=JSON.parse(fs.readFileSync('kjv_fix.json'));
const run=(qcf,qrf)=>{const $=n=>n==='Citation Scan'?{first:()=>({json:S})}:n==='Cited Verses'?{all:()=>K.map(j=>({json:j}))}:null;
 const C=new Function('$',fs.readFileSync(qcf,'utf8'))($)[0].json;
 const $2=n=>n==='Quote Compare'?{first:()=>({json:C})}:n==='Find Words'?{all:()=>[]}:null;
 return new Function('$',fs.readFileSync(qrf,'utf8'))($2)[0].json;};
const a=run('base/Quote_Compare.js','base/Quote_Report.js'),b=run('Quote_Compare.new.js','base/Quote_Report.js');
b.items.forEach((x,i)=>{const o=a.items.find(y=>y.side===x.side&&y.round===x.round&&y.ref===x.ref&&y.quote===x.quote);console.log(x.side.padEnd(10),x.round,x.ref.padEnd(13),'LB',String(x.load_bearing).padEnd(5),(o?o.status:'(absent)').padEnd(28),'->',x.status);});
console.log('base checked',a.checked,'mismatches',a.mismatches,'| new checked',b.checked,'mismatches',b.mismatches);
