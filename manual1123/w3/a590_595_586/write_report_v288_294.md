# Engine manual write report: versions 288 to 294

W3, on the operator's press "Write the four entries", 07:57 CST 2026-11-24. Seven of eight parts written. Whole manual now version 294, 723,943 characters (before: version 287, 719,080). Nothing was deleted without a replacement; every change below is the old words, then the words now in their place.

NOT YET WRITTEN: part 09.2 (the main ASK 590 entry with ASK 595). Two of its sentences said the quoted close sentences are shown cut to 500 and to 400 characters. W4's write of 07:57 CST made them whole, so those two sentences now read "shown whole" and "(each quoted sentence whole)". W1 checks them, then I write part 09.2.

## Part 09.5, version 288. ASK 590: the anti-cheat note is no longer written

Change 1. OLD WORDS:

>   - THE ANTI-CHEAT NOTE SAYS IT BREAKS NO LINK (pkgACX option B rev 2; Panel Build and Build Independent Verdict, the text of the [ANTI-CHEAT CHECK] note in __ACX):

WORDS NOW:

>   - THE ANTI-CHEAT NOTE SAYS IT BREAKS NO LINK (pkgACX option B rev 2; Panel Build and Build Independent Verdict, the text of the [ANTI-CHEAT CHECK] note in __ACX; NOT WRITTEN since ASK 590: no [ANTI-CHEAT CHECK] note is written, and the like sentence stands in the [REVERSED CLOSE SENTENCES] block, see THE CLOSING ENFORCER, ONE CLOSING CHECK):

## Part 09.8, version 289. ASK 590: the anti-cheat record node is reached by nothing; the same verse check runs in the closing enforcer

Change 1. OLD WORDS:

> (pkgOVS rev 3, ASK 311; Anticheat Record, Build Save Body):

WORDS NOW:

> (pkgOVS rev 3, ASK 311; Anticheat Record, Build Save Body; since ASK 590 Anticheat Record is reached by nothing and the same governing-verse check runs in Close Enforcer Record on each REVERSED READING):

## Part 09.3, version 290. ASK 590: the anti-cheat answer lines are no longer reached

Change 1. OLD WORDS:

>   - ANTI-CHEAT ANSWER LINES (pkgACM): a line may end with one period

WORDS NOW:

>   - ANTI-CHEAT ANSWER LINES (pkgACM; not reached since ASK 590, which took the anti-cheat nodes out of the flow): a line may end with one period

## Part 04.0, version 291. ASK 590: the first group of calls is the closing enforcer and the assume check only

Change 1. OLD WORDS:

> so Anticheat Build and Assume Check Build now run right after Close Enforcer Build.

WORDS NOW:

> so Anticheat Build and Assume Check Build now run right after Close Enforcer Build. Since ASK 590, Group 1 is Close Enforcer and Assume Check only: Close Enforcer Build leads to Assume Check Build, the batch carries no Anticheat items, and the six Anticheat nodes are reached by nothing.

## Part 09.1, version 292. ASK 586 J6: an enforcer DISAGREE answers every verse on the judge's GROUND

Change 1. OLD WORDS:

>   - E-HOLD through the gate (ECW HOLD on): an E-HOLD DISAGREE that pushes a line toward UNDERDETERMINED passes the same CARRIED BY gate as E-COL, DeepSeek's E-HOLD rule asks for CARRIED BY, and the send-back shows the judge the row.

WORDS NOW:

>   - E-HOLD through the gate (ECW HOLD on): an E-HOLD DISAGREE that pushes a line toward UNDERDETERMINED passes the same CARRIED BY gate as E-COL, DeepSeek's E-HOLD rule asks for CARRIED BY, and the send-back shows the judge the row.
>   - A DISAGREE ANSWERS EVERY VERSE ON THE JUDGE'S GROUND (ASK 586 J6; Shared Library, both copies: the E-COL and E-HOLD instructions, the reply parser read by the three Judge Enforcer Record nodes, and module ECW `gateJ6`):
>     - Why: in run 42071 the enforcer told a judge its break on D2 vs C6 was wrong, citing one verse (Luke 1:33), while the judge's GROUND rested on Jeremiah 22:30 and Acts 2:30, which the enforcer did not answer; that item began the seat's removal.
>     - Instruction: the E-COL text, after "Read the answer with every other verse either side quoted on the subject (Isaiah 28:10).", reads "A DISAGREE answers every verse on the judge's GROUND line: for each one, a clause that quotes it and says why it does not carry the judge's grade, or one CARRIED BY for each. A DISAGREE that leaves a verse of the GROUND unanswered is recorded and not sent back." The E-HOLD text, after "Without it the push is recorded and not sent back.", reads the same with "says why it leaves the point open".
>     - Code: the reply parser keeps, for each "ENFORCER: <id>" line, the lines that follow it up to the next ENFORCER line, whole. When the gate would send a DISAGREE, `gateJ6` also requires: every CARRIED BY on the reply line passes the gate, not only the last; and every verse reference on the judge's GROUND (from "GROUND:" to the next field, read from the judge's whole line) is cited in the item, on the reply line or in the lines kept with it. An "ENGAGE ... -- NO" line names verses without answering them and is not an answer. A range on the GROUND is answered only by a citation that covers the whole range.
>     - A miss is held, not sent: the row reads "ENFORCER HELD (pkgECW, recorded, not sent back: RECORDED, NOT SENT BACK, ASK 586 J6: the enforcer's DISAGREE does not answer <references>, on the judge's GROUND)". It touches no seat and no count, and the judge's grade stands (ruling 428). The pressed-verse rule (ASK 355) is unchanged and runs on each CARRIED BY.
>     - Limits: a citation counts as an answer; the code does not read whether the clause says why the verse does not carry the grade. A right correction by the enforcer that leaves one GROUND verse uncited does not reach the judge. Shown offline on stored row 53043 of run 42071 (sent before, held after, naming Jeremiah 22:30 and Acts 2:30). Not shown by a run.

