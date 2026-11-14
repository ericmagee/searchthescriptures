// count rests-on declarations in the 62 stored debates (defender rounds)
const fs=require('fs'),zlib=require('zlib');const src=fs.readFileSync(__dirname+'/krb.js','utf8');
const R=JSON.parse(fs.readFileSync(__dirname+'/../a287/runs.json','utf8'));let rows=Object.values(R).map(x=>x.r).concat(JSON.parse(zlib.gunzipSync(fs.readFileSync(__dirname+'/../a293/data/rounds8.json.gz'))));
const seen=new Set();let n=0,h=0;for(const r of rows){if(seen.has(r.id))continue;seen.add(r.id);n++;const F={cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,cr4:r.defender_r4};
 const f=new Function('$',src+'\nreturn krbRests2024();');const o=f(nm=>nm==='Final Output'?{isExecuted:true,first:()=>({json:F})}:{isExecuted:false});const ks=Object.keys(o);if(ks.length){h++;console.log(String(r.id).slice(0,8),ks.map(k=>'D'+k+' on '+[...o[k].on].map(x=>'D'+x).join('+')+' '+o[k].q.join(' ; ').slice(0,160)).join(' | '));}}
console.log('debates',n,'with a rests-on declaration',h);
