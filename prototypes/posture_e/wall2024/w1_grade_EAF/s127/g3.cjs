// W1: served blocks that are cut before the judge's quoted words (the enforcer is told to grade the full answer, which then lacks the quoted sentence)
const fs=require('fs');const {run,V,items,N,P}=require('./g.cjs');
(async()=>{for(const r of ['34852','34726','34703','34780']){const rd=JSON.parse(fs.readFileSync(P+'ex'+r+'_full.json')).data.resultData.runData;
 for(const v of ['live','SU','AU']){const M=items(await run(V[v],'Judge Enforcer Build',rd));let served=0,cutn=0,miss=[];
  for(const k in M){const t=M[k];const fm=t.match(/\nTHE ANSWER IN FULL, FROM \[([^\]]*)\][^:]*:\s*"([\s\S]*?)"\nTHE JUDGES' GRADES:/);if(!fm)continue;served++;const isCut=/\[\.\.\.\]\s*$/.test(fm[2]);if(isCut)cutn++;
   const q=(t.match(/\nTHE ANSWER: "([\s\S]*?)"\n/)||[])[1]||'';const parts=N(q).split(/\s*\.\.\.\s*|\s*…\s*/).filter(Boolean);const b=N(fm[2]);
   const tail=parts[parts.length-1].split(' ').slice(-6).join(' ');if(isCut&&!b.includes(tail))miss.push(k);}
  console.log(r,v,'served',served,'| block cut with [...]',cutn,'| cut before the end of the quoted words',miss.length,miss.join(' '));}}})();
