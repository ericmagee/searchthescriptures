const fs=require('fs');const {run,V,items,N,P}=require('./g.cjs');
const want={'34726':['B45','B101'],'34703':['B123'],'34780':['B43','B110','B18']};
(async()=>{for(const r in want){const rd=JSON.parse(fs.readFileSync(P+'ex'+r+'_full.json')).data.resultData.runData;const M=items(await run(V.AU,'Judge Enforcer Build',rd));
 for(const k of want[r]){const t=M[k];const fm=t.match(/\nTHE ANSWER IN FULL, FROM \[([^\]]*)\][^:]*:\s*"([\s\S]*?)"\nTHE JUDGES' GRADES:/);const q=(t.match(/\nTHE ANSWER: "([\s\S]*?)"\n/)||[])[1]||'';
  const words=N(q).split(' ');const b=N(fm[2]);let best=0;for(let i=0;i<words.length;i++)for(let j=words.length;j>i+best;j--)if(b.includes(words.slice(i,j).join(' '))){best=j-i;break;}
  console.log(r,k,'from',fm[1],'| block len',fm[2].length,'| quote words',words.length,'longest run of quote words found in block',best,'\n  Q:',q.slice(0,300),'\n  B:',fm[2].slice(0,200).replace(/\n/g,' '),'...',fm[2].slice(-300).replace(/\n/g,' '));}}})();
