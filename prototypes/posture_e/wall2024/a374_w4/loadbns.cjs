const fs=require('fs');const T=require('../tools/lib.cjs');const acorn=require('../tools/node_modules/acorn');const C={};
const load=(f,facts,node='Gate Build')=>{let d=C[f]||(C[f]=JSON.parse(fs.readFileSync(f)));if(d.data&&d.data.nodes)d=d.data;const U=T.unpack(d);const S=T.rb(U.L,U.M[node]);const pre='(async()=>{\n';const ast=acorn.parse(pre+S+'\n})',{ecmaVersion:'latest',allowReturnOutsideFunction:true});const body=ast.body[0].expression.body.body;const off=-pre.length;const parts=[];
 for(const st of body){const src=S.slice(st.start+off,st.end+off);if(st.type==='FunctionDeclaration')parts.push(src);else if(st.type==='VariableDeclaration'&&(/^(const|let|var)\s+(REFP|__RL)\b/.test(src)||!/\$\(|\$input|\$json|\$node|items\b/.test(src)))parts.push('try{'+src.replace(/^(const|let)\s/,'var ')+'}catch(e){}');}
 const $=n=>{if(n==='Assume Check Record')return {isExecuted:true,first:()=>({json:{acx:{facts}}})};if(n==='Shared Library')return {params:d.nodes.find(x=>x.name==='Shared Library').parameters};throw new Error('no '+n);};
 return new Function('$',parts.join('\n')+'\nreturn {bnsRefuse2024};')($);};
module.exports=load;
