const fs=require('fs'),T=require('../tools/lib.cjs'),acorn=require('../tools/node_modules/acorn');let w=JSON.parse(fs.readFileSync(process.argv[2]));w=w.data||w;const U=T.unpack(w);
const src=T.rb(U.L,U.M['Judge Enforcer Build']);const ast=acorn.parse(src,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
let code='';const want=new Set(['__RL','ri5Rd2024','ri6Col2024']);
const walk=n=>{if(!n||typeof n.type!=='string')return;if(n.type==='FunctionDeclaration'&&want.has(n.id&&n.id.name)){code+=src.slice(n.start,n.end)+'\n';return;}if(n.type==='VariableDeclaration'&&n.declarations.some(d=>d.id.name&&want.has(d.id.name))){code+=src.slice(n.start,n.end)+'\n';return;}for(const k in n){const v=n[k];if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v.type==='string')walk(v);}};walk(ast);
const F=new Function(code+'\nreturn {ri5Rd2024,ri6Col2024};')();
for(const l of fs.readFileSync(process.argv[3],'utf8').split('\n').filter(Boolean)){const r=F.ri5Rd2024(l);console.log(JSON.stringify(l.slice(0,60)),'| ri5:',r&&r.form,r&&JSON.stringify(r.f).slice(0,120),'| ri6:',JSON.stringify(F.ri6Col2024(l,/(?!)/,['DEFENDER LINK BROKEN'])));}
