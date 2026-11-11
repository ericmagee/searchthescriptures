// W1 plant for pkgA1N rev 3: lower MAX_CALLS (1..10) and CALL_CHARS (20000) in both live s128 and the candidate; the candidate's unchecked SET must be a subset of live's at every cap.
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../../pkgKSR/run_node.cjs');
const A=L(process.argv[2]),B=L(process.argv[3]);const P='/mnt/project-files/wall2024/';
const set=(c,cap,cc)=>{const s=c.replace('CALL_CHARS=40000,MAX_CALLS=10','CALL_CHARS='+cc+',MAX_CALLS='+cap);if(!c.includes('CALL_CHARS=40000,MAX_CALLS=10'))throw new Error('cap text not found');return s;};
const sent=o=>new Set([...JSON.stringify(o.map(x=>x.body)).matchAll(/ITEM ([A-Z]+\d+) \(/g)].map(m=>m[1]));
(async()=>{let cases=0,bad=0,lostTot=0,gained=0;for(const e of fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;
for(const n of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){if(!rd[n])continue;
 for(const cc of [40000,20000])for(let cap=1;cap<=10;cap++){const a=await run(set(A.code(n),cap,cc),n,rd),b=await run(set(B.code(n),cap,cc),n,rd);cases++;
  if(a.err||b.err){bad++;console.log(e,n,cap,cc,'ERR',a.err,b.err);continue;}
  const na=new Set((a[0]||{}).not_checked||[]),nb=(b[0]||{}).not_checked||[];const lost=nb.filter(x=>!na.has(x));const fewer=[...na].filter(x=>!nb.includes(x)).length;gained+=fewer;
  const sa=sent(a),sb=sent(b);const missing=[...sa].filter(x=>!sb.has(x));
  if(lost.length||missing.length){bad++;lostTot+=lost.length;console.log('BAD',e.slice(2,7),n,'cap',cap,'chars',cc,'lost',lost.join(','),'missing items',missing.join(','),'calls',b.length);}}}}
console.log('cases',cases,'bad',bad,'grades lost',lostTot,'grades checked by candidate but not live',gained);})();
