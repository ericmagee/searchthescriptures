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
 form:'RETRACTED: D<n> vs C<m> -- <the reason: the round in brackets and its words quoted, or the verse>',
 rules:['exactly one CORRECTED RESULT line in the whole reply (rxNoRes)','a reason that names the round in brackets and quotes its words, or names the verse (rxNoWhy, ruling 105)'],
 example:'RETRACTED: D2 vs C1 -- [DR3] answers the press: "the coming together is the taking into his house"\nCORRECTED RESULT: HELD-1',
 reason:'with its reason (the round in brackets and its words quoted, or the verse)',
 render:{
  formLine:()=>'RETRACTED: D<n> vs C<m> -- <the reason: the round in brackets and its words quoted, or the verse>',
  clause:t=>'RETRACTED for '+t+', with its reason (the round in brackets and its words quoted, or the verse), and the one CORRECTED RESULT of your whole reply',
  each:t=>'RETRACTED for each '+t+', each with its reason (the round in brackets and its words quoted, or the verse), and the one CORRECTED RESULT of your whole reply'}};
// Family 2b: RETRACTED, send-back phase (Send Back Record; FORCED lines only; no RESULT, pkgGRT). Table-owned; text unchanged in step 2.
const RXSB={rule:'RETRACTED (send-back)',form:'CHANGE TO: RETRACTED: <pair>',note:'A collision line is regraded, never retracted: RETRACTED is for a FORCED line only (pkgGRT).'};
module.exports={KW,RX,RXSB};
