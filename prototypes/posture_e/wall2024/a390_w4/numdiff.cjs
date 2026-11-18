// ASK 390: for each residual node run, every token that differs after marks are put back, with 50 chars of context (shows whether any offset or count moved)
const fs=require('fs');const o=JSON.parse(fs.readFileSync(process.argv[2]));
const src=fs.readFileSync(__dirname+'/cmp.cjs','utf8');
const notes=new Set();const walkN=v=>{if(v&&typeof v==='object'){if(Array.isArray(v.round_notes)&&typeof v.raw_unmarked==='string')v.round_notes.forEach(x=>notes.add(v.raw_unmarked.slice(x.span[0],x.span[1])));for(const k in v)walkN(v[k]);}};walkN(o.target);
const S=[...notes];const esc=s=>JSON.stringify(s).slice(1,-1);const forms=s=>{const f=[s];let x=s;for(let i=0;i<3;i++){x=esc(x);f.push(x);}return f;};
const strip=v=>{if(Array.isArray(v))return v.map(strip);if(v&&typeof v==='object'){const r={};for(const k in v){if(k==='round_notes'||k==='raw_unmarked')continue;r[k]=strip(v[k]);}return r;}
 if(typeof v==='string'){let t=v;for(const s of S)for(const f of forms(s)){const pre=f===s?'[working note: ':forms('[working note: ')[forms(s).indexOf(f)];t=t.split(pre+f+']').join(f);}return t;}return v;};
const tok=t=>t.split(/(?<=[^A-Za-z0-9])|(?=[^A-Za-z0-9])/);
const C={};for(const k of Object.keys(o.s262)){const a=JSON.stringify(o.s262[k]),z=JSON.stringify(strip(o.target[k]));if(a===z)continue;const A=tok(a),Z=tok(z);if(A.length!==Z.length){console.log(k,'token count differs',A.length,Z.length);continue;}
 let p=0;for(let i=0;i<A.length;i++){p+=A[i].length;if(A[i]!==Z[i]){const ctx=a.slice(Math.max(0,p-A[i].length-50),p-A[i].length).replace(/\\n/g,' ');const key=k.split('#')[0]+' | '+ctx.slice(-40);C[key]=(C[key]||0)+1;if(C[key]<=1)console.log(k,'|',A[i],'->',Z[i],'| before:',ctx);}}}
