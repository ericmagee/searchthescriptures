// Pulls named top-level declarations out of a stub's rebuilt source (Shared Library + MAP), for offline replay.
const fs=require('fs');const T=require('../tools/lib.cjs');const acorn=require('../tools/node_modules/acorn');
module.exports=function(file,node,names){let d=JSON.parse(fs.readFileSync(file));if(d.data&&d.data.nodes)d=d.data;const U=T.unpack(d);
 const S=T.rb(U.L,U.M[node]);const ast=acorn.parse('(async()=>{\n'+S+'\n})',{ecmaVersion:'latest',allowReturnOutsideFunction:true});
 const body=ast.body[0].expression.body.body;const off=-'(async()=>{\n'.length;const W=new Set(names);const parts=[];
 for(const st of body){let nm=null;if(st.type==='FunctionDeclaration')nm=st.id.name;else if(st.type==='VariableDeclaration'&&st.declarations.length===1&&st.declarations[0].id.type==='Identifier')nm=st.declarations[0].id.name;
  if(nm&&W.has(nm)){parts.push(S.slice(st.start+off,st.end+off));W.delete(nm);}}
 if(W.size)throw new Error('not found: '+[...W].join(','));
 return {src:parts.join('\n'),get:(...ns)=>new Function('$',parts.join('\n')+'\nreturn {'+ns.join(',')+'};')(()=>{throw new Error('no $');}),S,U};};
