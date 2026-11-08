// pkgRTB rule table (D50; W2, 11-08): ONE source for every judge-, enforcer- and audit-facing copy of a rule's answer forms.
// Family 1: K-W (a side withdrew or granted, in its own round, footing of a link it keeps). The forms are the cure reader's, in reader order
// (Shared Library K-W cure: kwSt, kwCo, kwRe, then NOT HELD with a 6-word run of the flagged sentence). build_RTB.cjs renders every copy from
// this file; test_RTB.cjs checks that every copy in every node equals its render and that each example passes its own reader only.
// Text is written in source form: a double quote is \" (valid in the '...' and "..." literals that hold these copies).
const Q='\\"';
const KW={
 rule:'K-W',
 forms:[
  {id:'STANDS',   text:'STANDS WITHOUT IT because <layer>', reader:'kwSt',
   example:'STANDS WITHOUT IT because the descent is carried by [L1] Romans 1:3 "made of the seed of David according to the flesh".'},
  {id:'CONCEDED', text:'CONCEDED', reader:'kwCo', example:'CONCEDED: no layer the side gives carries the descent.'},
  {id:'REASSERTED',text:'REASSERTED IN <round> '+Q+'<quote>'+Q, reader:'kwRe', example:'REASSERTED IN [DR4] "the child is of the seed of David by Joseph".'},
  {id:'NOT HELD', text:'NOT HELD with a reason that quotes the flagged sentence (six words in a row, or all of it when shorter)', reader:'KW_NH',
   example:'NOT HELD: "the son of Joseph as was supposed" withdraws no footing; it restates the narrator.'}],
 // the stake sentence follows ENF_STATUS['K-W'] in the library (read by the build)
 stake:s=>s==='LIVE'?'K-W is a LIVE rule: an item left unanswered after the cure removes the seat.':'K-W is a TRIAL rule: an item left unanswered removes no seat.',
 render:{
  // the judges' agreement (first person; 11 prompt nodes and 7 library nodes)
  agreement:()=>'For every withdrawal or concession the engine puts to me (K-W), I answer in one of four forms: STANDS WITHOUT IT because <layer>; CONCEDED; REASSERTED IN <round> '+Q+'<quote>'+Q+', when a later round rests on what was withdrawn; or NOT HELD with a reason that quotes the flagged sentence (six words in a row, or all of it when shorter), when the sentence withdraws no footing.',
  // the audit marks (library, v30 and v31 marks)
  audit:()=>'the judge answers STANDS WITHOUT IT because <layer>, CONCEDED, REASSERTED IN <round> '+Q+'<quote>'+Q+', or NOT HELD with a reason that quotes it (six words in a row, or all of it when shorter).',
  // the cure ask: appended after the STANDS / CONCEDED guidance
  cureAskTail:()=>' Where a later round rests on what was withdrawn, answer REASSERTED IN <round> '+Q+'<quote>'+Q+'. Where the sentence withdraws no footing, answer NOT HELD with a reason that quotes it (six words in a row, or all of it when shorter).',
  // the DeepSeek enforcer rule's list of the four forms
  enforcer:()=>'STANDS WITHOUT IT because <a layer>; CONCEDED; REASSERTED IN <round> "<quote>"; or NOT HELD with a reason that quotes the flagged sentence (six words in a row, or all of it when shorter).'}};
// Family 2: RETRACTED, cure phase (library cureVerdicts: rxNoRes = exactly one CORRECTED RESULT in the reply; rxNoWhy via cureReasoned = a reason
// for the pair that names a round [CRn]/[DRn] and quotes 3+ words or cites a verse, ruling 105). Renders carry no quote characters, so they
// sit unchanged in both '...' and "..." literals.
const RX={
 rule:'RETRACTED (cure)',
 form:'RETRACTED: D<n> vs C<m> -- <the reason: the round in brackets, then its words quoted or the verse it cites>',
 rules:['exactly one CORRECTED RESULT line in the whole reply (rxNoRes)','a reason that names the round in brackets and quotes its words, or names the verse (rxNoWhy, ruling 105)'],
 example:'RETRACTED: D2 vs C1 -- [DR3] answers the press: "the coming together is the taking into his house"\nCORRECTED RESULT: HELD-1',
 reason:'with its reason (the round in brackets, then its words quoted or the verse it cites)',
 render:{
  formLine:()=>'RETRACTED: D<n> vs C<m> -- <the reason: the round in brackets, then its words quoted or the verse it cites>',
  clause:t=>'RETRACTED for '+t+', with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply',
  each:t=>'RETRACTED for each '+t+', each with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply'}};
