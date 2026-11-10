// pkgF3A sketch (W2, offline on s110; NOT for writing until the operator chooses): one retry of the same alternate when its reply was unusable.
// Changes only the plain Code node "Second Alternate?" (pkgA2R). Round 2 already exists; this lets round 2 offer the SAME model again, once,
// when round 1 tried it and its reply was unusable (content null, no JSON object, JSON did not parse). The retry is the existing R2 path.
// Usage: node pkgF3A/build_F3A.cjs <fetch-back> <out>
const fs=require('fs');const [,,IN,OUT]=process.argv;let d=JSON.parse(fs.readFileSync(IN,'utf8'));const top=d;d=Array.isArray(d)?d[0]:d;d=d.data||d;const w=d.workflow||d;
const n=w.nodes.find(x=>x.name==='Second Alternate?');let c=n.parameters.jsCode;const L0=c.length;
const SET=process.env.SET||'ALL';const R=SET!=='G1',G=SET!=='RETRY';const rep=(a,b,on=true)=>{if(!on)return;if(c.split(a).length!==2)throw new Error('anchor not unique: '+a.slice(0,60));c=c.replace(a,b);};
rep("const a2r={run:false,seats:[],tried:[],free:[],why:null};","const a2r={run:false,seats:[],tried:[],free:[],retry:[],why:null};",R);
rep("const failed=[...new Set(T.filter(x=>x.result==='NOT SEATED'&&!filled.has(x.removed_seat)).map(x=>x.removed_seat))];",
 "const failed=[...new Set(T.filter(x=>x.result==='NOT SEATED'&&!filled.has(x.removed_seat)).map(x=>x.removed_seat))];\n a2r.retry=[...new Set(T.filter(x=>x.result==='NOT SEATED'&&!filled.has(x.removed_seat)&&/returned content null|returned no JSON object|JSON did not parse/.test(String(x.why||''))).map(x=>x.api_model))];a2r.tried=a2r.tried.filter(m=>a2r.retry.indexOf(m)<0); /* pkgF3A: an unusable reply is retried once, same model */",R);
rep("const free=(RS.alternates||[]).filter(a=>!deb.some(d=>d.model===a.api_model||d.family===a.family)","const free=(RS.alternates||[]).filter(a=>!deb.some(d=>d.model===a.api_model||(d.family===a.family&&a.api_model!=='anthropic/claude-haiku-5.5'))",G); /* G1 as R2 Alternate Build applies it (pkgJGR rev 6 haiku exemption) */
rep("a2r.why=a2r.run?'round 2 for '+a2r.seats.join(', ')+'; free: '+a2r.free.join(', ')","a2r.why=a2r.run?'round 2 for '+a2r.seats.join(', ')+'; free: '+a2r.free.join(', ')+(a2r.retry.length?'; retry of an unusable reply: '+a2r.retry.join(', '):'')",R);
n.parameters.jsCode=c;fs.writeFileSync(OUT,JSON.stringify(top));console.log(SET,'Second Alternate?',L0,'->',c.length,'+'+(c.length-L0));
