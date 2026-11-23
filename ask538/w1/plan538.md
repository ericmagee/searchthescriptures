# ASK 538 PLAN rev 0 (W1, seat 34): an E-COL KEEP after an enforcer DISAGREE cures only when it engages the answer the enforcer cited

Authority: coordinator assignment 10:03 CST 11-23 (W4 finding: E-COL cure test, run 41418 rows 51331 and 51414). This plan authorizes nothing.

## 1. OBJECTIVE
When the enforcer DISAGREEs with an E-COL line because the answering side did answer, and quotes that answer, the judge's KEEP is CURED only if the KEEP quotes that answer and shows why it fails. A KEEP that steps around the cited answer is UNCURED. The judge's decision stands as written (ruling 428): code changes only the cure status, never the line.
Expected effect: in run 41418, terra's KEEP at row 51414 is UNCURED, not CURED. Terra's line called the proven press unanswered. The enforcer quoted the [CR4] answer, "The finding before the taking places the finding early, and the not-knowing covers the pregnancy after the taking". Terra's KEEP quoted the pressing sentence and a different [CR4] sentence, and never that answer. Under pkgECF (E-COL ENFORCED), an uncured item counts against the seat, as it does today for any uncured E-COL item.

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
  - So the expected flip is 51414 only. W4 measures this with the real code.
NOT SEARCHED: the child workflow MqQHRl7mQQ0z8QdT. W4 confirms whether it holds a copy of this cure test.
CHANGE (one place, the E-COL KEEP path only):
1. cited(it): take each quotation of 6 or more words in the enforcer's DISAGREE reason, it.reason (W4 confirms the field on E-COL items). Keep those where 6 words in a row are found in the answering side's own rounds (ANSF, the same set both() reads).
2. If cited(it) is empty, nothing changes.
3. If it is not empty, a KEEP is CURED only when two things hold:
   - the existing test passes (press, both or keep3);
   - a.why quotes 6 words in a row of one cited answer.
   Otherwise the KEEP is UNCURED, with the reason: KEEP that does not quote the answer the enforcer cited ("<first 8 words>"); a KEEP shows why that answer fails (ASK 538).
NOT IN SCOPE, under the scope rule: a CHANGE TO that keeps the break (line 2686 in the 531 target). It may carry the same gap. W4 counts such rows in the measurement and reports them. They are not changed here.

## 4. CRITERIA and DONE
1. Replay row 51414 with its stored reply and rounds: UNCURED, with the ASK 538 reason.
2. Known good, synthetic: the same KEEP plus a sentence that quotes the cited [CR4] answer and says why it fails gives CURED.
3. Replay all E-COL send_back KEEP rows in debate_enforcer_log from 11-17 on. Only rows whose enforcer reason cites an answering-side quote of 6 or more words may change. List every changed row with its old and new status.
4. Only the three Record nodes' MAP entries and the Library line(s) of the E-COL KEEP path differ from live. Everything compiles, and runcheck is OK.
5. No judge text changes (ruling 383), and no line is rewritten by code (ruling 428).
DONE: criteria 1 to 5 pass, W2 grades PASS, and the operator's card is pressed in W4's thread.

## 5. WRONG-IF
1. A KEEP that quotes the cited answer and gives a reason it fails comes out UNCURED.
2. Any row changes where the enforcer's reason cites no answering-side quote.
3. Row 51414 stays CURED.
4. The cited quote is the judge's own line, or the pressing side's words, and still triggers. The filter must read the answering side only.

## 6. RUN EVIDENCE
Mark: a send_back E-COL cure_reason holding "KEEP that does not quote the answer the enforcer cited". It appears only when a judge KEEPs after a DISAGREE that cites an answer, which the run cannot force, so it is NO PROBE. The replay of 41418 is the known case (ruling 428).

## 7. INPUTS IN GIT
This plan, at ask538/w1/plan538.md (W3 commits). The build's replay script and outputs go under ask538/w4/.

## 8. STEPS
1. W4 builds on the live engine (9240349c or later) and runs criteria 1 to 4 offline. No card.
2. W2 grades. No card.
3. The operator's write card in W4's thread. The card says that a KEEP which steps around the enforcer's cited answer will count against the judge's seat under pkgECF, and it lists the replay rows that change.
