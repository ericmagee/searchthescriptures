const fs=require('fs');const A='In a debate a non-response is never neutral.';
const ok=s=>{try{new Function('return async function(){'+s+'\n}');return true}catch(e){return false}};
for(const f of ['Build_Independent_Verdict.new.js','Panel_Build.new.js']){const s=fs.readFileSync(f,'utf8');const i=s.indexOf(A)+A.length;
 const r={};for(const q of ["'",'"','`'])r[q]=ok(s.slice(0,i)+q+s.slice(i));console.log(f,'base parses',ok(s),'insert-breaks:',JSON.stringify(r));}
