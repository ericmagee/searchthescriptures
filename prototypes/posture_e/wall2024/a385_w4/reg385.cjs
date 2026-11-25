// ASK 385 (Wall 8098): one-copy check. For every name in registry.json, hash every copy (comments stripped) across the Shared Library
// (each stub's rebuilt source) and every code node, in every workflow file given (engine, ASK 379 child). FAIL when two copies differ,
// Copies are compared token by token (comments and whitespace ignored), unless the pair of shas is listed in registry.accepted with a reason and a Wall pointer. Exit code 1 on FAIL.
const fs=require('fs'),cr=require('crypto'),path=require('path');const acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const args=process.argv.slice(2);let REG=path.join(__dirname,'registry.json');const files=[];
for(let i=0;i<args.length;i++){if(args[i]==='--registry')REG=args[++i];else files.push(args[i]);}
const R=JSON.parse(fs.readFileSync(REG));const NAMES=new Set(R.names);
const rd=p=>{let x=JSON.parse(fs.readFileSync(p));if(x.result)x=x.result;if(x.data&&x.data.nodes)x=x.data;return x;};
const sha=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
function copies(src,where,out,errs){let cm=[];let ast;
 try{ast=acorn.parse(src,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true,onComment:(b,t,s,e)=>cm.push([s,e])});}catch(e){errs.push(where+': '+e.message);return;}
 const take=(name,s,e)=>{const seg=src.slice(s,e);const tk=[];for(const x of acorn.tokenizer(seg,{ecmaVersion:'latest'}))tk.push(seg.slice(x.start,x.end));const t=tk.join(' '); /* tokens only: comments and whitespace do not count */
  (out[name]=out[name]||[]).push({where,sha:sha(t),len:t.length});};
 const walk=n=>{if(!n||typeof n.type!=='string')return;
  if(n.type==='FunctionDeclaration'&&n.id&&NAMES.has(n.id.name))take(n.id.name,n.start,n.end);
  if(n.type==='VariableDeclarator'&&n.id&&n.id.type==='Identifier'&&NAMES.has(n.id.name)&&n.init)take(n.id.name,n.start,n.end);
  for(const k in n){const v=n[k];if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v.type==='string')walk(v);}};
 walk(ast);}
const out={},errs=[];const perFile={};
/* ASK 578: a child with no Shared Library node whose Library Check reads __p.lib is served the engine library in the call; its library copies are the engine's */
const WS=files.map(rd);const ENG=WS.find(w=>w.nodes.some(n=>n.name==='Shared Library'));
const served=w=>!w.nodes.some(n=>n.name==='Shared Library')&&w.nodes.some(n=>/^Library Check/.test(n.name)&&/__p\.lib/.test((n.parameters&&n.parameters.jsCode)||''));
files.forEach((f,i)=>{const w=WS[i];const tag=path.basename(f);perFile[tag]=w;
 if(served(w)&&ENG){console.log('SERVED '+tag+': no Shared Library node; library copies counted from the engine library sent in the call (ASK 578)');const U=T.unpack(ENG);const seen=new Set();
  for(const k of Object.keys(U.M)){const s=T.rb(U.L,U.M[k]);const h=sha(s);if(seen.has(h))continue;seen.add(h);copies(s,tag+' served:'+k,out,errs);}}
 for(const n of w.nodes){const j=n.parameters&&n.parameters.jsCode;if(typeof j!=='string')continue;
  if(n.name==='Shared Library'){const U=T.unpack(w);const seen=new Set();
   for(const k of Object.keys(U.M)){const s=T.rb(U.L,U.M[k]);const h=sha(s);if(seen.has(h))continue;seen.add(h);copies(s,tag+' lib:'+k,out,errs);}}
  else copies(j,tag+' '+n.name,out,errs);}});
/* W3 condition: a file holding 0 copies of a registered name FAILs (a wrong --child file must not pass) */
let zero=0;for(const tag of Object.keys(perFile))for(const name of R.names){const c=(out[name]||[]).filter(x=>x.where.startsWith(tag+' ')).length;if(!c){zero++;console.log('FAIL '+tag+': 0 copies of '+name);}}
const acc=(R.accepted||[]).map(a=>[a.name,[a.sha_a,a.sha_b].sort().join('|'),a]);let fail=0;
for(const name of R.names){const L=out[name]||[];const by={};for(const c of L)(by[c.sha]=by[c.sha]||[]).push(c.where);const shas=Object.keys(by);
 console.log('NAME '+name+': '+L.length+' copies, '+shas.length+' text(s)');
 shas.forEach(s=>console.log('  '+s+' x'+by[s].length+'  e.g. '+by[s].slice(0,3).join('; ')));
 for(let i=0;i<shas.length;i++)for(let j=i+1;j<shas.length;j++){const key=[shas[i],shas[j]].sort().join('|');const a=acc.find(x=>x[0]===name&&x[1]===key);
  if(a)console.log('  ACCEPTED '+shas[i]+' vs '+shas[j]+': '+a[2].reason+' ('+a[2].wall+')');else{fail++;console.log('  FAIL '+shas[i]+' vs '+shas[j]);}}}
if(errs.length)console.log('PARSE ERRORS '+errs.length+': '+errs.slice(0,3).join(' | '));
fail+=zero;console.log(fail?'RESULT: FAIL ('+fail+' failing check(s))':'RESULT: PASS');process.exitCode=fail?1:0;
