# Run ODV1-32194: problems and solutions

The re-fire of 32192, which MiMo's content filter stopped at the challenger's round 1. Flow version f0a13064: GROUND on every judge, no reasoning settings, caching for every model. Fired 21:13 CST, stopped 22:20 CST, success (67.7 minutes).
Row a4922479. Outcome UNDERDETERMINED; panel PARTIAL, "2-0 (1 not counted: debate rule)"; DeepSeek's panel seat aborted, and ChatGPT substituted.

READ SO FAR, NOT YET WHOLE: the result fields and review notes; the three panel judgments (collision lines and audit lines); targeted searches of the rounds by SQL position(). The six rounds, the single verdict and the synthesis have not yet been read whole. That read is owed and comes next.

---

## A. What the changes did

1. **Caching works and is now recorded.** Cache writes 73,395 tokens, cache reads 272,275 (run 32157: 0 written, 326,236 read, and the writes were lost by the parser).
2. **No reasoning settings: every debater and judge returned.** All three MiMo challenger rounds came back (12,003, 10,652 and 8,339 characters), as did both Claude rounds that follow them and every judge reply that was not aborted.
3. **GROUND on every collision line** in all three panel judgments.

## B. Faults that decided the outcome

### B1. DeepSeek aborted a third time (panel seat)
- Evidence: panel_substitution records deepseek, error, "aborted", at 03:48:33Z.
- Since GROUND went live, DeepSeek has aborted three of its five calls:
  - run 32157: panel aborted, single judge returned;
  - run 32167: single judge aborted, so the run never reached the panel;
  - run 32194: panel aborted, single judge returned.
- In run 32141, before GROUND, both its calls returned.
- Your ruling: "any model that can't response in the required time will be removed". DeepSeek now fails at the judge seat more often than it answers. The cause, whether a timeout or a dropped connection, is in the execution records, which the reading rule keeps closed.
- Solution: your word on (1) reading the abort timings, then (2) removing DeepSeek from the judge seats under your ruling if the timings show the 15-minute limit.

### B2. ChatGPT was dropped, and its grade was wrong
- Evidence: ChatGPT graded D3 vs C1 and D6 vs C1 CHALLENGER LINK BROKEN, saying Isaiah 7:14 (pressed in CR1) is answered in "neither DR2 nor DR3". The challenger did answer it, in DR1: "Isaiah 7:14 [L1] -- 'Therefore the Lord himself shall give you a sign...' [L2] ... ha-almah ... The sign is dated to its own hour: 7:16 ..." (engine_r1, position 4,079). DR1 is a later round than CR1.
- The checker cured D6 vs C1 ("quotation found in CR1") but not D3 vs C1, the same witness. It checked only that the press was quoted, not that the witness was unanswered in every later round.
- Solution: the K-G4 cure check also searches every later round of the answering side for the witness. If one names it, the BROKEN grade fails as unanswered-false.

### B3. Gemini, a counted seat, graded the challenger's union link BROKEN on "came together"
- Evidence: "D3 vs C1 (Matthew 1:18): CHALLENGER LINK BROKEN -- Matthew 1:18 and Luke 1:34 directly exclude Joseph knowing Mary before conception -- GROUND: ... 'before they came together' ... πρὶν ἢ συνελθεῖν ... contradict marital union prior to conception."
- The rule: "A witness contradicts a link only when its own words state the contrary." "Came together" is synerchomai, which the lexicon gives as "cohabit (conjugally)", living together. Matthew 1:18 does not state that no union took place.
- This is the Sight 32 problem: the record's own summary still says synerchomai "can name married union (1 Cor 7:5)". Worker_G1's correction is waiting on your digit (1 or 2).
- Solution: (1) your digit on the Sight 32 correction; (2) the enforcer, with GROUND, should flag a ground resting on 1:18 "came together" as a stating ground.

### B4. The defender conceded link 2, and two judges missed it
- Evidence (CR3): "LINK 2: CONCEDED. John 1:12-13 speaks of 'them that believe on his name' ..." Gemini and GLM marked D2 STANDS. The extractor caught it ("WITHDRAWN MISSED D2") and counted the withdrawal (HELD -> PARTIAL). The checker worked here.
- Solution: none to the flow.

### B5. No majority on the standings
- The two counted seats disagree on conceded links (Gemini 1, GLM 3) and on challenge standing (PROP-DEPENDENT vs SELF-SUPPORTED), so those fields are null.
- Solution: follows from B1 to B3. With only two counted seats, any disagreement leaves the fields null.

## C. Citation errors (challenger)
Job 14:4 is cited for words at Job 25:4. Wording differs at 1 Chronicles 3:17-19, Haggai 2:23, Hebrews 7:10, 1 Chronicles 2:21-22 and Luke 2:4. Not yet verified against the KJV.

## D. Order proposed
1. B1: your word on reading DeepSeek's abort timings; then removal under your ruling if confirmed.
2. B3: your digit on the Sight 32 correction.
3. B2: the K-G4 cure check searches every later round.
4. Finish the whole read of this run (rounds, single verdict, synthesis).
