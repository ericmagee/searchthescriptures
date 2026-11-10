// W3 plants for pkgKSR / pkgECB rev 2b (labels R4 to R8)
const {run,rd,U,cl,keyLines,rowSum}=require('./w3_KSR_ECB.cjs');let ok=0,bad=0;const T=(c,m)=>{c?ok++:bad++;console.log((c?'OK   ':'FAIL ')+m);};
const ORDER=Object.keys(rd).map(n=>({n,t:rd[n][0].startTime})).sort((a,b)=>a.t-b.t).map(o=>o.n);const PCC=ORDER.indexOf('Panel Cure Check');
const subIn=(pairs,nodes)=>async(over,out)=>{for(const n of nodes){const cur=out(n);if(!cur)continue;let s=JSON.stringify(cur);let hit=0;for(const [a,b] of pairs){for(let lvl=0,A=a,B=b;lvl<3;lvl++){A=JSON.stringify(A).slice(1,-1);B=JSON.stringify(B).slice(1,-1);const p=s.split(A);if(p.length>1){hit+=p.length-1;s=p.join(B);}}}if(hit)over[n]=JSON.parse(s);}};
const SBN=['Panel Cure Check','Enforcer Record','Judge Enforcer Record'];const BRK=/BROKEN BY A CONFIRMED CLOSING CONTRADICTION/;
const rowsKey=r=>r.rows.map(w=>w.judge_seat+':'+((U(w.verdict_raw).match(/(?:^|\n)\s*[-*\s]*KEYSTONE[^\n]{0,70}/g)||[]).map(s=>s.trim()).join(' / '))+' u'+w.drv_uncured).join(' | ');
(async()=>{
 // R4, R5: lines planted after the recompute, before Send Back Build
 const P={
  'R4a luna own D2 vs C1 STANDS line with the eight words':[[['D2 vs C1 (Matthew 1:19): STANDS -- the defender narrowed','D2 vs C1 (Matthew 1:19): STANDS -- link 6 is BROKEN BY A CONFIRMED CLOSING CONTRADICTION, and the defender narrowed']],i=>/D2 vs C1/.test(i.item)&&/HOLD/.test(i.rule)],
  'R4b sol own KEYSTONE STANDS line with the eight words':[[['KEYSTONE: D6 -- STANDS -- The conclusion that Christ had no biological father remains','KEYSTONE: D6 -- STANDS -- not BROKEN BY A CONFIRMED CLOSING CONTRADICTION; the conclusion that Christ had no biological father remains']],i=>/KEY/.test(i.rule)],
  'R5a luna D2 line with a hand-typed mark for LINK 2 (not confirmed)':[[['D2 vs C1 (Matthew 1:19): STANDS -- the defender narrowed','D2 vs C1 (Matthew 1:19): STANDS -- [AUDIT: LINK 2 BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- DEFENDER] the defender narrowed']],i=>/D2 vs C1/.test(i.item)&&/HOLD/.test(i.rule)],
  'R5b luna D2 line with a hand-typed mark for LINK 6 (confirmed, other link)':[[['D2 vs C1 (Matthew 1:19): STANDS -- the defender narrowed','D2 vs C1 (Matthew 1:19): STANDS -- [AUDIT: LINK 6 BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- DEFENDER] the defender narrowed']],i=>/D2 vs C1/.test(i.item)&&/HOLD/.test(i.rule)],
  'R5c sol own KEYSTONE line in the engine form for link 4 (not confirmed)':[[['KEYSTONE: D6 -- STANDS -- The conclusion that Christ had no biological father remains an exhibited inference from the conception accounts and the birth of Mary; it was neither withdrawn nor textually refuted under the prescribed collision test.','KEYSTONE: D4 -- BROKEN -- LINK 4 BROKEN BY A CONFIRMED CLOSING CONTRADICTION']],i=>/KEY/.test(i.rule)],
  'R5d sol own KEYSTONE line: the engine line for link 6 with more words after it':[[['KEYSTONE: D6 -- STANDS -- The conclusion that Christ had no biological father remains an exhibited inference from the conception accounts and the birth of Mary; it was neither withdrawn nor textually refuted under the prescribed collision test.','KEYSTONE: D6 -- BROKEN -- LINK 6 BROKEN BY A CONFIRMED CLOSING CONTRADICTION, yet the defense stands']],i=>/KEY/.test(i.rule)]};
 for(const name of Object.keys(P)){const [pairs,pick]=P[name];const res={};for(const tag of ['LIVE','ALL']){const r=await run(tag,{before:{'Send Back Build':subIn(pairs,SBN)}});const sbb=r.over['Send Back Build'][0];
   res[tag]=sbb.flatMap(x=>(x.json.items||[]).filter(pick).filter(i=>i.line.includes(pairs[0][1].slice(0,60))).map(i=>x.json.seat+' '+i.sid));res[tag+'n']=(sbb[0].json.sb_not_sent||[]).filter(n=>/pkgECB/.test(n.why)).length;}
  T(res.LIVE.length>0&&res.ALL.length>0,name+': live sends '+(res.LIVE.join()||'NOT (plant void)')+'; pkgECB sends '+(res.ALL.join()||'NOT')+'; pkgECB withheld '+res.ALLn+' items in all');}
 // R5e other links' items equal
 {const a=await run('LIVE'),b=await run('ALL');const it=r=>r.over['Send Back Build'][0].flatMap(x=>(x.json.items||[]).map(i=>x.json.seat+'|'+i.rule+'|'+i.item+'|'+i.line));const A=it(a),B=new Set(it(b));const gone=A.filter(x=>!B.has(x));const extra=[...B].filter(x=>!A.includes(x));
  console.log('   ALL: items in live and not in ALL: '+gone.length+'\n     '+gone.map(x=>x.slice(0,150)).join('\n     ')+'\n   items in ALL and not in live: '+extra.length+(extra.length?'\n     '+extra.map(x=>x.slice(0,150)).join('\n     '):''));
  T(gone.every(x=>/D6 vs C[56]|KEYSTONE D6/.test(x))&&extra.length===0,'R5e every item withheld by ALL is a link 6 collision line, its FORCED line or the KEYSTONE D6 item; every other item equals live');
  console.log('   sb_not_sent (ALL): '+JSON.stringify(b.over['Send Back Build'][0][0].json.sb_not_sent.map(n=>n.seat+' '+n.rule+' '+n.item)));
  // R8 enforcer_log rows
  const lg=r=>((r.over['Alternate Merge']||r.stored('Alternate Merge'))[0][0].json.enforcer_log||[]);const ka=new Set(lg(a).map(x=>JSON.stringify(x)));const nw=lg(b).filter(x=>!ka.has(JSON.stringify(x)));console.log('   enforcer_log rows: live '+lg(a).length+', ALL '+lg(b).length+', rows in ALL not in live '+nw.length);
  const kinds={};nw.forEach(x=>{const k=x.kind+'|'+x.rule+'|'+x.cure_status;kinds[k]=(kinds[k]||0)+1;});console.log('     '+JSON.stringify(kinds));require('fs').writeFileSync(__dirname+'/rev3_new_log_rows.json',JSON.stringify(nw));
  const keys=new Set();lg(a).forEach(x=>Object.keys(x).forEach(k=>keys.add(k)));const nk=new Set();nw.forEach(x=>Object.keys(x).forEach(k=>{if(!keys.has(k))nk.add(k);}));T(nk.size===0,'R8 the new rows use only fields live rows use'+(nk.size?': new fields '+[...nk].join():''));}
 // R6 moved to w3_r3_forms.cjs
 const up=ORDER.slice(0,PCC);
 // R7 confirmed list planted
 for(const [name,mut] of [['a. confirmed line on defender link 3',c=>{c.cec.confirmed.forEach(x=>x.link=3);c.cec.rows.forEach(x=>{if(x.answer==='CONFIRMED')x.link=3;});}],['b. confirmed line on CHALLENGER link 6',c=>{c.cec.confirmed.forEach(x=>x.side='CHALLENGER');c.cec.rows.forEach(x=>{if(x.answer==='CONFIRMED')x.side='CHALLENGER';});}],['c. no confirmed line',c=>{c.cec.confirmed=[];c.cec.rows.forEach(x=>{if(x.answer==='CONFIRMED')x.answer='CONSISTENT';});}]]){
  const hook={before:{'Panel Cure Check':async(over,out)=>{const c=cl(out('Close Enforcer Record'));mut(c[0][0].json);over['Close Enforcer Record']=c;}}};let a,b;try{a=await run('LIVE',hook);b=await run('ALL',hook);}catch(e){T(false,'R7 '+name+': '+e.message.slice(0,200));continue;}
  const ra=JSON.stringify(a.rows),rb=JSON.stringify(b.rows);console.log('   live: '+rowsKey(a).slice(0,420)+'\n   ALL : '+rowsKey(b).slice(0,420));T(ra===rb,'R7 '+name+': ALL written rows equal live written rows');}
 console.log(ok+' OK, '+bad+' FAIL');
})().catch(e=>console.log('ERROR '+e.stack));
