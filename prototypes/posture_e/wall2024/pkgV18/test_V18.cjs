// pkgV18: base vs patched Extract Independent Verdict on every recent saved run (harness, live feeder). Reports what changes: only v18 audit lines may.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');
const F='/mnt/project-files/wall2024/fetchback_live_s45.json';const IN=feeder(F,'Extract Independent Verdict')[0];const N='Extract_Independent_Verdict.js';
const BS=process.env.BS||'pkgLIB/base_s45/patched',PT=process.env.PT||'pkgV18/patched';let ok=0,bad=0;const T=(n,c)=>{console.log((c?'OK   ':'FAIL ')+n);c?ok++:bad++;};
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^33[2-9]\d\d_/.test(f)).map(f=>f.slice(0,5)))].sort();
(async()=>{for(const R of runs){let a,b;try{a=await harness(R)('return (async()=>{'+rd(BS+'/'+N)+'\n})()',IN);b=await harness(R)('return (async()=>{'+rd(PT+'/'+N)+'\n})()',IN);}catch(e){console.log('SKIP '+R+' '+String(e.message).slice(0,70));continue;}
 const ja=a[0].json,jb=b[0].json;const ka=Object.keys(ja).filter(k=>JSON.stringify(ja[k])!==JSON.stringify(jb[k]));
 const raw=x=>String(x.independent_verdict_raw||x.verdict_raw||'');const keyRaw=Object.keys(ja).find(k=>/raw/.test(k)&&typeof ja[k]==='string'&&/AUDIT v18/.test(ja[k]));
 const la=keyRaw?ja[keyRaw].split('\n'):[],lb=keyRaw?jb[keyRaw].split('\n'):[];const add=lb.filter(l=>!la.includes(l)),gone=la.filter(l=>!lb.includes(l));
 const onlyV18=ka.every(k=>k===keyRaw||k==='audit_flags')&&[...add,...gone].every(l=>/AUDIT v18|AUDIT FLAGS: /.test(l));
 T(R+': '+(ka.length?'changed '+ka.join(',')+' (+'+add.length+' -'+gone.length+' lines)':'unchanged')+(ka.length?'; only v18 audit lines and the flag count':''),onlyV18||!ka.length);
 if(R==='33345'){gone.forEach(l=>console.log('     - '+l.slice(0,120)));add.forEach(l=>console.log('     + '+l.slice(0,120)));
  T('33345: D3-D6 read as STANDS, no NO ENTRY / NOT READ left, 4 off-list lines',!lb.some(l=>/CARRIES NO ENTRY|ENTRY NOT READ/.test(l))&&lb.filter(l=>/OFF-LIST WORDING/.test(l)).length===4&&lb.some(l=>/COLLISION MAP: D1=STANDS D2=STANDS D3=STANDS D4=STANDS D5=STANDS D6=STANDS/.test(l)));}}
 console.log(ok+' OK, '+bad+' FAIL');})();
