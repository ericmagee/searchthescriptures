// W2 pkgHYD: operator 17:36 CST 11-12 (W3 thread): "add google/gemini-4-hydrogen to alternate... add after grok".
// Alternate order becomes grok, hydrogen, argon, haiku. Plain nodes only, as pkgALT: Init Seats, Resolve Seats, Accept Build.
// usage: node pkgHYD/build.cjs <parent in> <parent out>
const fs=require('fs');const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const E={
 'Init Seats':[
  ["const ORDER0=['chatgpt','sol','luna','grok','argon','haiku','qwen'];","const ORDER0=['chatgpt','sol','luna','grok','hydrogen','argon','haiku','qwen'];"],
  ["gemini:'google',argon:'google'};","gemini:'google',hydrogen:'google',argon:'google'};"],
  ["const __ALT=['grok','argon','haiku'];","const __ALT=['grok','hydrogen','argon','haiku'];"],
  ["haiku:'openrouter',argon:'openrouter'};\nconst ALT_ORDER","haiku:'openrouter',argon:'openrouter',hydrogen:'openrouter'};\nconst ALT_ORDER"]],
 'Resolve Seats':[["haiku:'openrouter',argon:'openrouter'};\nconst judges","haiku:'openrouter',argon:'openrouter',hydrogen:'openrouter'};\nconst judges"]],
 'Accept Build':[
  ["haiku:'haiku',argon:'argon'};","haiku:'haiku',argon:'argon',hydrogen:'hydrogen'};"],
  ["const ORDER=['chatgpt','sol','luna','grok','argon','haiku','qwen'];","const ORDER=['chatgpt','sol','luna','grok','hydrogen','argon','haiku','qwen'];"]]};
let d=0;for(const [nm,eds] of Object.entries(E)){const n=W.nodes.find(x=>x.name===nm);let s=n.parameters.jsCode;const s0=s;
 for(const [a,b] of eds){const c=s.split(a).length-1;if(c!==1)throw new Error(nm+': anchor found '+c+' times: '+a.slice(0,60));s=s.replace(a,b);}
 new Function('$','$input','$execution','return (async()=>{'+s+'})');n.parameters.jsCode=s;d+=s.length-s0.length;console.log(nm,s0.length,'->',s.length,'+'+(s.length-s0.length));}
fs.writeFileSync(fout,JSON.stringify(raw));console.log('SIZE (measured): code +'+d+' | prompt text 0');
