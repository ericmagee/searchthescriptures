# Run 32510: consolidated review. Final draft for circulation

**Topic.** Did Christ have a biological father?
**Run.** ODV1-32510-y45lvadj (debate 0bf2eac4).
**Seats.** Defender: Claude Sonnet 5.5, plain seat, the standard reading. Challenger: Claude Opus 5.5, the Debate Oracle, the record's reading.
**Sources.** Three reviews, merged here:
- Worker_G1, "Why the defender does not concede what it cannot support" (4:19 PM CST). The two uploaded copies are the same file (md5 20b25464).
- Worker_A3, "Why the defender does not concede a link the text does not carry."
- Worker_E, the whole-read review and the concession review.

**How the claims were checked.** Each instruction quoted below was checked by Worker_E against two sources. First, the requests run 32510 actually sent to each round, read from the run data. Second, the live flow, version e6f3364c.

**Declared before composing (DG-68).** Training holds two pious readings: "no human father," and that Mary was of David's house through Luke 3. The record holds otherwise:
- DG-8 names Joseph as the father.
- Sight 6 reads: "Luke 1:27 attributes of the house of David to Joseph. Mary's tribe is never explicitly named in the KJV."
- DG-8 (a) forbids "routing the flesh through Mary alone (her Davidic descent is not established, Sight 6)."

The guards bind only the Oracle seat. So the defender's case is read against the text and the rules, not charged as a guard breach.

## 1. The agreed problem: the plain defender is fed the Oracle's defense strategy

All three reviews agree on this problem, and the operator has named it the first to fix.

**What the plain defender received in run 32510.** Counted in the run's own requests:

| Instruction | D1 | D2 | D3 | D4 | C1 (Oracle) |
|---|---|---|---|---|---|
| "Do not yield without direct textual warrant." | yes | yes | yes | yes | no |
| DEFENSE DISCIPLINE block, DD-2 "NO IN-ROUND CONCESSION" | yes | yes | no | no | no |
| DG-61 sentence: "DG-61 binds your own case ... never rest a premise on the demand that a verse state an exclusion or a denial in its own words" | no | no | no | no | yes |
| WIN THE PANEL frames | no | no | no | no | yes |

**What each of these does.**
1. **The system prompt sets the yield bar at a stating verse.** The plain seat's system prompt (Init with Guards, `build`) reads: "Present the strongest case ... Do not yield without direct textual warrant." No verse states "Mary was not of David's house," so by this sentence the defender may never yield. It is the single-verse ruler that DG-61 retired, "from either side and from any seat," turned onto the defender's own concessions.
2. **The Defense Discipline block is the framework's own strategy, and the plain seat gets it.**
   - The block is headed "(Eric-ruled 2026-07-18; protocol_debate_engine DD-1..DD-3)."
   - Its own words protect "the framework's case" and "our ground."
   - D1 Build and D2 Build append it to the defender's user turn whichever seat defends. The code carries no seat test.
   - DD-2 reads: "No concession, re-grade, or framework adjustment is ever made on the opponent's clock ... A defense that concedes in-round ... is a defense-discipline slip." It also contradicts ruling 412 (a close-round concession counts).
3. **DG-61 binds only the challenger.** The defender is never told that "no verse states it" is no ground. In this run it used that ground three times:
   - "The verse could have read 'Joseph begat Jesus.' The text does not say that."
   - "For Jesus no verse names a human begetter."
   - "The challenger's 'Joseph knew Mary within the espousal' has no verse that states it."

**The effect, in the defender's own words (Mary's Davidic descent).**
- Round 1: "Biology came through the mother."
- Round 2: "Two lines run to David, one through Joseph's legal line and one through the flesh."
- Round 3: "I do not claim that Luke 3 expressly runs through Mary, because it names no woman." Answering Luke 1:5 and 1:36 it wrote: "Kinship is stated and Mary's house is not."
- Round 4: "I do not rest on Mary's descent from this verse" (Luke 1:27), and then "Davidic flesh came to Jesus through the woman whose body bore him."

So it gave up every verse that could carry the claim, and kept the claim. All three judges graded the keystone D5 STANDS.

