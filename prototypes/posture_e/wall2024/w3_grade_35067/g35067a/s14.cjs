const L=require('./lib.cjs');const fs=require('fs');
const pb=L.items('Panel Build')[0]; const j=pb.judges[1]; console.log(Object.keys(j)); 
const body=j.body||j; const t=JSON.stringify(body); 
let txt=null; (function f(o){ if(typeof o==='string'&&o.length>100000&&!txt) txt=o; else if(o&&typeof o==='object') for(const k in o) f(o[k]);})(j);
fs.writeFileSync('judge_prompt_terra.txt',txt||''); console.log(txt&&txt.length);
