// Chain replay of 34726 from Panel Cure Check with W2's chain (replies renumbered). Usage: CHAIN_EX CHAIN_WF node pkgJ4/chain_J4.cjs <SET>
const chain=require('../w2_grades/ead/chain_w2.cjs');
(async()=>{const SET=process.argv[2];const r=await chain(SET,process.env.START||'Panel Cure Check');if(r.err){console.log('ERROR '+r.err);return;}
 console.log(SET+': stored output kept for code nodes the runner cannot run: '+((r.fb||[]).join('; ')||'none'));
 const pick=n=>{const o=r.over[n];return o&&o[0]&&o[0][0]&&o[0][0].json;};
 const pcc=pick('Panel Cure Check');if(pcc&&pcc.bodies)for(const s of pcc.bodies){const p=JSON.parse(s).payload;console.log('  after cure: '+p.judge_seat+' drv_uncured '+p.drv_uncured);}
 const g=pick('Gate Record');if(g&&g.gate)console.log('  gate: '+JSON.stringify((g.gate.seats||[]).map(s=>s.seat+' items '+s.items+' cured '+s.cured+' counted '+s.uncured_counted)));
 const an=pick('Alternate Needed?')||pick('Gate Record');console.log('  alt_needed: '+JSON.stringify(an&&an.alt_needed));
 const am=pick('Alternate Merge');if(am){for(const s of am.bodies){const p=JSON.parse(s).payload;console.log('  final: '+p.judge_seat+' drv_uncured '+p.drv_uncured+' tag '+p.verdict_tag);}
  console.log('  drv_removed '+JSON.stringify(am.drv_removed)+' | tried '+JSON.stringify((am.alternates_tried||[]).map(t=>t.removed_seat+'->'+t.alternate+' '+t.result+' ('+String(t.why).slice(0,80)+')'))+' | seated '+JSON.stringify(am.alternates_seated));}
 const d=am;if(d){const s=JSON.stringify(d.summary);console.log('  summary: '+s.slice(0,700));console.log('  panel_effective '+JSON.stringify(d.panel_effective));}
for(const n of ["Replay Rows","Dry?","Verdict Rows"]){const o=pick(n);if(o)console.log("  "+n+": "+JSON.stringify(o).match(/.{0,40}(quorum|panel_split|outcome)[^,]{0,80}/gi));}
})();
