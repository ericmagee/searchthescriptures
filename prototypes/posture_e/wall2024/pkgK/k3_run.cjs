// K3 on the stored judgments: argv[2] kkjv_slice.js, fixtures from pkgVC, verses from W3's k3/verses.json
const fs=require('fs');eval(fs.readFileSync(process.argv[2],'utf8'));
const F=JSON.parse(fs.readFileSync(__dirname+'/../pkgVC/fixtures_runs4.json','utf8'));
const ROWS=JSON.parse(fs.readFileSync('/mnt/project-files/w3/k3/verses.json','utf8')).map(([book,chapter,verse,text])=>({book,chapter,verse,text}));
let tot={pairs:0,items:0,nc:0,nv:0};
for(const r of F){for(const [seat,t] of [['single',r.independent_verdict_raw]].concat(r.judgments.map(j=>[j.seat,j.verdict_raw]))){
 const P=kkjvPairs(kkjvText(t));const X=kkjvLines2024(t,ROWS);tot.pairs+=P.length;tot.items+=X.items.length;tot.nc+=X.not_checked;tot.nv+=X.report.filter(x=>x.startsWith('NOT A VERSE')).length;
 console.log(r.run_token.slice(5,10),seat.padEnd(8),'pairs',P.length,'items',X.items.length,'not_checked',X.not_checked);X.items.forEach(i=>console.log('   ITEM',i.line.slice(0,260)));
 X.report.filter(x=>!x.startsWith('NOT CHECKED')).forEach(x=>console.log('   ',x.slice(0,200)));}}
console.log('TOTAL',JSON.stringify(tot));
