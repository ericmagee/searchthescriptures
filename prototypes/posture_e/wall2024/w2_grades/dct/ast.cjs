// W2 grade of pkgDCT: AST proof. For each changed node, the trimmed AST must equal the live AST with only whole list elements removed:
// statements (FunctionDeclaration, VariableDeclaration, ExpressionStatement), declarators, object properties. Every other node, value and order equal.
// Then: removed names still read in the trimmed source; dynamic code (eval, with).
const fs=require('fs');const acorn=require('/opt/node-tools/node_modules/acorn');const walk=require('/opt/node-tools/node_modules/acorn-walk');
const D='w2_grades/dct/';const O={ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true,sourceType:'script'};
const SKIP=new Set(['FunctionDeclaration','VariableDeclaration','ExpressionStatement','VariableDeclarator','Property','EmptyStatement']);
const META=new Set(['start','end','loc','range','raw']);let A,B;const removed=[];
const txtEq=(x,y)=>A.slice(x.start,x.end)===B.slice(y.start,y.end);
function eq(x,y){if(x===y)return true;if(x===null||y===null||typeof x!=='object'||typeof y!=='object')return x===y;
 if(Array.isArray(x)){if(!Array.isArray(y))return false;return listEq(x,y);}
 if(x.type!==y.type)return false;if(x.type&&typeof x.start==='number'&&txtEq(x,y))return true;
 for(const k of Object.keys(x)){if(META.has(k))continue;if(!eq(x[k],y[k]))return false;}return Object.keys(y).filter(k=>!META.has(k)).length===Object.keys(x).filter(k=>!META.has(k)).length;}
function listEq(L,T){let p=0;const rm=[];for(const t of T){let found=false;while(p<L.length){const l=L[p++];if(l&&t&&l.type===t.type&&eq(l,t)){found=true;break;}if(!l||!SKIP.has(l.type))return false;rm.push(l);}if(!found)return false;}
 while(p<L.length){const l=L[p++];if(!l||!SKIP.has(l.type))return false;rm.push(l);}removed.push(...rm);return true;}