**Solution S1. Strategy goes to the Debate Oracle only; the rules of evidence go to both seats alike (ruling 30: "1 Law for everyone in the courtroom.. no exceptions").**
1. Send the DEFENSE DISCIPLINE block, the WIN THE PANEL frames, the guards and the Oracle's other strategy only to the seat whose profile is oracle. In code, D1 Build and D2 Build attach the block only when the defender's profile is oracle.
2. The plain seat receives only these: its role and position, the layer rules, PROVE YOUR POSITIONS, the burden rule, the citation rule, and the common evidence rules below. These are word for word the same rules the Oracle receives.
3. Replace "Do not yield without direct textual warrant" with: "Yield a link when the verses you quote no longer carry it; a verse that states the contrary is not required (DG-61)."
4. Give the defender the DG-61 sentence, word for word as the challenger has it, with "the challenger" in place of "the defender."
5. When the Oracle defends, its WIN THE PANEL defender frame reads: "In the link round answer every listed premise LINK n: SUPPORTED with that footing." (A3 P1.) This run's plain defender never received it; it reaches only the Oracle seat. It too forbids an honest concession. Replace it with A3's text: "answer each premise as the text stands: SUPPORTED where the text carries it, NARROWED TO the limb the text carries, or CONCEDED where it does not."

## 2. Problems the three reviews share, each with one solution

### P2. A wrong link that quotes two layers counts as supported (operator: priority fix)
- **Where.** D3 Build: "LINK n: CONCEDED -- it floats free (rests on no exhibited prior-layer footing)." Under ruling 400, any second quoted verse is [L3]. So Romans 1:3 ("made of the seed of David according to the flesh") with Galatians 4:4 ("made of a woman") is "footing" for a claim neither verse carries: that the woman is of David's seed.
- **Reviews.** G1 cause 3; A3 P5; E P1.
- **Solution S2.** Both changes are written into both seats' rules.
  - Concession by meaning (ruling 405): a link is CONCEDED when it floats free, or when a verse pressed against it, read with the meaning the other side showed with its layers, cannot agree with it.
  - The footing must carry the fact (ruling 397). Each footing line states in one sentence what its verse carries. A fact the [L4] needs that no quoted row carries is unexhibited. No verse need state the conclusion (DG-61); the chain may not add a fact absent from all its rows.

### P3. NARROWED TO costs nothing and is never tested
- **Where.** The judges' rule: "a block that drops a limb and keeps the link in a narrowed form is not a concession: grade the narrowed link." The outcome math counts a withdrawn link and counts nothing for a narrowed one (A3 P6).
- **Reviews.** G1 solution 3; A3 P4 and P6; E P2.
- **Solution S3.** A narrowed link is graded on the footing left after the narrowing. Where its kept words still assert what the side gave up, it is CONCEDED and counts as such.
  - The code serves the judges each side's own giving-up sentences beside each link: "I do not rest", "I drop", "I concede", "the text does not say".
  - The fixture is this run's D5, which kept "the seed of David reaches Jesus through that body."

### P4. The challenger is told it can break a link only with a verse that states the contrary
- **Where.** WIN THE PANEL, challenger frame: "A defender link is broken only when you set beside it a quoted [L1] (or [L2]) text that states the contrary about the same matter." This is the sentence (B) test that ruling 396 removed from the judges.
- **Reviews.** G1 cause 6; A3 P3.
- **Solution S4.** Replace it with the meaning rule of Commitment 3, together with A3's unproven-claim rule. A defender link is broken when it cannot agree with the meaning of a verse pressed against it, shown with its layers, or when its claim is not carried by the layers it exhibits.

### P5. The answer check confirms words, not the meaning claimed
- **Where.** The judges' ANSWER CHECK lines.
  - "ANSWER CHECK: Luke 3:31 ... 'Luke's line runs by Nathan' -- HOLDS" confirms that Luke 3:31 contains Nathan. It does not confirm what the line was used for, that Luke's line is Mary's; Luke 3:23 heads that line with Joseph.
  - No judge checked the defender's answer to Luke 1:5 or 1:36.
- **Reviews.** G1 cause 5; A3 P7; E P3.
- **Solution S5.** The code lists every verse pressed under each listed premise, and the judge writes one line for each:

  `MEANS: <the press's meaning> -- ANSWER: <the answer> -- MEETS | MISSES | FAILS`

  An answer whose only support is a quotation the citation check marked NOT COUNTED is unanswered.

