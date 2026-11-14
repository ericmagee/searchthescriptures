const fs=require('fs');
const R=JSON.parse(fs.readFileSync(process.argv[2],"utf8")).result;const a0=R.indexOf("\n[{\"j\":")+1,a1=R.lastIndexOf("]\n</untrusted")+1;const B=JSON.parse(R.slice(a0,a1))[0].j;
const mk=f=>{const W=require(f);const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const l=L[3120];const k=l.indexOf("+(()=>{try{const t=a?");return new Function('a','cut','sd','return '+l.slice(k+1)+';');};
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n)+'...':s;};
const R2=mk('./target_rev2.json'),R3=mk('./target.json');
let n=0,l2=0,l3=0,emp=0,same=0,diff=[],nod=0,rowd=0;
for(const b of B){n++;const a={t:b.t};const o2=R2(a,cut,b.sd),o3=R3(a,cut,b.sd);if(o2)l2++;if(o3){l3++;const k=o3.match(/THE KEPT CLAIM: "([\s\S]*?)" \| WHAT THE BLOCK DROPS OR DISOWNS: ([\s\S]*?)\. Rule it/);if(!k||!k[1].trim())emp++;if(/no such sentence found/.test(o3))nod++;if(/\[L[1-3]\]/.test(k?k[2]:''))rowd++;}
 if(o2===o3)same++;else diff.push({id:b.id,sd:b.sd,o2,o3});}
console.log({blocks:n,rev2_lines:l2,rev3_lines:l3,empty_kept:emp,no_drop:nod,row_in_drops:rowd,same,changed:diff.length});
fs.writeFileSync('t5_diff.json',JSON.stringify(diff,null,1));
const mk2=f=>{const W=require(f);const T=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return T;};
for(const b of B){const o3=R3({t:b.t},cut,b.sd);if(!o3)console.log('NOLINE',b.id,b.sd,JSON.stringify(b.t.slice(0,160)));else{const k=o3.match(/WHAT THE BLOCK DROPS OR DISOWNS: ([\s\S]*?)\. Rule it/);if(/\[L[1-3]\]/.test(k[1]))console.log('ROWMENTION',b.id,k[1].slice(0,300));}}
