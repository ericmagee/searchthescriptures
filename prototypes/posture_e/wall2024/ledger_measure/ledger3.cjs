const fs=require('fs');const o=require('./ledger_out.json');const D='/mnt/project-files/wall2024/inputs/';const T={};
const txt=(R,k)=>{const key=R+k;if(key in T)return T[key];let v=null;try{v=JSON.parse(fs.readFileSync(D+R+'_'+(k[0]==='C'?'C':'D')+k[2]+'_Extract.json'))[0].data.main[0][0].json;v=v.labelled||v.raw;}catch(e){}return T[key]=v;};
let named=0,rangeOnly=0,ex=[];
for(const p of o){if(p.cls==='NOT NAMED')continue;named++;const v=p.ref.split(':')[1];
 const isRange=h=>{const t=txt(p.run,h.round);const s=t.slice(h.pos,h.pos+60);const m=s.match(/^[1-3]?\s?[A-Za-z]+\.?\s+\d+:(\d+)\s*[-–]\s*(\d+)/);return !!(m&&m[1]!==v);};
 if(p.hits.every(isRange)){rangeOnly++;if(ex.length<4)ex.push(p.run+' '+p.ref+' <- '+txt(p.run,p.hits[0].round).slice(p.hits[0].pos,p.hits[0].pos+40));}}
console.log('named',named,'named only inside a verse range',rangeOnly);ex.forEach(x=>console.log('  ',x));
