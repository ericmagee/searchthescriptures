const fs=require('fs');const {src,cut}=require('/mnt/project-files/ask588/w4/build/libpatch.js');let bad=0,n=0;
for(const f of ['/mnt/project-files/ask590/w4/build/target_engine_590s.json','/mnt/project-files/ask590/w4/build/target_child_590s.json']){const W=JSON.parse(fs.readFileSync(f,'utf8'));const {M}=cut(W);
 for(const k of Object.keys(M)){if(!M[k]||!M[k].p)continue;const s=src(W,k);n++;try{new Function('return (async function(){'+s+'\n})')}catch(e){bad++;console.log('SYNTAX',f,k,e.message);}}
 for(const x of W.nodes){const s=x.parameters&&x.parameters.jsCode;if(typeof s!=='string'||x.name==='Shared Library')continue;n++;try{new Function('return (async function(){'+s+'\n})')}catch(e){bad++;console.log('SYNTAX',f,x.name,e.message);}}}
console.log('parsed',n,'syntax errors',bad);
