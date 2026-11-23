const fs=require('fs');
const nodes=[];
for(const [f,tag] of [["eng.json","E"],["child.json","C"]]){const w=JSON.parse(fs.readFileSync(f));for(const n of w.nodes){const c=n.parameters&&n.parameters.jsCode;if(c&&n.name!=='Shared Library')nodes.push({id:tag+':'+n.name,c})}}
const map=new Map();
for(const n of nodes){const seen=new Set();n.c.split('\n').forEach((l,i)=>{const t=l.trim();if(t.length<80)return;if(seen.has(t))return;seen.add(t);if(!map.has(t))map.set(t,[]);map.get(t).push(n.id)})}
let dupChars=0,saving=0;const rows=[];
for(const [l,ids] of map){if(ids.length>1){dupChars+=l.length*ids.length;saving+=l.length*(ids.length-1);rows.push({len:l.length,k:ids.length,ids,l})}}
const tot=nodes.reduce((a,n)=>a+n.c.length,0);
console.log('non-library code',tot,'chars in lines repeated across nodes',dupChars,'saving if one copy',saving,'distinct repeated lines',rows.length);
rows.sort((a,b)=>b.len*(b.k-1)-a.len*(a.k-1));
fs.writeFileSync('rows.json',JSON.stringify(rows));
for(const r of rows.slice(0,40))console.log(r.len,'x',r.k,'|',r.l.slice(0,110).replace(/\s+/g,' '),'|',r.ids.slice(0,4).join(', '));
