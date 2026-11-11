const fs=require('fs');const j=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const e=j.data||j;
const rd=e.resultData.runData;const out={};
for(const [n,runs] of Object.entries(rd)){for(let r=0;r<runs.length;r++){const it=(((runs[r].data||{}).main||[])[0]||[]);for(const x of it){const u=x.json&&(x.json.usage);if(u){out[n]=out[n]||{runs:0,keys:new Set(),model:x.json.model,ex:u};out[n].runs++;Object.keys(u).forEach(k=>out[n].keys.add(k));}}}}
for(const [n,o] of Object.entries(out))console.log(n,'|runs',o.runs,'|model',o.model,'|keys',[...o.keys].join(','),'|',JSON.stringify(o.ex).slice(0,250));
