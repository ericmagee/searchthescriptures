// print Final Output round texts to stdout JSON {cr1,cr2,cr3,gr1,gr2,dr3}
const fs=require('fs');const rd={};for(const p of process.argv.slice(2)){const d=JSON.parse(fs.readFileSync(p,'utf8'));const f=o=>{if(o&&typeof o==='object'){if(o.runData)return o.runData;for(const v of Object.values(o)){const r=f(v);if(r)return r;}}return null;};Object.assign(rd,f(d)||{});}
const F=rd['Final Output'][0].data.main[0][0].json;console.log(JSON.stringify(F));