## Part 08.0, version 293. ASK 586 J1: a result against the defender needs the keystone broken

Change 1. OLD WORDS:

> BROKEN gives CHALLENGER WINS when CHALLENGE STANDING is SELF-SUPPORTED and no collision on that seat is graded CHALLENGER LINK BROKEN (ASK 517), and UNDERDETERMINED otherwise;

WORDS NOW:

> BROKEN gives CHALLENGER WINS when CHALLENGE STANDING is SELF-SUPPORTED, no collision on that seat is graded CHALLENGER LINK BROKEN (ASK 517) and the seat's KEYSTONE line does not read STANDS (ASK 586 J1), and UNDERDETERMINED otherwise;


Change 2. OLD WORDS:

> The seat's word is given by the engine from these rules, not taken from the judge's RESULT line (ONE DECIDER FOR THE RESULT WORD, below).

WORDS NOW:

> The seat's word is given by the engine from these rules, not taken from the judge's RESULT line (ONE DECIDER FOR THE RESULT WORD, below).
> - A RESULT AGAINST THE DEFENDER NEEDS THE KEYSTONE BROKEN (ASK 586 J1; Panel Build, Build Independent Verdict, and the Shared Library, both copies; it holds whichever side the Oracle sits on):
>   - Judges' text, after "BROKEN gives CHALLENGER WINS when CHALLENGE STANDING is SELF-SUPPORTED, and UNDERDETERMINED when it is PROP-DEPENDENT or COLLAPSED.": "A RESULT against the defender requires your KEYSTONE line to read BROKEN, by a collision line on the keystone link or by the link it rests on. If your keystone line reads STANDS, you may not write a RESULT against the defender: write UNDERDETERMINED unless your verdict is HELD."
>   - The seat's word: where the rules above give CHALLENGER WINS and the seat's KEYSTONE line reads STANDS, the word is UNDERDETERMINED. The break stays on its collision line and counts as a broken link; it does not carry the conclusion. The engine applies this in the three places it computes the word (the recompute, the audit tag and the gate after the send-back), and the record then names the rule: "KEYSTONE STANDS (the keystone link is not broken; ASK 586 J1 ...)". Any word but STANDS, or a KEYSTONE line the reader cannot read, moves no word.
>   - The reader (`ks586`) reads the word STANDS, BROKEN, WITHDRAWN or UNDERDETERMINED after "--", an em dash, an en dash, a dash or a colon, in "KEYSTONE: D<n> -- STANDS" and in the form "KEYSTONE: D<n> vs C<m> (<references>) -- STANDS".
>   - Shown offline, nothing stored rewritten: with the Oracle as challenger (171 runs, 513 judgments, 2026-10-02 to 11-17), 149 judgments read CHALLENGER WINS, and 56 of them, in 32 runs, stand beside KEYSTONE STANDS and would read UNDERDETERMINED. With the Oracle as defender (runs 41418, 41822, 42071), 3 of 9 judgments (1271, 1272, 1273). Not shown by a run.

## Part 09.6, version 294. ASK 590: the regrade path leads to the panel, not to the anti-cheat step

Change 1. OLD WORDS:

> on a run that reaches Anticheat Resume by the regrade path (Close Enforcer Record > Regrade After Quotes?) without Build Save Body

WORDS NOW:

> on a run that reaches Panel Build by the regrade path (Close Enforcer Record > Regrade After Quotes?; since ASK 590 that path leads to Panel Build, not to Anticheat Resume) without Build Save Body
