const fs=require('fs');const F=f=>eval('(()=>{const VP4N0=s=>String(s||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();'+fs.readFileSync(__dirname+'/'+f,'utf8')+';return vp524Verses;})()');
const R={OLD:F('old_vp524.js'),B2:F('../b2/new_vp524.js'),B3:F('new_vp524.js')};
const rows=JSON.parse(fs.readFileSync('/mnt/project-files/ask682/w4/rows11.json','utf8'));const out=[];
for(const r of rows)for(const k of ['cr1','cr2','cr3','dr1','dr2','dr3'])for(const [lab,f] of Object.entries(R))for(const v of f([r[k]]))out.push({run:r.id.slice(0,8),k,lab,ref:v.ref,w:v.w});
fs.writeFileSync(__dirname+'/joins11.json',JSON.stringify(out));const refs=new Set();out.forEach(o=>{const m=o.ref.match(/^(.*) (\d+):(\d+)(?:[-–](\d+))?$/);const a=+m[3],b=m[4]?+m[4]:a;for(let v=a;v<=Math.min(b,a+30);v++)refs.add(m[1]+'|'+m[2]+'|'+v);});
fs.writeFileSync(__dirname+'/refs11.txt',[...refs].join('\n'));console.log('joins',out.length,'refs',refs.size);
