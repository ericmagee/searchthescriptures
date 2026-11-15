const fs=require('fs'),zlib=require('zlib');const c=JSON.parse(fs.readFileSync('target_F2.json','utf8')).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
new Function('$',c); // syntax
const i=c.indexOf('const PROMPT="');const P=new Function(c.slice(i,c.indexOf('\n',i))+';return PROMPT;')();console.log('PROMPT ok, narrowed sentence:',P.includes('narrowed or gave up in an earlier round (\"I narrow\"'));
const a=c.indexOf('const cecNar='),b=c.indexOf('\n',a);const nar=new Function(c.slice(a,b)+';return cecNar;')();
const rows=JSON.parse(zlib.gunzipSync(fs.readFileSync('../../a293/data/rounds8.json.gz')));const R=JSON.parse(fs.readFileSync('../../a287/runs.json','utf8'));const all=Object.values(R).map(x=>x.r).concat(rows);
const seen=new Set();let n=0,tot=0,mx=0,cap=0;for(const r of all){if(seen.has(r.id))continue;seen.add(r.id);n++;const F={cr1:r.claude_r1,cr2:r.claude_r2,cr3:r.engine_r3,cr4:r.defender_r4,gr1:r.engine_r1,gr2:r.engine_r2,dr3:r.challenger_r3,dr4:r.challenger_r4};for(const sd of ['DEFENDER','CHALLENGER']){const L=nar(F,sd);tot+=L.length;mx=Math.max(mx,L.length);if(L.length>=12)cap++;}}
console.log('debates',n,'listed',tot,'per side avg',(tot/n/2).toFixed(2),'max',mx,'sides at cap',cap);
if(process.argv[2]){const F=JSON.parse(fs.readFileSync(process.argv[2]));for(const sd of ['DEFENDER','CHALLENGER'])console.log(sd,JSON.stringify(nar(F,sd),null,1));}
