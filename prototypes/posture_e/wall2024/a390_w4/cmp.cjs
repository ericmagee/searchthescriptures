// ASK 390: in every changed node, the target equals the base once each "[working note: S]" is put back to S (in every escape depth) and round_notes / raw_unmarked are dropped
const fs=require('fs');const o=JSON.parse(fs.readFileSync(process.argv[2]));
const notes=new Set();const walkN=v=>{if(v&&typeof v==='object'){if(Array.isArray(v.round_notes)&&typeof v.raw_unmarked==='string')v.round_notes.forEach(x=>notes.add(v.raw_unmarked.slice(x.span[0],x.span[1])));for(const k in v)walkN(v[k]);}};walkN(o.target);
const S=[...notes];console.log('marked sentences',S.length);
const esc=s=>JSON.stringify(s).slice(1,-1);const forms=s=>{const f=[s];let x=s;for(let i=0;i<3;i++){x=esc(x);f.push(x);}return f;};
const strip=v=>{if(Array.isArray(v))return v.map(strip);if(v&&typeof v==='object'){const r={};for(const k in v){if(k==='round_notes'||k==='raw_unmarked')continue;r[k]=strip(v[k]);}return r;}
 if(typeof v==='string'){let t=v;for(const s of S)for(const f of forms(s)){const pre=f===s?'[working note: ':forms('[working note: ')[forms(s).indexOf(f)];t=t.split(pre+f+']').join(f);}return t;}return v;};
let bad=0,n=0;for(const k of Object.keys(o.s262)){const a=JSON.stringify(o.s262[k]),z=JSON.stringify(o.target[k]);if(a===z)continue;n++;const z2=JSON.stringify(strip(o.target[k]));if(a!==z2){bad++;let i=0;while(a[i]===z2[i])i++;console.log('RESIDUAL',k,'@'+i,'| base:',a.slice(i-80,i+120),'| tgt:',z2.slice(i-80,i+120));}}
const H=t=>t.replace(/\b[0-9a-f]{12,64}\b/g,'#H').replace(/\d+/g,'#N');let hv=0;for(const k of Object.keys(o.s262)){const a=JSON.stringify(o.s262[k]),z=JSON.stringify(o.target[k]);if(a===z)continue;const z2=JSON.stringify(strip(o.target[k]));if(a!==z2&&H(a)!==H(z2)){hv++;const A=H(a),Z=H(z2);let i=0;while(A[i]===Z[i])i++;console.log('RESIDUAL BEYOND HASH/COUNT',k,'| base:',A.slice(i-100,i+150),'| tgt:',Z.slice(i-100,i+150));}}
console.log('residual runs that differ in more than hashes and counts:',hv);
console.log('changed node runs',n,'| equal after marks removed',n-bad,'| residual',bad);
