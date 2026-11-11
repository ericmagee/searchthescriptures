// W1 answers to W3's pkgDCT points 1 and 2 (Wall 4720). Usage: node pkgDCT/w3_points.cjs <work dir from measure.sh>
const fs=require('fs');const W=process.argv[2];const rep=JSON.parse(fs.readFileSync(W+'/trim.report.json','utf8'));
const names=['RET','CURE_UNG','sheet','countCheck'];const cutIn={};
for(const f in rep)for(const d of (rep[f].dead||[])){const n=d.split(' ')[0];if(names.includes(n))(cutIn[n]=cutIn[n]||[]).push(f);}
let conflict=0;for(const f of fs.readdirSync(W+'/eff')){const src=fs.readFileSync(W+'/eff/'+f,'utf8');for(const n of names){const calls=new RegExp('\\.'+n+'\\(').test(src);if(calls&&(cutIn[n]||[]).includes(f)){conflict++;console.log('CONFLICT',f,n);}if(calls)console.log('calls',n,'in',f,'| cut there:',(cutIn[n]||[]).includes(f));}}
names.forEach(n=>console.log('POINT 1',n,'cut in',(cutIn[n]||[]).length,'nodes'));console.log('POINT 1 conflicts',conflict);
let nodes=0,lost=0,miss=0;for(const f of fs.readdirSync(W+'/eff')){const b=fs.readFileSync(W+'/eff/'+f,'utf8');if(!/P\[k\]\(/.test(b))continue;nodes++;const t=fs.readFileSync(W+'/trim/'+f,'utf8');
 const om=b.match(/const ORDER\s*=\s*\[([^\]]*)\]/);const ord=[...om[1].matchAll(/'([^']+)'|"([^"]+)"/g)].map(m=>m[1]||m[2]);
 const defs=s=>new Set([...s.matchAll(/\bP\.([A-Za-z0-9_]+)\s*=/g)].map(m=>m[1]).concat([...s.matchAll(/\bP\[['"]([^'"]+)['"]\]\s*=/g)].map(m=>m[1])));const db=defs(b),dt=defs(t);
 lost+=[...db].filter(x=>!dt.has(x)).length;miss+=ord.filter(k=>!dt.has(k)).length;}
console.log('POINT 2 nodes with P[k](',nodes,'| P parsers lost by trim',lost,'| ORDER keys without a parser after trim',miss);
