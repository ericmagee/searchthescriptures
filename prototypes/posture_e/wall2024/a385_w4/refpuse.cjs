const fs=require('fs');const T=require('../tools/lib.cjs');let w=JSON.parse(fs.readFileSync(process.argv[2]));w=w.data||w;const U=T.unpack(w);
const rows=[];for(const k of Object.keys(U.M)){const s=T.rb(U.L,U.M[k]);const full=s.includes("const keys=(t,o)=>{const cap=");const has=s.includes('const REFP=(()=>');
 const uses=(s.match(/REFP\.(keys|parse|book)\b/g)||[]).length;rows.push([k,has?(full?'FULL':'TRIMMED'):'none',uses]);}
const c={};rows.forEach(r=>{const key=r[1]+' uses>0:'+(r[2]>0);(c[key]=c[key]||[]).push(r[0]);});
for(const k in c)console.log(k,c[k].length,c[k].slice(0,6).join('; '));
