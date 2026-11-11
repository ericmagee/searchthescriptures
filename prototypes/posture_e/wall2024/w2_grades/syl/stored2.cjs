// W2 grade pkgSYL S12 (path diff): Build Save Body s125 vs SYL vs stored output, per JSON path.
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};
const A=g('/mnt/project-files/wall2024/fetchback_live_s125.json'),B=g('/mnt/project-files/wall2024/parent_s125_SYL.json');const nd=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const flat=(v,p='',o={})=>{if(v&&typeof v==='object')for(const k in v)flat(v[k],p+'.'+k,o);else o[p]=v;return o;};
const T=s=>typeof s==='string'?s.replace(/\d{4}-\d\d-\d\dT[\d:.]+Z/g,'<iso>'):s;
(async()=>{for(const f of ['ex33149_full.json','ex33371_full.json','ex33490_full.json','ex33497_full.json','ex34726_full.json','ex34852_full.json']){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f));const rd=(X.data||X).resultData.runData;
 const a=await run(nd(A,'Build Save Body'),'Build Save Body',rd),b=await run(nd(B,'Build Save Body'),'Build Save Body',rd);
 const st=rd['Build Save Body'][rd['Build Save Body'].length-1].data.main[0][0].json;
 const fa=flat(a[0].json||a[0]),fb=flat(b[0].json||b[0]),fs_=flat(st);
 const dls=Object.keys({...fa,...fs_}).filter(k=>T(fa[k])!==T(fs_[k]));const dab=Object.keys({...fa,...fb}).filter(k=>fa[k]!==fb[k]);
 console.log(f,'| live vs stored paths differing:',dls.length,dls.slice(0,4).join(' '),'| SYL vs live:',dab.join(' '));
 for(const k of dab){const La=String(fa[k]).split('\n'),Lb=String(fb[k]).split('\n');Lb.filter(l=>!La.includes(l)).forEach(l=>console.log('  + '+l.slice(0,400)));console.log('  lines removed:',La.filter(l=>!Lb.includes(l)).length,'| added at line',Lb.findIndex(l=>!La.includes(l)),'of',Lb.length,'| line before:',(Lb[Lb.findIndex(l=>!La.includes(l))-1]||'').slice(0,90));}}})();
