const fs=require('fs');const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex33497_full.json','utf8'));const rd=(X.data||X).resultData.runData;let F=null;
const walk=(v,d)=>{if(F||d>12||v==null||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(x=>walk(x,d+1));return;}if(typeof v.cr4==='string'&&typeof v.gr1==='string'&&v.cr4.includes('1:37')){F=v;return;}for(const k in v)walk(v[k],d+1);};for(const k in rd)walk(rd[k],0);
for(const k of ['cr1','gr1','cr2','gr2','cr3','dr3','cr4','dr4'])console.log(k,(String(F[k]||'').match(/1:37/g)||[]).length,(String(F[k]||'').match(/Luke 1:37/g)||[]).length);
let d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s119.json','utf8'));d=d.data||d;d=d.workflow||d;const c=d.nodes.find(x=>x.name==='Build Synthesis').parameters.jsCode;
const k=c.indexOf('const REFP=');const ke=c.indexOf('})();',k)+5;const i=c.indexOf('const C4P=');const e=c.indexOf('})();',i)+5;const R=new Function(c.slice(k,ke)+'\n'+c.slice(i,e)+'\nreturn {REFP,C4P};')();
const y=R.C4P.ofD(F);console.log('CR4 NEW list',JSON.stringify([...y]),'line',JSON.stringify(y.u||[]));
