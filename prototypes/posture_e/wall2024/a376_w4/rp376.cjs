const fs=require('fs');const {unpack,rb}=require('../tools/lib.cjs');
const u=unpack(JSON.parse(fs.readFileSync(process.argv[2])));const src=rb(u.L,u.M['Cure Check']);
const f=new Function(src.match(/const KV_KIND=.*?\*\//s)[0]+';return {KV_KIND,KV_EXCL};')();
const mask=s=>String(s).replace(/["“][^"”\n]*["”]/g,'"Q"').replace(/(^|[\s(\[:;,])['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’](?=$|[\s.,;:!?)\]])/g,"$1'Q'");
for(const [s,id,seat,t] of JSON.parse(fs.readFileSync(process.argv[3]))){const old=f.KV_KIND.test(t)||f.KV_KIND.test(mask(t));const nw=old||f.KV_EXCL.test(mask(t));console.log(s,id,seat,'old',old,'new',nw,nw!==old?'<< CHANGES':'');}
