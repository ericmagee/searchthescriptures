// W2: of the stored close references left with no book (dropped by C4P.refs), which have a chapter:verse that NO earlier round (the rounds each check reads) names under any book? Those are new verses the checks never see.
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const W=g('/mnt/project-files/wall2024/fetchback_live_s119.json');
const c=W.nodes.find(x=>x.name==='C4 Build').parameters.jsCode;const k=c.indexOf('const REFP=');const e=c.indexOf('})();',c.indexOf('const C4P='))+5;
const [REFP]=new Function(c.slice(k,e)+'\nreturn [REFP];')();
const Fs=[];const walk=(v,d)=>{if(d>12||v==null||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(x=>walk(x,d+1));return;}if((typeof v.dr4==='string'||typeof v.cr4==='string')&&typeof v.gr1==='string')Fs.push(v);for(const k in v)walk(v[k],d+1);};
const cv=t=>{const S=new Set();for(const r of REFP.parse(t,{scoped:false}))for(let v=r.v1;v<=Math.min(r.v2,r.v1+30);v++)S.add(r.c+':'+v);return S;};
const seen=new Set();let tot=0,nw=0;
for(const id of '33149 33371 33490 33497 34299 34626 34703 34726 34780'.split(' ')){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+id+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;Fs.length=0;for(const kk in rd)walk(rd[kk],0);
 for(const F of Fs)for(const [f,er] of [['dr4',[F.gr1,F.gr2,F.dr3]],['cr4',[F.cr1,F.gr1,F.cr2,F.gr2,F.cr3,F.dr3]]]){const t=String(F[f]||'');if(!t)continue;const key=id+f+t.length;if(seen.has(key))continue;seen.add(key);
  const S=new Set();er.forEach(x=>cv(String(x||'')).forEach(z=>S.add(z)));
  for(const r of REFP.parse(t,{scoped:true})){if(r.book||r.ctx)continue;tot++;const miss=[];for(let v=r.v1;v<=Math.min(r.v2,r.v1+30);v++)if(!S.has(r.c+':'+v))miss.push(r.c+':'+v);
   if(miss.length){nw++;console.log(id,f,'NEW, UNCHECKED:',r.label,'missing',miss.join(','),'|',t.slice(Math.max(0,r.at-120),r.end+30).replace(/\s+/g,' '));}}}}
console.log('refs with no book:',tot,'of which chapter:verse named in no earlier round under any book:',nw);
