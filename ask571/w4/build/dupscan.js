// duplicate code across nodes (excluding Shared Library), by named top-level blocks "const X=(" and by lines
const fs=require('fs'),crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);
const W=JSON.parse(fs.readFileSync(process.argv[2]));
const nodes=W.nodes.filter(x=>x.parameters&&x.parameters.jsCode&&x.name!=='Shared Library');
let tot=0;for(const x of nodes)tot+=x.parameters.jsCode.length;
const lib=W.nodes.find(x=>x.name==='Shared Library');
// line-level duplication
const L={};for(const x of nodes){for(const l of x.parameters.jsCode.split('\n')){if(l.length<40)continue;(L[l]=L[l]||new Set()).add(x.name);}}
let dupBytes=0;for(const [l,s] of Object.entries(L))if(s.size>1)dupBytes+=l.length*(s.size-1);
console.log('code nodes',nodes.length,'code chars (excl library)',tot,'library',lib?lib.parameters.jsCode.length:0,'| repeated-line chars beyond first copy',dupBytes);
// named blocks: const NAME=(()=>{ ... or const NAME=(T=>{  ; cut to balanced parse
const blocks={};
for(const x of nodes){const s=x.parameters.jsCode;for(const m of s.matchAll(/(?:^|\n)\s*(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*\(/g)){const name=m[1];const i=m.index+(m[0].startsWith('\n')?1:0);
 let j=i,st=null;let tries=0;while((j=s.indexOf(')',j+1))>=0&&tries<4000){tries++;let e=j+1;if(s[e]===';')e++;const c=s.slice(i,e);if(c.length<300)continue;try{new Function(c);st=c;break;}catch(_){}}
 if(!st)continue;const k=name;(blocks[k]=blocks[k]||[]).push({node:x.name,len:st.length,h:md5(st)});}}
const rows=[];for(const [k,v] of Object.entries(blocks)){if(v.length<2)continue;const sum=v.reduce((a,b)=>a+b.len,0);const max=Math.max(...v.map(b=>b.len));const vars=new Set(v.map(b=>b.h)).size;rows.push({k,copies:v.length,variants:vars,chars:sum,saving:sum-max*vars});}
rows.sort((a,b)=>b.chars-a.chars);for(const r of rows.slice(0,30))console.log(r.k.padEnd(16),'copies',String(r.copies).padStart(3),'variants',String(r.variants).padStart(3),'chars',String(r.chars).padStart(8));
