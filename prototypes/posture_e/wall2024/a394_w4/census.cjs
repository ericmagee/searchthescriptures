// ASK 394 item 6.1: census of collision-line readers in the engine (s262) and the child, cited by stub/node and enclosing name.
const fs=require('fs'),acorn=require('../tools/node_modules/acorn');const {unpack,rb}=require('../tools/lib.cjs');
const walk={fullAncestor:(root,cb)=>{const st=[];const go=n=>{if(!n||typeof n.type!=='string')return;cb(n,null,st);st.push(n);for(const k in n){if(k==='type'||k==='start'||k==='end')continue;const v=n[k];if(Array.isArray(v))v.forEach(go);else if(v&&typeof v==='object'&&typeof v.type==='string')go(v);}st.pop();};go(root);}};
const files={engine:'rdf/fetchback_s262.json',child:'rdf/child_live_dry385.json'};
const isCol=src=>/vs/i.test(src)&&/C/.test(src)&&/\\d|0-9|'\+n\+'/.test(src)&&/D/.test(src);
const hits={};
const scan=(code,where)=>{let ast;try{ast=acorn.parse(code,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true,locations:false});}catch(e){console.error('PARSE FAIL',where,e.message);return;}
 const anc=[];walk.fullAncestor(ast,(node,st,ancestors)=>{let re=null;if(node.type==='Literal'&&node.regex)re=node.regex.pattern;else if(node.type==='NewExpression'&&node.callee.name==='RegExp'&&node.arguments[0]){const a=node.arguments[0];const t=code.slice(a.start,a.end);if(/vs/.test(t))re='new RegExp('+t.slice(0,200)+')';}
  if(!re||!isCol(re))return;let name='(top level)';for(let i=ancestors.length-1;i>=0;i--){const a=ancestors[i];if(a.type==='VariableDeclarator'&&a.id&&a.id.name){name=a.id.name;break;}if(a.type==='FunctionDeclaration'&&a.id){name=a.id.name;break;}if(a.type==='Property'&&a.key&&(a.key.name||a.key.value)){name='prop '+(a.key.name||a.key.value);break;}if(a.type==='AssignmentExpression'&&a.left.type==='Identifier'){name=a.left.name;break;}}
  const inRi6=ancestors.some(a=>a.type==='CallExpression'&&a.callee&&/^ri[56](Col|Rd)2024$/.test(a.callee.name||''));
  const k=name+'||'+re;(hits[k]=hits[k]||{name,re,inRi6,where:new Set()}).where.add(where);});};
for(const [wk,f] of Object.entries(files)){const w=JSON.parse(fs.readFileSync(f));const {L,M}=unpack(w);
 for(const n of w.nodes){if(n.name==='Shared Library')continue;const c=n.parameters&&n.parameters.jsCode;if(!c)continue;
  const mk=c.match(/^\/\*LIB:[^*]*\*\//);/* inline code only; stubs come from MAP */ if(M[n.name]){continue;}scan(c,wk+' node '+n.name);}
 for(const [node,m] of Object.entries(M)){scan(rb(L,m),wk+' lib:'+node);}
 // nodes in MAP also carry inline code after the stub? record mapped nodes whose jsCode is not just the loader
}
const out=Object.values(hits).sort((a,b)=>a.name.localeCompare(b.name));
fs.writeFileSync('a394/census.json',JSON.stringify(out.map(h=>({...h,where:[...h.where]})),null,1));
console.log('collision-line regex sites (distinct name+pattern):',out.length);
out.forEach(h=>console.log('-',h.name,h.inRi6?'[inside ri5/ri6 call: fallback]':'[own path]','| '+[...h.where].length+' places | e.g. '+[...h.where].slice(0,3).join('; ')+'\n    /'+h.re.slice(0,230)+'/'));
