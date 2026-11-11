// free names of each newly packed source (approximate scope analysis with acorn): any name that is neither declared in the source, nor a JavaScript global, nor $ / $input
const fs=require('fs');const acorn=require('/opt/node-tools/node_modules/acorn');const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};
const A=g('/mnt/project-files/wall2024/fetchback_live_s119.json'),B=g('/mnt/project-files/wall2024/parent_s119_R1b.json');
const G=new Set(Object.getOwnPropertyNames(globalThis).concat(['undefined','NaN','Infinity','arguments','$','$input']));
const free=src=>{const ast=acorn.parse('(async()=>{\n'+src+'\n})()',{ecmaVersion:'latest'});const decl=new Set(),refs=new Map();
 const pat=p=>{if(!p)return;if(p.type==='Identifier')decl.add(p.name);else if(p.type==='ObjectPattern')p.properties.forEach(q=>pat(q.value||q.argument));else if(p.type==='ArrayPattern')p.elements.forEach(pat);else if(p.type==='RestElement')pat(p.argument);else if(p.type==='AssignmentPattern')pat(p.left);};
 const walk=(n,par,key)=>{if(!n||typeof n.type!=='string')return;
  if(n.type==='VariableDeclarator')pat(n.id);if(/Function/.test(n.type)){if(n.id)decl.add(n.id.name);n.params.forEach(pat);}if(n.type==='CatchClause')pat(n.param);if(n.type==='ClassDeclaration'&&n.id)decl.add(n.id.name);
  if(n.type==='Identifier'){const prop=par&&((par.type==='MemberExpression'&&key==='property'&&!par.computed)||(par.type==='Property'&&key==='key'&&!par.computed)||(par.type==='MethodDefinition'&&key==='key')||(par.type==='LabeledStatement')||(par.type==='BreakStatement')||(par.type==='ContinueStatement'));if(!prop)refs.set(n.name,(refs.get(n.name)||0)+1);}
  for(const k in n){const v=n[k];if(k==='type'||!v||typeof v!=='object')continue;if(Array.isArray(v))v.forEach(x=>walk(x,n,k));else walk(v,n,k);}};
 walk(ast,null,null);return [...refs.keys()].filter(x=>!decl.has(x)&&!G.has(x));};
let n=0,bad=0;for(const b of B.nodes){const a=A.nodes.find(x=>x.name===b.name);if(a.parameters.jsCode===b.parameters.jsCode||b.name==='Shared Library')continue;n++;let f;try{f=free(a.parameters.jsCode);}catch(e){f=['PARSE '+e.message];}if(f.length){bad++;console.log(b.name,'FREE:',f.join(', '));}}
console.log('newly packed sources read',n,'| with a free name beyond $ and $input',bad);
// control: the check must see a planted free name
console.log('control (planted $json and items):',free('const a=$json.x;return items.map(i=>i);').join(','));
