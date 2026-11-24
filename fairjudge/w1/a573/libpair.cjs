// ASK 573: run the engine's Library Sha (ASK 422a) node on the engine target, pass its output to the child's Library Check on the child target (the live drift check between the two libraries).
const fs=require('fs');const run=(src,lib,items)=>new Function('$','$input',src)(()=>({params:{jsCode:lib}}),{all:()=>items,first:()=>items[0]});
for(const [ef,cf] of [[process.argv[2],process.argv[3]]]){const E=JSON.parse(fs.readFileSync(ef)),C=JSON.parse(fs.readFileSync(cf));
 const el=E.nodes.find(n=>n.name==='Shared Library').parameters.jsCode,cl=C.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const out=run(E.nodes.find(n=>n.name==='Library Sha (ASK 422a)').parameters.jsCode,el,[{json:{}}]);const j=out[0].json;console.log('engine Library Sha output keys:',JSON.stringify(j).slice(0,300));
 const pass={lib_sha:j.__lib422,map_sha:j.__map422}; /* Alternate Pass Call hands these on as pass.lib_sha and pass.map_sha */let r;try{r=run(C.nodes.find(n=>/^Library Check/.test(n.name)).parameters.jsCode,cl,[{json:{pass}}]);console.log('PASS child Library Check:',JSON.stringify(r[0].json.lib422))}catch(e){console.log('FAIL child Library Check:',e.message)}}
