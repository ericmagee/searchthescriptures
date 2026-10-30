// BB-8172 step 4 harness: runs Citation Scan, then Quote Compare, base and new node code unchanged, on one debate's six stored rounds.
// usage: node harness_cs.cjs <rounds.json> <verses.json|-> [groups]
//   rounds.json: {cr1,gr1,cr2,gr2,cr3,dr3}; verses.json: [{book,chapter,verse,text}] (kjv_verses rows, hash-gated by the caller).
//   With "groups" it prints the verse groups both versions would read (to fetch), and stops.
const fs=require('fs'),path=require('path');
const [,,RF,VF,MODE]=process.argv;const R=JSON.parse(fs.readFileSync(RF,'utf8'));
const V=VF&&VF!=='-'?JSON.parse(fs.readFileSync(VF,'utf8')):[];
const node=(dir,name)=>fs.readFileSync(path.join(__dirname,dir,name+'.js'),'utf8');
function run(dir){
 const env={'Final Output':{json:R},'Regrade Load':null};
 const $=n=>{if(n==='Regrade Load')return {isExecuted:false,first:()=>({json:{}})};if(n==='Final Output')return {isExecuted:true,first:()=>({json:R})};
  if(n==='Citation Scan')return {first:()=>({json:env.cs})};if(n==='Cited Verses')return {all:()=>env.rows.map(j=>({json:j}))};throw new Error('no node '+n);};
 env.cs=new Function('$',node(dir,'Citation_Scan'))($)[0].json;
 const groups=[...decodeURIComponent(env.cs.url_cited).matchAll(/and\(book\.eq\."([^"]+)",chapter\.eq\.(\d+),verse\.gte\.(\d+),verse\.lte\.(\d+)\)/g)].map(m=>[m[1],+m[2],+m[3],+m[4]]);
 if(MODE==='groups')return {groups};
 env.rows=V.filter(v=>groups.some(([b,c,a,z])=>v.book===b&&+v.chapter===c&&+v.verse>=a&&+v.verse<=z));
 const qc=new Function('$',node(dir,'Quote_Compare'))($)[0].json;
 return {groups,scanned:env.cs.scanned,items:qc.items.map(i=>({side:i.side,round:i.round,ref:i.ref,status:i.status,score:i.score,rebound_from:i.rebound_from||null,after_first:!!i.after_first,order:i.order||null,cite_form:i.cite_form,quote:String(i.quote).slice(0,90)}))};}
const b=run('base'),n=run('new');
if(MODE==='groups'){const s=new Set([...b.groups,...n.groups].map(g=>g.join('|')));console.log(JSON.stringify([...s]));process.exit(0);}
const k=i=>i.side+'|'+i.round+'|'+i.quote;const bm=new Map(b.items.map(i=>[k(i),i])),nm=new Map(n.items.map(i=>[k(i),i]));
const changes=[];for(const [key,x] of nm){const y=bm.get(key);if(!y)changes.push({kind:'NEW ITEM',...x});else if(y.ref!==x.ref||y.status!==x.status||y.rebound_from!==x.rebound_from)changes.push({kind:'CHANGED',from:{ref:y.ref,status:y.status,rebound_from:y.rebound_from},...x});}
for(const [key,y] of bm)if(!nm.has(key))changes.push({kind:'LOST ITEM',...y});
const cnt=a=>a.items.reduce((o,i)=>(o[i.status]=(o[i.status]||0)+1,o),{});
console.log(JSON.stringify({base:{items:b.items.length,status:cnt(b)},new:{items:n.items.length,status:cnt(n)},changes},null,1));
