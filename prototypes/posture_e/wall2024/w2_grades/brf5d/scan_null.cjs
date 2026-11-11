// W2: stored [DR4]/[CR4] references the scoped parser leaves with no book (dropped by C4P.refs: never marked NEW, never on a book line), and bare refs that borrow a book across one sentence break.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const W=g('/mnt/project-files/wall2024/fetchback_live_s119.json');
const c=W.nodes.find(x=>x.name==='C4 Build').parameters.jsCode;const k=c.indexOf('const REFP=');const e=c.indexOf('})();',c.indexOf('const C4P='))+5;
const [REFP,C4P]=new Function(c.slice(k,e)+'\nreturn [REFP,C4P];')();
const Fs=[];const walk=(v,d)=>{if(d>12||v==null||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(x=>walk(x,d+1));return;}if((typeof v.dr4==='string'||typeof v.cr4==='string')&&typeof v.gr1==='string')Fs.push(v);for(const k in v)walk(v[k],d+1);};
const seen=new Set();let nul=0,bor=0;
for(const id of '33149 33371 33490 33497 34299 34626 34703 34726 34780'.split(' ')){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+id+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;Fs.length=0;for(const kk in rd)walk(rd[kk],0);
 for(const F of Fs)for(const f of ['dr4','cr4']){const t=String(F[f]||'');if(!t)continue;const key=id+f+t.length;if(seen.has(key))continue;seen.add(key);
  for(const r of REFP.parse(t,{scoped:true})){if(r.book)continue;const ctxt=t.slice(Math.max(0,r.at-90),r.end+20).replace(/\s+/g,' ');
   if(!r.ctx){nul++;console.log(id,f,'NO BOOK (dropped):',r.label,'|',ctxt);}else{bor++;console.log(id,f,'borrowed',r.ctx,r.label,'|',ctxt);}}}}
console.log('distinct close texts:',seen.size,'refs with no book:',nul,'refs with a borrowed book:',bor);
