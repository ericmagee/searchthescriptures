const fs=require('fs'),crypto=require('crypto');const raw=fs.readFileSync(process.argv[2],'utf8');let j;try{j=JSON.parse(raw)}catch(e){j=JSON.parse(raw.slice(raw.indexOf('{')))}
const find=o=>{if(o&&o.nodes&&Array.isArray(o.nodes))return o;if(o&&typeof o==='object'){for(const k in o){const r=find(o[k]);if(r)return r}}if(typeof o==='string'&&o.includes('"nodes"')){try{return find(JSON.parse(o))}catch(e){}}return null};
const w=find(j);const base=process.argv[3];const want=process.argv[4];console.log('versionId',w.versionId,'nodes',w.nodes.length);
const m=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,8);
const files=fs.readdirSync(want).filter(f=>f.endsWith('.js'));const names=new Set(files.map(f=>f.replace(/\.js$/,'').replace(/_/g,' ')));
let same=0,diff=[];for(const n of w.nodes){const c=(n.parameters||{}).jsCode;const f=n.name.replace(/[^A-Za-z0-9]+/g,'_')+'.js';
 if(names.has(n.name)){const tgt=fs.readFileSync(want+'/'+n.name.replace(/ /g,'_')+'.js','utf8');const b=fs.existsSync(base+'/'+f)?fs.readFileSync(base+'/'+f,'utf8'):null;console.log(n.name.padEnd(26),m(c||''),c===tgt?'= NEW':(c===b?'= 14054eb4':'OTHER'));}
 else if(c!==undefined){const b=fs.existsSync(base+'/'+f)?fs.readFileSync(base+'/'+f,'utf8'):null;if(c===b)same++;else diff.push(n.name);}}
console.log('other code nodes equal to 14054eb4:',same,'differ:',diff.join(', ')||'none');
