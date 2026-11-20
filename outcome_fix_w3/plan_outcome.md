# Plan rev 0 (W3, seat 33, 11-20; ASK number pending from the coordinator): the outcome must agree with the graded chain, and the transcript must explain it

Team: W3 plans, W4 checks against live and builds (the operator, 03:45:05Z: "Just you two."). The second non-builder grade is HELD.

## 1. THE OPERATOR'S WORDS
- 22:26 CST 11-19 (W4's thread): "members of the app will be carefully reading these transcripts.. they must make sense and add up. We can't have broken links and still win.. the rule we gave at the start says different. esp when the transcript says our link was prop supported."
- The rule given at the start (engine manual §1, the framing every seat receives): "The DEFENDER holds a declared chain on the topic; the CHALLENGER presses the opposing view and wins only by breaking that chain."
- 10:50 CST 11-19 (ASK 488): agreeing RESULT words decide the outcome.
- Ruling 494 (11-18 11:58 CST): "(1) keystone rule unchanged; a broken supporting link breaks the chain. (2) Apply symmetry: BROKEN defender chain plus a challenge resting on an unproven fact gives UNDERDETERMINED, not CHALLENGER WINS ... (3) Ruling 421 kept: a retraction is not a cure."
- Ruling 364 (11-17 11:15 CST): when a rule is applied to one side, consider applying it to the other.

## 2. WHAT HAPPENED IN RUN 40995 (W3 read debate_judgments and debate_results, 22:2x CST)
- All three seats (argon, sol, sol62): verdict BROKEN (BROKEN-1, keystone D5 BROKEN); DEFENSE STANDING PROP-DEPENDENT; CHALLENGE STANDING PROP-DEPENDENT; RESULT: UNDERDETERMINED (each recomputed after the cure; each notes "CLOSE-CONTRADICTION C5 ... counted as one CHALLENGER LINK BROKEN").
- Stored outcome: DEFENDER PREVAILS.
- The path, from the manual's OUTCOME rule (derive_debate_outcome): BROKEN panel -> CHALLENGER PREVAILS; then AGREEING RESULT WORDS (ASK 488): all three say UNDERDETERMINED -> UNDERDETERMINED; then CLOSE FORFEIT (pkgCFO rev 3, cfo_sides), which runs after: "The challenger alone: DEFENDER PREVAILS." So a confirmed closing contradiction by the challenger turned an agreed UNDERDETERMINED, over a chain all three seats graded BROKEN, into a defender win.
- That breaks the opening rule from the other direction: the defender won with its chain broken. The transcript also shows "DEFENSE STANDING PROP-DEPENDENT", which a reader takes as "supported"; the word means the side rests on 1 or more premises that were conceded or not shown.

## 3. OBJECTIVE
The stored outcome never names a side as winning when the panel's graded chain does not let that side win under the opening rule, and the transcript states, in plain words a reader can follow, how the outcome was reached. Expected effect: on run 40995's grades the outcome is UNDERDETERMINED, and its transcript says why.

## 4. THE CHANGE
C1. Close forfeit cannot make a side win that the chain does not let win (derive_debate_outcome / cfo_sides; W4 locates; for debates created at or after the write time, as ASK 404 and 488 did):
  Today a close forfeit by one side hands the outcome to the other side, whatever the outcome was before it. The change: a close forfeit can only take a win away from the side that forfeits; it never hands a win to the other side.
  - Option A (only the case the operator named): the challenger alone forfeits: if the outcome before the forfeit is CHALLENGER PREVAILS or UNDERDETERMINED, it becomes UNDERDETERMINED (today DEFENDER PREVAILS); a DEFENDER PREVAILS or DEFENDER PREVAILS, WEAKENED stays. The defender-alone case is unchanged (CHALLENGER PREVAILS).
  - Option B (recommended; A and its mirror, by ruling 364 and the opening rule read both ways): the same for the defender alone: if the outcome before the forfeit is DEFENDER PREVAILS (or WEAKENED) or UNDERDETERMINED, it becomes UNDERDETERMINED; a CHALLENGER PREVAILS stays. Both sides forfeit: UNDERDETERMINED (unchanged).
  The citation rule still applies after, unchanged.
C2. The transcript explains the outcome: one OUTCOME block in the transcript document, written by code from the same values the function used, listing in order: each seat's verdict and RESULT word; the panel verdict; each rule that changed the outcome (tie, agreeing RESULT words, close forfeit with the side and the contradiction's link, citation rule) with the word before and after; the final outcome. No step is shown that did not run.
C3. The standing words are explained to a reader, in the transcript only: beside each standing, its meaning in plain words and its numbers, for example "PROP-DEPENDENT (rests on 1 premise conceded or not shown; L=5 c=1)". The stored words, the rules and the judges' prompts are unchanged.
Not in this change: grading rules, the judges' prompts, Commitments, model settings. Reasoning untouched.

## 5. THE OPERATOR'S ONE QUESTION
C1 Option A or Option B (B recommended). C2 and C3 are reader-facing and follow his 22:26 words.

## 6. CHECKS
- B1 (W4, offline): recompute stored debates created since the CFO write time under A and under B: the count of outcomes that move, listed by run token with before and after; nothing written back (as ASK 404). 40995 must move to UNDERDETERMINED under both.
- B2 (W4, offline): the OUTCOME block rendered for 40995, 40891 and one HELD run; each step matches the function's path.
- Q1 (the operator's release): the next run's stored outcome and its transcript OUTCOME block agree, step for step.
- Whether the stored outcome of 40995 (and any other row B1 lists) is rewritten is the operator's word, asked separately after B1.

## 7. WRONG-IF
1. B1 shows the change moving outcomes where every seat agreed on a winning RESULT word: stop; the agree rule (488) must keep deciding those.
2. The OUTCOME block shows a step the function did not take, or misses one: the block reads different values from the function; fix before the card.
3. A reader gloss for a standing disagrees with its numbers: fix before the card.

## 8. STEPS
1. W4 checks against live: derive_debate_outcome, cfo_sides, the transcript builder node(s), the standing lines.
2. The operator answers A or B.
3. W4 builds; B1, B2; W4 tells him the second grade is held; his card; write; readback.
4. Q1 on his release. Manual entry (W3) on its own card after.
