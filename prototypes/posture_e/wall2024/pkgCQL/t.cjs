const fs=require('fs'),zlib=require('zlib');const src=fs.readFileSync(__dirname+'/cql.js','utf8');const f=new Function(src+'\nreturn cecQph;')();
const R=JSON.parse(fs.readFileSync(__dirname+'/../a287/runs.json','utf8'));const P=__dirname+'/data/';
let rows=Object.values(R).map(x=>({id:x.r.id,...x.r}));try{rows=rows.concat(JSON.parse(zlib.gunzipSync(fs.readFileSync(P+'rounds8.json.gz'))));}catch(e){console.log('no rounds8',e.message)}
const seen=new Set();let tot=0,deb=0;
for(const r of rows){if(seen.has(r.id))continue;seen.add(r.id);const F={cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,cr4:r.defender_r4,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3,dr4:r.challenger_r4};
 const links={DEFENDER:[1,2,3,4,5,6,7,8],CHALLENGER:[1,2,3,4,5,6,7,8]};const o=f(F,links,[]);tot+=o.length;if(o.length)deb++;
 if(String(r.id).startsWith('eaef1fa9')||process.argv[2]==='all')for(const c of o)console.log(String(r.id).slice(0,8),c.id,c.side,'L'+c.n,'['+c.earlier_round+']',JSON.stringify(c.earlier_q.slice(0,150)),'||',JSON.stringify(c.closing_q.slice(0,150)));}
console.log('debates',seen.size,'with pairs',deb,'pairs',tot);
