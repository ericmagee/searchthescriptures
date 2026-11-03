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
