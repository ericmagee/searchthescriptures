# Run ODV1-32141: problems and solutions

Execution 32141, audit 26401. SUCCESS, 22:10:48Z to 23:00:54Z.
Defender: Claude via OpenRouter, plain profile. Challenger: MiMo via OpenRouter, oracle profile.
Outcome UNDERDETERMINED. Panel HELD 2-0; DeepSeek not counted (3 uncured debate-rule violations). 0 errors.

Each problem gives the evidence, the rule it breaks, and the proposed solution. Nothing here is applied. Each fix waits for your word.

What was read: the six rounds whole (defender R1, R2 and link round R3 in claude_r1, claude_r2, engine_r3; challenger R1, closing R2 and link round R3 in engine_r1, engine_r2, challenger_r3 of debate_results row 5c1e3bb2; challenger_r3 length 11,596), the three panel judgments, the single verdict, the synthesis, the review notes, the citation check, and drv_removed (NULL). The other columns' lengths were read in the earlier dump and are not restated here.

---

## A. Judges

### A1. DeepSeek panel judge graded LINK BROKEN on grounds DG-8 forbids
- Evidence: D3/C3, D3/C5, D6/C5, D6/C6 graded CHALLENGER LINK BROKEN on Matthew 1:18 and 1:25. Grounds: "before they came together" and "till" read as excluding the union.
- Rule: DG-8 holds that 1:25 "till" bounds the abstinence and is no witness against the union. K-G4 caught D3/C3, D3/C5 and D6/C5, and none were cured. Its D1 also drew a K-C flag, which was cured.
- Effect: the seat was correctly not counted. The alternate, Qwen, was tried and not seated (2 uncured). The panel then ran with 2 judges.
- Solution: put GROUND on all judges, as one change (already decided: "if ground is on one judge it must be on all"). The enforcer then checks the stated reason line by line. g2 offline: 8/8 forbidden reasons caught by majority.

### A2. The single judge (also DeepSeek) repeated the same fault and drew a different verdict
- Evidence: DEFENDER WINS. D5 STANDS flagged K-S, UNCURED ("REVIEW THIS ROW"). Its CHALLENGER LINK BROKEN grades rest on 1:25 "till".
- The synthesis confirmation says so: "training holds 'no human biological father' as the pious reading; the governing guard on this subject does not…"
- Rule: same as A1. The same model graded differently as panel judge and as single judge (DEFENDER WINS vs its panel grades).
- Solution:
  1. Same GROUND change, applied to the single judge too.
  2. When the single judge carries an uncured K-S flag, do not publish its verdict as the result. Mark it "verdict withheld: uncured K-S" instead.

### A3. Gemini's judgment is thin and its reasons are generic
- Evidence: 3,312 characters. Every collision UNDERDETERMINED, both sides self-supported. Reasons such as "the passive verb leaves begetting unnarrated…" do not name the row the grade rests on.
- Rule: possible K-S2-type grounds (grading on what a row does not state). No flag was raised.
- Solution: GROUND, plus one enforcer line: a GROUND that names no row is incomplete. A minimum-length floor is not proposed; length is not the defect, the missing row is.

### A4. GLM graded on absence
- Evidence: K-S2 on D1/C1, "nor does any row state Joseph's begetting in words". It also drew a K-C flag, cured by restatement.
- Rule: K-S2. It was caught, so the enforcer worked. The defect is that the judge produced it in the first place.
- Solution: GROUND makes the reason explicit, so K-S2 is caught at the line, not inferred from the prose. No separate change.

### A5. The panel says HELD while the result says UNDERDETERMINED
- Evidence: panel HELD 2-0 with both seated judges grading every collision UNDERDETERMINED.
- Rule: a known mismatch. "HELD" reads as a win for the standing reading when no collision was decided.
- Solution: when every counted collision is UNDERDETERMINED, label the panel outcome UNDERDETERMINED, not HELD. One condition in the panel tally node.

---

## B. Debaters

### B1. Defender's false lexical claim (Luke 2:27)
- Evidence (DR3, defender Link 5): "Luke 2:27 'the parents' and Acts 16:13 'where prayer was wont to be made' use the same family of verbs, nomizō".
- Fault: "parents" at Luke 2:27 is goneis (G1118), a noun, not nomizō. Verified at original_words: Luke 2:27 position 14 goneiv G1118; "the custom of the law" there is eithismenon G1480 (position 23); enomizeto G3543 stands at Acts 16:13 (position 13) and Luke 3:23 (position 12). The defender took the challenger's R2 press, which set Acts 16:13 beside Luke 2:27, and repeated it as fact.
- I did not re-check whether the panel flagged it. The panel texts were read before this write-up and not saved locally.
- Solution: the citation check verifies wording, not Greek claims. Add a lexeme check: for each "[L2] word (gloss)" claim, look up the Strong's number on that verse in the record, and flag a mismatch to the judges.

