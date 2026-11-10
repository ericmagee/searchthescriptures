const {go,J,base}=require('./o.cjs');const S=j=>JSON.stringify(j);
const plant=(sid,to)=>({'Send Back Record':o=>{const x=o[0][0].json.sb_items.find(z=>z.seat==='luna'&&z.sid===sid);if(!x)throw new Error('no '+sid);x.ans='CHANGE';x.to=to;}});
const f=(arr,sid)=>{const it=arr[0].items.find(x=>x.sid===sid);return it?it.kind+': '+String(it.why).slice(0,58):'no gate item';};
(async()=>{
 const P=[['p1','S12','NONE'],['p2','S12','none.'],['p3','S12','(NONE)'],['p4','S12','NONE; the row stands as written'],['p11','S12','NONE OF THE ROWS CHANGE; I KEEP ALL'],['p5','S12','KEEP'],['p6','S12','NO CHANGE'],['p8','S12','NONETHELESS the row stands'],['p10','S12','Not applicable'],['p7','S12','DEFENDER | [CR2] | “None of the titles gives a knowing.”'],['p9','S12','OUT-OF-ROUND CONCESSIONS: NONE'],['p14','S12','STRUCK'],['p13','S1','NONE'],['p13b','S6','NONE'],['p13c','S25','NONE'],['p13d','S8','NONE']];
 for(const [id,sid,to] of P){try{const {a,b}=await go(plant(sid,to));console.log(id,JSON.stringify(to).slice(0,44),'| LIVE:',f(a,sid),'| CAND:',f(b,sid),'| S12 equal',S(a[0].items.filter(x=>x.sid===sid))===S(b[0].items.filter(x=>x.sid===sid)),'| others equal',S(a.slice(1))===S(b.slice(1)));}catch(e){console.log(id,'ERR',e.message);}}
 // p12: row ends COUNTED
 try{const q='names the espoused man.”';const ed={};for(const n of ['Panel Build','Send Back Record','Panel Cure Check','Send Back Build']){ed[n]=o=>{const s=JSON.stringify(o);const t=s.split(q).join(q+' -- COUNTED');const v=JSON.parse(t);o.length=0;v.forEach(z=>o.push(z));};}
  const {a,b}=await go(ed);console.log('p12 COUNTED row | LIVE:',f(a,'S12'),'| CAND:',f(b,'S12'));const it=b[0].items.find(x=>x.sid==='S12');console.log('   cand why:',it&&it.why, '| line:',it&&String(it.lines).slice(0,120));}catch(e){console.log('p12 ERR',e.message);}
})();
