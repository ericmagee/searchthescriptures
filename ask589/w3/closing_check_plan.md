# ASK 589, item A2: ONE closing check in place of the anti-cheat check. Finding and plan, draft 1

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 2026-11-24 CST, on the operator's order of 23:59 CST 2026-11-23 (W3 thread): "Turn your opinion into a finding. Work on that recommendation and see if you can bring that into a workable solution." For W1's grade and W4's read of the live engine. Nothing is built or written.

SOURCE AND LIMITS. Engine manual version 275, every line naming the anti-cheat check or the closing enforcer (SQL over engine_manual_full, 40 lines read whole); md_notes_rulings 412 and 427, whole; debate_enforcer_log, rule E-CLOSECON, all 272 rows counted and 4 read; debate_judgments, every line of every stored judgment that names the anti-cheat check (59 lines counted, 6 read whole). NOT read: the code and the live flow (W4's); the judges' prompts as sent (not stored where I read). No judge line was hand-graded right or wrong by me.

## 1. FINDING

1. TWO CHECKS READ THE SAME CLOSING SENTENCES.
   a. THE CLOSING ENFORCER (E-CLOSECON, "the perjury rule"). Runs before the judges. Each side's close is read twice, independently; a CONFIRMED stands only when both reads confirm the same side and link, and code finds both quotations word for word in that side's own rounds. A confirmed contradiction makes the link BROKEN for every judge. Every answer is a row in debate_enforcer_log, and a confirmed one enters the debater fault ledger.
   b. THE ANTI-CHEAT CHECK (ruling 427). One read. A REVERSED answer becomes a note in the panel judges' prompt: "The close sentence is disregarded (this note by itself breaks no link; only a pair listed under CONFIRMED CLOSING CONTRADICTIONS is confirmed); grade this side's earlier answer". It writes no row in debate_enforcer_log. Its audit rows in the review notes "do not fire" since s138 (manual 09.5).
2. THE ANTI-CHEAT CHECK IS NOT OFF. IT IS LIVE AND UNRECORDED. Its notes reach the panel: 59 judge lines in 45 stored judgments of 31 runs name it, the latest in run 41822 (2026-11-23). What was removed at s138 was only its place before the single judge and the save.
3. THE JUDGES REJECT MANY OF ITS NOTES. 33 of the 59 lines, in 17 runs, are the judge's NOT HELD against the note.
   a. Run 41822, two judges (judgments 1269, 1270): the note gave the DEFENDER's sentence "Two fatherhoods stand together ..." to the CHALLENGER as the challenger's earlier words. Judgment 1269: "The system attributed the defender's earlier quote ... to the challenger, who never said it."
   b. Run 37203 (manual 09.7, pkgOVS): "all three judges obeyed an anti-cheat strike" that paired a close bullet with the wrong verse.
   c. Run 41043 (judgment 1248): the judge held the note was no reversal, and still wrote "The flagged sentence remains disregarded as directed." A note the judge finds wrong still strikes the sentence.
4. THE CLOSING ENFORCER, BY CONTRAST, IS RECORDED AND CHECKED TWICE: 272 rows in 51 runs; 134 NONE; 86 CONFIRMED (47 defender in 15 runs, 39 challenger in 14 runs); 51 NOT A CONTRADICTION. Run 42071: 3 CONFIRMED against the challenger's LINK 1.
5. THE TWO CAN DISAGREE ON ONE PAIR, and the manual says so: "The disagreement between the anti-cheat check and the post-panel contradiction call (J1) is not resolved" (09.5, 17.0).
6. SO: the need the operator approved (rulings 412 item 3, 427) stands, and it is being served by the weaker of two mechanisms: one read, no record, no review, and errors that reach the judges as instructions.

## 2. THE PLAN: one closing check, before the judges, recorded, live

S1. ONE READER. The closing enforcer becomes the only reader of the closing rounds. Its candidate list gains what the anti-cheat check looks for: each close sentence that names a verse or link that side argued earlier, set beside that side's own earlier sentence on that verse (ruling 427). It keeps its three guards: two independent reads that must agree; both quotations found word for word in THAT side's own rounds (earlier round 1 to 3, closing round 4); the governing-verse rule of pkgOVS, so a quote standing under another verse is not paired.

S2. TWO ANSWERS, AS THE TWO RULINGS SAY. Nothing new is ruled.
   a. CONFIRMED CONTRADICTION (two statements that cannot both be true, on a declared link): the link is BROKEN for every judge. This is today's rule, unchanged.
   b. REVERSED READING (the side's close gives a verse a reading its own earlier round did not, short of (a)): the close sentence is DISREGARDED and the earlier answer is graded on its own words. This is ruling 427, unchanged.

S3. WHAT ACTING MEANS FOR (b), LIVE, NOT TRIAL.
   a. The judges receive, before they judge, one block: REVERSED CLOSE SENTENCES, each with both quotations and rounds, under the existing CONFIRMED CLOSING CONTRADICTIONS block. It replaces the [ANTI-CHEAT CHECK] notes.
   b. Every answer, REVERSED or not, is a row in debate_enforcer_log under E-CLOSECON, so each can be reviewed and struck if false, as confirmed contradictions are today.
   c. A judge may still answer NOT HELD with its reason (the judge keeps the decision, ruling 428); that line is recorded.
   d. FOR W1'S GRADE: whether a judge's grade that quotes a disregarded close sentence as that side's footing is sent back once. I propose NOT in this build: it adds a new send-back rule, and the scope rule says change only what addresses the issue. It can be carded after one run shows whether judges lean on struck sentences.

S4. THE ANTI-CHEAT NODES LEAVE THE PATH (Anticheat Build, Call, Record, Anticheat Only?). One enforcer call fewer; the manual measured that step at 100 to 233 seconds. W4 says whether the nodes stay in the flow unconnected.

S5. PROOF BEFORE THE CARD, offline, by W4 on stored runs, with counts posted for W1:
   a. Run 32643 (the test ruling 427 names): the defender's close sentence on Deuteronomy 22:24 must read REVERSED against its link-round sentence, and one held reading must raise nothing.
   b. Run 41822: the note that gave the defender's sentence to the challenger must NOT appear. W4 states why it appeared, since the manual says a REVERSED answer is shown only when both quotations stand in the side's own rounds.
   c. Run 37203: the wrong-verse pairing must not appear.
   d. Run 42071: its 3 confirmed contradictions are unchanged.
   e. Over all stored runs with closing rounds: how many REVERSED findings the one check gives, and for the 33 NOT HELD lines, how many of those notes would no longer be raised.
   f. Size of the judges' block and of the enforcer request.

S6. WHAT THIS CHANGES IN STANDING RULINGS, to be said on the card. Ruling 427's rule is kept and its TRIAL status ends; its mechanism (a separate DeepSeek read "after both closes") is replaced by the closing enforcer's read. Ruling 412 item 3 is kept. The perjury rule is unchanged. No model setting is touched.

## 3. NOT KNOWN, W4 TO READ IN THE LIVE ENGINE 7536d7bf
1. Where the Anticheat nodes sit in the live path today, and whether any audit row fires.
2. Why run 41822's note crossed the sides.
3. Whether the closing enforcer's two reads can carry the added candidates without a new call.
4. Whether a pair can be answered both CONFIRMED and REVERSED, and which wins (I propose CONFIRMED).

## 4. CARD
One write card from W4 after W1's grade of the build, with the before and after text of the judges' block and of the enforcer instruction, the S5 counts, and the S6 statement.
