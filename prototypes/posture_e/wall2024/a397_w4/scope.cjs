// static scope check: every reference to ri6Col2024, ri5Rd2024 and __RL in each changed stub resolves to a declaration in an enclosing scope
const fs=require('fs');const T=require('../tools/lib.cjs');const acorn=require('../tools/node_modules/acorn');const [BASE,TGT]=process.argv.slice(2);
const b=T.unpack(JSON.parse(fs.readFileSync(BASE))),t=T.unpack(JSON.parse(fs.readFileSync(TGT)));const NAMES=new Set(['ri6Col2024','ri5Rd2024','__RL','run6','LAY']);
function check(src){const ast=acorn.parse(src,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});const bad=[];let refs=0;
 const declIn=(body)=>{const s=new Set();for(const st of body){if(st.type==='FunctionDeclaration')s.add(st.id.name);if(st.type==='VariableDeclaration')st.declarations.forEach(d=>{if(d.id.type==='Identifier')s.add(d.id.name);});}return s;};
 const varsIn=(fn)=>{const s=new Set();(function w(n){if(!n||typeof n.type!=='string')return;if(n!==fn&&/Function/.test(n.type))return;if(n.type==='VariableDeclaration'&&n.kind==='var')n.declarations.forEach(d=>{if(d.id.type==='Identifier')s.add(d.id.name);});if(n.type==='FunctionDeclaration'&&n!==fn)s.add(n.id.name);for(const k of Object.keys(n)){const v=n[k];if(Array.isArray(v))v.forEach(w);else if(v&&typeof v.type==='string')w(v);}})(fn.body||fn);return s;};
 function walk(n,scopes,parent,key){if(!n||typeof n.type!=='string')return;let sc=scopes;
  if(n.type==='Program'||n.type==='BlockStatement'||n.type==='StaticBlock'){sc=scopes.concat([declIn(n.body)]);if(n.type==='Program')sc.push(varsIn(n));}
  if(/Function/.test(n.type)){const s=new Set();(n.params||[]).forEach(p=>{if(p.type==='Identifier')s.add(p.name);});if(n.id&&n.type!=='FunctionDeclaration')s.add(n.id.name);sc=scopes.concat([s,varsIn(n)]);}
  if(n.type==='Identifier'&&NAMES.has(n.name)){const isProp=parent&&((parent.type==='MemberExpression'&&key==='property'&&!parent.computed)||(parent.type==='Property'&&key==='key'));const isDecl=parent&&((parent.type==='FunctionDeclaration'&&key==='id')||(parent.type==='VariableDeclarator'&&key==='id'));
   if(!isProp&&!isDecl){refs++;if(!sc.some(s=>s.has(n.name)))bad.push(n.name+'@'+n.start);}}
  for(const k of Object.keys(n)){const v=n[k];if(Array.isArray(v))v.forEach(x=>walk(x,sc,n,k));else if(v&&typeof v.type==='string')walk(v,sc,n,k);}}
 walk(ast,[],null,null);return {refs,bad};}
let fail=0,n=0;for(const k of Object.keys(t.M)){const s=T.rb(t.L,t.M[k]);if(b.M[k]&&s===T.rb(b.L,b.M[k]))continue;n++;const r=check(s);if(r.bad.length)fail++;console.log(r.bad.length?'FAIL':'PASS',k.padEnd(30),'refs',r.refs,r.bad.length?'unresolved '+r.bad.slice(0,4).join(' '):'');}
console.log('changed stubs',n,'| failing',fail);
