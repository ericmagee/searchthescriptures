// W1 grade of pkgA1N, part C: run the three Judge Enforcer Build nodes' effective code (live s128 vs A1N) on the ten stored exports.
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');const RM=require('../pkgLIB/runner_model.cjs');
const A=L(process.argv[2]),B=L(process.argv[3]);const P='/mnt/project-files/wall2024/';
const NODES=['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build'];
const strip=v=>JSON.stringify(v).replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');
const items=o=>{const s=[];JSON.stringify(o,(k,v)=>{if(typeof v==='string'&&/ITEM B\d+ \(E-ANS/.test(v))for(const m of v.split(/(?=ITEM [A-Z]?\d+ \()/))if(/^ITEM B\d+ \(E-ANS/.test(m))s.push(m.trimEnd());return v;});return s;};
(async()=>{let tot=0,eqAll=0;const rep=[];
 for(const n of NODES){const ca=A.code(n),cb=B.code(n);const na=RM.needs(ca),nb=RM.needs(cb);console.log('RUNNER',n,'all:',na.all,nb.all,'nodes equal:',JSON.stringify([...na.nodes].sort())===JSON.stringify([...nb.nodes].sort()),'len',ca.length,cb.length,cb.length-ca.length);}
 for(const e of fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;
  for(const n of NODES){if(!rd[n])continue;const oa=await run(A.code(n),n,rd),ob=await run(B.code(n),n,rd);tot++;
   if(oa&&oa.err||ob&&ob.err){console.log(e,n,'ERR',oa.err,'|',ob&&ob.err);continue;}
   const sa=strip(oa),sb=strip(ob);if(sa===sb){eqAll++;console.log(e,n,'equal; E-ANS items',items(oa).length);continue;}
   const ia=items(oa),ib=items(ob);let ch=0,add=0,non=0;for(let i=0;i<Math.max(ia.length,ib.length);i++){if(ia[i]===ib[i])continue;ch++;add+=(ib[i]||'').length-(ia[i]||'').length;
     const ol=(ib[i]||'').match(/THE SIDE'S OTHER LINES ON THIS VERSE[^"]*"([\s\S]*?)"\nTHE JUDGES/);rep.push({e,n,item:(ib[i]||'').slice(0,40),served:ol?ol[1]:'(no other-lines block)'});
     if(!ol)non++;}
   // non-E-ANS parts equal?
   const ra=sa.replace(/ITEM B\d+ \(E-ANS[\s\S]*?(?=ITEM [A-Z]?\d+ \(|$)/g,''),rb=sb.replace(/ITEM B\d+ \(E-ANS[\s\S]*?(?=ITEM [A-Z]?\d+ \(|$)/g,'');
   console.log(e,n,'DIFFER; E-ANS items',ia.length,ib.length,'changed',ch,'chars added',add,'changed without block',non,'calls',oa.length,ob.length);}}
 console.log('replays',tot,'fully equal',eqAll);fs.writeFileSync(process.argv[4],JSON.stringify(rep,null,1));})();
