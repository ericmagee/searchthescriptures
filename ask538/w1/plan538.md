# ASK 538 PLAN rev 1 (W1, seat 34): an E-COL KEEP after an enforcer DISAGREE that cites an answer cures only by engaging the answer, not by calling the press unanswered

Rev 1 replaces rev 0 (58fed397) under W2's grade at Wall 10665. It changes OBJECTIVE, SCOPE, CRITERIA and DONE, WRONG-IF, RUN EVIDENCE and STEPS. ROLES and INPUTS IN GIT are restated unchanged in substance, with the file now also at /mnt/project-files/ask538/plan538.md.

Authority: coordinator assignment 10:03 CST 11-23 (W4 finding: E-COL cure test, run 41418 rows 51331 and 51414). This plan authorizes nothing.

## 1. OBJECTIVE
Sometimes the enforcer DISAGREEs with an E-COL line because the answering side did answer, and quotes that answer. In that case the judge's KEEP may no longer cure by the ruling 392 route, press(): "the press was left unanswered", shown by quoting the pressing sentence. The enforcer's reason has shown an answer on the record, so the KEEP must engage the answer. That is the existing both() test: it quotes 6 or more words of the answering side's own words and 6 or more words of the quoted verse the answer cannot agree with. Any sentence of the answering side counts, not only the one the enforcer quoted (W2 10665 item 1, option (b)). The judge's decision stands as written (ruling 428): code changes only the cure status, never the line.
Expected effect, stated before the measurement: in run 41418, terra's KEEP at row 51414 was CURED by press(). Under this plan, press() is closed to it. Its own words still pass both(): it quotes the [CR4] answer, "the withholding runs from the taking to the birth and the begetting stands before it", and Matthew 1:25. So 51414 is expected to STAY CURED. Terra's remaining fault is reading Matthew 1:25 alone against the answer, and that is ASK 530's ground, not this plan's. If W4's replay of all E-COL KEEP rows finds no row that changes, this plan has no failed case. Then it closes as NOT NEEDED (operator rule 23:19 CST 11-18), and nothing is written.

## 2. ROLES
Planner W1. Builder W4. Grader W2 (one non-builder grader, op doc v139). Write card: W4's thread.

## 3. SCOPE
SEARCH (W1, 10:05 CST 11-23):
- Library of ask531/w4/build/target_engine_531.json (commit a34af0fd). Since the 531 write at 10:01 CST (engine 9240349c, Wall 10660), this target is the live engine. The send-back cure test's E-COL branch is at lines 2671 to 2687; W4's 2674 to 2686 were the line numbers on 48513907. The KEEP path:
  `const p=press(a.why);if(p)return res(true,'KEEP that '+p);const b2=both(a.why);if(!b2.ok&&it.ecw){const k3=ECW.keep3(a.why,it.ecw,PRS);if(k3)return res(true,'KEEP that '+k3);}return res(b2.ok,'KEEP that '+b2.why);`
  - press(): when the line or the KEEP says "unanswered", it cures a KEEP that quotes 6 words in a row of the pressing side (ruling 392).
  - both(): it cures a KEEP that quotes 6 words of any answering-side text and 6 words of a quoted verse.
  - keep3() (pkgECW) cures a KEEP that quotes the row the enforcer named.
  None of the three reads the answer the enforcer cited in its DISAGREE reason.
