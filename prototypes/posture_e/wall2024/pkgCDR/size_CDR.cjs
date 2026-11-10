// pkgCDR rev 10 (W1): prompt size of the closing enforcer call on every stored debate, live s103 against pkgCDR. Characters of the user prompt and the
// added characters; tokens estimated at 4 characters per token (an estimate, not a tokenizer count).
process.chdir(__dirname+'/..');const fs=require('fs');const H=require('../pkgVP3/harness.cjs');const {harness}=require('../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const C={live:g('/mnt/project-files/wall2024/fetchback_live_s103.json'),cdr:g(process.env.CAND||'pkgCDR/parent_s103_CDR.json')};for(const k in C)C[k]=C[k].nodes.find(z=>z.name==='Close Enforcer Build').parameters.jsCode;
const runs=fs.readdirSync(H.IN).filter(f=>f.endsWith('_Final_Output.json')).map(f=>f.split('_')[0]).sort();const A=[];
(async()=>{for(const r of runs){let F;try{const o=H.out(r,'Final Output');F=o.flat().filter(Boolean)[0].json;}catch(e){try{const x=JSON.parse(fs.readFileSync(H.IN+'/'+r+'_Final_Output.json','utf8'));F=x[x.length-1].main[0][0].json;}catch(e2){continue;}}
 const L={};for(const k in C){try{const B=(await harness(r,{'Final Output':[{json:F}],'Resolve Seats':[{json:{deepseek:{api_model:'deepseek-flash'}}}],'Init Seats':[{json:{run_token:r}}]})('return (async()=>{\n'+C[k]+'\n})();','Quote Report'))[0].json;L[k]=B.cec_skip?null:{n:B.body.messages[1].content.length+B.body.messages[0].content.length,c:(B.cands||[]).filter(x=>/^P/.test(x.id)).length};}catch(e){L[k]=null;}}
 if(!L.live||!L.cdr){console.log(r+' skip');continue;}const d=L.cdr.n-L.live.n;A.push([r,L.live.n,L.cdr.n,d,L.cdr.c]);console.log(r+': live '+L.live.n+' chars, pkgCDR '+L.cdr.n+' (+'+d+', +'+(100*d/L.live.n).toFixed(1)+'%), hints '+L.cdr.c);}
 const s=A.map(x=>x[3]).sort((a,b)=>a-b),sum=A.reduce((t,x)=>t+x[3],0),base=A.reduce((t,x)=>t+x[1],0);
 console.log(A.length+' debates: added characters min '+s[0]+', median '+s[Math.floor(s.length/2)]+', max '+s[s.length-1]+', mean '+Math.round(sum/A.length)+' (about '+Math.round(sum/A.length/4)+' tokens); whole prompt '+(100*sum/base).toFixed(1)+'% larger on average; live prompt mean '+Math.round(base/A.length)+' chars');})();
