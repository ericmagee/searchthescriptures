const acorn=require('/home/claude/searchthescriptures/node_modules/acorn');const fs=require('fs');
const nodes=[];
for(const [f,tag] of [["eng.json","E"],["child.json","C"]]){const w=JSON.parse(fs.readFileSync(f));for(const n of w.nodes){const c=n.parameters&&n.parameters.jsCode;if(c&&n.name!=='Shared Library')nodes.push({id:tag+':'+n.name,c})}}
const G=new Map();let fails=[];
const nameOf=(st,src)=>{if(st.type==='VariableDeclaration')return st.declarations.map(d=>d.id&&d.id.name||'?').join(',');if(st.type==='FunctionDeclaration')return 'fn '+st.id.name;return '~'+src.slice(0,50).replace(/\s+/g,' ')};
for(const n of nodes){const pre='(async function(){\n';let ast;try{ast=acorn.parse(pre+n.c+'\n})',{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true})}catch(e){fails.push(n.id+': '+e.message);continue}
 const fn=ast.body[0].expression;const body=fn.body.body;const walk=(arr)=>{for(const st of arr){if(st.type==='TryStatement'){walk(st.block.body);continue}if(st.type==='BlockStatement'){walk(st.body);continue}
  const src=(pre+n.c).slice(st.start,st.end);if(src.length<300)continue;const k=nameOf(st,src);if(!G.has(k))G.set(k,new Map());const m=G.get(k);m.set(n.id,(m.get(n.id)||'')+src)}};walk(body)}
const res=[];for(const [k,m] of G){if(m.size<2)continue;const t=[...m.values()];const lens=t.map(x=>x.length);const tot=lens.reduce((a,b)=>a+b,0);const mx=Math.max(...lens);res.push({k,n:m.size,texts:new Set(t).size,mx,tot,save:tot-mx,ids:[...m.keys()].map(x=>x.replace('E:',''))})}
res.sort((a,b)=>b.save-a.save);fs.writeFileSync('top.json',JSON.stringify(res,null,1));
console.log('parse fails',fails.length,fails.slice(0,3));console.log('total repeated-statement saving',res.reduce((a,r)=>a+r.save,0));
for(const r of res.slice(0,30))console.log(r.save,'|',r.k.slice(0,40),'| copies',r.n,'texts',r.texts,'| max',r.mx,'| tot',r.tot,'|',r.ids.join(', ').slice(0,170));
