const run=require('./rep.cjs');
run('parent_s148_KWP.json',['Panel Cure Normalize 1'],(fn,n,a,b)=>{if(fn!=='35296')return;const A=a.map(x=>x.json),B=b.map(x=>x.json);console.log('items',A.length,B.length);
 for(let i=0;i<Math.max(A.length,B.length);i++){const x=A[i]||{},y=B[i]||{};for(const k of new Set([...Object.keys(x),...Object.keys(y)])){const s1=JSON.stringify(x[k]),s2=JSON.stringify(y[k]);if(s1!==s2)console.log(i,k,(s1||'').length,'->',(s2||'').length,'| was',String(s1).slice(0,300),'\n   now',String(s2).slice(0,300));}}});
