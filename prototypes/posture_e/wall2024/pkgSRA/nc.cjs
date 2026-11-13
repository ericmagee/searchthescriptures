// W1 pkgSRA: not-checked ids and call count, live vs candidate, on every stored export (pkgA1N rev 2 guarantee).
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');
const A=L(process.argv[2]),B=L(process.argv[3]);const P='/mnt/project-files/wall2024/';const NODES=['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build'];
const nc=o=>{const s=new Set();JSON.stringify(o,(k,v)=>{if(k==='not_checked'&&Array.isArray(v))v.forEach(x=>s.add(typeof x==='string'?x:JSON.stringify(x)));return v;});return s;};
const pl=o=>{let n=0;JSON.stringify(o,(k,v)=>{if(typeof v==='string'&&v.length>2000&&/RULE E-ANS/.test(v))n+=v.length;return v;});return n;};
(async()=>{let tA=0,tB=0;for(const e of fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;
 for(const n of NODES){if(!rd[n])continue;const oa=await run(A.code(n),n,rd),ob=await run(B.code(n),n,rd);if(oa&&oa.err){continue;}
  const a=nc(oa),b=nc(ob);const extra=[...b].filter(x=>!a.has(x));const pa=pl(oa),pb=pl(ob);tA+=pa;tB+=pb;console.log(e,n,'not_checked live',a.size,'new',b.size,'extra',extra.length,'prompt chars',pa,pb,pb-pa);}}
 console.log('TOTAL prompt chars',tA,tB,tB-tA);})();
