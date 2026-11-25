const fs=require('fs'),cr=require('crypto');const acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const w=JSON.parse(fs.readFileSync(process.argv[2]));const W=w.data&&w.data.nodes?w.data:w;
const sha=s=>cr.createHash('sha256').update(s).digest('hex').slice(0,12);const got={};
function scan(src,where){let ast;try{ast=acorn.parse(src,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});}catch(e){return;}
 const walk=n=>{if(!n||typeof n.type!=='string')return;if(n.type==='VariableDeclarator'&&n.id&&n.id.name==='__RL'&&n.init){const seg=src.slice(n.start,n.end);const tk=[];for(const x of acorn.tokenizer(seg,{ecmaVersion:'latest'}))tk.push(seg.slice(x.start,x.end));const t=tk.join(' ');const h=sha(t);(got[h]=got[h]||{t,w:[]}).w.push(where);}
  for(const k in n){const v=n[k];if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v.type==='string')walk(v);}};walk(ast);}
const U=T.unpack(W);for(const k of Object.keys(U.M))scan(T.rb(U.L,U.M[k]),'lib:'+k);
for(const n of W.nodes){if(n.name==='Shared Library')continue;const j=n.parameters&&n.parameters.jsCode;if(j)scan(j,n.name);}
for(const h in got)console.log(h,got[h].w.length,got[h].w.slice(0,4).join('; '));
const hs=Object.keys(got);if(hs.length>=2){const a=got[hs[0]].t.split(' '),b=got[hs[1]].t.split(' ');let i=0;while(a[i]===b[i])i++;let j=0;while(a[a.length-1-j]===b[b.length-1-j])j++;console.log('DIFF',hs[0],a.slice(i,a.length-j).join(' ').slice(0,400));console.log('DIFF',hs[1],b.slice(i,b.length-j).join(' ').slice(0,400));}
