// ASK 394 site 11: old regex against the new reader-based extraction (from the built stub) on every stored CHANGE TO text holding "STANDS" and a D number (266 of 3,986; the head before " -- ", 110 chars). The refusal depends only on the extracted D number and the run's E-ASSUME facts, so equal extraction gives equal refusals for any facts.
const fs=require('fs');const H=fs.readFileSync(__dirname+'/heads.txt','utf8').trim().split('^').map(x=>{const i=x.indexOf('~');return [x.slice(0,i),x.slice(i+1)];});
const ld=f=>{const mk=require('../a400/stubload400.cjs');return mk(f,'Gate Build',['__RL']);};
const facts=[1,2,3,4,5,6].map(k=>({side:'DEFENDER',link:k,n:k,fact:'F'+k,both_not_stated:true}));
const $=n=>{if(n==='Assume Check Record')return {isExecuted:true,first:()=>({json:{acx:{facts}}})};throw new Error('no '+n);};
const load=f=>{const fs2=require('fs');const T=require('../tools/lib.cjs');const acorn=require('../tools/node_modules/acorn');let d=JSON.parse(fs2.readFileSync(f));if(d.data&&d.data.nodes)d=d.data;const U=T.unpack(d);const S=T.rb(U.L,U.M['Gate Build']);const pre='(async()=>{\n';const ast=acorn.parse(pre+S+'\n})',{ecmaVersion:'latest',allowReturnOutsideFunction:true});const body=ast.body[0].expression.body.body;const off=-pre.length;const parts=[];
 for(const st of body){const src=S.slice(st.start+off,st.end+off);if(st.type==='FunctionDeclaration')parts.push(src);else if(st.type==='VariableDeclaration'&&(/^(const|let|var)\s+(REFP|__RL)\b/.test(src)||!/\$\(|\$input|\$json|\$node|items\b/.test(src)))parts.push('try{'+src.replace(/^(const|let)\s/,'var ')+'}catch(e){}');}
 return new Function('$',parts.join('\n')+'\nreturn {bnsRefuse2024};')($);};
const O=load(__dirname+'/../rdf/fetchback_w386.json'),N=load(__dirname+'/t394s11.json');
const k=r=>{const m=r&&String(r).match(/sets D(\d+) to STANDS/);return m?m[1]:null;};
let a=0,b=0,diff=[];for(const [id,t] of H){const x=k(O.bnsRefuse2024(t)),y=k(N.bnsRefuse2024(t));if(x)a++;if(y)b++;if(x!==y)diff.push({id,t,old:x,new:y});}
const out={texts:H.length,refused_old:a,refused_new:b,differ:diff.length,diff,row43734:{old:k(O.bnsRefuse2024(H.find(z=>z[0]==='43734')[1])),new:k(N.bnsRefuse2024(H.find(z=>z[0]==='43734')[1]))}};
console.log(JSON.stringify(out,null,1));fs.writeFileSync(__dirname+'/stored_out.json',JSON.stringify(out,null,1));
