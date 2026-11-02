# Run ODV1-32157: problems and solutions

First live run with GROUND on every judge, plus the OpenRouter switch. Flow version 0a1e1b2d. Fired 18:04 CST, stopped 18:49 CST 2026-11-01, status success.
Row 2232b185. Topic and sides as run 32141: "Did Christ have a biological father?", defender Claude (plain), challenger MiMo (oracle).
Result fields: outcome "UNGRADED — REVIEW"; panel CONTESTED, split "1-0 (2 not counted: debate rule)"; DeepSeek's panel seat failed and ChatGPT substituted.

What was read whole: the six rounds (claude_r1 9,692; engine_r1 13,519; claude_r2 12,641; engine_r2 6,877; engine_r3 7,831; challenger_r3 10,220), the three panel judgments (debate_judgments 876 ChatGPT 7,943; 877 Gemini 6,371; 878 GLM 9,522), the single verdict (independent_verdict_raw), the synthesis (14,711), the review notes (1,634), the citation check, panel_substitution and drv_removed. Each pressed witness was checked by name in the answering side's later rounds, with SQL position() searches on the stored columns.

Nothing here is applied. Each fix waits for your word.

---

## A. What GROUND did

1. **Every judge wrote it.** GROUND appears on every collision line: ChatGPT 9 of 9, Gemini 7 of 7, GLM 7 of 7, the single judge (DeepSeek) 8 of 8. ChatGPT writes ". GROUND:" instead of "-- GROUND:", and the extractor read it either way.
2. **The panel reply reader handled it.** This was the one path not tested offline. Every field was extracted for all three judges.
3. **It exposed the forbidden grounds, as designed.** The single judge: "the witnesses do not state Joseph begat Jesus". ChatGPT: "The seed chain does not establish Joseph as the immediate begetter". The checkers flagged them (K-S2, K-C, K-U).
4. **MiMo writing GROUND is still unproven.** MiMo sat as challenger, not as a judge.

## B. Faults that decided the outcome

### B1. DeepSeek's panel seat errored (aborted)
- Evidence: panel_substitution records failed_seat deepseek, failure_kind error, detail "aborted" at 00:37:07Z. ChatGPT took the seat. The debate_errors table has no row for this run.
- Cause: unread. The rule allows reading a debate run's execution data only when it stopped in under 10 seconds, so I have not opened it. The single judge, also DeepSeek, answered normally in the same run.
- Solution: with your word, read that one node's error in execution 32157 (the reading rule needs an exception). Separately, record a debate_errors row whenever a panel seat fails, so the cause is never lost.

### B2. ChatGPT was dropped on a false K-C mark
- Evidence: the judgment row ends "RULE: K-C; RESULT: UNCURED; NOT COUNTED; WHY: the restated line keeps the ground that a verse does not state the link". The restated line says the opposite: "...the later defense does not name the three 1 John witnesses... rather than requiring a single verse to state their conclusions." "Does not name" is the unanswered-witness test the rules require, not the stating-verse ground.
- Rule: this is the known false K-C class from run 29820, where the checker matched "never names" (finding B there, never fixed).
- Solution: in the K-C pattern, exclude "does not name", "never names" and "not named", which belong to the unanswered-witness test. Test it on 29820's ChatGPT/Grok row and on this row before writing.

### B3. Gemini was dropped on a round label and a numbering mismatch
- Evidence:
  1. K-G4, "no quotation found in the named round". Gemini quoted "Luke 1:27 gives Joseph 'of the house of David'..." and labelled it DR2. Those words are in DR1 (position 10,714 of engine_r1, absent from engine_r2). DR2 does press Luke 1:27, but in other words: premise 5, "Luke 1:27 'of the house of David'".
  2. K-G7. Gemini graded D4 BROKEN, but its counted list names premise 5. The challenger's list files premise 5 under "LINK 4", so premise 5 is the attack on link D4. The check compares premise numbers with link numbers.
- Its BROKEN grade is right on substance: Luke 1:27 is never named in the defender's round 2 or round 3 (verified, position 0 in both).
- Solution:
  1. K-G4: accept the quote if it appears in any round that pressed the witness, and report the wrong label as a note rather than a reason to drop the seat.
  2. K-G7: map each premise to its link through the "LINK n:" label in the challenger's list before comparing (the numbering defect from 32141, item B4).

### B4. No alternate for Gemini
- Evidence: "no pool model passes the guards: qwen ... already sits as the other alternate". Qwen, tried for ChatGPT, was "NOT SEATED; 1 uncured item(s)".
- Solution: widen the alternate pool. A pool of one cannot cover two dropped seats. This widening was already named for follow-on work when the alternates' cost was approved.

### B5. The counting rule was not applied by the counted judges
- Evidence: three witnesses pressed against the defender were never named in its later rounds (SQL position() 0 in claude_r2 and engine_r3 for each):
  1. Luke 1:27, pressed in DR1 and in DR2 premise 5, against link D4.
  2. Isaiah 7:16, pressed in DR1 against link D4.
  3. 1 John 3:9, 4:7 and 5:1, pressed in DR1 against link D1.
