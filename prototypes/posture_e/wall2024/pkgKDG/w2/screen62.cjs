// W2 (Wall 6502): kdgLinks2024 old vs new on the defender rounds of the 62 stored debates; lists lost and gained flags.
// usage: node screen62.cjs <old kdg.js> <new kdg.js> <runs.json> <rounds8.json.gz>
const fs=require('fs'),zlib=require('zlib');const [, , A, B, RJ, RG]=process.argv;const mk=p=>new Function('$',fs.readFileSync(p,'utf8')+';return kdgLinks2024')(null);const f1=mk(A),f3=mk(B);
const R=JSON.parse(fs.readFileSync(RJ,'utf8'));let rows=Object.values(R).map(x=>x.r).concat(JSON.parse(zlib.gunzipSync(fs.readFileSync(RG))));const seen=new Set();let a=0,b=0;const lost=[],gained=[];
const ks=o=>Object.entries(o||{}).flatMap(([k,v])=>[].concat(v).map(z=>({k:k+(z.ty||''),q:z.q})));
for(const r of rows){if(seen.has(r.id))continue;seen.add(r.id);const F={cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,cr4:r.defender_r4};const k1=ks(f1(F)),k3=ks(f3(F));a+=k1.length;b+=k3.length;
 for(const x of k1)if(!k3.some(y=>y.k===x.k))lost.push(String(r.id).slice(0,6)+'/'+x.k+' '+String(x.q).replace(/\s+/g,' ').slice(0,140));for(const y of k3)if(!k1.some(x=>x.k===y.k))gained.push(String(r.id).slice(0,6)+'/'+y.k+' '+String(y.q).replace(/\s+/g,' ').slice(0,140));}
console.log('old flags',a,'new flags',b,'lost',lost.length,'gained',gained.length);lost.forEach(s=>console.log('LOST',s));gained.forEach(s=>console.log('GAINED',s));