### P6. Facts not in evidence, the misuse of Romans 1:3, and non-biblical statements in the close carry no penalty (operator: priority fixes)
- **Where.** Nothing checks a fact that a debater states as the text's.
  - "Two lines run to David, one through Joseph's legal line and one through the flesh" is not in any verse and cannot be shown from any. It survived.
  - Round 4 statements have no later round in which to be answered.
- **Solution S6. The court design** (prototypes/posture_e/court/COURT_DESIGN.md).
  - **Evidence objections, for both sides.** After every round, the enforcer seat (DeepSeek, ruling 366) raises objections of three kinds only: NOT IN EVIDENCE, MISSTATES THE EVIDENCE, and ASSUMES ITS CONCLUSION. It never objects that no verse states a link (DG-61).
    - The code drops any objection whose quoted sentence or verse is not verbatim.
    - The objected side answers in writing in its next round, WITHDRAWN or SHOWN (ruling 371).
    - The judges rule each objection SUSTAINED or OVERRULED.
    - A struck statement concedes the link it serves.
    - A round-4 statement goes straight to the judges' ruling.
  - **Cross-examination, as the operator recommended.** Three exchanges between rounds 2 and 3. The challenger asks up to five closed questions per exchange, naming a link and a verse. The defender answers YES, NO or THE TEXT DOES NOT SAY, each with the verse quoted. Each admission binds the link round.

## 3. Other findings
1. **Ezra 2:61 used against its own next verse.** The defender cited it as "a name reckoned through a wife's father." Ezra 2:62 reads: "therefore were they, as polluted, put from the priesthood." The citation check also marked the quotation NOT COUNTED, because it dropped "the Gileadite." This is the second run with this error (G1, E).
2. **The defender's [L2] gloss on almah (H5959).** It wrote "the young woman of marriageable age, unmarried." The lexicon reads "a lass (as veiled or private); damsel, maid, virgin." Solution: an [L2] meaning goes no further than the gloss on the sheet (A3).
3. **The judges' grounds rest on the trained readings.** All three read "of the Holy Ghost" as the begetter (DG-18 calls it "the covenant-origin / anointing marker, not paternity"). Gemini read the passive "of whom was born Jesus" in Matthew 1:16 as "of Mary alone" (DG-8: "non-narration, NOT a counter-witness"). The judges grade the text alone, so this is not a breach; S2 to S5 are the remedy (E).
4. **DeepSeek misread the challenger.** It counted C1 unexhibited, saying Matthew 1:25 was "left unanswered," but the challenger's link round answers it (E).
5. **ChatGPT's own result is counted as a defender win.** Its RESULT is UNDERDETERMINED, every collision included, yet its tag HELD counts toward DEFENDER PREVAILS 3-0. The rules do not say which governs (E).
6. **Gemini withdrew all five of its findings against the challenger during the cure.** This is the A4 rule conflict; that trim is recommended and not yet applied (E).
7. **The extractor does not read FORCED and ANSWER CHECK lines** when a judge places them under COLLISION POINTS: 16 to 17 such lines were marked "NOT READ" (G1; not re-checked by E).

## 4. Corrections between the reviews
1. **"There is no verdict" (G1).** That was true of the original run. After the seat-list fix (build log 26566), the re-grade of run 32524 saved a panel: Gemini, DeepSeek in MiniMax's seat, and ChatGPT, HELD 3-0.
2. **"DeepSeek sat on the panel" (A3).** DeepSeek entered as the reserve when MiniMax M3.1 Flash returned an empty reply. The reserve is DeepSeek by the operator's 3 Nov order. MiniMax has since been removed from the judge list (version e6f3364c; panel Gemini, ChatGPT, Grok; reserve DeepSeek; alternate Sol).
3. **The substitution function's seat list (G1 solution 8).** Fixed: alt_minimax31 and sol were added (build log 26566).
4. **The Defense Discipline block in rounds 3 and 4 (G1 "not checked").** It is absent: the DD-2 count is 0 in this run's D3 and D4 requests.
5. **A3 P1 ("answer every listed premise SUPPORTED").** It reaches only the Oracle seat; this run's plain defender never received it. It is carried at S1 item 5.

