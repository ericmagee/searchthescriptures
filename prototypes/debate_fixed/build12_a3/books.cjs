const fs=require('fs');const s=new Set();
for(const f of ['fx/rounds_27795.json','fx/rounds_27665.json']){const R=JSON.parse(fs.readFileSync(f,'utf8'));
const F={cr1:R.cr1,gr1:R.gr1,cr2:R.cr2,gr2:R.gr2,cr3:R.cr3,dr3:R.dr3};const $=n=>({isExecuted:false,first:()=>({json:F})});
const out=new Function('$',fs.readFileSync('new11/Citation_Scan.js','utf8'))($)[0].json;out.items.forEach(i=>{s.add(i.book);if(i.alt)s.add(i.alt.book);});}
console.log([...s].map(b=>"'"+b.replace(/'/g,"''")+"'").join(','));
