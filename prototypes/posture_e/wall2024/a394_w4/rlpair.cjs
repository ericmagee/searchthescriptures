const fs=require('fs'),acorn=require('../tools/node_modules/acorn'),T=require('../tools/lib.cjs');
let w=JSON.parse(fs.readFileSync(process.argv[2]));w=w.data||w;const U=T.unpack(w);
const srcOf=k=>k.startsWith('lib:')?T.rb(U.L,U.M[k.slice(4)]):w.nodes.find(n=>n.name===k).parameters.jsCode;
const toks=src=>{const ast=acorn.parse(src,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});let r;
 const walk=n=>{if(r||!n||typeof n.type!=='string')return;if(n.type==='VariableDeclarator'&&n.id&&n.id.name==='__RL'&&n.init){const seg=src.slice(n.start,n.end);r=[...acorn.tokenizer(seg,{ecmaVersion:'latest'})].map(x=>seg.slice(x.start,x.end));return;}for(const k in n){const v=n[k];if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v.type==='string')walk(v);}};walk(ast);return r;};
const a=toks(srcOf(process.argv[3])),b=toks(srcOf(process.argv[4]));fs.writeFileSync(process.argv[5],JSON.stringify([a,b]));
