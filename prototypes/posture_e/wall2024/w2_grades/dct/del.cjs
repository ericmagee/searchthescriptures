// W2 grade of pkgDCT: for each changed node, align the token streams (GNU diff on one token per line) and require that the trimmed source is the live source
// with deletions only, each deletion being whole declarations / declarators / object properties (one separating comma allowed). Then list every removed name
// that the trimmed source still reads as a bare identifier, and count eval / new Function / with in the trimmed sources.
const fs=require('fs');const acorn=require('/opt/node-tools/node_modules/acorn');const walk=require('/opt/node-tools/node_modules/acorn-walk');const cp=require('child_process');
const D='w2_grades/dct/';const O={ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true,sourceType:'script',locations:false};
const toks=s=>{const t=[];for(const k of acorn.tokenizer(s,O))t.push(k);return t;};const tv=(s,k)=>s.slice(k.start,k.end);
let bad=0,hunks=0,nodes=0,kinds={},stillRead=[],dyn={};const tmp='/tmp/claude-0/dct_tok';fs.mkdirSync(tmp,{recursive:true});
for(const f of fs.readdirSync(D+'live').sort()){const a=fs.readFileSync(D+'live/'+f,'utf8'),b=fs.readFileSync(D+'trim/'+f,'utf8');
 const tb=toks(b);let ast;
 // dynamic code in trimmed
 const ev=(b.match(/\beval\s*\(/g)||[]).length,nf=(b.match(/new\s+Function\s*\(/g)||[]).length,wi=(b.match(/\bwith\s*\(/g)||[]).length;if(ev||wi)dyn[f]={ev,nf,wi};
 if(a===b)continue;nodes++;const ta=toks(a);ast=acorn.parse(a,O);
 fs.writeFileSync(tmp+'/a',ta.map(k=>JSON.stringify(tv(a,k))).join('\n')+'\n');fs.writeFileSync(tmp+'/b',tb.map(k=>JSON.stringify(tv(b,k))).join('\n')+'\n');
 let d='';try{d=cp.execSync('diff '+tmp+'/a '+tmp+'/b',{maxBuffer:1e9}).toString();}catch(e){d=e.stdout.toString();}
 // allowed whole nodes in live
 const ok=new Map();walk.full(ast,n=>{if(['FunctionDeclaration','VariableDeclaration','VariableDeclarator','Property','ExpressionStatement'].includes(n.type))ok.set(n.start+':'+n.end,n);});
 const removedNames=new Set();
 for(const line of d.split('\n')){const m=line.match(/^(\d+)(?:,(\d+))?([adc])(\d+)(?:,(\d+))?$/);if(!m)continue;hunks++;
  if(m[3]!=='d'){bad++;console.log('NOT A DELETION',f,line);continue;}
  let i=+m[1]-1,j=(m[2]?+m[2]:+m[1])-1;// token indices in live
  const cover=(i,j)=>{// split the token range into consecutive whole allowed nodes, allowing commas/semicolons between
   let p=ta[i].start;const E=ta[j].end;const got=[];let guard=0;
   while(p<E&&guard++<100000){while(p<E&&/[\s,;]/.test(a[p]))p++;if(p>=E)break;let best=null;for(const [k,n] of ok){if(n.start===p&&n.end<=E&&(!best||n.end>best.end))best=n;}if(!best)return null;got.push(best);p=best.end;}
   return got;};
  // diff may shift a deletion by a few tokens (identical tokens either side); try small shifts
  const T=k=>tv(a,ta[k]);const cands=[[i,j]];{let x=i,y=j;while(x>0&&T(x-1)===T(y)){x--;y--;cands.push([x,y]);}x=i;y=j;while(y+1<ta.length&&T(x)===T(y+1)){x++;y++;cands.push([x,y]);}}
  let got=null;for(const [ii,jj] of cands){got=cover(ii,jj);if(got)break;}
  if(!got){bad++;console.log('NOT WHOLE NODES',f,line,JSON.stringify(a.slice(ta[i].start,Math.min(ta[j].end,ta[i].start+160))));continue;}
  for(const n of got){kinds[n.type]=(kinds[n.type]||0)+1;if(n.type==='FunctionDeclaration')removedNames.add(n.id.name);else if(n.type==='VariableDeclarator')removedNames.add(n.id.name);else if(n.type==='VariableDeclaration')n.declarations.forEach(x=>removedNames.add(x.id.name));else if(n.type==='Property'&&n.key)removedNames.add('.'+(n.key.name||n.key.value));else kinds['other:'+n.type]=1;}}
 // still read? bare identifiers in trimmed that name a removed binding and are not declared in trimmed
 const declared=new Set();const bt=acorn.parse(b,O);walk.full(bt,n=>{if(n.type==='FunctionDeclaration'&&n.id)declared.add(n.id.name);if(n.type==='VariableDeclarator'&&n.id.type==='Identifier')declared.add(n.id.name);});
 const ids=new Set();walk.full(bt,n=>{if(n.type==='Identifier')ids.add(n.name);});
 for(const nm of removedNames){if(nm[0]==='.'){const k=nm.slice(1);if(new RegExp('\\.'+k.replace(/[$]/g,'\\$')+'\\b').test(b)||b.includes("['"+k+"']")||b.includes('["'+k+'"]'))stillRead.push(f+' prop '+k);continue;}
  if(ids.has(nm)&&!declared.has(nm))stillRead.push(f+' '+nm);}}
console.log('changed nodes',nodes,'| deletion hunks',hunks,'| hunks not whole-node deletions',bad,'| removed node kinds',JSON.stringify(kinds));
console.log('removed names still read as identifiers or properties in the trimmed source (not redeclared):',stillRead.length);stillRead.slice(0,40).forEach(x=>console.log('  ',x));
console.log('trimmed sources with eval( or with(:',JSON.stringify(dyn));
