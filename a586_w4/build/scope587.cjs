// ASK 587: scope check. For each joined library source, parse with acorn and find, for every use of __cecX and __cecU586, whether a declaration is in an enclosing scope.
const acorn=require('/opt/node-tools/node_modules/acorn');const walk=(()=>{try{return require('/opt/node-tools/node_modules/acorn-walk');}catch(e){return null;}})();
const fs=require('fs');const {src,cut}=require('./libpatch.js');
const file=process.argv[2];const W=JSON.parse(fs.readFileSync(file));const {M}=cut(W);let bad=0,uses=0;
function check(code,name){let ast;try{ast=acorn.parse('async function __w(){'+code+'\n}',{ecmaVersion:'latest',allowReturnOutsideFunction:true});}catch(e){console.log('PARSE',name,e.message);bad++;return;}
 // collect scopes: function bodies and blocks; record declarations and identifier uses with their ancestor chain
 const out=[];(function rec(n,anc){if(!n||typeof n.type!=='string')return;const a=anc.concat([n]);
  if(n.type==='Identifier'&&(n.name==='__cecX'||n.name==='__cecU586'))out.push({n,anc:a});
  for(const k of Object.keys(n)){const v=n[k];if(Array.isArray(v))v.forEach(x=>x&&typeof x.type==='string'&&rec(x,a));else if(v&&typeof v.type==='string')rec(v,a);}})(ast,[]);
 const decl=(scope,nm)=>{const body=scope.type==='Program'?scope.body:scope.type==='BlockStatement'?scope.body:scope.type.includes('Function')?(scope.body.body||[]):scope.type==='SwitchCase'?scope.consequent:[];
  for(const s of body){if(s.type==='VariableDeclaration'&&s.declarations.some(d=>d.id.type==='Identifier'&&d.id.name===nm))return true;if(s.type==='FunctionDeclaration'&&s.id&&s.id.name===nm)return true;}
  if(scope.type&&scope.type.includes('Function')&&scope.params&&scope.params.some(p=>p.type==='Identifier'&&p.name===nm))return true;return false;};
 for(const u of out){const p=u.anc[u.anc.length-2];if(p&&p.type==='VariableDeclarator'&&p.id===u.n)continue;if(p&&p.type==='FunctionDeclaration'&&p.id===u.n)continue;if(p&&p.type==='MemberExpression'&&p.property===u.n&&!p.computed)continue;
  uses++;const ok=u.anc.slice(0,-1).some(s=>decl(s,u.n.name));if(!ok){bad++;console.log('NOT IN SCOPE',name,u.n.name,'at',u.n.start);}}}
for(const k of Object.keys(M))check(src(W,k),k);
console.log(file,'sources',Object.keys(M).length,'uses',uses,'out of scope',bad);process.exit(bad?1:0);
