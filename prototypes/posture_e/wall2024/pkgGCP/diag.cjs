// Diagnostic: per seat in the 34626 chain, the rule items raised before the send-back and gate changes (a) and after (z), and the replaced lines.
const chain=require('../pkgKSR/w3_grade/chain.cjs');const L=require('./glib.cjs');
(async()=>{const r=await chain(process.argv[2]||'pkgGCP/parent_s110_GCP.json',{after:{'Gate Record':(over,out)=>{const G=L(out);const GR=over['Gate Record'][0][0].json;const SB=out('Send Back Record')[0][0].json;const PB0=out('Panel Build')[0][0].json;
 for(const s of SB.bodies){const p=JSON.parse(s).payload;const seat=p.judge_seat;const its=(GR.sb_items||[]).filter(x=>x.seat===seat);if(!its.length){console.log(seat,'no send-back items');continue;}
  const j=PB0.judges.find(q=>q.seat===seat);const PT=G.gatePromptText2024(j.body);const ctx={R:G.ciRounds(PT),DL:G.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
  const F={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
  const R=G.sbApply2024(seat,p.verdict_raw,F,its,ctx.R);const a=G.gnkRun2024(G.cureJText(p.verdict_raw,true),F,ctx).its;const z=G.gnkRun2024(R.text,R.fields,ctx).its;const k=x=>x.rule+'|'+(x.side||'')+'|'+(x.link||'');
  console.log('\n'+seat,'drv',p.drv_uncured,'applied',R.applied.join(','),'rp',R.rp.length);
  console.log('  before:',a.map(k).join(' ; '));console.log('  after :',z.map(k).join(' ; '));
  R.rp.forEach(([o,n])=>console.log('  RP',String(o).slice(0,110),'\n   ->',String(n).slice(0,110)));
  console.log('  cure report lines:',(p.verdict_raw.match(/\[AUDIT v21: DEBATE RULE VIOLATION REPORT[^\n]{0,160}/g)||[]).join('\n    '));}}}});
 console.log('\nrows',r.rows.map(x=>(x.judge_seat||x.seat)+':'+x.drv_uncured).join(' '));})().catch(e=>{console.error(e);process.exit(1)});