- MAP: the test is used by Send Back Record, Alt Send Back Record and R2 Alt Send Back Record. No other node calls it.
- debate_enforcer_log: rows 51331 (enforcer DISAGREE, "right: SPARED", which quotes the [CR4] answer) and 51414 (terra's KEEP, CURED by "KEEP that quotes the unanswered pressing sentence ... ruling 392").
- debate_enforcer_log since 11-17: 64 E-COL send_back rows whose cure_reason begins "SEND-BACK KEEP". A rough regex finds 4 whose enforcer reason quotes text after a [CR]/[DR] label: 44243, 44244, 50673 and 51414.
  - 44243 quotes the judge's own line, not the answering side.
  - 50673's answer quote has fewer than 6 words.
  - Only rows whose cure came by press() can change. 51414 is expected to stay CURED by both() (see OBJECTIVE). W4 measures this with the real code.
CHILD: R2 Alt Send Back Record is a node of the child workflow MqQHRl7mQQ0z8QdT. The child holds its own Library, byte-equal to the engine's (LIB cf88f476 in both since 531, per W2 10665). The same line changes in both Library copies, and both LIB hashes stay equal. NOT SEARCHED: none beyond the child's own nodes, which W4 reads at build.
CHANGE (one line, the E-COL KEEP path, in both Library copies):
1. cited(it): take each quotation of 6 or more words in the enforcer's DISAGREE reason, it.reason (W4 confirms the field on E-COL items). Keep those where 6 words in a row are found in the answering side's own rounds (ANSF).
2. If cited(it) is empty, nothing changes.
3. If it is not empty, press() is skipped for this KEEP. The KEEP cures by both() or keep3(), exactly as today. Otherwise it is UNCURED, with this reason: "KEEP that calls the press unanswered after the enforcer quoted the answer on the record; a KEEP quotes the answer and the verse it cannot agree with (ASK 538)".
NOT IN SCOPE, under the scope rule: a CHANGE TO that keeps the break (line 2686 in the 531 target). It may carry the same gap. W4 counts such rows in the measurement and reports them. They are not changed here.

## 4. CRITERIA and DONE
1. Replay row 51414 with its stored reply and rounds: press() is not used; the result is CURED by both(), with both()'s reason, as stated in the OBJECTIVE.
2. Known bad, synthetic: the 51414 KEEP cut down to its pressing-sentence quote, with no [CR4] words, gives UNCURED with the ASK 538 reason. Today it gives CURED by press().
3. Known good, synthetic: a KEEP that quotes a different [CR4] sentence from the one the enforcer quoted, plus a verse that sentence cannot agree with, gives CURED.
4. Replay all E-COL send_back KEEP rows in debate_enforcer_log from 11-17 on. List every changed row with its old and new status. Only rows whose enforcer reason cites an answering-side quote of 6 or more words, and that were cured by press(), may change.
5. Only the three Record nodes and the E-COL KEEP line of both Library copies differ from live (engine and child). The two LIB hashes are equal. Everything compiles, and runcheck is OK.
6. No judge text changes (ruling 383), and code rewrites no line (ruling 428).
DONE: if criterion 4 finds no changed row, the plan closes as NOT NEEDED and nothing is written. Otherwise criteria 1 to 6 pass, W2 grades PASS, and the operator's card is pressed in W4's thread.

## 5. WRONG-IF
1. A KEEP that quotes any sentence of the answering side's answer, and a verse that sentence cannot agree with, comes out UNCURED. A flip on the choice of sentence alone is a live count on a technicality under pkgECF (W2 10665).
2. Any row changes where the enforcer's reason cites no answering-side quote, or where press() was not the route that cured it.
3. The cited quote is the judge's own line, or the pressing side's words, and still triggers. The filter must read the answering side only.
4. The engine and child Library hashes differ after the build.

## 6. RUN EVIDENCE
Mark: a send_back E-COL cure_reason holding "KEEP that calls the press unanswered after the enforcer quoted the answer on the record". It appears only when a judge KEEPs after a DISAGREE that cites an answer, which the run cannot force, so it is NO PROBE. The synthetic known-bad of criterion 2 and the replay of criterion 4 are the known cases (ruling 428).

## 7. INPUTS IN GIT
This plan, at ask538/w1/plan538.md in git and at /mnt/project-files/ask538/plan538.md. The build's replay script and outputs go under ask538/w4/.

## 8. STEPS
1. W4 runs criterion 4 (the replay) on the live engine and child (9240349c or later). No card. If no row changes, W4 posts that, and the plan closes as NOT NEEDED.
2. Otherwise W4 builds both Library copies and runs criteria 1 to 6. No card.
3. W2 grades. No card.
4. The operator's write card in W4's thread lists the rows that change and says that a KEEP calling a press unanswered, after the enforcer quoted the answer, then counts against the seat under pkgECF unless it engages the answer.
