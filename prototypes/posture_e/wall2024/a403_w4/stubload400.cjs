// Loads every top-level function and const of a stub's rebuilt source (no $ calls at load), for offline calls of its functions.
const fs=require('fs');const T=require('../tools/lib.cjs');const acorn=require('../tools/node_modules/acorn');
module.exports=function(file,node,want){let d=JSON.parse(fs.readFileSync(file));if(d.data&&d.data.nodes)d=d.data;const U=T.unpack(d);const S=T.rb(U.L,U.M[node]);
 const pre='(async()=>{\n';const ast=acorn.parse(pre+S+'\n})',{ecmaVersion:'latest',allowReturnOutsideFunction:true});const body=ast.body[0].expression.body.body;const off=-pre.length;const parts=[];
 for(const st of body){const src=S.slice(st.start+off,st.end+off);if(st.type==='FunctionDeclaration')parts.push(src);else if(st.type==='VariableDeclaration'&&(/^(const|let|var)\s+REFP\b/.test(src)||!/\$\(|\$input|\$json|\$node|items\b/.test(src)))parts.push('try{'+src.replace(/^(const|let)\s/,'var ')+'}catch(e){}');}
 return new Function('$',parts.join('\n')+'\nreturn {'+want.join(',')+'};')(()=>{throw new Error('no $');});};
