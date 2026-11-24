const fs=require('fs');
function load(p){let j=JSON.parse(fs.readFileSync(p,'utf8'));if(j.data)j=j.data;return j;}
const E=load(process.argv[2]),C=load(process.argv[3]);
function walk(w){const out={};for(const [s,o] of Object.entries(w.connections))for(const arr of Object.values(o))for(const outs of arr)for(const c of (outs||[])){(out[s]=out[s]||[]).push(c.node);}
 const hasIn=new Set();for(const v of Object.values(out))v.forEach(x=>hasIn.add(x));
 const starts=w.nodes.filter(n=>/trigger|webhook|start/i.test(n.type)&&!/sticky/i.test(n.type)).map(n=>n.name);
 const seen=new Set(starts),q=[...starts];while(q.length){const x=q.pop();for(const y of out[x]||[])if(!seen.has(y)){seen.add(y);q.push(y);}}
 const un=w.nodes.filter(n=>!seen.has(n.name)&&!/stickyNote/.test(n.type)).map(n=>n.name);
 return {starts,un,disabled:w.nodes.filter(n=>n.disabled).map(n=>n.name),sticky:w.nodes.filter(n=>/stickyNote/.test(n.type)).length};}
const we=walk(E),wc=walk(C);
console.log('eng starts',we.starts,'unreached',we.un.length,'disabled',we.disabled,'sticky',we.sticky);
console.log(we.un.join(' | '));
console.log('child starts',wc.starts,'unreached',wc.un);
const dead=we.un.filter(n=>n!=='Shared Library');const deadSet=new Set(dead);
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
for(const [lab,w] of [['eng',E],['child',C]]){
 const res={};
 for(const n of w.nodes){if(lab==='eng'&&deadSet.has(n.name))continue;
  const s=JSON.stringify(n.parameters||{});
  for(const d of dead){const forms={dollar:new RegExp("\\$\\(\\s*\\\\?['\"`]"+esc(d)+"\\\\?['\"`]"),nodeidx:new RegExp("\\$node\\[\\s*\\\\?['\"]"+esc(d)),items:new RegExp("\\$items\\(\\s*\\\\?['\"]"+esc(d)),any:new RegExp(esc(d))};
   const hit=Object.entries(forms).filter(([k,r])=>r.test(s)).map(([k])=>k);
   if(hit.length){const isCode=/code|function/i.test(n.type);(res[d]=res[d]||[]).push(n.name+'['+hit.join(',')+(isCode?'':',NONCODE:'+n.type.split('.').pop())+']');}}}
 console.log('\n==',lab);for(const d of dead)console.log(d,'<=',(res[d]||['none']).join('; '));
}
// size
let sz=0;for(const n of E.nodes)if(deadSet.has(n.name))sz+=JSON.stringify(n).length;console.log('dead size',sz,'file',fs.statSync(process.argv[2]).size);
