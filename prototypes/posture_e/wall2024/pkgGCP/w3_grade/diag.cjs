// W3 diagnosis: s111 replay with remapped replies; per seat the replaced lines and the rule items before and after.
const chain=require('../../pkgKSR/w3_grade/chain.cjs');const {remap,gremap}=require('../../pkgKSR/w3_grade/w3_KSR_ECB.cjs');const L=require('./lib.cjs');const W=process.argv[2];
(async()=>{const r=await chain(W,{after:{'Send Back Call openrouter':remap('Send Back Call openrouter','Send Back Build'),'Gate Call openrouter':gremap,'Gate Record':(over,out)=>{const G=L(W,out);const GR=over['Gate Record'][0][0].json;const SB=out('Send Back Record')[0][0].json;const PB0=out('Panel Build')[0][0].json;
 console.log('fns',Object.keys(G).join(','));console.log('gate',JSON.stringify(GR.gate&&GR.gate.seats));
 for(const s of SB.bodies){const p=JSON.parse(s).payload;const seat=p.judge_seat;const its=(GR.sb_items||SB.sb_items||[]).filter(x=>x.seat===seat);console.log('\n'+seat,'drv at SBR',p.drv_uncured,'items',its.map(x=>x.sid+':'+x.rule+':'+String(x.item).slice(0,28)).join(' | '));if(!its.length)continue;
  const j=PB0.judges.find(q=>q.seat===seat);const PT=G.gatePromptText2024(j.body);const ctx={R:G.ciRounds(PT),DL:G.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
  const F={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
  const R=G.sbApply2024(seat,p.verdict_raw,F,its,ctx.R);const k=x=>x.rule+'|'+(x.side||'')+'|'+(x.link||'');
  {const K=G.gateNewK2024(G.cureJText(p.verdict_raw,true),R.text,F,R.fields,ctx);const a=K.a||[],z=K.b||[];console.log('  before:',a.map(k).join(' ; '));console.log('  after :',z.map(k).join(' ; '));}
  console.log('  applied',JSON.stringify(R.applied));R.rp.forEach(([o,n])=>console.log('  RP',String(o).slice(0,150),'\n   ->',String(n).slice(0,150)));}}}});
 console.log('\nrows',r.rows.map(x=>(x.judge_seat||x.seat)+':'+x.drv_uncured).join(' '));})().catch(e=>{console.error(e);process.exit(1)});
