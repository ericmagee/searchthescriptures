const fs=require('fs');const rows=JSON.parse(fs.readFileSync('rows17.json'));
const src=fs.readFileSync('Citation_Scan.js','utf8');
const stub=map=>{const $=n=>{if(n==='Regrade Load')return {isExecuted:false};if(!(n in map))throw new Error('no node '+n);return {first:()=>({json:map[n]}),all:()=>[{json:map[n]}]};};return $;};
const out={};const need=new Set();
for(const r of rows){const F={topic:'',cr1:r.cr1,gr1:r.gr1,cr2:r.cr2,gr2:r.gr2,cr3:r.cr3,dr3:r.dr3};
 const res=new Function('$',src)(stub({'Final Output':F}))[0].json;out[r.id]=res.items;
 for(const i of res.items){need.add(i.book+'|'+i.chapter+'|'+i.v1+'|'+i.v2);if(i.alt)need.add(i.alt.book+'|'+i.alt.chapter+'|'+i.alt.verse+'|'+i.alt.verse);}
 console.log(r.tok,res.scanned);}
fs.writeFileSync('scan.json',JSON.stringify(out));
const vals=[...need].map(g=>{const [b,c,a,z]=g.split('|');return "('"+b.replace(/'/g,"''")+"',"+c+","+a+","+z+")";});
fs.writeFileSync('need.sql',"SELECT json_agg(json_build_object('book',k.book,'chapter',k.chapter,'verse',k.verse,'text',k.text)) j, repeat('#',120000) pad FROM (SELECT DISTINCT v.book,v.chapter,v.verse,v.text FROM kjv_verses v JOIN (VALUES "+vals.join(',')+") n(b,c,a,z) ON v.book=n.b AND v.chapter=n.c AND v.verse BETWEEN n.a AND n.z) k;");
console.log('groups',need.size);