// Family 2b: RETRACTED, send-back phase (Send Back Record; FORCED lines only; no RESULT, pkgGRT). Table-owned; text unchanged in step 2.
const RXSB={rule:'RETRACTED (send-back)',form:'CHANGE TO: RETRACTED: <pair>',note:'A collision line is regraded, never retracted: RETRACTED is for a FORCED line only (pkgGRT).'};
// Family 3: "unanswered", the PRESSED cure for K-G1 / K-G4 (library: P.PRESSED reads 'PRESSED: <pair> | [<round>] | "<quote>"'; CURE_PRESS gives
// the rounds by side; cureFoundAll needs the quote word for word in that round; kg4Split makes the cure fail when a later round of the
// holding side names every pressed witness). The rounds are read from the library's CURE_PRESS at build time (PR.bind), never typed here.
// Renders carry no quote characters.
const PR={
 rule:'PRESSED (cure for K-G1 / K-G4)',
 rounds:null,
 bind(cp){this.rounds=cp;return this;},
 roundsText(){const L=a=>a.map(r=>'['+r+']');const j=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' or '+a[a.length-1];
  return j(L(this.rounds.DEFENDER))+' against the defender, '+j(L(this.rounds.CHALLENGER))+' against the challenger';},
 example:'PRESSED: D2 vs C1 | [DR2] | "the coming together is the taking into his house"',
 render:{
  formLine:()=>'PRESSED: D<n> vs C<m> | [<the round that pressed the witness>] | \\"<its words, quoted exactly>\\"',
  mark:()=>'Otherwise cure it with one line PRESSED: D<n> vs C<m> | [<round>] | <the pressing words in quotation marks>, the round '+PR.roundsText()+', its words standing word for word in that round; it does not cure when a later round of that side names every pressed witness the line rests on.]',
  agreement:()=>'A break that rests on an unanswered press quotes the pressing sentence instead (Commitment 5); to cure such a break I write PRESSED: D<n> vs C<m> | [<round>] | <the pressing words in quotation marks>, the round '+PR.roundsText()+', its words standing word for word in that round.',
  enforcer:()=>'(ruling 392); that is not a break by absence. Its cure line is PRESSED: D<n> vs C<m> | [<round>] | <the pressing words in quotation marks>, the round '+PR.roundsText()+', its words standing word for word in that round; it does not cure when a later round of the side that holds the link names every pressed witness the line rests on.'}};
// Family 3b: RETRACTED of a K-G4 meaning break (library K-G4 branch, !g4Unans2024, ruling 421): 6+ words of a holding-side round, or a verse such a round names.
const RXM={rule:'RETRACTED (K-G4 meaning break)',
 render:{clause:()=>'Where your line names no pressed witness left unanswered, the break rests on meaning (ruling 421): only one FORCED line cures it, or RETRACTED with a reason that quotes 6 or more words, word for word, from a round of the side that holds the link, or names a verse of the line that such a round names. '}};
// PU (family 4, K-G11 / K-P; DESIGN_UNPROVEN.md): a BROKEN line or a count that rests only on presses that are no witness.
// Engine: one cure branch for K-G11 and line-form K-P (RETRACTED; one RESTATED line not graded LINK BROKEN; or one RESTATED LINK BROKEN line
// whose unanswered verse is in the side's proven pressed-witness set, pwUnans ∩ pwk); count-form K-P: CORRECTED COUNT within the cap + STANDING.
const PU={rule:'K-G11 / K-P',
 notBroken:'one RESTATED line for it that is not graded LINK BROKEN',
 restated:'one RESTATED LINK BROKEN line that names, as left unanswered, a verse that the list against that side carries under PRESSED WITH: and the ledger marks PROVEN or PROVEN BY REFERENCE',
 count:'CORRECTED COUNT for that side without that premise and the CORRECTED STANDING that count makes true',
 render:{
  kg11:()=>'or with '+PU.notBroken+'; or with '+PU.restated+'.',
  kp:()=>'or '+PU.notBroken+', or '+PU.restated+'.',
  markLine:()=>'TRIAL rule: answer it in the cure with '+RX.render.clause('that line')+', or with '+PU.notBroken+', or with '+PU.restated+'; it removes no seat. REVIEW THIS ROW.]',
  markCount:()=>'TRIAL rule: answer it in the cure with '+PU.count+'; it removes no seat. REVIEW THIS ROW.]'}};
module.exports={KW,RX,RXSB,PR,RXM,PU};
