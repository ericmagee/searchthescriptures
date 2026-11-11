// W2 pkgALT variant B2 (NOT a package; measured only): grok, argon fill a panel gap after the panel seats; haiku never.
// W2 pkgALT: operator 20:50 CST 11-10 (W3 thread): "let's bring grok back. add google/gemini-4-argon to the alternate list ... alternate order be: grok, argon, haika 5.5". Plain nodes only: Init Seats, Resolve Seats, Accept Build.
// usage: node pkgALT/build.cjs <parent in> <parent out>
const fs=require('fs');const [,,fin,fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const E={
 'Init Seats':[
  ["const ORDER0=['chatgpt','sol','luna','haiku','qwen'];","const ORDER0=['chatgpt','sol','luna','grok','argon','haiku','qwen'];"],
  ["const FAM_PANEL={chatgpt:'openai',sol:'openai',luna:'openai'};","const FAM_PANEL={chatgpt:'openai',sol:'openai',luna:'openai',grok:'xai',gemini:'google',argon:'google'};"],
  ["const pfree=pfree0.filter(s=>!JFL_MOVED.has(s)&&s!=='haiku').concat(pfree0.filter(s=>JFL_MOVED.has(s)&&s!=='haiku')).concat(pfree0.length-pfree0.filter(s=>s==='haiku').length>=3?pfree0.filter(s=>s==='haiku'):[]);","const __ALT=['grok','argon'];const __NA=s=>__ALT.indexOf(s)<0&&s!=='haiku';const pfree=pfree0.filter(s=>!JFL_MOVED.has(s)&&__NA(s)).concat(pfree0.filter(s=>JFL_MOVED.has(s)&&__NA(s))).concat(pfree0.filter(s=>__ALT.indexOf(s)>=0)).concat(pfree0.length-pfree0.filter(s=>s==='haiku').length>=3?pfree0.filter(s=>s==='haiku'):[]); /* pkgALT B2: grok then argon fill a panel gap after terra, sol, luna; haiku never */"],
  ["sol:'openrouter',luna:'openrouter',haiku:'openrouter'};\nconst ALT_ORDER","sol:'openrouter',luna:'openrouter',haiku:'openrouter',argon:'openrouter'};\nconst ALT_ORDER"]],
 'Resolve Seats':[["sol:'openrouter',luna:'openrouter',haiku:'openrouter'};\nconst judges","sol:'openrouter',luna:'openrouter',haiku:'openrouter',argon:'openrouter'};\nconst judges"]],
 'Accept Build':[
  ["sol:'sol',luna:'luna',haiku:'haiku'};","sol:'sol',luna:'luna',haiku:'haiku',argon:'argon'};"],
  ["const ORDER=['chatgpt','sol','luna','haiku','qwen'];","const ORDER=['chatgpt','sol','luna','grok','argon','haiku','qwen'];"]]};
let d=0;for(const [nm,eds] of Object.entries(E)){const n=W.nodes.find(x=>x.name===nm);let s=n.parameters.jsCode;const s0=s;
 for(const [a,b] of eds){const c=s.split(a).length-1;if(c!==1)throw new Error(nm+': anchor found '+c+' times: '+a.slice(0,60));s=s.replace(a,b);}
 new Function('$','$input','$execution','return (async()=>{'+s+'})');n.parameters.jsCode=s;d+=s.length-s0.length;console.log(nm,s0.length,'->',s.length,'+'+(s.length-s0.length));}
fs.writeFileSync(fout,JSON.stringify(raw));console.log('SIZE (measured): code +'+d+' | prompt text 0');