### B2. Grammar claim at Luke 1:34 (CORRECTED: the claim is served by Sight 32)
- Evidence (DR3, Link 6): "a standing negation would take ou mē (not at all) with the aorist subjunctive".
- My first reading was wrong. Sight 32's summary carries the same rule: "a permanent negation would take ou me + aorist subjunctive". The challenger took it from a served row; it is not training recall.
- What stands: the rule is in Sight 32 with no row behind it (no original_words or lexicon footing for the grammar rule itself). The defect sits in the sight, not in the debater.
- Solution: put it to the operator with the Sight 32 correction (Worker_G1's draft of 2026-11-01): keep, re-footed, or remove the grammar clause.

### B3. The challenger carries record labels into its text
- Evidence (DR3): "count as served (S-9): episkiazō = 5 rows, every use the cloud or the shadow"; "Count as served (S-1578): Iechonias in the NT = 2 rows".
- Fault 1: internal labels in debate text.
- Fault 2: the synthesis drift guard rated both as low-weight DG-63 count issues. "Every use" overstates 5 rows. S-1578 is used as a negative closure ("never cited against the child's throne").
- Solution: in the oracle profile prompt, ask for counts as plain words ("the record shows 5 uses") with no S-labels. Keep DG-63 as the check. No new rule.

### B4. The premise numbering collides between sides
- Evidence: in DR2 the challenger pressed "LINK 4" twice, once for the curse and once for Mary as channel. The defender then answered "LINK 4 [premise 3]" and "LINK 4 [premise 4]".
- In DR3 the challenger's "LINK 1–6" are its own premises, while the defender's "LINK 1–6" are the defender's chain. Defender LINK 2 is never pressed or answered by number.
- Effect: judges must map links by content, which invites grading the wrong pair.
- Solution: tag each side's links with a prefix (D-L1, C-L1) in the round prompts, and have the press name the target prefix. Then the collision builder matches by label.

### B4a. Pressed witnesses traced by name
- Challenger R2 pressed 32 witnesses (8, 4, 5, 6, 4, 5) across six links. The defender's link round names every one except two:
  1. Luke 2:33 "Joseph and his mother marvelled" (pressed on link 1). Never named; unanswered.
  2. 1 Chronicles 3:17-18, Jeconiah's sons named (pressed on the curse link). Never named; unanswered.
- The defender's link round pressed 6 items (18 witnesses). The challenger's link round names every one.
- Defender R2 laid Ruth 4:17, 1 Chronicles 3:19, Genesis 24:16 and 24:43, and Galatians 3:16. The challenger's closing (R2) names none of them. Its link round answers Galatians 4:4, not Galatians 3:16.
- The challenger's three floating-premise charges come in the last round. The defender has no later round to answer them, by structure.
- Solution: the judges should grade the two unanswered witnesses as unanswered. Whether any judge did is a check on the panel texts, which were read before this addendum, and is not re-run here. Add a per-witness answered/unanswered list to the collision builder input, so the judges do not have to find gaps by reading alone.

### A6. Removed seat not recorded
- DeepSeek's panel seat was not counted (3 uncured violations), and the alternate Qwen was not seated. Yet the run's row has drv_removed NULL.
- Rule: the live-run read covers "the removed seats' verdicts (debate_results.drv_removed)". Here there is nothing to read.
- Solution: check whether drv_removed is written only for a seat replaced by an alternate. If so, a seat that is dropped and not replaced is lost from that field. The fix is to write the dropped seat and its reason there too. This is unverified until the Save node's code is read.

### B5. Engagement gaps (from the synthesis)
- Challenger left unanswered: monogenēs (John 3:16), Ruth 4:17, Ezra 2:61, and the enomizō tested-use list.
- Defense vulnerabilities it named: the keystone is entirely inferential; the narrator's "parents" at Luke 2:27 and 2:41; Gal 4:4 unanswered on the defender's side.
- Solution: none to the flow. These are debate content. The synthesis reported them, which is its job.

---

## C. Citation check

### C1. Five wording differences, two not checked
- 238 checked, 231 match. Wording differs: Heb 7:10, Hag 2:23, Luke 9:34, Matt 1:11-12, Luke 1:32. 2 not checked.
- Cause: likely ellipses and joined ranges ("Josias begat Jechonias... Jechonias begat Salathiel"), not misquotes. Not verified one by one.
- Solution:
  1. Read the five against the record.
  2. If they are ellipsis or range joins, teach the checker to match each fragment separately.
  3. Report why the 2 were not checked.

---

## D. Provider switch defects

### D1. Cache writes recorded as 0
- Evidence: cache_write_tokens 0, cache_read 253,336. Reads cannot exist without writes.
- Cause: the generic OpenRouter parser sets cache_creation to 0.
- Solution: read usage.prompt_tokens_details.cache_write_tokens in that parser. One line. Cost figures for this run understate.

### D2. Grok not exercised live
- Grok moved to x-ai/grok-4.7 via OpenRouter, but no seat drew Grok in this run.
- Solution: one live run with Grok seated, or a relay call on the live body (as in g4), before calling the switch complete.

### D3. Format Markdown "mis-routed" note not verified
- The patch was not checked in the Drive transcript of this run.
- Solution: open the run's Drive transcript and confirm the note's text and routing.

### D4. Tribunal webhook fails at the trigger
- "Unused Respond to Webhook node found in the workflow". This setting existed before the switch, but the Tribunal's OpenRouter path cannot run until it is fixed.
- Solution: set the trigger's responseMode to "responseNode", or remove the unused node. Pending your word.

---

## E. Order proposed

1. D1 cache parser: one line, no behavior change.
2. A5 panel label: one condition.
3. GROUND on all judges plus the row-naming enforcer line (A1–A4), as one change, after the board hold lifts.
4. A2 withhold the single verdict on an uncured K-S.
5. B4 link prefixes.
6. B1/B2 lexeme check: a new node, the largest item.
7. D4 Tribunal trigger, D2 Grok run, D3 transcript check, C1 five citations: checks, any time.
8. B3 prompt wording.
