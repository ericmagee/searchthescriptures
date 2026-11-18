const fs=require('fs');const {lib,src,grabFn}=require('./stubs.cjs');
const pick=f=>{const {arr,M}=lib(f);const R={};for(const k of ['Gate Record','Send Back Record','Cure Check']){const s=src(arr,M[k].p);const fn=grabFn(s,'psGrades');const ri=s.indexOf('function ri3Head2024(');const ri3=ri>=0?s.slice(ri,s.indexOf('function ',ri+10)):'';R[k]=new Function((/ri3Head2024/.test(fn)?ri3:'')+'\n'+fn+';return psGrades;')();}return R;};
const OLD=pick('rdf/fetchback_s262.json'),NEW=pick('a381/t381.json');const A=JSON.parse(fs.readFileSync('a381/countlines.json'));
let n=0,parsed=0;const ch=[];for(const r of A){for(const k of Object.keys(NEW)){n++;let o,w;try{o=JSON.stringify(OLD[k](r.l));w=JSON.stringify(NEW[k](r.l));}catch(e){o=w='ERR '+e.message;}if(o!=='null')parsed++;if(o!==w)ch.push({id:r.id,seat:r.s,variant:k,old:o,new:w,line:r.l.slice(0,300)});}}
console.log('lines',A.length,'| rows',new Set(A.map(r=>r.id)).size,'| variant runs',n,'| parsed (non-null)',parsed,'| changed',ch.length);
for(const c of ch)console.log(JSON.stringify(c));
