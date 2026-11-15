const fs=require('fs');const d=JSON.parse(fs.readFileSync(process.argv[2]));
const dec=s=>{const i=s.indexOf('\n/*END*/');return JSON.parse(i>0?s.slice(0,i):s);};
const rb=(m,L)=>m.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
for(const [tag,L,M] of [['R',d.R,dec(d.MR)],['S7',d.S7,dec(d.M7)]]){let ok=0,bad=[];
 for(const [k,m] of Object.entries(M)){const src=rb(m,L);try{new Function('$','$input','$json','items','$node','$execution','$workflow','require','return (async()=>{'+src+'\n})')();ok++;}catch(e){bad.push(k+': '+e.message.slice(0,80));}}
 console.log(tag,'parse ok',ok,'bad',bad.length,bad.slice(0,5));}
