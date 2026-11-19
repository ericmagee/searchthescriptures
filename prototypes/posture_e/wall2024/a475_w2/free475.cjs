// ASK 475: list the names the inline LAY text reads but does not declare (an over-approximation of its free names).
// Any such name other than a JS global would be lost when the text is rebuilt with new Function; $ is passed in by the loader.
// usage: node a475_w2/free475.cjs ENGINE.json
const fs=require('fs'),path=require('path');const acorn=require(path.join(__dirname,'../tools/node_modules/acorn'));
let w=JSON.parse(fs.readFileSync(process.argv[2]));if(w.data&&w.data.nodes)w=w.data;const c=w.nodes.find(n=>n.name==='D2B Build').parameters.jsCode;
const a=c.indexOf('const LAY=(()=>{');const P='(async function(){';const ast0=acorn.parse(P+c+'\n})',{ecmaVersion:'latest'});let hit;
(function w0(n){if(!n||typeof n!=='object')return;if(n.type==='VariableDeclaration'&&n.start-P.length===a)hit=n;for(const k in n){const v=n[k];if(Array.isArray(v))v.forEach(w0);else if(v&&typeof v.type==='string')w0(v);}})(ast0);
const src=c.slice(a,hit.end-P.length);const ast=acorn.parse(src,{ecmaVersion:'latest'});const decl=new Set(),refs=new Set();
function pat(p){if(!p)return;if(p.type==='Identifier')decl.add(p.name);else if(p.type==='ObjectPattern')p.properties.forEach(q=>pat(q.value||q.argument));else if(p.type==='ArrayPattern')p.elements.forEach(pat);else if(p.type==='AssignmentPattern')pat(p.left);else if(p.type==='RestElement')pat(p.argument);}
(function w1(n,par,key){if(!n||typeof n!=='object')return;if(n.type==='VariableDeclarator')pat(n.id);
 if(/Function/.test(n.type)){if(n.id)decl.add(n.id.name);n.params.forEach(pat);}if(n.type==='CatchClause'&&n.param)pat(n.param);
 if(n.type==='Identifier'){const prop=par&&((par.type==='MemberExpression'&&key==='property'&&!par.computed)||(par.type==='Property'&&key==='key'&&!par.computed&&!par.shorthand));if(!prop)refs.add(n.name);}
 for(const k in n){const v=n[k];if(Array.isArray(v))v.forEach(x=>w1(x,n,k));else if(v&&typeof v.type==='string')w1(v,n,k);}})(ast);
const free=[...refs].filter(x=>!decl.has(x));const nonGlobal=free.filter(x=>!(x in globalThis)&&x!=='undefined');
console.log('free names:',free.join(', '));console.log('not JS globals:',nonGlobal.join(', ')||'none');process.exit(nonGlobal.every(x=>x==='$')?0:1);
