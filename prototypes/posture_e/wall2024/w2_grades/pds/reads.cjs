// W2: (1) $() reads of moved Builds vs nodes run before the group's first Build in each stored export; (2) reachability of each Resume without its group's first Build
const fs=require('fs');const {ld,src}=require('./src.cjs');const D='/mnt/project-files/wall2024/';const J=ld('parent_s146_PDS.json');
const reads=n=>{let s;try{s=src(J,n);}catch(e){s=J.nodes.find(x=>x.name===n).parameters.jsCode;}return [...new Set([...s.matchAll(/\$\(\s*['"]([^'"]+)['"]\s*\)/g)].map(m=>m[1]))];};
const G={'Close Enforcer Build':['Close Enforcer Build','Anticheat Build','Assume Check Build'],'Enforcer Build':['Enforcer Build','Judge Enforcer Build']};
for(const first in G)for(const b of G[first]){const r=reads(b);console.log('#',b,'reads',r.length+':',r.join(' | ').slice(0,600));
 for(const fn of fs.readdirSync(D).filter(x=>/^ex3\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync(D+fn,'utf8')).data.resultData.runData;if(!rd[first]||!rd[b])continue;const t0=rd[first][0].startTime;
  const late=r.filter(n=>rd[n]&&rd[n][0].startTime>=t0&&n!==b&&!G[first].includes(n));const never=r.filter(n=>!rd[n]);if(late.length)console.log('   ',fn.slice(2,7),'read but first run AFTER',first+':',late.join(', '),'| not run:',never.length);}}
// reachability
const C=J.connections;const adj={};for(const s in C)for(const t in C[s])C[s][t].forEach(a=>(a||[]).forEach(c=>(adj[s]=adj[s]||[]).push(c.node)));
const trig=J.nodes.filter(n=>/trigger|webhook/i.test(n.type)).map(n=>n.name);
const reach=(block)=>{const seen=new Set(),q=[...trig];while(q.length){const x=q.shift();if(seen.has(x)||x===block)continue;seen.add(x);(adj[x]||[]).forEach(y=>q.push(y));}return seen;};
console.log('triggers',trig.join(', '));
for(const [first,res] of [['Close Enforcer Build',['Close Enforcer Resume','Anticheat Resume','Assume Check Resume']],['Enforcer Build',['Enforcer Resume','Judge Enforcer Resume']]]){const s=reach(first);console.log('without',first+':',res.map(r=>r+(s.has(r)?' REACHABLE':' not reachable')).join('; '));}
