const fs=require('fs'),path=require('path');const R=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
for(const dir of ['base','new']){const src=fs.readFileSync(path.join(process.argv[3],dir,'Citation_Scan.js'),'utf8');
 const $=n=>{if(n==='Regrade Load')return {isExecuted:false};return {first:()=>({json:R})};};
 const out=new Function('$',src)($)[0].json;const it=out.items||out.citation_items||[];
 const keys=Object.keys(out);const arr=Array.isArray(it)?it:[];
 console.log(dir,'keys',keys.slice(0,8).join(','),'n',arr.length,JSON.stringify(arr.filter(x=>x.round==='R3'&&/^John (1:45|6:42)/.test(x.ref)).map(x=>[x.side,x.ref,x.quote.slice(0,50)])));}
