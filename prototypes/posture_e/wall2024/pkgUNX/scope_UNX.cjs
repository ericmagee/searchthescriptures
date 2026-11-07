// pkgUNX scope check (from pkgFCB/scope_FCB.cjs): kunxLines and what it reads are in scope in each library node
// scope that holds kfcLines and from each scope that calls it (acorn parse; function declarations hoist within their own function).
const fs=require('fs');const acorn=require('/opt/node-tools/node_modules/acorn');
const NEED=['kunxLines','ciRounds','ciCountSection','lbBlockText','lbFoot','unxNamed','unxSegs','UNX_OTHER','UNX_TAG'];
const plan=JSON.parse(fs.readFileSync('pkgUNX/plan_UNX.json','utf8'));let bad=0,ok=0;
for(const n of plan.nodes){if(!n.edits.includes('lib'))continue;const src='async function __n8n($,$input,$json,$execution){\n'+fs.readFileSync('pkgUNX/patched/'+n.file,'utf8')+'\n}';
 const ast=acorn.parse(src,{ecmaVersion:'latest',allowReturnOutsideFunction:true});
 // scopes: each function body; declared names per scope (top-level declarations of that body, var/let/const/function)
 const scopes=[];const walk=(node,chain)=>{if(!node||typeof node.type!=='string')return;let ch=chain;
  if(/Function/.test(node.type)){const sc={names:new Set(),parent:chain};(node.params||[]).forEach(p=>p.type==='Identifier'&&sc.names.add(p.name));if(node.id&&node.type!=='FunctionDeclaration')sc.names.add(node.id.name);scopes.push(sc);ch=sc;node.__sc=sc;}
  if(node.type==='BlockStatement'&&!node.__fnbody){const sc={names:new Set(),parent:ch,block:true};scopes.push(sc);ch=sc;}
  if(node.type==='VariableDeclaration'){for(const d of node.declarations)if(d.id.type==='Identifier')(node.kind==='var'?fnOf(ch):ch).names.add(d.id.name);}
  if(node.type==='FunctionDeclaration'&&node.id)ch===node.__sc?0:0;
  if(node.type==='CallExpression'&&node.callee.type==='Identifier'&&node.callee.name==='kunxLines')calls.push(ch);
  for(const k of Object.keys(node)){if(k==='__sc')continue;const v=node[k];if(Array.isArray(v))v.forEach(c=>{if(c&&c.type){if(/Function/.test(node.type)&&k==='body'){}walk(c,ch);}});else if(v&&typeof v.type==='string'){if(/Function/.test(node.type)&&k==='body')v.__fnbody=true;walk(v,ch);}}};
 const fnOf=s=>{while(s.block&&s.parent)s=s.parent;return s;};const calls=[];
 // function declarations: register in enclosing scope before walking (hoist)
 const decl=(node,ch)=>{};
 const walk2=(node,ch)=>{};
 const root={names:new Set(),parent:null};
 // simple approach: register FunctionDeclarations in the scope they appear in, during the walk
 const W0=walk;const walkF=(node,chain)=>{if(node&&node.type==='FunctionDeclaration'&&node.id){(chain.block?chain:chain).names.add(node.id.name);}return W0(node,chain);};
 // patch: re-walk with function registration
 scopes.length=0;calls.length=0;
 const walkAll=(node,chain)=>{if(!node||typeof node.type!=='string')return;if(node.type==='FunctionDeclaration'&&node.id)chain.names.add(node.id.name);let ch=chain;
  if(/Function/.test(node.type)){const sc={names:new Set(),parent:chain};(node.params||[]).forEach(p=>p.type==='Identifier'&&sc.names.add(p.name));ch=sc;if(node.body&&node.body.type==='BlockStatement'){node.body.__fnbody=true;}}
  else if(node.type==='BlockStatement'&&!node.__fnbody){ch={names:new Set(),parent:chain,block:true};}
  if(node.type==='VariableDeclaration'){for(const d of node.declarations)if(d.id.type==='Identifier')(node.kind==='var'?fnOf(chain):chain).names.add(d.id.name);}
  if(node.type==='CallExpression'&&node.callee.type==='Identifier'&&node.callee.name==='kunxLines')calls.push(chain);
  if(node.type==='FunctionDeclaration'&&node.id&&node.id.name==='kunxLines')libScope.s=chain;
  for(const k of Object.keys(node)){const v=node[k];if(Array.isArray(v))v.forEach(c=>c&&c.type&&walkAll(c,ch));else if(v&&typeof v.type==='string')walkAll(v,ch);}};
 const libScope={s:null};walkAll(ast,root);
 const sees=(sc,name)=>{for(let s=sc;s;s=s.parent)if(s.names.has(name))return true;return false;};
 const miss=[];if(!libScope.s)miss.push('no kunxLines declaration');else for(const k of NEED)if(!sees(libScope.s,k))miss.push('lib scope: '+k);
 calls.forEach((c,i)=>{if(!sees(c,'kunxLines'))miss.push('call '+i+': kunxLines');});
 if(miss.length){bad++;console.log('FAIL',n.name,miss.join('; '));}else{ok++;console.log('OK  ',n.name,'('+calls.length+' calls)');}}
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
