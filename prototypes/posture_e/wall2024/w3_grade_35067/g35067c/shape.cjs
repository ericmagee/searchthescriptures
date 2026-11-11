const fs=require('fs');const f=process.argv[2];const d=JSON.parse(fs.readFileSync(f));
function sh(o,dep,ind){if(dep>5)return;if(Array.isArray(o)){console.log(ind+'[array '+o.length+']');if(o.length)sh(o[0],dep+1,ind+'  ');}else if(o&&typeof o==='object'){for(const [k,v] of Object.entries(o)){const t=typeof v==='string'?'str('+v.length+') '+JSON.stringify(v.slice(0,80)):Array.isArray(v)?'arr('+v.length+')':typeof v==='object'&&v?'obj':String(v);console.log(ind+k+': '+t);if(v&&typeof v==='object')sh(v,dep+1,ind+'  ');}}}
sh(d[0].data.main[0][0].json,0,'');
