const fs=require('fs');
for(const f of ['fixtures/r29609_gr2l.txt','fixtures/r29609_cr3l.txt']){const s=fs.readFileSync(f,'utf8');const h=s.search(/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/i);let body=s.slice(h);const stop=body.slice(1).search(/\n\s*(?:PREMISE COUNT\s*:|-{3,}|#{1,3}\s)/i);if(stop>=0)body=body.slice(0,stop+1);
const items=body.split(/\n(?=[ \t]*(?:\*\*)?(?:\d+\.|LINK\s+\d+\s*:))/i).slice(1);console.log(f,'items',items.length);
items.forEach((it,k)=>{const qs=[];const pos=[];const qre=/["“”]/g;let m;while((m=qre.exec(it)))pos.push(m.index);for(let i=0;i+1<pos.length;i+=2)qs.push(it.slice(pos[i]+1,pos[i+1]).trim());const mk=it.search(/(?:words|Quote)\s*:\s*["“]/i);if(mk>=0){const tail=it.slice(mk).replace(/^[^"“]*["“]/,'').replace(/["”]\s*$/,'').trim();if(tail)qs.push(tail);}
qs.filter(x=>x.length>=8).forEach(x=>console.log((f.includes('gr2')?'G':'C')+(k+1)+'\t'+x));});}
