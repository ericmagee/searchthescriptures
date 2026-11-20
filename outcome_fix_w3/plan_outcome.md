# ASK 505 (if the operator agrees; coordinator via W4 04:29Z) plan rev 2 (W3, seat 33, 11-20; adds the operator's 22:29 CST ruling as C0; rev 1 d4ef2dde replaced rev 0 886679fd after W4's live check 04:29Z): the outcome must agree with the graded chain, and the transcript must explain it

Team: W3 plans, W4 checks against live and builds (the operator, 03:45:05Z: "Just you two."). The second non-builder grade is HELD.

## 1. THE OPERATOR'S WORDS
- 22:26 CST 11-19 (W4's thread): "members of the app will be carefully reading these transcripts.. they must make sense and add up. We can't have broken links and still win.. the rule we gave at the start says different. esp when the transcript says our link was prop supported."
- The rule given at the start (engine manual §1, the framing every seat receives): "The DEFENDER holds a declared chain on the topic; the CHALLENGER presses the opposing view and wins only by breaking that chain."
- 10:50 CST 11-19 (ASK 488): agreeing RESULT words decide the outcome.
- Ruling 494 (11-18 11:58 CST): "(1) keystone rule unchanged; a broken supporting link breaks the chain. (2) Apply symmetry: BROKEN defender chain plus a challenge resting on an unproven fact gives UNDERDETERMINED, not CHALLENGER WINS ... (3) Ruling 421 kept: a retraction is not a cure."
- 22:29 CST 11-19 (W4's thread): "the verdict should have been UNDERTERMINED.  You can't with a PROP SUPPORTED by two or more judges" (W4 reads it: a side whose standing is PROP-DEPENDENT on two or more judges cannot prevail, both sides; W4 is confirming that reading with him).
- Ruling 364 (11-17 11:15 CST): when a rule is applied to one side, consider applying it to the other.

## 2. WHAT HAPPENED IN RUN 40995 (W3 read debate_judgments and debate_results, 22:2x CST)
- All three seats (argon, sol, sol62): verdict BROKEN (BROKEN-1, keystone D5 BROKEN); DEFENSE STANDING PROP-DEPENDENT; CHALLENGE STANDING PROP-DEPENDENT; RESULT: UNDERDETERMINED (each recomputed after the cure; each notes "CLOSE-CONTRADICTION C5 ... counted as one CHALLENGER LINK BROKEN").
- Stored outcome: DEFENDER PREVAILS.
- The path, from the manual's OUTCOME rule (derive_debate_outcome): BROKEN panel -> CHALLENGER PREVAILS; then AGREEING RESULT WORDS (ASK 488): all three say UNDERDETERMINED -> UNDERDETERMINED; then CLOSE FORFEIT (pkgCFO rev 3, cfo_sides), which runs after: "The challenger alone: DEFENDER PREVAILS." So a confirmed closing contradiction by the challenger turned an agreed UNDERDETERMINED, over a chain all three seats graded BROKEN, into a defender win.
- That breaks the opening rule from the other direction: the defender won with its chain broken. The transcript also shows "DEFENSE STANDING PROP-DEPENDENT", which a reader takes as "supported"; the word means the side rests on 1 or more premises that were conceded or not shown.

## 3. OBJECTIVE
The stored outcome never names a side as winning when the panel's graded chain does not let that side win under the opening rule, and the transcript states, in plain words a reader can follow, how the outcome was reached. Expected effect: on run 40995's grades the outcome is UNDERDETERMINED, and its transcript says why.

## 4. THE CHANGE
C0. THE STANDING GATE (the operator's 22:29 CST ruling; not a question): in derive_debate_outcome, after the agree rule (488) and the close forfeit, before the citation rule: when the outcome names a side as prevailing (DEFENDER PREVAILS, DEFENDER PREVAILS, WEAKENED, or CHALLENGER PREVAILS) and that side's standing is PROP-DEPENDENT on two or more counted seats, the outcome is UNDERDETERMINED. Both sides alike. COLLAPSED is a weaker standing than PROP-DEPENDENT; W3 reads it as covered (a side cannot do better on a worse standing), to be confirmed in the same question W4 is asking him. For debates created at or after the write time. In 40995 both standings are PROP-DEPENDENT on all three seats, so C0 alone gives UNDERDETERMINED.
C1. Close forfeit cannot make a side win that the chain does not let win (derive_debate_outcome / cfo_sides; W4 locates; for debates created at or after the write time, as ASK 404 and 488 did):
  Still needed after C0 for the cases C0 does not reach: a close forfeit by the challenger when the panel graded the chain BROKEN but the defender's standing is SELF-SUPPORTED on two or more seats; C0 lets that DEFENDER PREVAILS stand, with a broken chain, against the operator's 22:26 words. Today a close forfeit by one side hands the outcome to the other side, whatever the outcome was before it. The change: a close forfeit can only take a win away from the side that forfeits; it never hands a win to the other side.
  - Option A (only the case the operator named): the challenger alone forfeits: if the outcome before the forfeit is CHALLENGER PREVAILS or UNDERDETERMINED, it becomes UNDERDETERMINED (today DEFENDER PREVAILS); a DEFENDER PREVAILS or DEFENDER PREVAILS, WEAKENED stays. The defender-alone case is unchanged (CHALLENGER PREVAILS).
  - Option B (recommended; A and its mirror, by ruling 364 and the opening rule read both ways): the same for the defender alone: if the outcome before the forfeit is DEFENDER PREVAILS (or WEAKENED) or UNDERDETERMINED, it becomes UNDERDETERMINED; a CHALLENGER PREVAILS stays. Both sides forfeit: UNDERDETERMINED (unchanged).
  The citation rule still applies after, unchanged.
C2. The transcript explains the outcome: one OUTCOME block, written by code from the same values the function used, listing in order: each seat's verdict and RESULT word; the panel verdict; each rule that changed the outcome (tie, agreeing RESULT words, close forfeit with the side and the contradiction's link, citation rule) with the word before and after; the final outcome. No step is shown that did not run. Format Markdown has no such block today (W4: 0 hits for "OUTCOME"); it does not call derive_debate_outcome (called from Build Save Body, Derive Outcome and Panel Done), so the steps must come from the function's own output or the saved row, not be re-derived.
C3. The standing words beside their numbers: Format Markdown already prints a legend ("PROP-DEPENDENT: some listed claims were conceded or stood without showing their layers, but not more than half. Those claims do not count."). The change moves that meaning beside each standing where it is printed, with the side's numbers, for example "DEFENSE STANDING: PROP-DEPENDENT (1 of 5 listed claims conceded or not shown; those claims do not count)". Stored words, rules and prompts unchanged.
OPEN (asked of the coordinator, not guessed): which transcript members of the app read: the Format Markdown document, or a render in the Vercel app (truth-app-dashboard). C2 and C3 go wherever that is; if both, both.
Not in this change: grading rules, the judges' prompts, Commitments, model settings. Reasoning untouched.

## 5. THE OPERATOR'S ONE QUESTION
C0 is his ruling (only the COLLAPSED reading rides on W4's confirmation). The one question left: C1 Option A or Option B (B recommended), for the cases C0 does not reach. C2 and C3 are reader-facing and follow his 22:26 words.

## 6. CHECKS
- B1 (W4, offline): recompute stored debates created since the CFO write time (v_cfo_from, held in the function) with C0, and with C0 plus A, and C0 plus B: the count of outcomes that move, listed by run token with before and after; nothing written back (as ASK 404). 40995 must move to UNDERDETERMINED under both.
- B2 (W4, offline): the OUTCOME block rendered for 40995, 40891 and one HELD run; each step matches the function's path.
- Q1 (the operator's release): the next run's stored outcome and its transcript OUTCOME block agree, step for step.
- Whether the stored outcome of 40995 (and any other row B1 lists) is rewritten is the operator's word, asked separately after B1.

## 7. WRONG-IF
1. B1 shows C0 overriding an outcome where every seat agreed on a winning RESULT word (488): list each such row for the operator; his 22:29 ruling is the later and more specific one, but he sees the count before the card.
2. The OUTCOME block shows a step the function did not take, or misses one: the block reads different values from the function; fix before the card.
3. A reader gloss for a standing disagrees with its numbers: fix before the card.

## 8. STEPS
1. W4 checked against live (04:29Z): derive_debate_outcome 1f79a931 runs 488 then pkgCFO as described; cfo_sides 48f76f17; C1 confirmed. C1 build may start offline now; C2 and C3 wait on the OPEN question.
2. The operator answers A or B.
3. W4 builds; B1, B2; W4 tells him the second grade is held; his card; write; readback.
4. Q1 on his release. Manual entry (W3) on its own card after.
