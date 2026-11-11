// W2: ASK 48 scorer. Usage: node score.cjs <dir>  where <dir> holds reply files named <BODY>_<live|R1>_<draw>.json
// (each the raw DeepSeek response JSON, or a text file with the reply content). Prints, per body and variant, how many draws CONFIRMED each link,
// the closing sentence quoted for link 6 in C, and the pass verdict for R1. Also checks request files if <dir>/sent/<same name> exists (must equal the body file).
const fs=require('fs'),path=require('path');const dir=process.argv[2];const B='/mnt/project-files/wall2024/ask48_bodies/';
const text=f=>{const s=fs.readFileSync(f,'utf8');try{const j=JSON.parse(s);return j.choices?j.choices[0].message.content:(j.content||s);}catch(e){return s;}};
const R={};for(const f of fs.readdirSync(dir).filter(f=>/^(A|B|C_DEFENDER|D_DEFENDER)_(live|R1)_\d+\.(json|txt)$/.test(f))){const [,b,v]=f.match(/^(A|B|C_DEFENDER|D_DEFENDER)_(live|R1)_/);const k=b+' '+v;R[k]=R[k]||{n:0,links:{},q6:[]};R[k].n++;
 const t=text(path.join(dir,f));const seen=new Set();for(const m of t.matchAll(/CLOSE-CONTRADICTION:\s*(\S+)\s*--\s*(\w+)\s*--\s*LINK\s*(\d+)\s*--\s*(CONFIRMED|NOT A CONTRADICTION)[^\n]*/g)){if(m[4]!=='CONFIRMED')continue;const L=m[2]+' '+m[3];if(!seen.has(L)){seen.add(L);R[k].links[L]=(R[k].links[L]||0)+1;}if(b==='C_DEFENDER'&&m[3]==='6'){const c=(m[0].match(/CLOSING \[[^\]]+\] "([^"]*)"/)||[])[1];R[k].q6.push(c);}}
 const sf=path.join(dir,'sent',f.replace(/_\d+\.(json|txt)$/,'.json'));if(fs.existsSync(sf)&&fs.readFileSync(sf,'utf8')!==fs.readFileSync(B+b+'_'+v+'.json','utf8'))console.log('SENT BODY DIFFERS from the file:',f);}
const g=(k,L)=>(R[k]&&R[k].links[L])||0,n=k=>(R[k]||{n:0}).n;
for(const k of Object.keys(R).sort())console.log(k,'draws',R[k].n,'| CONFIRMED',JSON.stringify(R[k].links),R[k].q6.length?'| link 6 closing quoted: '+JSON.stringify(R[k].q6):'');
const P=[['A R1','DEFENDER 4',0],['B R1','DEFENDER 4',0],['A R1','DEFENDER 1','all'],['B R1','DEFENDER 1','all'],['D_DEFENDER R1','DEFENDER 1','all'],['C_DEFENDER R1','DEFENDER 6','all']];
let ok=true;for(const [k,L,w] of P){const c=g(k,L),N=n(k);const pass=N>0&&(w===0?c===0:c===N);ok=ok&&pass;console.log((pass?'PASS ':'FAIL ')+k+' '+L+' confirmed '+c+' of '+N+' (needed '+(w===0?'0':'all')+')');}
console.log('R1 overall:',ok?'PASS on counts (hand-read the link 6 quotes and any other CONFIRMED line)':'FAIL');
