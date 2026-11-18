// ASK 376 replay: old (live) against new (target) kind test on every stored line that can carry the K-V kind: debate_judgments lines holding "exclu" in rows holding "void" (a superset: KV_EXCL needs "exclu"), and every K-V cure row's response and flagged lines.
const fs=require('fs');const T=require('../tools/lib.cjs');
const ld=p=>{let d=JSON.parse(fs.readFileSync(p));return d.data||d;};
const kvOf=w=>{const U=T.unpack(ld(w));const iK=U.L.findIndex(l=>l.startsWith("const KV_KIND=/"));return new Function(U.L[iK]+";return {KV_KIND,KV_EXCL:typeof KV_EXCL!==\"undefined\"?KV_EXCL:null};")();};
const A=kvOf(process.argv[2]),B=kvOf(process.argv[3]);
const mask=s=>String(s).replace(/["“][^"”\n]*["”]/g,'"Q"').replace(/(^|[\s(\[:;,])['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’](?=$|[\s.,;:!?)\]])/g,"$1'Q'");
const kind=(f,t)=>f.KV_KIND.test(t)||f.KV_KIND.test(mask(t))||(f.KV_EXCL?f.KV_EXCL.test(mask(t)):false);
const P=JSON.parse(fs.readFileSync(__dirname+'/pop.json'));const rows=[...P.jl,...P.el.filter(x=>x[3]),...(P.al||[])];let ch=[];
for(const r of rows){const t=r[3];const o=kind(A,t),n=kind(B,t);if(o!==n)ch.push(r);}
console.log('alternate replies holding exclu',P.nalt,'lines',(P.al||[]).length);console.log('judgments with void',P.nj,'in',P.nd,'debates; their lines with exclu',P.jl.length,'| K-V cure rows',P.kv,'in',P.kvruns,'runs; lines',P.el.filter(x=>x[3]).length,'| changed',ch.length);
for(const r of ch)console.log(' ',r[0],r[1],r[2],r[4]||'',JSON.stringify(String(r[3]).slice(0,260)));
// sentence level: the engine tests a ruling segment, not a whole stored line; a line that already reads a kind elsewhere hides a flip, so each sentence is tested alone too
const sp=t=>String(t).split(/(?<=[.!?])\s+(?=[A-Z"“\[(])|\s--\s|\s\|\s/);let cs=[];const seen=new Set();
for(const r of rows)for(const s of sp(r[3])){if(!/exclu/i.test(s))continue;const o=kind(A,s),n=kind(B,s);if(o!==n){const k=r[0]+r[1]+s;if(seen.has(k))continue;seen.add(k);cs.push([r[0],r[1],r[2],r[4]||'',s]);}}
const ids=[...new Set(cs.map(x=>x[0]+' '+x[1]))];
console.log('SENTENCE LEVEL: sentences that change',cs.length,'in',ids.length,'rows:',ids.join(', '));
for(const x of cs)console.log(' ',x[0],x[1],x[2],x[3],JSON.stringify(x[4].slice(0,300)));
