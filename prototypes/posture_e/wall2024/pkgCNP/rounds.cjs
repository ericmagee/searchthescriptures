// Rebuild the round fields F (cr1..cr4, gr1, gr2, dr3, dr4) of a run from its stored close-enforcer prompt (both calls).
const fs=require('fs');
module.exports=function(file){let t=fs.readFileSync(file,'utf8');try{t=JSON.parse(t).result}catch(e){}
 const rows=JSON.parse(t.slice(t.indexOf('[{'),t.lastIndexOf('}]')+2));const out={};
 for(const r of rows){const F={};const p=r.prompt_sent;const K={CR1:'cr1',CR2:'cr2',CR3:'cr3',CR4:'cr4',DR1:'gr1',DR2:'gr2',DR3:'dr3',DR4:'dr4'};
  const re=/^=== \[((?:CR|DR)[1-4])\b[^\n]*===\s*$/gm;const at=[];let m;while((m=re.exec(p)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});
  at.forEach((x,i)=>{let end=i+1<at.length?at[i+1].s:p.length;for(const stop of ['\n\n######## THE ','\n\nNEXT CALL']){const c=p.indexOf(stop,x.e);if(c>=0&&c<end)end=c;}if(F[K[x.k]]==null)F[K[x.k]]=p.slice(x.e,end).trim();});
  out[r.run_token]=F;}
 return out;};
