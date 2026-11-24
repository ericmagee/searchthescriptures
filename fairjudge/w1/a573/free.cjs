// crude free-name check: identifiers referenced (not property keys, not member properties) minus every name declared anywhere in the text.
const acorn=require('/home/claude/searchthescriptures/node_modules/acorn');const fs=require('fs');const t=fs.readFileSync(process.argv[2],'utf8');
const ast=acorn.parse(t,{ecmaVersion:'latest'});const decl=new Set(),used=new Set();
const pat=p=>{if(!p)return;if(p.type==='Identifier')decl.add(p.name);else if(p.type==='ObjectPattern')p.properties.forEach(q=>pat(q.value||q.argument));else if(p.type==='ArrayPattern')p.elements.forEach(pat);else if(p.type==='RestElement')pat(p.argument);else if(p.type==='AssignmentPattern')pat(p.left)};
const go=(n,parent,key)=>{if(!n||typeof n.type!=='string')return;
 if(n.type==='VariableDeclarator')pat(n.id);if(/Function/.test(n.type)){if(n.id)decl.add(n.id.name);n.params.forEach(pat)}if(n.type==='CatchClause')pat(n.param);
 if(n.type==='Identifier'){const prop=(parent&&parent.type==='MemberExpression'&&key==='property'&&!parent.computed)||(parent&&parent.type==='Property'&&key==='key'&&!parent.computed);if(!prop)used.add(n.name)}
 for(const k of Object.keys(n)){const v=n[k];if(Array.isArray(v))v.forEach(x=>go(x,n,k));else if(v&&typeof v.type==='string')go(v,n,k)}};
go(ast,null,null);const builtins=new Set(Object.getOwnPropertyNames(globalThis).concat(['undefined','arguments']));
console.log('free (non-builtin):',[...used].filter(x=>!decl.has(x)&&!builtins.has(x)).sort().join(',')||'none');
