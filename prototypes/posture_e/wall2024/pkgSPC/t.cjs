// usage: node t.cjs <rounds json array> <out tags json>  -> computes tags with live Citation Scan, writes verse list
const fs=require('fs');const S='/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/';
const load=(f,name,stop,ret)=>{const c=require(f).nodes.find(n=>n.name===name).parameters.jsCode;const nx=c.indexOf(stop);return new Function(c.slice(0,nx)+';return '+ret+';')();};
const CS=load(S+'w201/fetchback_live_s201.json','Citation Scan','let F=null;try{if($(','L2C');
const d=require(process.argv[2]);const all=[];
for(const r of d){const RA=[['DEFENDER','CR1',r.claude_r1],['DEFENDER','CR2',r.claude_r2],['DEFENDER','CR3',r.engine_r3],['DEFENDER','CR4',r.defender_r4],['CHALLENGER','DR1',r.engine_r1],['CHALLENGER','DR2',r.engine_r2],['CHALLENGER','DR3',r.challenger_r3],['CHALLENGER','DR4',r.challenger_r4]].filter(x=>x[2]);
 for(const t of CS.tags(RA))all.push({...t,id:r.id});}
fs.writeFileSync(process.argv[3],JSON.stringify(all));const V=[...new Set(all.flatMap(t=>t.verses))];fs.writeFileSync(process.argv[3]+'.verses',JSON.stringify(V));console.log('tags',all.length,'verses',V.length);
