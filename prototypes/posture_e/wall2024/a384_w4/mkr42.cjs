// ASK 384 rev 4.2 target (W1 Wall 8405, 8409, 8415). R1 NARROW; R3 option b; R2: a reference is NAMED when its book is in its own head, or its context book comes
// from the same sentence (no sentence end between the book and the reference, the SENT test parse already uses) or from a possessive. A named reference passes through
// as today (4a: the live binder lists a missing verse as "not in the KJV table"); only a context carried from an earlier sentence is refused, into o.refused (4b).
const fs=require('fs');const L=fs.readFileSync(__dirname+'/refp_r4.txt','utf8').split('\n');
const rep=(i,a,b)=>{if(L[i].split(a).length!==2)throw new Error('line '+i+' anchor '+a);L[i]=L[i].replace(a,()=>b);};
rep(8,'let pi=0,lastBook=null,lastAt=-1;','let pi=0,lastBook=null,lastAt=-1,lastPo=false;');
rep(10,'{lastBook=PO[pi].b;lastAt=PO[pi].at;}','{lastBook=PO[pi].b;lastAt=PO[pi].at;lastPo=true;}');
rep(11,'if(b){lastBook=b;lastAt=m.index;}','const named=!!b||(!!ctx&&(lastPo||!SENT.test(T.slice(lastAt,m.index))));if(b){lastBook=b;lastAt=m.index;lastPo=false;}');
rep(18,'it.end=i;out.push(it);','it.end=i;it.named=named;out.push(it);');
rep(20,'if(!r.book){','if(!r.named){');
const N=L.join('\n');fs.writeFileSync(__dirname+'/refp_r42.txt',N);fs.writeFileSync(__dirname+'/refp_r42.cjs',N+'\nmodule.exports=REFP;\n');console.log('len',N.length,'lines',N.split('\n').length);
