// pkgRTB family 3 substitution list (old text -> table render), shared by build_RTB3.cjs and test_RTB3.cjs. Call after PR.bind(CURE_PRESS).
const {RX,PR,RXM}=require('./rule_table.cjs');
module.exports=()=>({
 library:[
  ['pr.form','PRESSED: D<n> vs C<m> | [<round>] | \\"<the words of that round, quoted exactly>\\"',PR.render.formLine()],
  ['pr.mark','Otherwise cure it with a PRESSED line quoting the round that pressed it.]',PR.render.mark()],
  ['rxm.kg4','pressed the witness (rounds as for K-G1), or with '+RX.render.clause('that link')+'. ','pressed the witness (rounds as for K-G1), or with '+RX.render.clause('that link')+'. '+RXM.render.clause()],
  ['pr.agreement','A break that rests on an unanswered press quotes the pressing sentence instead (Commitment 5).',PR.render.agreement()]],
 prompt:[
  ['pr.agreement','A break that rests on an unanswered press quotes the pressing sentence instead (Commitment 5).',PR.render.agreement()],
  ['pr.enforcer','(ruling 392); that is not a break by absence.',PR.render.enforcer()]]});
