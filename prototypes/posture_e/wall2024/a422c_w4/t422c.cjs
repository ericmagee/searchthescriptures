// ASK 422(c) offline proof: stubs compile; KV_KIND/KV_EXCL taken from the Cure Check stub of OLD (live) and NEW (target);
// near-miss cases a-h and W3's 9 wrong-if cases; replay of the stored population (pop.json) at line and sentence level.
// Usage: node a422c/t422c.cjs OLD.json NEW.json
const fs=require('fs');const {unpack,rb}=require('../tools/lib.cjs');
const ld=p=>{let d=JSON.parse(fs.readFileSync(p));return d.data||d;};
const kvOf=p=>{const u=unpack(ld(p));let bad=0;for(const k in u.M){try{new Function('$','$input','$json','$node','$items','require',`return (async()=>{${rb(u.L,u.M[k])}\n})`);}catch(e){bad++;console.log('COMPILE FAIL',k,e.message);}}
 const src=rb(u.L,u.M['Cure Check']);const KV=src.match(/const KV_KIND=.*?\*\//s)[0];const f=new Function(KV+';return {KV_KIND,KV_EXCL};')();f.stubs=Object.keys(u.M).length;f.bad=bad;return f;};
const A=kvOf(process.argv[2]),B=kvOf(process.argv[3]);
console.log('stubs old',A.stubs,'fails',A.bad,'| new',B.stubs,'fails',B.bad);
console.log('KV_EXCL old:',A.KV_EXCL.source);console.log('KV_EXCL new:',B.KV_EXCL.source);
const mask=s=>String(s).replace(/["“][^"”\n]*["”]/g,'"Q"').replace(/(^|[\s(\[:;,])['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’](?=$|[\s.,;:!?)\]])/g,"$1'Q'");
const kind=(f,s)=>f.KV_KIND.test(s)||f.KV_KIND.test(mask(s))||f.KV_EXCL.test(mask(s));
const C=JSON.parse(fs.readFileSync(__dirname+'/cases.json'));let fail=0;
for(const c of C){const o=kind(A,c.text),n=kind(B,c.text);const ok=o===c.old&&n===c.new;if(!ok)fail++;console.log(ok?'OK  ':'FAIL',c.id,'old',o,'new',n,'| want',c.old,c.new);}
console.log('cases',C.length,'fail',fail);
const P=JSON.parse(fs.readFileSync(__dirname+'/pop.json'));const rows=[...P.jl,...P.el.filter(x=>x[3]),...(P.al||[])];
let ch=[];for(const r of rows){const t=r[3];if(kind(A,t)!==kind(B,t))ch.push(r);}
console.log('REPLAY: judgments with void',P.nj,'| their lines with exclu',P.jl.length,'| K-V rows',P.kv,'lines',P.el.filter(x=>x[3]).length,'| alternate lines',(P.al||[]).length,'| LINES CHANGED',ch.length);
for(const r of ch)console.log(' ',r[0],r[1],r[2],r[4]||'',JSON.stringify(String(r[3]).slice(0,300)));
const sp=t=>String(t).split(/(?<=[.!?])\s+(?=[A-Z"“\[(])|\s--\s|\s\|\s/);let cs=[];const seen=new Set();
for(const r of rows)for(const s of sp(r[3])){if(!/exclu/i.test(s))continue;if(kind(A,s)!==kind(B,s)){const k=r[0]+r[1]+s;if(seen.has(k))continue;seen.add(k);cs.push([r[0],r[1],r[2],r[4]||'',s]);}}
console.log('SENTENCE LEVEL: sentences changed',cs.length);for(const x of cs)console.log(' ',x[0],x[1],x[2],x[3],'old',kind(A,x[4]),'new',kind(B,x[4]),JSON.stringify(x[4].slice(0,400)));
process.exit(fail?1:0);
