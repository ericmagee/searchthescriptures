const fs=require('fs');const W='/mnt/project-files/wall2024/';const out=[];
for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const rd=JSON.parse(fs.readFileSync(W+f,'utf8')).data.resultData.runData;
 for(const n in rd){if(!/Enforcer Record/.test(n))continue;rd[n].forEach(r=>{const walk=o=>{if(Array.isArray(o))o.forEach(walk);else if(o&&typeof o==='object'){if(o.rule&&('cure_reason' in o))out.push({run:f.match(/\d+/)[0],node:n,seat:o.seat,rule:o.rule,item:o.item,fl:o.flagged_line,cr:o.cure_reason,cs:o.cure_status});else for(const k in o)walk(o[k]);}};walk(r.data);});}}
fs.writeFileSync(process.argv[2],JSON.stringify(out));console.log(out.length);
