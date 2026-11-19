const fs=require('fs');const acorn=require(process.argv[2]);
const r=JSON.parse(fs.readFileSync('revert_444A2.json'));
const toks=s=>{const o=[];const cs=[];for(const t of acorn.tokenizer(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true,onComment:(b,t)=>cs.push(t)}))o.push(t.type.label+':'+(t.value===undefined?'':String(t.value)));return [o,cs];};
for(const x of r.restore)for(const h of x.hunks){const [tb,cb]=toks(h.base_text),[tp,cp]=toks(h.pkg_text);
 let eq=tb.length===tp.length&&tb.every((v,i)=>v===tp[i]);
 console.log(x.node,'| tokens base',tb.length,'pkg',tp.length,'equal:',eq,'| comments base',cb.length,'pkg',cp.length);
 if(cp.length)console.log('  pkg keeps comment:',JSON.stringify(cp.map(c=>c.slice(0,160))));
 if(!eq){let k=0;while(tb[k]===tp[k])k++;console.log('  first token diff',k,tb.slice(k,k+5),tp.slice(k,k+5));}}