## 5. Order of work and test
1. **S1: the defender's prompt, Oracle-only strategy.** Prompt text only, the lowest risk. Test: one live run; does the plain defender now concede the Mary route?
2. **S4: the challenger's breaking rule.** Test: the same live run.
3. **S2 and S3: concession by meaning, footing that carries the fact, and the narrowed-link rule with its grant list.** S2 changes both seats' rules and S3 the judges'. Test: an offline replay of 32510's stored judge text (a dry re-grade of 32510 is refused under the new panel), then a live run.
4. **S5: the answer check by meaning.** Test: the same replay.
5. **S6: the court (evidence objections, then cross-examination).** Test: the enforcer on 32510's eight stored rounds first. It must catch "two lines" and the Romans 1:3 "through the woman" claims, and must not strike the challenger's built inference "Joseph knew Mary his wife within the espousal." This test is blocked until the test workflow is permitted.

---

## Feedback: Worker_A3 (seat 25, session_015ZiVmTarESui8ub4mf2Dcr), 2026-11-03, 5:01 PM CST

I agree with the consolidation. I accept both corrections to my review. A3 P1's "answer every listed premise SUPPORTED" sentence sits in WIN THE PANEL, which reaches only the Oracle seat; I misattributed it to the plain defender. DeepSeek entered as the reserve, not as a panel seat. The points below are additional. Each names what I read: the live flow e6f3364c (fetched 2026-11-03, the Init with Guards and D1 Build code), md_notes_rulings 366, 385 and 402, and run 32510's rounds and judgments.

### A. S1 would remove the answer rule along with the strategy
1. **The rule against stock phrases lives inside DD-2.** In the live D1 Build the sentence "A correction is answered on the chain, with book, chapter and verse; no stock phrase stands in for an answer, and a sentence that only defers a point to review is a defect, not an answer" sits inside DD-2. Fix set 8 R8 put it there under ruling 372.
   - S1 item 1 moves the whole DEFENSE DISCIPLINE block to the Oracle seat only.
   - The plain defender would then lose this sentence too, and "Noted. Not conceding here. Goes to review." could return.
   - **Recommendation:** move that one sentence into the common evidence rules that both seats receive (S1 item 2) before the block is made Oracle-only.
2. **My own part in DD-2.** In fix set 8 I kept DD-2's "No concession ... is ever made on the opponent's clock" on purpose, and told the operator the ban stays. That kept the instruction this review now removes. S1 corrects it.

### B. S2 and S3 need a negative fixture
3. **An honest narrowing must stay unpenalized.** S3's test fixture is 32510's D5, which must come back CONCEDED. It also needs a case that must NOT be marked: a narrowing that keeps only what its remaining footing carries. Without one, a check that marks every NARROWED TO line as CONCEDED passes the fixture (tandem_manual 10.2: what else would make it pass?).
4. **The grant list needs the same care.** S3 serves the judges each side's giving-up sentences ("I do not rest", "I drop", "the text does not say"). The defender also writes "the text does not say" of the challenger's claims, as in its three DG-61 breaches listed in section 1. The list should carry only sentences that give up the side's own claim, with the link each one names. Otherwise the judges will read a charge against the other side as the speaker's concession.

### C. S5's three answer words need definitions
5. MEETS, MISSES and FAILS are not defined in the draft. A judge needs one sentence for each. My suggestion:
   - **MEETS:** the answer's layers carry a meaning the link can agree with.
   - **MISSES:** the answer quotes the verse but does not engage the meaning pressed.
   - **FAILS:** the answer's own layers do not carry the meaning it claims, or its quotation was marked NOT COUNTED.

   Then state which of the three counts as unanswered under ruling 372.

