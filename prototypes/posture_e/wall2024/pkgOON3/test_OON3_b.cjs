// pkgOON3 builder's test, part (a): the two reasons and the forms they tell, on stored 34726 with planted rows.
const {LIVE,CAND,run,store,base,J,T,S}=require('./test_OON3.cjs');
const all=(fn)=>{const ed={};for(const n in base){if(base[n]&&fn(S(base[n]))!==S(base[n]))ed[n]=o=>{const v=JSON.parse(fn(S(o)));o.length=0;v.forEach(z=>o.push(z));};}return ed;};
(async()=>{const out=base['Judge Enforcer Build'][0][0].json;const rows=out.code_rows.filter(x=>x.rule==='E-OOR'&&x.seat==='luna');const r0=rows[0].flagged_line,r1=rows[1].flagged_line;
 console.log('rows used:',S(r0).slice(0,90),'||',S(r1).slice(0,90));
 const j=s=>S(s).slice(1,-1);const side=r0.startsWith('DEFENDER')?['DEFENDER','CHALLENGER']:['CHALLENGER','DEFENDER'];
 const ed=all(s=>s.split(j(r0)).join(j(r0.replace(side[0],side[1]))).split(j(r1)).join(j(r1+' -- COUNTED')));console.log('stored nodes edited by the plant:',Object.keys(ed).length);
 const st=store(ed);const a=(await run(LIVE,'Judge Enforcer Build','Enforcer Record',st))[0],b=(await run(CAND,'Judge Enforcer Build','Enforcer Record',st))[0];
 const R=o=>o.code_rows.filter(x=>x.rule==='E-OOR').map(x=>x.cure_reason);const ra=R(a),rb=R(b);console.log('T3 E-OOR rows live',ra.length,'candidate',rb.length);
 const OLD=' ("Ground granted in [CR1], [DR1], [CR2] or [DR2] ... does not enter those counts")',NEW='; CHANGE TO: the row without COUNTED',N2='; write the corrected row, or CHANGE TO: STRUCK';
 let dif=0;ra.forEach((x,i)=>{if(x!==rb[i]){dif++;console.log('  live:',x.slice(0,260));console.log('  cand:',rb[i].slice(0,260));}});
 const back=T(S(b)).split(j(NEW)).join(j(OLD)).split(j(N2)).join('');console.log('T3 rows differing',dif,'| candidate output equals live once the two edits are reversed:',back===T(S(a)));
 console.log('T3 with no plant, candidate equals live:',T(S((await run(LIVE,'Judge Enforcer Build','Enforcer Record',store()))[0]))===T(S((await run(CAND,'Judge Enforcer Build','Enforcer Record',store()))[0])));
 // T4 the forms told are read by the applier (Gate Build)
 const f=(arr,sid)=>{const it=arr[0].items.find(x=>x.sid===sid);return it?it.kind+': '+String(it.why).slice(0,90):'no gate item (applied)';};
 const sb=base['Send Back Record'][0][0].json.sb_items.filter(z=>z.seat==='luna'&&z.rule==='E-OOR');const it=sb[0];console.log('item used',it.sid,S(it.line).slice(0,80));
 const ans=(sid,to,extra)=>Object.assign({},extra||{},{'Send Back Record':o=>{if(extra&&extra['Send Back Record'])extra['Send Back Record'](o);const x=o[0][0].json.sb_items.find(z=>z.seat==='luna'&&z.sid===sid);x.ans='CHANGE';x.to=to;}});
 const sd=it.line.startsWith('DEFENDER')?['DEFENDER','CHALLENGER']:['CHALLENGER','DEFENDER'];
 for(const [lab,to,extra] of [['corrected row (side changed)',it.line.replace(sd[0],sd[1])],['STRUCK','STRUCK']]){const s2=store(ans(it.sid,to,extra));const x=await run(LIVE,'Gate Build','Reread Record',s2),y=await run(CAND,'Gate Build','Reread Record',s2);console.log('T4',lab,'| LIVE:',f(x,it.sid),'| CAND:',f(y,it.sid));}
 // COUNTED row: the item's row ends COUNTED everywhere; answers: the row without COUNTED, STRUCK, label NONE
 const edC=all(s=>s.split(j(it.line)).join(j(it.line+' -- COUNTED')));
 for(const [lab,to] of [['the row without COUNTED',it.line],['STRUCK','STRUCK'],['OUT-OF-ROUND CONCESSIONS: NONE','OUT-OF-ROUND CONCESSIONS: NONE']]){const e2=Object.assign({},edC);const prev=e2['Send Back Record'];e2['Send Back Record']=o=>{if(prev)prev(o);const x=o[0][0].json.sb_items.find(z=>z.seat==='luna'&&z.sid===it.sid);x.ans='CHANGE';x.to=to;};const s2=store(e2);const x=await run(LIVE,'Gate Build','Reread Record',s2),y=await run(CAND,'Gate Build','Reread Record',s2);console.log('T4 COUNTED row answered',lab,'| LIVE:',f(x,it.sid),'| CAND:',f(y,it.sid));}
})();
