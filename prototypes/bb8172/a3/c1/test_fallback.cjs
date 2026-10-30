// BB-8172 step 4: the fallback path. A quote whose after-reference fails and whose before-reference (a range) holds it; Quote Compare
// (new: reads the whole fallback range) and the Format Markdown rebound lines, base vs new. Verses from data/8a510163/verses.json (md5-gated).
const fs=require('fs'),path=require('path');const V=JSON.parse(fs.readFileSync('data/8a510163/verses.json','utf8'));
const R={cr1:'Luke 1:13, 62-63 and "they made signs to his father, how he would have him called" (Numbers 1:2) are the naming rows.',gr1:'',cr2:'',gr2:'',cr3:'',dr3:''};
function run(dir){const env={};const $=n=>{if(n==='Regrade Load')return {isExecuted:false};if(n==='Final Output')return {first:()=>({json:R})};if(n==='Citation Scan')return {first:()=>({json:env.cs})};if(n==='Cited Verses')return {all:()=>V.map(j=>({json:j}))};};
 env.cs=new Function('$',fs.readFileSync(path.join(dir,'Citation_Scan.js'),'utf8'))($)[0].json;const qc=new Function('$',fs.readFileSync(path.join(dir,'Quote_Compare.js'),'utf8'))($)[0].json;
 const fm=fs.readFileSync(path.join(dir,'Format_Markdown.js'),'utf8');const a=fm.indexOf('  // Nearer reference shown');const e=fm.indexOf('\n}',a);
 const QRd={items:qc.items};let t='';new Function('QRd','t',fm.slice(a,e)+'\nreturn t;');const block=new Function('QRd',"let t='';"+fm.slice(a,e)+'\nreturn t;')(QRd);
 return {items:qc.items.map(i=>[i.ref,i.v1+'-'+i.v2,i.status,i.rebound_from||'',!!i.after_first]),report:block};}
console.log(JSON.stringify({base:run('base'),new:run('new')},null,1));