let ok=0,bad=0,cuts=0;const kinds={};const reads=[];const dyn=[];let chars=0;
for(const f of fs.readdirSync(D+'live').sort()){const a=fs.readFileSync(D+'live/'+f,'utf8'),b=fs.readFileSync(D+'trim/'+f,'utf8');if(/\beval\s*\(|\bwith\s*\(/.test(b))dyn.push(f);if(a===b)continue;
 A=a;B=b;removed.length=0;const la=acorn.parse(a,O),lb=acorn.parse(b,O);
 if(!eq(la,lb)){bad++;console.log('FAIL',f);continue;}ok++;cuts+=removed.length;chars+=a.length-b.length;
 const names=new Set();for(const n of removed){kinds[n.type]=(kinds[n.type]||0)+1;if(n.type==='FunctionDeclaration')names.add(n.id.name);if(n.type==='VariableDeclaration')n.declarations.forEach(d=>d.id.type==='Identifier'&&names.add(d.id.name));if(n.type==='VariableDeclarator'&&n.id.type==='Identifier')names.add(n.id.name);if(n.type==='ExpressionStatement')console.log('  removed statement',f,JSON.stringify(a.slice(n.start,Math.min(n.end,n.start+120))));}
 const decl=new Set();walk.full(lb,n=>{if((n.type==='FunctionDeclaration'||n.type==='FunctionExpression'||n.type==='ClassDeclaration')&&n.id)decl.add(n.id.name);if(n.type==='VariableDeclarator')walk.full(n.id,m=>{if(m.type==='Identifier')decl.add(m.name);});if(n.params)n.params.forEach(p=>walk.full(p,m=>{if(m.type==='Identifier')decl.add(m.name);}));if(n.type==='CatchClause'&&n.param)walk.full(n.param,m=>{if(m.type==='Identifier')decl.add(m.name);});});
 const used=new Set();walk.ancestor(lb,{Identifier(n,st){const p=st[st.length-2];if(p&&p.type==='MemberExpression'&&p.property===n&&!p.computed)return;if(p&&(p.type==='Property'||p.type==='MethodDefinition')&&p.key===n&&!p.shorthand&&!p.computed)return;used.add(n.name);}});
 for(const nm of names)if(used.has(nm)&&!decl.has(nm))reads.push(f+' '+nm);}
console.log('changed nodes',ok+bad,'| AST proven: trimmed = live minus whole list elements',ok,'| failed',bad,'| elements removed',cuts,JSON.stringify(kinds),'| characters removed in effective sources',chars);
console.log('removed names read in the trimmed source and declared nowhere in it:',reads.length?reads.join(', '):'none');console.log('trimmed sources containing eval( or with(:',dyn.length?dyn.join(', '):'none');
// purity of what was removed: a removed declarator or property whose value is not a function, literal, regex, plain identifier, or a template/array/object of those
// could have run code (a call, a new, a getter) in live that the trimmed source no longer runs.
{const pure=n=>{if(!n)return true;switch(n.type){case 'FunctionExpression':case 'ArrowFunctionExpression':case 'Literal':case 'Identifier':return true;
 case 'TemplateLiteral':return n.expressions.every(pure);case 'ArrayExpression':return n.elements.every(pure);case 'ObjectExpression':return n.properties.every(p=>p.type==='Property'&&!p.computed&&p.kind==='init'&&pure(p.value));
 case 'UnaryExpression':return pure(n.argument);case 'BinaryExpression':case 'LogicalExpression':return pure(n.left)&&pure(n.right);case 'ConditionalExpression':return pure(n.test)&&pure(n.consequent)&&pure(n.alternate);default:return false;}};
 const imp=[];for(const f of fs.readdirSync(D+'live').sort()){const a=fs.readFileSync(D+'live/'+f,'utf8'),b=fs.readFileSync(D+'trim/'+f,'utf8');if(a===b)continue;A=a;B=b;removed.length=0;eq(acorn.parse(a,O),acorn.parse(b,O));
  for(const n of removed){const vals=n.type==='VariableDeclaration'?n.declarations.map(d=>d.init):n.type==='VariableDeclarator'?[n.init]:n.type==='Property'?[n.kind==='init'?n.value:null]:[];if(n.type==='Property'&&(n.computed||n.kind!=='init'))imp.push(f+' property '+a.slice(n.start,n.start+80));
   for(const v of vals)if(!pure(v))imp.push(f+' '+n.type+' '+JSON.stringify(a.slice(n.start,Math.min(n.end,n.start+140))));}}
 console.log('removed elements whose value is not plainly side-effect free:',imp.length);const seen={};for(const x of imp){const k=x.replace(/^\S+ /,'');seen[k]=(seen[k]||[]).concat(x.split(' ')[0]);}for(const [k,v] of Object.entries(seen))console.log('  x'+v.length,k.slice(0,220));}
// stricter: removed names that the trimmed source reads at all, even where some declaration of that name exists elsewhere in the file (needs a scope look)
{const masked=[];for(const f of fs.readdirSync(D+'live').sort()){const a=fs.readFileSync(D+'live/'+f,'utf8'),b=fs.readFileSync(D+'trim/'+f,'utf8');if(a===b)continue;A=a;B=b;removed.length=0;const lb=acorn.parse(b,O);eq(acorn.parse(a,O),lb);
 const names=new Set();for(const n of removed){if(n.type==='FunctionDeclaration')names.add(n.id.name);if(n.type==='VariableDeclaration')n.declarations.forEach(d=>d.id.type==='Identifier'&&names.add(d.id.name));if(n.type==='VariableDeclarator'&&n.id.type==='Identifier')names.add(n.id.name);}
 const used={};walk.ancestor(lb,{Identifier(n,st){const p=st[st.length-2];if(p&&p.type==='MemberExpression'&&p.property===n&&!p.computed)return;if(p&&(p.type==='Property'||p.type==='MethodDefinition')&&p.key===n&&!p.shorthand&&!p.computed)return;if(names.has(n.name))used[n.name]=(used[n.name]||0)+1;}});
 for(const [k,v] of Object.entries(used))masked.push(f+' '+k+' x'+v);}
 console.log('removed names that still occur as identifiers in the trimmed source (a same-named binding elsewhere in the file):',masked.length);masked.forEach(x=>console.log('  ',x));}
// code held in strings: a string or template in the trimmed source that names a removed function with a call "name(", and computed reads of globalThis/this/self
{const hits=[];let nf=0,comp=0;for(const f of fs.readdirSync(D+'live').sort()){const a=fs.readFileSync(D+'live/'+f,'utf8'),b=fs.readFileSync(D+'trim/'+f,'utf8');const lb=acorn.parse(b,O);
 walk.full(lb,n=>{if(n.type==='NewExpression'&&n.callee.type==='Identifier'&&n.callee.name==='Function')nf++;if(n.type==='MemberExpression'&&n.computed&&n.object.type==='Identifier'&&/^(globalThis|self|window|global)$/.test(n.object.name))comp++;if(n.type==='MemberExpression'&&n.computed&&n.object.type==='ThisExpression')comp++;});
 if(a===b)continue;A=a;B=b;removed.length=0;eq(acorn.parse(a,O),lb);const names=new Set();for(const n of removed){if(n.type==='FunctionDeclaration')names.add(n.id.name);if(n.type==='VariableDeclaration')n.declarations.forEach(d=>d.id.type==='Identifier'&&names.add(d.id.name));}
 walk.full(lb,n=>{const s=n.type==='Literal'&&typeof n.value==='string'?n.value:n.type==='TemplateElement'?n.value.cooked:null;if(!s||s.length<4)return;for(const nm of names)if(nm.length>2&&new RegExp('(^|[^A-Za-z0-9_$.])'+nm.replace(/\$/g,'\\$')+'\\s*\\(').test(s))hits.push(f+' '+nm+' in '+JSON.stringify(s.slice(0,100)));});}
 console.log('new Function in trimmed sources:',nf,'| computed reads of globalThis/self/this:',comp,'| strings naming a removed function as a call:',hits.length);hits.slice(0,20).forEach(x=>console.log('  ',x));}
