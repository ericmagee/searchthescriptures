// W3's proposal (Wall 12815 item 4): the judge's quoted words, normalized, anywhere in the side's rounds 1 to 3.
const fs=require('fs');const N=s=>String(s==null?'':s).replace(/\\+"/g,'"').toLowerCase().replace(/[‘’]/g,"'").replace(/'s\b/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const R=f=>fs.readFileSync(__dirname+'/../inputs/'+f+'.txt','utf8');const keeps=JSON.parse(fs.readFileSync(__dirname+'/../inputs/keeps43103.json','utf8'));
const T={CHALLENGER:' '+N([R('cr1'),R('cr2'),R('cr3')].join(' '))+' ',DEFENDER:' '+N([R('dr1'),R('dr2'),R('dr3')].join(' '))+' '};
for(const k of keeps){const qs=[...String(k.why).matchAll(/["“]([^"”]{2,})["”]/g)].map(m=>m[1]);const hit=qs.find(q=>{const n=N(q);return n.split(' ').length>=4&&T[k.side].includes(' '+n+' ');});console.log('W3FORM',k.id,k.seat,k.item,hit?'CURED: "'+hit.slice(0,70)+'"':'UNCURED');}
