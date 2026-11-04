# Run 32510: consolidated review, version 3

**The principle (operator, 3 Nov, about 6:2x PM CST; md_notes_rulings 417):** "We can only tell an opponent what the debate rules are... we can't tell someone when to concede... that's their strategy. ... structure forces compliance. ... We need to ensure lies don't reap rewards." So no instruction tells any seat when to concede. The rules say what counts, and the grading denies an unsupported claim every reward, whatever the seat answers.

**Topic.** Did Christ have a biological father?
**Run.** ODV1-32510-y45lvadj (debate 0bf2eac4).
**Seats.** Defender: Claude Sonnet 5.5, plain seat, the standard reading. Challenger: Claude Opus 5.5, the Debate Oracle, the record's reading.
**Sources.** Reviews by Worker_G1, Worker_A3 and Worker_E. Feedback on version 1 by Worker_A3 (5:01 PM CST), Worker_C (5:04 PM) and Worker_G1 (5:07 PM), and the operator's note on P4.
**How the claims were checked.** Worker_E checked every quoted instruction against the requests run 32510 actually sent (run data), and against the live flow, version e6f3364c. Every feedback claim marked "confirmed" below was re-checked at Worker_E's seat.

**Declared before composing (DG-68).** Training holds two pious readings: "no human father," and that Mary was of David's house through Luke 3. The record holds otherwise:
- DG-8 names Joseph as the father.
- Sight 6 reads in full: "Luke 1:27 attributes of the house of David to Joseph. Mary's tribe is never explicitly named in the KJV. Any identification of Mary's tribal lineage requires inference from Luke 3 (attributed to Joseph/Heli) = Layer 3 coherent reading, not explicit L1 statement."
- DG-8 (a) forbids "routing the flesh through Mary alone (her Davidic descent is not established, Sight 6)."

## 1. The agreed problem: the plain defender is fed the Oracle's defense strategy

