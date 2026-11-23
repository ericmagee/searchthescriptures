const fs=require('fs');
const nodes=[];
for(const [f,tag] of [["eng.json","E"],["child.json","C"]]){const w=JSON.parse(fs.readFileSync(f));for(const n of w.nodes){const c=n.parameters&&n.parameters.jsCode;if(c&&n.name!=='Shared Library')nodes.push({id:tag+':'+n.name,c})}}
const keyOf=t=>{let m=t.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/)||t.match(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/);return m?m[1]:'~'+t.slice(0,40)};
const K=new Map();
for(const n of nodes){n.c.split('\n').forEach(l=>{const t=l.trim();if(t.length<60)return;const k=keyOf(t);if(!K.has(k))K.set(k,new Map());const m=K.get(k);if(!m.has(n.id))m.set(n.id,[]);m.get(n.id).push(t)})}
const out=[];
for(const [k,m] of K){if(m.size<2)continue;const texts=[...m.values()].map(a=>a.join('\n'));const tot=texts.reduce((a,x)=>a+x.length,0);const vers=new Set(texts).size;const mx=Math.max(...texts.map(x=>x.length));out.push({k,nodes:[...m.keys()],n:m.size,vers,tot,mx,save:tot-mx})}
out.sort((a,b)=>b.save-a.save);
fs.writeFileSync('keys.json',JSON.stringify(out));
console.log('keys',out.length,'total save',out.reduce((a,x)=>a+x.save,0));
for(const o of out.slice(0,60))console.log(o.save,'|',o.k.slice(0,40),'| copies',o.n,'vers',o.vers,'| per',o.mx,'| tot',o.tot);
