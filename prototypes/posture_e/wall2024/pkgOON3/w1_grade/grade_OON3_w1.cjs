// W1 grade of pkgOON3: plants from labels_OON3_w1.json on luna S12 of stored 34726; Gate Build live vs candidate. Uses W3's exported store/run (pkgEAD harness_clone).
const T=require(__dirname+'/../test_OON3.cjs');const {LIVE,CAND,run,store,S,A,B}=T;const fs=require('fs');
const L=JSON.parse(fs.readFileSync(__dirname+'/labels_OON3_w1.json')).cases;
const plant=(sid,to,rule)=>({'Send Back Record':o=>{const x=o[0][0].json.sb_items.find(z=>z.seat==='luna'&&z.sid===sid);if(!x)throw new Error('no '+sid);x.ans='CHANGE';x.to=to;}});
const f=(arr,sid)=>{const it=arr[0].items.find(x=>x.sid===sid);return it?it.kind+': '+String(it.why).slice(0,70):'APPLIED';};
(async()=>{let fail=0;
 const a0=await run(LIVE,'Gate Build','Reread Record',store()),b0=await run(CAND,'Gate Build','Reread Record',store());console.log('no plant equal',S(a0)===S(b0));if(S(a0)!==S(b0))fail++;
 for(const c of L){const st=store(plant('S12',c.to));const a=await run(LIVE,'Gate Build','Reread Record',st),b=await run(CAND,'Gate Build','Reread Record',st);const lv=f(a,'S12'),cd=f(b,'S12');
  const got=cd==='APPLIED'?'APPLY':/NOT APPLIED/.test(cd)?'KEEP':'OTHER';const ok=c.expect==='RECORD'?'RECORD':(got===c.expect?'AS LABELLED':'NOT AS LABELLED');if(ok==='NOT AS LABELLED')fail++;
  console.log(c.id,S(c.to).slice(0,60),'| LIVE',lv,'| CAND',cd,'|',ok,'| other seats equal',S(a.slice(1))===S(b.slice(1)));}
 // non-E-OOR item: the same answer on a luna item of another rule must equal live
 const sb=T.base['Send Back Record'][0][0].json.sb_items.filter(z=>z.seat==='luna'&&z.rule!=='E-OOR').slice(0,3);
 for(const x of sb)for(const to of ['OUT-OF-ROUND CONCESSIONS: NONE','NONE']){const st=store(plant(x.sid,to));const a=await run(LIVE,'Gate Build','Reread Record',st),b=await run(CAND,'Gate Build','Reread Record',st);const eq=S(a)===S(b);if(!eq)fail++;console.log('other rule',x.sid,x.rule,S(to),'live=cand',eq);}
 console.log('NOT AS LABELLED or unequal:',fail);})();
