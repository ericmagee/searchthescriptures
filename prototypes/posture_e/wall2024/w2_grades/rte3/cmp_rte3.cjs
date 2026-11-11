// W2 grade of pkgRTE rev 3: Gate Build / Alt Gate Build / Send Back Build / Alt Send Back Build, live s116 vs RTE3 on every stored inputs/ run; clause stripped before compare
const fs=require('fs');process.chdir(__dirname+'/../..');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const H=require(process.cwd()+'/pkgEAD/harness_clone.cjs');
const wf=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const W='/mnt/project-files/wall2024/';
const A=wf(W+'fetchback_live_s116.json'),B=wf(W+'parent_s116_RTE3.json');const ld=d=>{const by={};d.nodes.forEach(n=>by[n.name]=n);return n=>rebuild(by[n].parameters.jsCode,by['Shared Library'].parameters.jsCode);};const LA=ld(A),LB=ld(B);
const preds=n=>{const p=[];for(const [k,v] of Object.entries(A.connections))for(const outs of (v.main||[]))for(const c of (outs||[]))if(c.node===n)p.push(k);return p;};
const CL='; a retraction is written "RETRACTED: <pair>" with nothing after the pair';
const T=s=>s.replace(/"at":"[^"]*"/g,'"at":""');
(async()=>{let eq=0,df=0,cl=0,badcl=0,err=0;for(const node of ['Gate Build','Alt Gate Build','Send Back Build','Alt Send Back Build']){const ps=preds(node);
 const runs=[...new Set(fs.readdirSync(H.IN).filter(f=>f.endsWith('_'+node.replace(/ /g,'_')+'.json')).map(f=>f.split('_')[0]))].sort();
 for(const r of runs){const ip=ps.find(p=>H.out(r,p));if(!ip){console.log(r,node,'no input');continue;}let a,b;try{a=await H.run(LA(node),r,ip,{});b=await H.run(LB(node),r,ip,{});}catch(e){err++;console.log(r,node,'ERROR',String(e.message).slice(0,80));continue;}
  const sa=T(JSON.stringify(a)),sbr=T(JSON.stringify(b));const n=sbr.split(CL.replace(/"/g,'\\"')).length-1;cl+=n;
  if(n){for(const x of b.map(z=>z.json))for(const it of (x.items||[]))if(String(it.why||'').includes(CL)){const ok=/^RETRACTED\s*:\s*D\d+\s+VS\.?\s+C\d+\s*\S/i.test(String(it.to||'').replace(/[*_`]+/g,'').trim());if(!ok)badcl++;console.log(r,node,x.seat,'CLAUSE on',it.kind,'| TO:',JSON.stringify(it.to).slice(0,110),ok?'':'<-- NOT a reasoned retraction');}}
  const sb2=sbr.split(CL.replace(/"/g,'\\"')).join('');if(sa===sb2)eq++;else{df++;console.log(r,node,'DIFFERS beyond the clause');}}}
 console.log('node runs equal (clause stripped):',eq,'differ:',df,'errors:',err,'| clause count:',cl,'| clause on a non-retraction:',badcl);})();
