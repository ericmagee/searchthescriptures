const run=require('./rep.cjs');const mask=s=>JSON.stringify(s).replace(/20\d\d-\d\d-\d\dT[\d:.]+Z/g,'T');let eq=0,tot=0;
run(process.argv[2]||'parent_s148_EAC.json',['Panel Tokens'],(fn,n,a,b,rd)=>{tot++;if(a.ERR||b.ERR){console.log('ERR',fn,a.ERR,b.ERR);return;}if(mask(a)===mask(b)){eq++;return;}
 const A=a[0].json,B=b[0].json;const keys=Object.keys(B).filter(k=>mask(A[k])!==mask(B[k]));console.log('==',fn,'fields differ:',keys.join(', '));
 for(const k of keys){const x=A[k],y=B[k];if(Array.isArray(y)){const xs=new Set((x||[]).map(mask));y.filter(r=>!xs.has(mask(r))).forEach(r=>console.log('   +',k,mask(r).slice(0,260)));}else console.log('   ',k,mask(x).slice(0,160),'->',mask(y).slice(0,160));}
 const g=rd['Get Early Alternate'];console.log('   Get Early Alternate items',g?g.slice(-1)[0].data.main.flat().filter(Boolean).length:'not run','| Early Alternate Reply',rd['Early Alternate Reply']?'ran':'not run');
}).then(()=>console.log('Panel Tokens runs',tot,'equal',eq));
