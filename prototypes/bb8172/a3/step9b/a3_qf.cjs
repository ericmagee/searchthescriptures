const fs=require('fs');const src=fs.readFileSync(process.argv[2],'utf8');
const api=new Function(src+';return {preCheckSide,preCheckBlock};')();
const rows=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
for(const t of ['28514','28532']){const r=rows.find(x=>x.t.includes(t)).cr3;
 // opponent text stand-in: each quoted string in the list itself (as if found verbatim), so the quote is chosen
 const qs=(r.match(/[“"][^”"]{8,}[”"]/g)||[]).map(s=>s.slice(1,-1));
 console.log('==',t);console.log(api.preCheckSide(r,qs,'DEFENDER LIST [CR3]').join('\n'));}
