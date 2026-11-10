// W3 study: luna's gate answer G5 in execution 34626. Same words, FORCED line moved from the CHANGE TO field to the reason field (the form the gate prompt asks for). Live s110 code.
const chain=require('../pkgKSR/w3_grade/chain.cjs');const rd=chain.rd;const cl=x=>JSON.parse(JSON.stringify(x));
(async()=>{for(const mode of ['stored','forced in the reason field']){
 const r=await chain('/mnt/project-files/wall2024/fetchback_live_s110.json',{after:{'Gate Call openrouter':async over=>{if(mode==='stored')return;const c=cl(rd['Gate Call openrouter'][0].data.main[0]);let t=c[0].json.choices[0].message.content;
   const m=/(GATE: G5 \|\| CHANGE TO: [\s\S]*?); (FORCED: [\s\S]*?) \|\| ([\s\S]*)$/.exec(t);if(!m)throw new Error('G5 not found');t=t.slice(0,m.index)+m[1]+' || '+m[2];c[0].json.choices[0].message.content=t;over['Gate Call openrouter']=[c];}}});
 const g=(r.over['Gate Record']||r.stored('Gate Record'))[0][0].json;console.log(mode+': '+JSON.stringify(g.gate.seats));
 g.gate_rows.filter(x=>/G5|NEW RULE/.test(x.item)).forEach(x=>console.log('   '+x.item+' | '+x.cure_status+' | '+String(x.cure_reason).slice(-330)));
 console.log('   written row luna drv_uncured: '+r.rows.find(w=>w.judge_seat==='luna').drv_uncured);}})().catch(e=>console.log('ERROR '+e.stack));
