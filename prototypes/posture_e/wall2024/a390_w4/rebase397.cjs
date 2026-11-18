// ASK 390 rebase check: the 390 change made on 394 live (A0->A1) equals the change made on 397 live (B0->B1), line by line and node by node.
const fs=require('fs'),T=require('../tools/lib.cjs');const J=f=>{let d=JSON.parse(fs.readFileSync(f));return d.data&&d.data.nodes?d.data:d;};
const [a0,a1,b0,b1]=process.argv.slice(2).map(J);const U=[a0,a1,b0,b1].map(T.unpack);
const n=Math.max(...U.map(u=>u.L.length));let same=0,diff=[];
for(let i=0;i<n;i++){const A0=U[0].L[i],A1=U[1].L[i],B0=U[2].L[i],B1=U[3].L[i];
 if(A0===B0){if(A1===B1)same++;else diff.push(['390 change differs on a line 397 did not touch',i]);}
 else{ // 397-touched line: 390's change must be the same edit. Undo it: B1 with A0->A1 replaced back must equal B0
  const ch=A0!==A1, chB=B0!==B1; if(ch!==chB){diff.push(['390 touches only one side',i]);continue;}
  if(!ch){same++;continue;}
  // find A's edit as (prefix,suffix) and check the same insertions occur in B
  const insA=[];{let p=0;while(A0[p]===A1[p])p++;let s=0;while(s<A0.length-p&&A0[A0.length-1-s]===A1[A1.length-1-s])s++;insA.push(A0.slice(p,A0.length-s),A1.slice(p,A1.length-s));}
  let p=0;while(B0[p]===B1[p])p++;let s=0;while(s<B0.length-p&&B0[B0.length-1-s]===B1[B1.length-1-s])s++;const insB=[B0.slice(p,B0.length-s),B1.slice(p,B1.length-s)];
  console.log('397-touched line',i,'| 390 edit equal:',insA[0]===insB[0]&&insA[1]===insB[1],'| A old/new',JSON.stringify(insA).slice(0,200),'| B',JSON.stringify(insB).slice(0,200));}}
console.log('library lines',n,'| same',same,'| problems',diff.length,diff.slice(0,10));
// MAP: every stub's p change (A0->A1) equals (B0->B1)
let mp=0;for(const k of Object.keys(U[3].M)){const d=x=>JSON.stringify(x);const a=d(U[0].M[k]&&U[0].M[k].p),a2=d(U[1].M[k]&&U[1].M[k].p),b=d(U[2].M[k]&&U[2].M[k].p),b2=d(U[3].M[k]&&U[3].M[k].p);
 if((a!==a2)!==(b!==b2)||(a===b&&a2!==b2)){mp++;console.log('MAP p differs',k);}}
console.log('MAP stubs',Object.keys(U[3].M).length,'| p problems',mp);
// nodes other than Shared Library
const nm=d=>Object.fromEntries(d.nodes.map(x=>[x.name,JSON.stringify(x.parameters)]));const N=[a0,a1,b0,b1].map(nm);let np=0,nc=0;
for(const k of Object.keys(N[3])){if(k==='Shared Library')continue;const c=N[0][k]!==N[1][k];if(c)nc++;if(N[0][k]===N[2][k]?N[1][k]!==N[3][k]:(c||N[2][k]!==N[3][k])){np++;console.log('node problem',k);}}
console.log('other nodes changed by 390',nc,'| problems',np);
