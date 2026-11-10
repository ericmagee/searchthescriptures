// W2: which applied replacement (rp tag) meets condition (a) for a planted D6 vs C6 line, per seat, at the Gate Record call (gate mode).
const chain=require('../../pkgKSR/w3_grade/chain.cjs');const Lb=require('../../pkgGCP/glib.cjs');
(async()=>{let G;const r=await chain(process.argv[2]||'pkgGCP/parent_s111_GCP.json',{before:{'Gate Record':(over,out)=>{G=Lb(out);
 const PASS=out('Send Back Record')[0][0].json;const GR=out('Gate Build')[0];const PB0=out('Panel Build')[0][0].json;
 for(const seat of ['luna','sol']){const b=JSON.parse(PASS.bodies.find(s=>JSON.parse(s).payload.judge_seat===seat)).payload;const raw=b.verdict_raw;
  const its=(PASS.sb_items||[]).filter(x=>x.seat===seat);const F={verdict_tag:b.verdict_tag,defense_standing:b.defense_standing,conceded_links:b.conceded_links,challenge_standing:b.challenge_standing,challenger_conceded_links:b.challenger_conceded_links};
  const j=(PB0.judges||[]).find(q=>q.seat===seat);const PT=j?G.gatePromptText2024(j.body):'';const R=G.sbApply2024(seat,raw,F,its,PT?G.ciRounds(PT):null);
  console.log(seat,'items',its.map(x=>x.sid+':'+x.rule).join(','),'| rp:');(R&&R.rp||[]).forEach(p=>console.log('   ',p[2]||'(no tag)','|',String(p[0]).replace(/\s+/g,' ').slice(0,90)));}}}});})().catch(e=>{console.error(e);process.exit(1)});
