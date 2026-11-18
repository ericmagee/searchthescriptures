// Keeps only the sources of a replay spec that exist in the given workflow (the child has no engine-only nodes).
const R=require('./replay418.cjs'),fs=require('fs');const [w0,sp,outp]=process.argv.slice(2);const w=R.ld(w0);const s=JSON.parse(fs.readFileSync(sp));
for(const c of s.cut){c.from=(Array.isArray(c.from)?c.from:[c.from]).filter(f=>{try{R.sourceOf(w,f);return true}catch(e){return false}});}
fs.writeFileSync(outp,JSON.stringify(s));console.log(s.cut.every(c=>c.from.length)?'OK':'NO SOURCE IN CHILD');
