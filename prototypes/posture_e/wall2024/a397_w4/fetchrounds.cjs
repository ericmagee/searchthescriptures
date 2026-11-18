// ASK 397 shim input: the debate texts (both sides, every round column) for each debate that has a stored judgment (a394/judall.json)
const fs=require('fs');const src=fs.readFileSync('a394/fetchall.cjs','utf8');const K=src.match(/const K='([^']+)'/)[1],B=src.match(/B='([^']+)'/)[1];
const J=JSON.parse(fs.readFileSync('a394/judall.json'));const ids=[...new Set(J.map(j=>j.debate_id))];
const cols='id,claude_r1,engine_r1,claude_r2,engine_r2,engine_r3,challenger_r3,defender_r4,challenger_r4';
const get=async u=>{for(let k=0;k<5;k++){try{const r=await fetch(u,{headers:{apikey:K,Authorization:'Bearer '+K}});const j=await r.json();if(Array.isArray(j))return j;console.error(JSON.stringify(j).slice(0,200));}catch(e){console.error(e.message)}await new Promise(r=>setTimeout(r,1000*(k+1)));}throw new Error('fail');};
(async()=>{const out={};for(let i=0;i<ids.length;i+=20){const r=await get(B+'debate_results?select='+cols+'&id=in.('+ids.slice(i,i+20).join(',')+')');r.forEach(x=>out[x.id]=x);}
 fs.writeFileSync('a397/rounds_all.json',JSON.stringify(out));console.log('debates',ids.length,'found',Object.keys(out).length);})();
