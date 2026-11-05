const crypto=require('crypto');const fs=require('fs');
const {ledger}=require('./ledger.cjs');
const src=fs.readFileSync(__dirname+'/prs_lifted.cjs','utf8');
console.log('prs_lifted.cjs sha256',crypto.createHash('sha256').update(src).digest('hex'));
const runs=['32643','32677','32717','32791'];const all=[];
for(const r of runs){const L=ledger(r);all.push(...L);const n={};L.forEach(x=>n[x.cls]=(n[x.cls]||0)+1);console.log(r,JSON.stringify(n));}
fs.writeFileSync(__dirname+'/out/baseline.json',JSON.stringify(all.map(({e,...x})=>x),null,1));
for(const x of all.filter(x=>x.cls==='UNPROVEN'))console.log('UNPROVEN',x.run,x.round,x.ref,'|',x.why,'|',x.means.slice(0,90));
