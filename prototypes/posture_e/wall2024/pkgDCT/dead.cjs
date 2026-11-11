// Dead-function finder: a named function (declaration, or const/let/var bound to an arrow/function expression) is DEAD when no code that runs
// references its name. Liveness is a fixed point from the node's top-level code. A function body is walked only once its name is live.
// Module IIFEs (const M=(()=>{...;return {a,b}})()): an export is live only through M.a in live code; any other use of M makes all exports live.
// Name-based and conservative: a name referenced anywhere in live code keeps every function of that name live (shadowing only adds liveness).
const acorn=require('/opt/node-tools/node_modules/acorn');
function analyze(src){
 const ast=acorn.parse(src,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true,allowHashBang:true,sourceType:'script'});
 const cands=[];const fnOwner=new Map(); // function node -> cand
 const modules={}; // M -> {exportProps:[{key,local,prop}], all:false, retNode}
 const exportSkip=new Set(); // Property nodes in module return objects
 // pass 1: collect
 (function col(n,parent){if(!n||typeof n.type!=='string')return;
  if(n.type==='FunctionDeclaration'&&n.id){const c={name:n.id.name,fn:n,stmt:n,start:n.start,end:n.end};cands.push(c);fnOwner.set(n,c);}
  if(n.type==='VariableDeclaration'){for(const dcl of n.declarations){if(dcl.id.type==='Identifier'&&dcl.init&&(dcl.init.type==='ArrowFunctionExpression'||dcl.init.type==='FunctionExpression')){const c={name:dcl.id.name,fn:dcl.init,stmt:n.declarations.length===1?n:null,decl:dcl,declN:n,start:(n.declarations.length===1?n:dcl).start,end:(n.declarations.length===1?n:dcl).end};cands.push(c);fnOwner.set(dcl.init,c);}
   if(dcl.id.type==='Identifier'&&dcl.init&&dcl.init.type==='CallExpression'&&dcl.init.arguments.length===0&&(dcl.init.callee.type==='ArrowFunctionExpression'||dcl.init.callee.type==='FunctionExpression')&&dcl.init.callee.body.type==='BlockStatement'){
    const b=dcl.init.callee.body.body;const last=b[b.length-1];if(last&&last.type==='ReturnStatement'&&last.argument&&last.argument.type==='ObjectExpression'){
     const ex=[];for(const p of last.argument.properties){if(p.type==='Property'&&!p.computed&&p.value.type==='Identifier'){const key=p.key.name||p.key.value;ex.push({key,local:p.value.name,prop:p});exportSkip.add(p);}}
     modules[dcl.id.name]={exports:ex,all:false,obj:last.argument};}}}}
  for(const k in n){if(k==='parent')continue;const v=n[k];if(Array.isArray(v))v.forEach(x=>col(x,n));else if(v&&typeof v.type==='string')col(v,n);}})(ast,null);
 const live=new Set(),walked=new Set(),memb={};const queue=[];
 const ref=name=>{if(!live.has(name)){live.add(name);for(const c of cands)if(c.name===name&&!walked.has(c.fn))queue.push(c.fn);}};
 const useModuleKey=(M,key)=>{const m=modules[M];for(const e of m.exports)if(e.key===key)ref(e.local);};
 function walk(n,parent,key){if(!n||typeof n.type!=='string')return;
  if(fnOwner.has(n)&&!walked.has(n))return; // candidate body: only when live
  if(n.type==='Property'&&exportSkip.has(n))return;
  if(n.type==='MemberExpression'){if(n.object.type==='Identifier'&&modules[n.object.name]&&!n.computed){useModuleKey(n.object.name,n.property.name);walk(n.object,n,'objM');return;}
   walk(n.object,n,'object');if(n.computed)walk(n.property,n,'property');return;}
  if(n.type==='Identifier'){
   if(parent&&((parent.type==='Property'&&key==='key'&&!parent.computed)||(parent.type==='MethodDefinition'&&key==='key')||(parent.type==='LabeledStatement')||(parent.type==='BreakStatement')||(parent.type==='ContinueStatement')))return;
   if(parent&&(parent.type==='FunctionDeclaration'||parent.type==='FunctionExpression')&&key==='id')return;
   if(parent&&parent.type==='VariableDeclarator'&&key==='id')return;
   if(modules[n.name]&&key!=='objM'){modules[n.name].all=true;for(const e of modules[n.name].exports)ref(e.local);}
   ref(n.name);return;}
  for(const k in n){if(k==='start'||k==='end'||k==='type')continue;const v=n[k];if(Array.isArray(v))v.forEach(x=>walk(x,n,k));else if(v&&typeof v.type==='string')walk(v,n,k);}}
 walk(ast,null,null);
 while(queue.length){const f=queue.pop();if(walked.has(f))continue;walked.add(f);// walk the function itself (params defaults + body)
  for(const k of ['params','body'])(Array.isArray(f[k])?f[k]:[f[k]]).forEach(x=>walk(x,f,k));}
 // dead = candidates whose fn was never walked and that are not inside another dead candidate
 const dead=cands.filter(c=>!walked.has(c.fn));const outer=dead.filter(c=>!dead.some(o=>o!==c&&o.start<=c.start&&o.end>=c.end));
 return {cands,dead,outer,modules,ast};}
module.exports={analyze};
if(require.main===module){const fs=require('fs');const r=analyze(fs.readFileSync(process.argv[2],'utf8'));for(const c of r.outer)console.log(c.name,c.end-c.start,c.stmt?'':'(multi-declarator)');}
