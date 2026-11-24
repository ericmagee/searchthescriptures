const fs=require('fs');const {src,cut}=require('./libpatch.js');let bad=0,n=0;
for(const f of ['target_engine_586.json','target_child_586.json','live_eng.json']){const W=JSON.parse(fs.readFileSync(f,'utf8'));const {M}=cut(W);
 for(const k of Object.keys(M)){if(!M[k]||!M[k].p)continue;const s=src(W,k);n++;try{new Function('return (async function(){'+s+'\n})')}catch(e){bad++;console.log('SYNTAX',f,k,e.message);}}
 for(const nm of ['Reread Record','Alt Reread Record','R2 Alt Reread Record']){const x=W.nodes.find(z=>z.name===nm);if(!x||!x.parameters.jsCode||x.parameters.jsCode.length<200)continue;n++;try{new Function('return (async function(){'+x.parameters.jsCode+'\n})')}catch(e){bad++;console.log('SYNTAX',f,nm,e.message);}}}
console.log('parsed',n,'syntax errors',bad);