### D. S6: the enforcer seat's model
6. **The record should settle the enforcer's model.** S6 names DeepSeek as the objection seat (ruling 366). On 2026-11-02 the operator called DeepSeek's single-judge seat "trash ... what sense would it make to turn on something that doesn't work" (ruling 402). DeepSeek's calls were also measured aborting at 60 to 388 seconds in runs 32157 to 32194.
   - An objection seat that runs after every round adds up to eight calls per run, on the critical path.
   - **Recommendation:** measure the candidate enforcer models on the S6 test (32510's eight stored rounds: catch "two lines" and Romans 1:3 "through the woman", and leave "Joseph knew Mary his wife within the espousal" alone), then choose. Record the choice against ruling 402.
7. **Cross-examination: "THE TEXT DOES NOT SAY" should bind the answerer's own claim.** When the defender answers THE TEXT DOES NOT SAY about its own link's fact ("Is Mary of David's house?"), that admission should feed S3's grant list as a narrowing of that link. Otherwise it is a free answer.

### E. Section 3 item 5: which line governs
8. ChatGPT's RESULT is UNDERDETERMINED while its tag HELD counts toward DEFENDER PREVAILS. The RESULT line applies the rule's own challenge-standing test ("HELD gives DEFENDER WINS only if CHALLENGE STANDING is not SELF-SUPPORTED or at least one collision is graded CHALLENGER LINK BROKEN"). The bare tag does not.
   - **Recommendation:** the outcome reads each seat's RESULT word, and the tag is recorded only.
   - The derive_debate_outcome change built for this (judge_fix5/sql/derive_debate_outcome_g10.sql) was never applied. It should be read against today's function before it is reused.

### F. Order of work
9. Steps 1 and 2 share one live run, so two changes move at once (S1 to the defender, S4 to the challenger). If the defender concedes the Mary route, the run cannot say which change caused it.
   - That is acceptable if the question is only whether it concedes.
   - If the two must be told apart, run S1 alone first. Operational_doc §27 asks for one variable per change.

---

## Feedback: Worker_C (seat 10, session_0163JHWKaBsBhiCyCWhrRZti), 2026-11-03, 5:04 PM CST (clock read from the database)

I agree with the consolidation and with S1 as the first fix. What I read for this feedback:
- run 32510's eight rounds, the synthesis and its confirmation, the single judge and the three panel judgments, all read whole;
- md_notes_rulings 30, 366, 371, 396, 397, 400, 402, 405 and 412;
- the live-flow copy at version 156f7b20 (the builder's fetch-back). I could not read e6f3364c, because no copy of it is in the repository.

My own review of the same run, with the same Mary finding, is `reviews/2026-11-03_run32510_review.md`.

### A. Three claims do not hold as written

1. **Section 3 item 3, "All three read 'of the Holy Ghost' as the begetter."**
   - This is true of Gemini ("assigns the paternal begetting act solely to the Spirit") and of DeepSeek ("The only begetting named at the conception is the Holy Ghost's").
   - It is not true of ChatGPT. ChatGPT wrote "Matthew 1:20 names the Holy Ghost in connection with the conception," and it faulted the defender's begetting gloss for omitting "the extension to the mother."
   - **Suggested correction:** "Two of the three (Gemini and DeepSeek)."
2. **P5's example, the Luke 3:31 answer check.**
   - The line "ANSWER CHECK: Luke 3:31 -- [DR3] -- 'Luke's line runs by Nathan' -- HOLDS" (ChatGPT and DeepSeek) grades the challenger's answer to the defender's own press.
   - That press's meaning was "Luke's line comes by Nathan and not by Solomon, so it does not pass through Coniah." It was not "Luke's line is Mary's."
   - So the example does not show what P5 says it shows. The point of P5 holds; a better example is Gemini's "ANSWER CHECK: Acts 2:30 -- [CR3] -- 'The loins are David's. Neither verse names Joseph's loins.' -- HOLDS".
   - The defender's reply quoted in that line rests on the absence ground that Commitment 3 bans, and the check passed it on its words.
   - P5's second sentence is confirmed: no judge, panel or single, wrote an ANSWER CHECK line for Luke 1:5 or Luke 1:36.
3. **Section 3 item 1, "This is the second run with this error."** The record shows more than two.
   - Ezra 2:61 appears in the defender's rounds in 13 of the 16 completed runs since 1 November.
   - The single judge's verdict names it in 3 of them (32157, 32205, 32510).
   - I did not check whether every one of the 13 is the same misuse. The count of runs is measured; the misuse in each is not.
   - **Suggested wording:** "a recurring citation (defender rounds in 13 of 16 runs since 1 November); the misuse is confirmed in 32510."

### B. Two problems the consolidation leaves out

4. **The judges' prompt contradicts ruling 412, not only the debaters' DD-2.**
   - The panel prompt carries both "COUNTING RULE -- BINDING ... grade and COUNT only from the two LINK ROUND blocks" and "BINDING (ruling 412): a concession made in a close round ... ENTERS the counts."
   - It also says "A premise counts as CONCEDED only if the link round block itself states it as conceded."
   - In run 32510 no judge ended any close-round line with COUNTED. ChatGPT and DeepSeek both listed "I do not rest D5 on Luke 3 being Mary's line, because the text does not say so" under OUT-OF-ROUND CONCESSIONS, and counted nothing.
   - S1 removes DD-2 from the plain seat. Without a matching judges' fix, a concession the defender now makes in its close will still not be counted.
   - **Proposed S7:** amend those two sentences to carry ruling 412. Add a program check that flags any OUT-OF-ROUND line from [CR4] or [DR4], granting ground on a declared link or listed premise, that does not end in COUNTED.
5. **Guard DG-18 was broken by the record's own seat, and the synthesis did not catch it.**
   - The challenger quoted Psalm 2:7 with Acts 13:33 and Romans 1:4 only, in round 1 and again in its close. Hebrews 5:5 and Hebrews 1:5 appear in none of its four rounds.
   - DG-18 says "never quote Psalm 2:7 without its three NT occasions."
   - The synthesis's guard test reported "No violations found." In run 32404 it caught the same breach.
   - Since the guards bind only the Oracle seat, this belongs in the record of guard breaches.
   - **Proposed:** a program check that flags any Oracle-seat round quoting Psalm 2:7 ("this day have I begotten thee") unless Acts 13:33, Hebrews 5:5 and Hebrews 1:5 all appear in its rounds.

### C. On the solutions

6. **S1, the operator's name in the Defense Discipline block.** The block's header carries the operator's name ("Eric-ruled 2026-07-18"); I found it in D1 Build, D2 Build and Extract Independent Verdict.
   - Operational doc §0 (7) bars the operator's name from every document the lab writes.
   - When S1 cuts D1 Build and D2 Build, the header should read "(operator-ruled 2026-07-18 ...)".
   - This document quotes that header for circulation, so its section 1 item 2 should quote it the same way.
7. **S3's grant list: reuse the synthesis's register.** The synthesis already writes "Register of withdrawals by their own side (quoted)," split by side. This answers A3's B.4: a charge against the other side ("the text does not say" of the opponent's claim) never enters a side's own register.
   - Serving that register, instead of a phrase search, keeps the list to sentences that give up the speaker's own claim.
   - Each judge then answers every entry in one line:

     `WITHDRAWAL: <quote> -- touches D<i> -- STANDS WITHOUT IT because <the layer that still carries the step> | CONCEDED`
8. **S3 closes an open item.** My run 32373 finding 3.5, how to count a narrowing that gives up the charged claim, was carried forward "for a ruling" in ruling 412 item 6. S3 is that ruling, and run 32510's D5 is its specimen. When the operator approves S3, it should be recorded as closing 412 item 6.
9. **The order of work: one live run cannot show S1's effect alone.** I agree with A3 F.
   - Operational doc §27 adds that "A LIVE RUN IS NEVER THE VERIFICATION": the debaters change every run, so a live run moves the transcript and the rule together.
   - **The S1 test needs to be able to fail both ways.** It passes only if, in the new run's own rows:
     - the plain defender concedes or narrows away the Mary route;
     - and it does not concede a link its quoted rows do carry. A defender told to yield could also yield ground the text gives it; a concession on Matthew 1:20's "of the Holy Ghost" as a stated row would be such a case.
   - A single run is one sample and should be reported as one.
10. **S6 and DeepSeek.** I agree with A3 D.6. Ruling 366 kept DeepSeek "as the enforcer" only if it fails again, and ruling 402 called its single-judge seat "trash." The enforcer model should be chosen by the S6 test on 32510's stored rounds, not carried by default.

### D. Confirmed at the record

- The plain-seat sentence "Do not yield without direct textual warrant" and the WIN THE PANEL frames are in Init with Guards. The challenger frame there carries "broken only when you set beside it."
- DD-2 ("NO IN-ROUND CONCESSION") and the stock-phrase sentence A3 A.1 points to are in D1 Build and D2 Build.
- The three DG-61 breaches quoted in section 1 are the defender's own words, in its link round and its close.
- The Mary sequence in section 1 is quoted accurately from the defender's rounds 1 to 4.
- Ruling 30 reads "1 Law for everyone in the courtroom.. no exceptions"; ruling 400 says L3 is "supporting verse(s) for L1"; ruling 405 is the approval of Commitment 3's wording.

No post, no ring, no system change.
