const fs=require('fs');const src=fs.readFileSync(__dirname+'/libcheck.js','utf8');
for(const f of process.argv.slice(2)){const d=JSON.parse(fs.readFileSync(f,'utf8'));const jc=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
 const $=()=>({params:{jsCode:jc}});const $input={all:()=>[]};
 try{console.log(f.split('/').pop(), new Function('$','$input',src)($,$input));}catch(e){console.log(f.split('/').pop(),'THROWS',e.message);}}