- The rule sent to the judges: "Grade a link BROKEN when the other side exhibited ... witnesses that together contradict it and the broken side's later rounds left any of those witnesses UNANSWERED."
- How each judge handled it:
  - ChatGPT conceded premises 2, 4 and 5 for exactly these witnesses, then graded every collision UNDERDETERMINED (flagged K-U twice).
  - GLM, the only counted judge, conceded premise 5 for Luke 1:27 and graded D4 vs C3 UNDERDETERMINED on "the unanswered Luke 1:27" (flagged K-U).
  - The single judge said every premise was answered.
  - Only Gemini graded by the rule, and it was dropped (B3).
- Effect: by the rule, D4 at least is DEFENDER LINK BROKEN. The run should probably have produced a challenger result, not "UNGRADED".
- Solution: make K-U a cure item like K-S, so an uncured K-U drops the seat, or have the extractor raise BROKEN where the judge's own concession list names an unanswered witness on the same link. Test the choice on this row and on 30304 before writing.

## C. Single judge (DeepSeek)

### C1. One K-C left uncured, possibly a false mark
- Evidence: D1's restated line weighs "chain against chain" (quoted in the review notes), yet the report says "keeps the ground that a verse does not state the link". The restated text is cut off in the row, so whether it kept the ground is unverified.
- Solution: store the full restated line, and re-run the K-C pattern on it after fixing B2.

### C2. It missed the three unanswered witnesses
- Evidence: "every premise in the challenger's [DR2] list is answered in [CR3]". Luke 1:27 was not answered.
- Solution: the same as B5.

## D. Debate content

### D1. Sight 32 shaped both sides again
- Evidence: the challenger's round 1 repeats Sight 32's "*synerchomai* ... can itself name married union — 1 Corinthians 7:5" and "A permanent negation would take the subjunctive with the strong negative". The defender took it in round 2: "grant that it can name married union, as in 1 Corinthians 7:5. That is what Matthew 1:18 needs." Every judge lists that as an out-of-round concession.
- Solution: Worker_G1's Sight 32 correction (your digit, 1 or 2), plus your word on the unfooted grammar clause.

### D2. The challenger used a Septuagint form without saying so
- Evidence (challenger R3): "*heōs hou* ... the same bound at 2 Samuel 6:23". 2 Samuel 6:23 is a Hebrew verse, so a Greek *heōs hou* there can only come from the Septuagint. All three judges wrote "No Septuagint citation was used".
- Solution: the citation checker should flag a Greek term attached to an Old Testament verse. This also touches the open question on the Septuagint rule, which is yours to rule.

### D3. The challenger's citation errors
- Evidence: the checker flagged wording at Haggai 2:23, Acts 2:30, Ezra 2:61-62, Genesis 21:3, Genesis 16:15, Luke 2:4, Ruth 4:10, Matthew 1:12 and Matthew 1:19, and "took unto him his wife" cited to Deuteronomy 1:24 (the words are at Deuteronomy 22:19). The judges gave those quotations no first-layer weight.
- Not verified one by one. Some may be 1611 spellings, for example "publick" at Matthew 1:19.
- Solution: read the nine against the KJV, and have the checker accept 1611 spellings as matches.

## E. Synthesis

1. **A false "both agree".** Section 1, item 6: "No union before the birth. Both seats state it." The challenger holds the opposite: "Joseph knew Mary his wife within the espousal."
2. **A false "every link answered".** Section 2: "every link was answered with lower-layer footing". This misses the three unanswered witnesses in B5.
3. **A rule conflict.** The confirmation says the defender's conclusion should be graded "against the same DG-8(a) prohibition that binds both seats under DG-29". The tandem manual says only the seat arguing the record's reading is bound by the guards.

Solution for all three: in the synthesis prompt, (a) a "both agree" item must quote both sides' words for it; (b) the link table takes its unanswered-witness list from the same check B5 uses; (c) state that the guards bind only the record seat.

## F. Carried from 32141 (still open)

1. Cache writes recorded as 0 (cache_write_tokens 0, cache_read 326,236). Fix in the OpenRouter usage parser.
2. drv_removed is NULL although two seats were not counted.
3. Grok still not exercised live.

## G. Order proposed

1. B2 (false K-C) and B3 (K-G4 round match, K-G7 premise-to-link map): checker fixes, tested on stored rows.
2. B5 (K-U as a cure item, or a BROKEN raise): decides outcomes; test on this row and 30304.
3. B1: your word on reading the DeepSeek error; then always write a debate_errors row for a failed seat.
4. D1: Sight 32 correction (your digit).
5. B4: widen the alternate pool.
6. E: synthesis prompt lines.
7. D2, D3, F: checks and smaller fixes.
