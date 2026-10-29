// Prototype of (A): every quote segment (split at ellipsis) must stand contiguous in the cited text.
const fs=require('fs');let src=fs.readFileSync(require('path').join(__dirname,'../fix7/test.cjs'),'utf8');
src=src.replace("cr1: '","cr1: '\"I will multiply thy daughters\" (Genesis 16:10). \"being (as was never supposed) the son of Joseph\" (Luke 3:23). \"God sent forth his Son, born without a father\" (Galatians 4:4). ");
src=src.replace(/const key = [\s\S]*$/,`
const fold=s=>String(s||'').toLowerCase().replace(/\\[[^\\]]*:[^\\]]*\\]/g,' ').replace(/[^a-z ]/g,' ').replace(/\\s+/g,' ').trim();
const segOK=(q,c)=>{const cv=' '+fold(c)+' ';const segs=String(q).split(/\\.\\.\\.|…/).map(fold).filter(Boolean);return segs.length>0&&segs.every(s=>cv.includes(' '+s+' '));};
for(const i of run('new')){ if(!i.cited){console.log('  no cited', i.ref, i.status);continue;}
 const a=segOK(i.quote,i.cited); console.log((i.status==='MATCHES'&&!a?'* ':'  ')+(i.ref+' "'+String(i.quote).slice(0,44)+'"').padEnd(60)+' NEW '+String(i.status).padEnd(11)+' (A) '+(a?'MATCHES':'NOT MATCHED'));}
`);
fs.writeFileSync('seg_run.cjs',src);
