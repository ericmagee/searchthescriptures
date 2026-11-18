// ASK 383 build (plan rev 3, Wall 8077/8082/8083/8085): the [L2] binding trial's keysOf in L2 Count Plan reads each reference through REFP.keys
// (scoped, cap 40), as the live binding (L2C.refsIn) does, so "Book C:V, V" comma lists bind every verse. Trial-only (record-only); one node. Offline.
// Usage: node build383.cjs IN OUT
const fs=require('fs'),acorn=require('../tools/node_modules/acorn');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const n=d.nodes.find(x=>x.name==='L2 Count Plan');const c=n.parameters.jsCode;
const OLD="const keysOf=s=>{const o=[];for(const m of String(s||'').matchAll(BK)){const v1=+m[3],v2=+(m[4]||m[3]);for(let v=v1;v<=Math.min(v2,v1+40);v++){const k=L2C.refsIn(m[1]+' '+m[2]+':'+v)[0];if(k)o.push(k);}}return [...new Set(o)];};";
const NEW="const keysOf=s=>{const o=[];try{for(const k of REFP.keys(String(s||''),{scoped:true,cap:40}))o.push(k.key);}catch(e){}return [...new Set(o)];}; /* ASK 383: the trial reads references through REFP.keys, as the live binding does (comma lists bind every verse); cap 40 keeps the trial's range reading */";
if(c.split(OLD).length!==2)throw new Error('old keysOf found '+(c.split(OLD).length-1));
n.parameters.jsCode=c.replace(OLD,()=>NEW);acorn.parse(n.parameters.jsCode,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
fs.writeFileSync(OUT,JSON.stringify(d));console.log('L2 Count Plan keysOf replaced; length',c.length,'->',n.parameters.jsCode.length);
