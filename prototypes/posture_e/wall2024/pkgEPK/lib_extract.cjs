// Copy named top-level declarations (and everything they use) from one n8n Code node into another, byte for byte, so no second reader is written.
const acorn=require(__dirname+'/node_modules/acorn');
function decls(code){const ast=acorn.parse(code,{ecmaVersion:2022,allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});const D={};
 for(const s of ast.body){if(s.type==='FunctionDeclaration')D[s.id.name]={s,text:code.slice(s.start,s.end)};
  else if(s.type==='VariableDeclaration'&&s.declarations.length===1&&s.declarations[0].id.type==='Identifier')D[s.declarations[0].id.name]={s,text:code.slice(s.start,s.end)};}
 return D;}
// free names of a declaration: identifiers used, less property names, object keys and names it declares itself (params, locals)
function idsIn(node,out,loc){if(!node||typeof node!=='object')return out;if(Array.isArray(node)){node.forEach(n=>idsIn(n,out,loc));return out;}
 if(node.type==='Identifier'){out.add(node.name);return out;}
 if(node.type==='MemberExpression'){idsIn(node.object,out,loc);if(node.computed)idsIn(node.property,out,loc);return out;}
 if(node.type==='Property'){if(node.computed)idsIn(node.key,out,loc);idsIn(node.value,out,loc);return out;}
 if(node.type==='VariableDeclarator'){pat(node.id,loc);idsIn(node.init,out,loc);return out;}
 if(/Function/.test(node.type)){if(node.id&&node.type!=='FunctionDeclaration')loc.add(node.id.name);node.params.forEach(p=>pat(p,loc));idsIn(node.body,out,loc);return out;}
 if(node.type==='CatchClause'){if(node.param)pat(node.param,loc);idsIn(node.body,out,loc);return out;}
 for(const k of Object.keys(node))if(k!=='type'&&k!=='start'&&k!=='end')idsIn(node[k],out,loc);return out;}
function pat(p,loc){if(!p)return;if(p.type==='Identifier')loc.add(p.name);else if(p.type==='ObjectPattern')p.properties.forEach(q=>pat(q.value||q.argument,loc));else if(p.type==='ArrayPattern')p.elements.forEach(e=>pat(e,loc));else if(p.type==='AssignmentPattern')pat(p.left,loc);else if(p.type==='RestElement')pat(p.argument,loc);}
function freeOf(s){const loc=new Set();const used=idsIn(s.type==='FunctionDeclaration'?{type:'FunctionExpression',params:s.params,body:s.body}:s,new Set(),loc);return [...used].filter(n=>!loc.has(n));}
function closure(code,names){const D=decls(code);const need=new Set();const q=[...names];while(q.length){const n=q.shift();if(need.has(n))continue;if(!D[n])throw new Error('no top-level '+n);need.add(n);for(const i of freeOf(D[n].s))if(D[i]&&!need.has(i))q.push(i);}
 const order=Object.keys(D).filter(n=>need.has(n)).sort((a,b)=>D[a].s.start-D[b].s.start);return {order,text:order.map(n=>D[n].text).join('\n'),D};}
module.exports={decls,closure};
