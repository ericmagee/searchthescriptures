const fs=require('fs');const raw=fs.readFileSync(process.argv[2],'utf8');
let j;try{j=JSON.parse(raw)}catch(e){const m=raw.indexOf('{');j=JSON.parse(raw.slice(m))}
const find=o=>{if(o&&o.nodes&&Array.isArray(o.nodes))return o;if(o&&typeof o==='object'){for(const k in o){const r=find(o[k]);if(r)return r}}if(typeof o==='string'&&o.includes('"nodes"')){try{return find(JSON.parse(o))}catch(e){}}return null};
const w=find(j);console.log('versionId',w.versionId||w.activeVersionId,'nodes',w.nodes.length);
const crypto=require('crypto');
for(const n of w.nodes){const c=(n.parameters||{}).jsCode||'';if(/cureQ|cureAsk/.test(c))console.log(n.name,crypto.createHash('md5').update(c).digest('hex').slice(0,8),/cureQ=s=>/.test(c)?'q':'',/cureAsk/.test(c)?'a':'')}
