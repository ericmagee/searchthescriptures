// pkgDCT static checks on a measure.sh work dir (W1). For every trimmed node:
// S1 parses; S2 no identifier left that names a removed function and is not still declared; S3 no ".name" property read left for a removed name
// S4 runner model: the trimmed effective code needs no node the live stub does not send. Usage: node pkgDCT/static_check.cjs <W> <fetchback> <out.json>
const fs=require('fs');const acorn=require('/opt/node-tools/node_modules/acorn');const walk=require('/opt/node-tools/node_modules/acorn-walk');
const R=require('../pkgLIB/runner_model.cjs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');
const [W,FB,OUT]=process.argv.slice(2);const rep=JSON.parse(fs.readFileSync(W+'/trim.report.json','utf8'));const meta=JSON.parse(fs.readFileSync(W+'/eff.meta.json','utf8'));
let n=0,bad=[];
for(const [f,x] of Object.entries(rep)){if(!x.removed)continue;n++;const t=fs.readFileSync(W+'/trim/'+f,'utf8');const names=new Set((x.dead||[]).map(d=>d.split(' ')[0]));
 let ast;try{ast=acorn.parse('(async()=>{\n'+t+'\n})',{ecmaVersion:'latest',allowReturnOutsideFunction:true});}catch(e){bad.push(f+' S1 parse '+e.message);continue;}
 const declared=new Set(),used=[],props=[];
 walk.fullAncestor(ast,(node,anc)=>{const p=anc[anc.length-2];
  if(node.type==='Identifier'){const isKey=p&&((p.type==='Property'&&p.key===node&&!p.computed&&!p.shorthand)||(p.type==='MemberExpression'&&p.property===node&&!p.computed)||(p.type==='MethodDefinition'&&p.key===node));
   const isDecl=p&&((p.type==='FunctionDeclaration'||p.type==='FunctionExpression'||p.type==='ClassDeclaration')&&p.id===node||p.type==='VariableDeclarator'&&p.id===node);
   if(isDecl)declared.add(node.name);if(p&&p.type==='MemberExpression'&&p.property===node&&!p.computed&&names.has(node.name))props.push(node.name);
   if(!isKey&&!isDecl&&names.has(node.name))used.push(node.name);}
  if(node.type==='Property'&&!node.computed&&node.key&&node.key.type==='Identifier'&&node.value&&node.value.type!=='Identifier')declared.add(node.key.name);});
 const dang=[...new Set(used)].filter(u=>!declared.has(u));const pr=[...new Set(props)].filter(u=>!declared.has(u));
 if(dang.length)bad.push(f+' S2 dangling '+dang.join(','));if(pr.length)bad.push(f+' S3 property read of a removed name '+pr.join(','));}
console.log('S1-S3 nodes checked',n,'| problems',bad.length);bad.forEach(b=>console.log('  ',b));
const A=L(FB),B=L(OUT);let rc=0,rbad=[];for(const nd of B.w.nodes){if(!nd.parameters.jsCode||nd.name==='Shared Library')continue;rc++;const st=R.needs(nd.parameters.jsCode),eff=R.needs(B.code(nd.name)),lv=R.needs(A.w.nodes.find(z=>z.name===nd.name).parameters.jsCode);
 const miss=[...eff.nodes].filter(m=>!st.all&&!st.nodes.has(m));if(miss.length||!st.parsed||JSON.stringify([...st.nodes].sort())!==JSON.stringify([...lv.nodes].sort()))rbad.push(nd.name+' miss '+miss.join(',')+' parsed '+st.parsed);}
console.log('S4 runner: code nodes',rc,'| fail',rbad.length);rbad.forEach(b=>console.log('  ',b));
