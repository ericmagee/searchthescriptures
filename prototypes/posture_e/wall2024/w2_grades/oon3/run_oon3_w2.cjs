// W2 grade of pkgOON3: my plants (labels_oon3_w2.md) through W3's exported harness.
const {LIVE,CAND,run,store,base,T,S}=require('../../pkgOON3/test_OON3.cjs');
const j=s=>S(s).slice(1,-1);
const all=(fn)=>{const ed={};for(const n in base){if(base[n]&&fn(S(base[n]))!==S(base[n]))ed[n]=o=>{const v=JSON.parse(fn(S(o)));o.length=0;v.forEach(z=>o.push(z));};}return ed;};
const f=(arr,sid)=>{const it=arr[0].items.find(x=>x.sid===sid);return it?it.kind+': '+String(it.why).slice(0,70):'APPLIED (no item)';};
const sbi=base['Send Back Record'][0][0].json.sb_items;
(async()=>{
 const ans=(sid,to,pre)=>Object.assign({},pre||{},{'Send Back Record':o=>{if(pre&&pre['Send Back Record'])pre['Send Back Record'](o);const x=o[0][0].json.sb_items.find(z=>z.seat==='luna'&&z.sid===sid);x.ans='CHANGE';x.to=to;}});
 const G=async(st)=>[await run(LIVE,'Gate Build','Reread Record',st),await run(CAND,'Gate Build','Reread Record',st)];
 const [nl,nc]=await G(store(ans('S12','NONE')));
 const forms=[['N1','**OUT-OF-ROUND CONCESSIONS:** NONE'],['N2','OUT-OF-ROUND CONCESSIONS: REMOVED'],['N3','OUT-OF-ROUND CONCESSIONS: DELETE'],['N4',"OUT-OF-ROUND CONCESSIONS: NONE (the concession is in the other side's round)"],['N5','OUT-OF-ROUND CONCESSION: NONE'],['N6','OUT OF ROUND CONCESSIONS: NONE'],['N7','OUT-OF-ROUND CONCESSIONS: NONEXISTENT'],['N8','OUT-OF-ROUND CONCESSIONS: STRIKE THIS ROW']];
 for(const [id,to] of forms){const [a,b]=await G(store(ans('S12',to)));
  console.log(id,S(to).slice(0,50),'| LIVE:',f(a,'S12'),'| CAND:',f(b,'S12'),'| other seats equal',S(a.slice(1))===S(b.slice(1)),'| CAND equals plain NONE',T(S(b))===T(S(nc)),'| LIVE has item',!!a[0].items.find(x=>x.sid==='S12'));}
 // N9 another rule
 const other=sbi.find(z=>z.seat==='luna'&&z.rule!=='E-OOR');console.log('N9 item',other&&other.sid,other&&other.rule);
 if(other){const [a,b]=await G(store(ans(other.sid,'OUT-OF-ROUND CONCESSIONS: NONE')));console.log('N9 LIVE:',f(a,other.sid),'| CAND:',f(b,other.sid),'| whole output equal',T(S(a))===T(S(b)));}
 // N10 COUNTED row
 const it=sbi.find(z=>z.seat==='luna'&&z.sid==='S12');console.log('S12 rule',it.rule,S(it.line).slice(0,90));
 const edC=all(s=>s.split(j(it.line)).join(j(it.line+' -- COUNTED')));
 const [a,b]=await G(store(ans('S12','OUT-OF-ROUND CONCESSIONS: NONE',edC)));console.log('N10 LIVE:',f(a,'S12'),'| CAND:',f(b,'S12'));
 // count of all luna items unchanged except S12 across N-forms already shown; check no item vanished: item sids live vs cand for N2
 const [a2,b2]=await G(store(ans('S12','OUT-OF-ROUND CONCESSIONS: REMOVED')));const sid=x=>x[0].items.map(z=>z.sid).sort().join(',');console.log('N11 item sids LIVE',sid(a2),'| CAND',sid(b2));
})();
