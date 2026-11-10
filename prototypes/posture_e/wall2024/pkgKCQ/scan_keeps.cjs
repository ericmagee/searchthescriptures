// netKeeps and ks2Keeps on every line of every stored corpus text, live against candidate
const fs=require('fs');const {O,N}=require('./scan.cjs');let n=0;const d=[];
for(const l of fs.readFileSync('corpus/texts.jsonl','utf8').split('\n'))if(l.trim()){const r=JSON.parse(l);for(const line of String(r.jtext||r.text||'').split('\n')){if(!line.trim())continue;n++;
 if(O.netKeeps(line)!==N.netKeeps(line)||O.ks2Keeps(line)!==N.ks2Keeps(line))d.push(r.run+' '+r.seat+' '+r.src+': '+line.slice(0,300));}}
console.log('lines',n,'differ',d.length);d.forEach(x=>console.log(' ',x));
