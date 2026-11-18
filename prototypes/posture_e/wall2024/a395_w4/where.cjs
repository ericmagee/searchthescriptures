// ASK 395: where each __RL copy lives (node inline, or stub: library line range or own text), per workflow file
const fs=require('fs'),cr=require('crypto');const acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const sha=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);
const tok=seg=>{const tk=[];for(const x of acorn.tokenizer(seg,{ecmaVersion:'latest'}))tk.push(seg.slice(x.start,x.end));return tk.join(' ');};
const find=src=>{const ast=acorn.parse(src,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});const r=[];
 const walk=n=>{if(!n||typeof n.type!=='string')return;if(n.type==='VariableDeclarator'&&n.id&&n.id.name==='__RL'&&n.init)r.push([n.start,n.end]);for(const k in n){const v=n[k];if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v.type==='string')walk(v);}};walk(ast);return r;};
for(const f of process.argv.slice(2)){const w=JSON.parse(fs.readFileSync(f));const U=T.unpack(w);
 for(const n of w.nodes){const j=n.parameters&&n.parameters.jsCode;if(typeof j!=='string'||n.name==='Shared Library')continue;for(const [s,e] of find(j))console.log(f.split('/').pop(),'NODE',n.name,sha(tok(j.slice(s,e))));}
 for(const k of Object.keys(U.M)){const src=T.rb(U.L,U.M[k]);for(const [s,e] of find(src)){
  // locate which p entries cover [s,e]
  let off=0;const cov=[];for(const p of U.M[k].p){const t=typeof p==='number'?U.L[p]:(typeof p[0]==='string'?p[0]:U.L.slice(p[0],p[1]+1).join('\n'));const a=off,b=off+t.length;if(b>s&&a<e)cov.push(typeof p==='number'?'L'+p:(typeof p[0]==='string'?'OWN('+p[0].length+')':'L'+p[0]+'-'+p[1]));off=b+1;}
  console.log(f.split('/').pop(),'STUB',k,sha(tok(src.slice(s,e))),cov.join(','));}}}
