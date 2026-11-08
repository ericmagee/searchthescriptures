// pkgRTB family 2 substitution list (old clause -> table render), shared by build_RTB.cjs and test_RTB.cjs
const {RX}=require('./rule_table.cjs');
const RXSUBS=[
 ['rx.form','RETRACTED: D<n> vs C<m>\\n"','RETRACTED: D<n> vs C<m> -- <the reason: the round in brackets, then its words quoted or the verse it cites>\\n"'],
 ['rx.brokenLine','cure a BROKEN line with RETRACTED for it and one CORRECTED RESULT,','cure a BROKEN line with '+RX.render.clause('it')+','],
 ['rx.kf','or with RETRACTED for the line and one CORRECTED RESULT, or one RESTATED','or with '+RX.render.clause('the line')+', or one RESTATED'],
 ['rx.kl2','cure it with RETRACTED for the line and one CORRECTED RESULT,','cure it with '+RX.render.clause('the line')+','],
 ['rx.answered','It is then cured by RETRACTED or, where','It is then cured by '+RX.render.clause('the line')+' or, where'],
 ['rx.kg9','Cure it with RETRACTED for that line and one CORRECTED RESULT, the reason naming the round and the verse;','Cure it with '+RX.render.clause('that line')+';'],
 ['rx.kg7','or a RETRACTED line with one CORRECTED RESULT (pkgKG7)','or '+RX.render.clause('the link')+' (pkgKG7)'],
 ['rx.kcount',"kCount(x,'no RETRACTED line with one CORRECTED RESULT')","kCount(x,'no "+RX.render.clause('the link')+"')"],
 ['rx.kff','or RETRACTED the link with one CORRECTED RESULT, or RESTATED it not graded','or '+RX.render.clause('the link')+', or RESTATED it not graded'],
 ['rx.kc','or a RETRACTED line with one CORRECTED RESULT.','or '+RX.render.clause('the line')+'.'],
 ['rx.kg1count','or RETRACTED and one CORRECTED RESULT.','or '+RX.render.clause('that link')+'.'],
 ['rx.kfc','or RETRACTED the link, or RESTATED it','or '+RX.render.clause('the link')+', or RESTATED it'],
 ['rx.thatLink','or with RETRACTED for that link.','or with '+RX.render.clause('that link')+'.'],
 ['rx.eachBroken','or with one RETRACTED line for each BROKEN link of that side.','or with '+RX.render.each('BROKEN link of that side')+'.'],
 ['rx.uwb','cure it with RETRACTED: D<n> vs C<m> and exactly one CORRECTED RESULT line for your whole reply (CORRECTED RESULT: <BROKEN-1 | BROKEN-2 | PARTIAL-1 | PARTIAL-2 | PARTIAL-3 | HELD-1>, a reason may follow after " -- ")',
  'cure it with RETRACTED: D<n> vs C<m> -- <the reason: the round in brackets, then its words quoted or the verse it cites> and exactly one CORRECTED RESULT line for your whole reply (CORRECTED RESULT: <BROKEN-1 | BROKEN-2 | PARTIAL-1 | PARTIAL-2 | PARTIAL-3 | HELD-1>)']];
module.exports=RXSUBS;
