const fs=require('fs');const rep=JSON.parse(fs.readFileSync('h_out.json'));
const kinds={};let maxLine={};
for(const [t,ns] of Object.entries(rep))for(const [n,v] of Object.entries(ns))for(const l of v.add){
 let k=l.startsWith('cited in')?'cited in ...':l.startsWith('EVERY VERSE')?l.slice(0,60):/^round \d|^round 3, the link round above/.test(l)?l.replace(/:.*/,''):l.startsWith('PRESSED-WITNESS LEDGER')?'LEDGER HEADER':l.slice(0,80);
 // unescape json
 kinds[n+' | '+k]=(kinds[n+' | '+k]||0)+1;
 if(k==='cited in ...'||k.startsWith('round')){maxLine[n+' '+k]=Math.max(maxLine[n+' '+k]||0,l.length);}}
console.log(JSON.stringify(kinds,null,1));console.log(JSON.stringify(maxLine,null,1));
