const fs=require('fs');const VP4N0=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const OLD=eval('(()=>{'+fs.readFileSync(__dirname+'/old_vp524.js','utf8')+';return vp524Verses;})()');
const NEW=eval('(()=>{'+fs.readFileSync(__dirname+'/new_vp524.js','utf8')+';return vp524Verses;})()');
const t=fs.readFileSync(__dirname+'/../inputs/dr3.txt','utf8');const n=NEW([t]);const k=v=>v.ref+'|'+VP4N0(v.w);const ns=new Set(n.map(k));
for(const v of OLD([t]).filter(v=>!ns.has(k(v)))){console.log('LOST',v.ref,'|',v.w.slice(0,150));const cover=n.filter(x=>x.ref===v.ref&&VP4N0(x.w).includes(VP4N0(v.w)));console.log('  covered by longer new entry of same ref:',cover.length,cover.map(x=>x.w.slice(0,100)));}