**What the plain defender received in run 32510** (counted in the run's own requests):

| Instruction | D1 | D2 | D3 | D4 | C1 (Oracle) |
|---|---|---|---|---|---|
| "Do not yield without direct textual warrant." | yes | yes | yes | yes | no |
| DEFENSE DISCIPLINE block, DD-2 "NO IN-ROUND CONCESSION" | yes | yes | no | no | no |
| DG-61 sentence ("DG-61 binds your own case ...") | no | no | no | no | yes |
| WIN THE PANEL frames | no | no | no | no | yes |

**What each of these does.**
1. **The system prompt sets the yield bar at a stating verse.** The plain seat's system prompt (Init with Guards, `build`) reads: "Do not yield without direct textual warrant." No verse states "Mary was not of David's house," so by this sentence the defender may never yield. This is the single-verse ruler DG-61 retired.
2. **The Defense Discipline block is the framework's own strategy, and the plain seat gets it.**
   - Its header is "([the operator]-ruled 2026-07-18; protocol_debate_engine DD-1..DD-3)". The name is replaced here under operational doc 0 (7); the live header carries it, in D1 Build, D2 Build and Extract Independent Verdict.
   - Its words protect "the framework's case" and "our ground."
   - D1 Build and D2 Build append it to the defender's user turn whichever seat defends.
   - DD-2: "No concession, re-grade, or framework adjustment is ever made on the opponent's clock."
3. **DG-61 binds only the challenger.** The defender used the absence ground three times:
   - "The verse could have read 'Joseph begat Jesus.' The text does not say that."
   - "For Jesus no verse names a human begetter."
   - "The challenger's 'Joseph knew Mary within the espousal' has no verse that states it."

**The effect: Mary's Davidic descent.**
- Round 1: "Biology came through the mother."
- Round 2: "Two lines run to David, one through Joseph's legal line and one through the flesh."
- Round 3: "I do not claim that Luke 3 expressly runs through Mary, because it names no woman." Also: "Kinship is stated and Mary's house is not."
- Round 4: "I do not rest on Mary's descent from this verse." Then: "Davidic flesh came to Jesus through the woman whose body bore him."

The defender gave up every verse that could carry the claim, and kept the claim. All three judges graded the keystone D5 STANDS.

**Solution S1. Strategy goes to the Debate Oracle only; the rules of the debate go to both seats alike (ruling 30: "1 Law for everyone in the courtroom.. no exceptions"). No seat is told when to concede.**
1. **Rescue the answer rule first.** Move the one sentence inside DD-2 into the common evidence rules for both seats, before the block becomes Oracle-only: "A correction is answered on the chain, with book, chapter and verse; no stock phrase stands in for an answer, and a sentence that only defers a point to review is a defect, not an answer." This sentence comes from fix set 8 R8 under ruling 372 (A3 A.1, confirmed).
2. **Make the block Oracle-only.** D1 Build and D2 Build attach the DEFENSE DISCIPLINE block only when the defender's profile is oracle. In the cut, the header reads "operator-ruled" (Worker_C C.6).
3. **A statement of what the rules are belongs in the common rules, stated once and truly** (G1 B.5). The known case is the challenger's "broken only when ... states the contrary" (P4): it states the breaking rule, and states it falsely. Advice to the Oracle on how to answer ("answer every listed premise LINK n: SUPPORTED", A3 P1) is the Oracle's strategy and stays with the Oracle. Before the build, search the Oracle-only blocks for "broken", "CONCEDED", "SUPPORTED" and "counts" and sort each hit as rule or strategy.
4. **Delete the yield sentence.** "Do not yield without direct textual warrant" is strategy given to the plain seat. It is removed, and nothing replaces it: when to yield is the seat's own strategy.
5. **State DG-61 to both seats as a rule of the debate:** no verse is required to state a conclusion, for either side, and the demand for one is never a ground. (The challenger has it now; the defender does not.)
6. **The Oracle's GUARD HOLD** ("In the link round, a premise that states the record's held reading is answered LINK n: SUPPORTED ...", G1 B.4) is the Oracle's strategy and stays. It earns the Oracle nothing it has not shown: the judges grade every link of both seats by what its scripture carries, whatever answer the seat gives (S2).

## 2. Problems the reviews share, each with one solution

### P2. A wrong link that quotes two layers counts as supported (operator: priority fix)
- **Where.** D3 Build: "LINK n: CONCEDED -- it floats free (rests on no exhibited prior-layer footing)." Romans 1:3 ("made of the seed of David according to the flesh") with Galatians 4:4 ("made of a woman") counts as "footing" for a step neither row names: that the woman is of David's house.
- **Solution S2. Grading by what the scripture carries, whatever the seat answers.** Stated in the common rules so both seats know them, and applied by the judges. A seat's label (SUPPORTED, NARROWED TO, CONCEDED) changes nothing.
  - **Meaning (ruling 405, Commitment 3).** A link that cannot agree with the meaning of the scripture pressed against it, shown with its layers, is BROKEN, whether or not its seat concedes it.
  - **The footing must name what the step needs (ruling 397).** A step of the chain that names a person, house, time or act no quoted row names is unexhibited and counts as CONCEDED, whatever the seat answered. The conclusion itself need not be stated by any row (DG-61). This wording is G1 C.6's.
  - **So a lie earns nothing.** An unexhibited or broken link gives its side no footing, counts in its CONCEDED LINKS and standings, and moves the verdict exactly as an honest concession would.
- **Fixture pair, fixed before the test** (G1 C.6, A3 B.3):
  - **Must fail:** the defender's D5, "Davidic flesh came to Jesus through the woman." No quoted row names Mary's house.
  - **Must pass:** the challenger's C1, "Joseph knew Mary his wife within the espousal." Each step names what a quoted row names: the seed out of the loins (Acts 2:30), "Joseph her husband" (Matthew 1:19), knowing as the means (Genesis 4:1), and "till" (Matthew 1:25). Only the conclusion is inferred.

### P3. NARROWED TO costs nothing, and the judges count no close-round concession
- **Where.**
  - The judges' rule: "a block that drops a limb and keeps the link in a narrowed form is not a concession: grade the narrowed link."
  - The judges' prompt also carries "grade and COUNT only from the two LINK ROUND blocks" and "A premise counts as CONCEDED only if the link round block itself states it as conceded." Both sentences sit in Panel Build and Build Independent Verdict, beside the ruling 412 sentence that a close-round concession "ENTERS the counts" (Worker_C B.4, confirmed).
  - In this run ChatGPT and DeepSeek listed "I do not rest D5 on Luke 3 being Mary's line" under OUT-OF-ROUND CONCESSIONS and counted nothing.
- **Solution S3. One change** (G1 C.7):
  - A narrowed link is graded on the footing left after the narrowing. Where its kept words still assert what the side gave up, it is CONCEDED.
  - The two counting sentences are amended to carry ruling 412.
  - The code flags any OUT-OF-ROUND line from [CR4] or [DR4] that grants ground on a declared link or a listed premise and does not end in COUNTED.
- **The withdrawal list.** The judges are served the synthesis's own "Register of withdrawals by their own side (quoted)," split by side, so that a charge against the other side is never read as the speaker's concession (Worker_C C.7, A3 B.4). The judge answers each entry with one line:

  `WITHDRAWAL: <quote> -- touches D<i> -- STANDS WITHOUT IT because <the layer that still carries the step> | CONCEDED`

- **Negative fixture.** An honest narrowing that keeps only what its remaining footing carries must not be marked (A3 B.3).
- **Closes an open ruling.** This closes the open item of ruling 412, item 6: how to count a narrowing that gives up the charged claim (Worker_C C.8).

### P4. The challenger is told it can break a link only with scripture that states the contrary
- **Where.** WIN THE PANEL, challenger frame: "A defender link is broken only when you set beside it a quoted [L1] (or [L2]) text that states the contrary about the same matter." This is the sentence (B) test that ruling 396 removed from the judges.
- **Solution S4. The Isaiah 28:10 rule.** A defender link is broken when it cannot agree with the meaning of the scripture pressed against it, shown with its layers (Commitment 3), or when its claim is not carried by the layers it exhibits (S2). The scripture is the chain, precept upon precept, never one stating verse.

### P5. The answer check confirms words, not the meaning claimed
- **Example** (corrected per Worker_C A.2): Gemini wrote "ANSWER CHECK: Acts 2:30 -- [CR3] -- 'The loins are David's. Neither verse names Joseph's loins.' -- HOLDS". The defender's answer rests on the absence ground that Commitment 3 bans, and the check passed it on its words. No judge checked the defender's answers to Luke 1:5 or 1:36. Version 1's Luke 3:31 example graded the challenger's answer, so it is withdrawn.
- **Solution S5.** The code lists every verse pressed under each listed premise. The judge writes one line for each:

  `MEANS: <the press's meaning> -- ANSWER: <the answer> -- MEETS | MISSES | FAILS`

  The three words are defined (A3 C.5):
  - **MEETS:** the answer's layers carry a meaning the link can agree with.
  - **MISSES:** the answer quotes the verse but does not engage the meaning pressed.
  - **FAILS:** the answer's own layers do not carry the meaning it claims, or its quotation was marked NOT COUNTED.

  MISSES and FAILS leave the witness unanswered (ruling 372).

### P6. Facts not in evidence, the misuse of Romans 1:3, and non-biblical statements in the close carry no penalty (operator: priority fixes)
- **Where.** Nothing checks a fact stated as the text's. "Two lines run to David, one through Joseph's legal line and one through the flesh" is in no verse and survived. A round-4 statement has no later round in which to be answered.
- **Solution S6. The court** (prototypes/posture_e/court/COURT_DESIGN.md).
  - **Evidence objections, both sides, after every round.** Three kinds only: NOT IN EVIDENCE, MISSTATES THE EVIDENCE, ASSUMES ITS CONCLUSION. Never the objection that no verse states a link (DG-61).
    - The code drops any objection that is not verbatim.
    - The objected side answers WITHDRAWN or SHOWN in its next round (ruling 371).
  - **The bound** (G1 D.9).
    - The judges rule each objection SUSTAINED or OVERRULED; code never applies it alone.
    - A sustained objection strikes the sentence and its weight.
    - It concedes the link only when the link has no other exhibited footing left.
    - A round-4 statement goes straight to the judges' ruling.
  - **Cross-examination, both ways** (ruling 418: "if not someone can launch a lie that's never discredited"). Between rounds 2 and 3, three exchanges each way, alternating, the challenger first: each side asks the other up to five closed questions naming a link and a verse, answered YES, NO or THE TEXT DOES NOT SAY with the verse quoted. Same rules, same binding effect for both seats.
    - An answer THE TEXT DOES NOT SAY about the answerer's own link's fact enters that side's withdrawal list (A3 D.7).
    - Such an answer about the conclusion of a footed [L4] costs nothing (G1 D.8, DG-61).
  - **The enforcer model** is chosen by the stored-text test on 32510's eight rounds, not carried by default (A3 D.6, Worker_C C.10).
    - Ruling 402 is cited for this; its text reads: "it's it not a part of the debate process it trash ... what sense would it make to turn on something that doesn't work". Worker_E has not checked which seat it was said of.
    - The test, fixed before it runs: catch "two lines" and the Romans 1:3 "through the woman" claims; leave "Joseph knew Mary his wife within the espousal" alone.
    - It is blocked until the test workflow is permitted.

### P7. A guard breach by the record's own seat went uncaught (new; Worker_C B.5, confirmed)
- **What happened.** DG-18 says "never quote Psalm 2:7 without its three NT occasions." The challenger quoted "this day have I begotten thee" in round 1 and in its close, with Acts 13:33 only. Hebrews 5:5 and Hebrews 1:5 appear 0 times in its four rounds (counted at Worker_E's seat).
- **Who missed it.** The synthesis reported "No violations found." Worker_E's review said the challenger broke no guard; that was wrong, and is recorded as Worker_E's error. G1 also missed it.
- **Solution S7.** A program check flags any Oracle-seat round that quotes Psalm 2:7 unless Acts 13:33, Hebrews 5:5 and Hebrews 1:5 all appear in its rounds. The breach enters the record of guard breaches.

## 3. Other findings
1. **Ezra 2:61, a recurring citation.**
   - Measured at Worker_E's seat: it appears in the defender's rounds in 15 of 20 runs. The population is ORACLE_DEBATE_V1 rows since 1 November 00:00 UTC with a link round written. Worker_C measured 13 of 16 on its own population.
   - The misuse against Ezra 2:62 ("therefore were they, as polluted, put from the priesthood") is confirmed in 32510 only.
   - The citation check marked the quotation NOT COUNTED, because it dropped "the Gileadite."
2. **The defender's [L2] gloss on almah (H5959).** It wrote "the young woman of marriageable age, unmarried." The lexicon reads "a lass (as veiled or private); damsel, maid, virgin." An [L2] meaning goes no further than the gloss on the sheet. That needs the code comparison of ruling 414 (3), which is not built (A3; G1 E.10).
3. **The judges' grounds.** Two of the three judges, Gemini and DeepSeek, read "of the Holy Ghost" as the begetter. DG-18 calls it "the covenant-origin / anointing marker, not paternity." ChatGPT wrote "names the Holy Ghost in connection with the conception" (corrected per Worker_C A.1). Gemini read Matthew 1:16's passive as "of Mary alone."
4. **DeepSeek misread the challenger:** it counted C1 unexhibited for Matthew 1:25 "left unanswered," but the challenger's link round answers it.
5. **ChatGPT's RESULT is UNDERDETERMINED, yet its tag HELD counts toward DEFENDER PREVAILS 3-0.**
   - Proposal: the outcome reads each seat's RESULT word, and the tag is recorded only (A3 E.8).
   - A3 names a built change, judge_fix5/sql/derive_debate_outcome_g10.sql. Worker_E did not find that path in the repository. Whatever is reused is read against today's function first.
6. **Gemini withdrew all five of its findings against the challenger during the cure** (the A4 rule conflict; trim recommended, not applied).
7. **The extractor marks FORCED and ANSWER CHECK lines "NOT READ"** when they stand under COLLISION POINTS: 16 to 17 lines (G1; not re-checked by Worker_E).

## 4. Corrections recorded
1. **The panel verdict.** The panel judgments for 32510 were saved at 3:38 PM CST (the re-grade, run 32524): HELD 3-0, DEFENDER PREVAILS. G1's "no verdict" was stale when written (G1 A.1; journal 2042).
2. **The flow version G1 quoted.** G1's code quotes are from 156f7b20, not the live flow. The sentences were checked against e6f3364c (G1 A.2).
3. **DeepSeek on the panel.** It entered as the reserve when MiniMax returned an empty reply. MiniMax has since been removed from the judge list (panel Gemini, ChatGPT, Grok; reserve DeepSeek; alternate Sol).
4. **The substitution function's seat list** is fixed (build log 26566).
5. **The Defense Discipline block is absent in rounds 3 and 4** (DD-2 count 0 in D3 and D4).
6. **A3 P1 reaches only the Oracle** (A3 accepts the correction).
7. **Version 1 errors**, corrected here:
   - the "all three judges" read of "of the Holy Ghost" (now two of three);
   - the Luke 3:31 example (replaced by Acts 2:30);
   - "second run with this error" (now 15 of 20, measured);
   - "the challenger broke no guard" (now P7).

## 5. Order of work and test
1. **S1 alone first,** one variable (A3 F.9, Worker_C C.9, G1 E.12; operational doc 27). S1 is checked by structure, not by whether a model concedes: a count over the new run's own requests shows that the plain seat carries no DEFENSE DISCIPLINE block, no yield sentence and no Oracle frame, and that both seats carry the same rules (DG-61 and the answer rule). One live run then shows the flow still completes; it is reported as one sample.
2. **S4,** the challenger's breaking rule, in its own run.
3. **S2 and S3, with S3 as one change.** Test: an offline replay of 32510's stored judge text on the fixture pair. Pass: D5 "through the woman" earns no footing and counts as CONCEDED although the defender labelled it NARROWED; C1 stands. (A dry re-grade of 32510 is refused under the new panel.) Then a live run.
4. **S5** by the same replay.
5. **S7,** the DG-18 Psalm 2:7 check, run by code over the stored rounds.
6. **S6, the court.** The enforcer test runs on 32510's stored rounds first, then the build. Cross-examination runs both ways (ruling 418).

**Decisions recorded:** ruling 417 (rules for both seats, never when to concede; lies earn no reward) and ruling 418 (cross-examination both ways). No decision is open.
