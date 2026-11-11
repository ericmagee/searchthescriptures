// W2: both close-round notes on every stored F (8 executions), live s117 vs rev 5, every node copy of C4P compared on node C4 Build
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const mk=W=>{const c=W.nodes.find(x=>x.name==='C4 Build').parameters.jsCode;const k=c.indexOf('const REFP=');const e=c.indexOf('})();',c.indexOf('const C4P='))+5;return new Function(c.slice(k,e)+'\nreturn C4P;')();};
const a=mk(g('/mnt/project-files/wall2024/fetchback_live_s117.json')),b=mk(g('/mnt/project-files/wall2024/parent_s117_BRF5.json'));
const Fs=[];const walk=(v,d)=>{if(d>12||v==null||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(x=>walk(x,d+1));return;}if((typeof v.dr4==='string'||typeof v.cr4==='string')&&typeof v.gr1==='string')Fs.push(v);for(const k in v)walk(v[k],d+1);};
const seen=new Set();let n=0,df=0,err=0;
for(const e of '33149 33371 33490 33497 34299 34626 34703 34726 34780'.split(' ')){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+e+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;Fs.length=0;for(const k in rd)walk(rd[k],0);
 for(const F of Fs){const k=e+'|'+(F.dr4||'').length+'|'+(F.cr4||'').length;if(seen.has(k))continue;seen.add(k);n++;let p;try{p=[a.note(F),b.note(F),a.noteD(F),b.noteD(F)];}catch(x){err++;continue;}
  if(p[0]!==p[1]||p[2]!==p[3]){df++;const m=s=>(s.match(/BOOK CHECK.*?read the sentence for its book/)||[''])[0];console.log(e,'| live:',m(p[0])||m(p[2]),'| rev5:',m(p[1])||m(p[3]));}}}
console.log('distinct stored F:',n,'notes differing:',df,'errors:',err);
