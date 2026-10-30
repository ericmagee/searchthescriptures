// BB-8172 step 1 harness. Loads drvCheck (and the helpers above it) from each node file, base and new, and runs both over the
// exported STANDS/UNDERDETERMINED lines of P (data/part_*.jsonl, hash-gated by check_part.py). Reports per node: items equal
// base vs new (JSON, every row), and the new marks K-S2 and K-U by row and line.
const fs=require('fs'),path=require('path');
function load(file){const t=fs.readFileSync(file,'utf8');const a=t.indexOf('const DRV_REF=');const f=t.indexOf('function drvCheck(');
 if(a<0||f<0)return null;const e=t.indexOf(' return {items,marks};}',f);if(e<0)throw new Error('no drvCheck end in '+file);
 const src=t.slice(a,e+' return {items,marks};}'.length);return new Function(src+'\nreturn {drvCheck,drvUnans:typeof drvUnans==="function"?drvUnans:null};')();}
const D=path.join(__dirname,'..','data');const rows={};
for(const f of fs.readdirSync(D).filter(x=>/^part_.*\.jsonl$/.test(x)))for(const l of fs.readFileSync(path.join(D,f),'utf8').split('\n'))if(l.trim()){const r=JSON.parse(l);(rows[r.i]=rows[r.i]||[]).push(r);}
const ids=Object.keys(rows).map(Number).sort((a,b)=>a-b);
const files=fs.readdirSync(path.join(__dirname,'new')).filter(x=>x.endsWith('.js')).sort();
const report={rows:ids.length,lines:ids.reduce((s,i)=>s+rows[i].length,0),nodes:{}};let ref=null;
for(const f of files){const B=load(path.join(__dirname,'base',f)),N=load(path.join(__dirname,'new',f));if(!B||!N){report.nodes[f]='no drvCheck';continue;}
 let itemsEqual=0,itemsDiff=[],marks=[];
 for(const i of ids){const text=rows[i].sort((a,b)=>a.n-b.n).map(r=>r.t).join('\n');const b=B.drvCheck(text,null,null,null,null,false),n=N.drvCheck(text,null,null,null,null,false);
  if(JSON.stringify(b.items)===JSON.stringify(n.items))itemsEqual++;else itemsDiff.push(i);
  const bm=new Set(b.marks);const extra=n.marks.filter(m=>!bm.has(m));const lost=b.marks.filter(m=>!n.marks.includes(m));
  for(const m of extra)marks.push(i+' '+m.slice(0,110));for(const m of lost)marks.push(i+' LOST '+m.slice(0,100));}
 const sig=JSON.stringify(marks);if(ref===null)ref=sig;
 report.nodes[f]={itemsEqual,itemsDiff,newMarks:marks.length,sameAsFirst:sig===ref};if(f==='Panel_Payloads.js')report.marks=marks;}
console.log(JSON.stringify(report,null,1));
