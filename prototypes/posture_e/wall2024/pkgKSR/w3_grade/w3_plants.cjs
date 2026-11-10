// W3 plants for pkgECB and pkgKSR (labels E4, E5, K3 to K8) and the gate items of the ALL chain
const {run,rd,U,cl,keyLines}=require('./w3_KSR_ECB.cjs');
const sub=(pairs,nodes)=>async(over,out)=>{for(const n of nodes){const cur=out(n);if(!cur)continue;let s=JSON.stringify(cur);let hit=0;for(const [a,b] of pairs){const A=JSON.stringify(a).slice(1,-1),B=JSON.stringify(b).slice(1,-1);const parts=s.split(A);hit+=parts.length-1;s=parts.join(B);const A2=JSON.stringify(A).slice(1,-1),B2=JSON.stringify(B).slice(1,-1);if(A2!==A){const p2=s.split(A2);hit+=p2.length-1;s=p2.join(B2);}}over[n]=JSON.parse(s);sub.hits=(sub.hits||'')+n+':'+hit+' ';}};
(async()=>{
 {const r=await run('ALL',{flip:1});const gb=r.over['Gate Build'][0];gb.forEach(x=>{if(x.json.seat!=='luna')(x.json.items||[]).forEach(i=>console.log('ALL gate item '+x.json.seat+': '+JSON.stringify(i).slice(0,900)));});
  r.over['Send Back Build'][0].forEach(x=>console.log('ALL send-back '+x.json.seat+': '+(x.json.items||[]).map(i=>i.sid+' '+i.rule+' '+i.item+(/^FORCED/.test(i.line)?' [FORCED line]':'')).join('; ')));}
 // E4: the judge's own collision line on a link with no confirmed contradiction carries the engine's words
 const P1=[['D2 vs C1 (Matthew 1:19): STANDS -- the defender narrowed','D2 vs C1 (Matthew 1:19): STANDS -- link 6 is BROKEN BY A CONFIRMED CLOSING CONTRADICTION, and the defender narrowed']];
 // E5: sol's own KEYSTONE line carries the words
 const P2=[['KEYSTONE: D6 -- STANDS -- The conclusion that Christ had no biological father remains','KEYSTONE: D6 -- STANDS -- not BROKEN BY A CONFIRMED CLOSING CONTRADICTION; the conclusion that Christ had no biological father remains']];
 for(const [name,P,pick] of [['E4 luna D2 vs C1 E-HOLD line',P1,i=>/D2 vs C1/.test(i.item)&&/HOLD/.test(i.rule)],['E5 sol KEYSTONE E-KEY line',P2,i=>/KEY/.test(i.rule)]])for(const tag of ['LIVE','ECB']){sub.hits='';
  const r=await run(tag,{before:{'Send Back Build':sub(P,['Panel Cure Check','Enforcer Record','Judge Enforcer Record'])}});const sbb=r.over['Send Back Build'][0];
  const sent=sbb.flatMap(x=>(x.json.items||[]).filter(pick).filter(i=>/BROKEN BY A CONFIRMED CLOSING CONTRADICTION/.test(i.line)&&!/\[AUDIT: LINK/.test(i.line)).map(i=>x.json.seat+' '+i.sid));
  const ns=(sbb[0].json.sb_not_sent||[]).filter(n=>/pkgECB/.test(n.why)).map(n=>n.seat+' '+n.rule+' '+n.item);
  console.log(name+' | '+tag+' | text replaced in '+sub.hits+'| planted line sent: '+(sent.join(', ')||'NO')+' | pkgECB not_sent: '+ns.length+' ['+ns.join('; ')+']');}
})().catch(e=>console.log('ERROR '+e.stack));
