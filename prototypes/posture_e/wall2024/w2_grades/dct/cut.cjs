// W2 grade of pkgDCT: prove each trimmed source equals the live source with whole-node spans cut out, character for character.
// Allowed spans (from the LIVE AST): a whole FunctionDeclaration / VariableDeclaration / ExpressionStatement; one declarator or one object property
// together with one neighbouring comma. Greedy alignment: on a mismatch, back up at most 400 characters to a span start and accept the span if the next
// 400 characters after it match. Also lists removed names the trimmed source still reads, and dynamic code (eval, with) in the trimmed sources.
const fs=require('fs');const acorn=require('/opt/node-tools/node_modules/acorn');const walk=require('/opt/node-tools/node_modules/acorn-walk');
const D='w2_grades/dct/';const O={ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true,sourceType:'script'};
let fails=0,cutsN=0,nodes=0,chars=0;const kinds={};const reads=[];const dyn={};
for(const f of fs.readdirSync(D+'live').sort()){const a=fs.readFileSync(D+'live/'+f,'utf8'),b=fs.readFileSync(D+'trim/'+f,'utf8');
 if(/\beval\s*\(|\bwith\s*\(/.test(b))dyn[f]=1;if(a===b)continue;nodes++;
 const ast=acorn.parse(a,O);const sp=new Map();const add=(s,e,k,n)=>{(sp.get(s)||sp.set(s,[]).get(s)).push({e,k,n});};
 walk.full(ast,n=>{if(['FunctionDeclaration','VariableDeclaration','ExpressionStatement'].includes(n.type))add(n.start,n.end,n.type,n);
  const list=n.type==='VariableDeclaration'?n.declarations:n.type==='ObjectExpression'?n.properties:null;
  if(list&&list.length>1)list.forEach((d,i)=>{const k=n.type==='VariableDeclaration'?'Declarator':'Property';if(i<list.length-1)add(d.start,list[i+1].start,k,d);if(i>0)add(list[i-1].end,d.end,k,d);});});
 // depth-first alignment with backtracking: a full alignment is the proof; a failure only says none was found
 const cands=(i,j)=>{const out=[];for(let back=0;back<=400;back++){const s=i-back;if(s<0)break;const L=sp.get(s);if(!L)continue;for(const c of L)if(c.e>i)out.push({c,jj:j-back});}
  const score=x=>{let k=0;while(k<400&&x.c.e+k<a.length&&x.jj+k<b.length&&a[x.c.e+k]===b[x.jj+k])k++;return k;};out.forEach(x=>x.s=score(x));return out.filter(x=>x.s>0||sp.has(x.c.e)||(x.c.e===a.length&&x.jj===b.length)).sort((x,y)=>y.s-x.s||x.c.e-y.c.e);};
 const st=[];let i=0,j=0,ok=true,steps=0;let last=null;
 for(;;){while(i<a.length&&j<b.length&&a[i]===b[j]){i++;j++;}if(i===a.length&&j===b.length)break;
  if(++steps>200000){ok=false;last='step cap';break;}
  const cs=cands(i,j);if(cs.length){st.push({cs,k:0,i,j});const x=cs[0];i=x.c.e;j=x.jj;continue;}
  // backtrack
  let moved=false;while(st.length){const t=st[st.length-1];t.k++;if(t.k<t.cs.length){const x=t.cs[t.k];i=x.c.e;j=x.jj;moved=true;break;}st.pop();}
  if(!moved){ok=false;last='at live '+i+' trim '+j+' '+JSON.stringify(a.slice(i,i+80))+' VS '+JSON.stringify(b.slice(j,j+80));break;}}
 const cut=st.map(t=>t.cs[t.k].c);if(!ok)console.log('FAIL',f,last);
 if(!ok){fails++;continue;}cutsN+=cut.length;chars+=a.length-b.length;
 const names=new Set();for(const c of cut){kinds[c.k]=(kinds[c.k]||0)+1;const n=c.n;if(n.type==='FunctionDeclaration')names.add(n.id.name);else if(n.type==='VariableDeclaration')n.declarations.forEach(d=>d.id.name&&names.add(d.id.name));else if(n.type==='VariableDeclarator'&&n.id.name)names.add(n.id.name);}
 // a removed name the trimmed source reads (Identifier not a property key / member property) and does not declare again
 const bt=acorn.parse(b,O);const decl=new Set();walk.full(bt,n=>{if((n.type==='FunctionDeclaration'||n.type==='FunctionExpression')&&n.id)decl.add(n.id.name);if(n.type==='VariableDeclarator'&&n.id.type==='Identifier')decl.add(n.id.name);for(const p of (n.params||[]))if(p.type==='Identifier')decl.add(p.name);});
 const used=new Set();walk.ancestor(bt,{Identifier(n,st){const p=st[st.length-2];if(p&&p.type==='MemberExpression'&&p.property===n&&!p.computed)return;if(p&&p.type==='Property'&&p.key===n&&!p.shorthand)return;used.add(n.name);}});
 for(const nm of names)if(used.has(nm)&&!decl.has(nm))reads.push(f+' '+nm);}
console.log('changed nodes',nodes,'| proven as whole-node cuts',nodes-fails,'| failed',fails,'| cuts',cutsN,'| characters removed (effective sources)',chars,'| kinds',JSON.stringify(kinds));
console.log('removed names still read in the trimmed source and not declared there:',reads.length?reads.join(', '):'none');console.log('trimmed sources with eval( or with(:',Object.keys(dyn).length?Object.keys(dyn).join(', '):'none');
