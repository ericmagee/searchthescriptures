# W2 grade of pkgCDR rev 1 (W1, commit 4c4ebc2a)

Verdict: FAIL on one false-listing class (a refused drop read as a drop). Everything else checked holds. Small fix below.

## Claims checked
- Rebuild on fetchback_live_s102.json byte-equal to parent_s102_CDR.json; three nodes change (Close Enforcer Build, Close Enforcer Record, Judge Contradiction Build).
- 34108 (W1's run_cases rerun, w1_run_cases_rerun.txt): P2 = [CR3] "I drop the wording "no biological father" as a bare statement." against [CR4] "Christ had no biological father." (the D6 drop and reclaim). P1 = the [CR4] sentence "... with no biological father needed to complete it.".
- 34299 post-panel: J2 = the "ordinary means" pair ([CR3] Genesis 4:1 grant against [CR4] "Genesis 4:1 therefore cannot supply the sequence ..."), by the CLOSE-ROUND REVERSAL CHECK; J1 = Luke 1:34 pair listed once, "also named by the ANTI-CHEAT CHECK". No other new candidate. W1's run 11 OK, 1 MISS (C9, W1's stated label error).
- Corpus rerun (corpus_rerun.txt): 39 debates, 2 listings, both on 34108.
- Rolled-back insert (rollback_w2.sql, W1's 5 rows with tag W2-ROLLBACK-TEST-CDR): 5 inserted, RAISE rolled back, 0 remain. 20:45 CST 11-09.

## My cases (cases.json W1-W13 committed before any run, commit 1384cc1c; W14-W16 added after the first run to size the W3 class; run.cjs -> run.txt)
16 cases, 12 as labeled.
- Listed and right: drop in [CR2] restated inside a longer close (W1); challenger "I retract the claim that ..." (W2); upper-case restatement (W11); "I abandon the reading that ..." (W12).
- Not listed and right: "I will not withdraw" (W4), "I do not drop" (W13), a reported request "The challenger asks me to drop ..." (W5), the other side saying it (W6), a close that grants it (W7), restated in round 3 not the close (W8), 2-word span (W9), close that quotes it and repeats the drop (W10).
- MISS, false listing (4): a refused drop is read as a drop.
  - W3 "I drop nothing: the wording "the register stops at Joseph" stands." then [CR4] "The register stops at Joseph." -> listed.
  - W14 "I withdraw none of the wording ...", W15 "I give up no part of the claim that ...", W16 "I retract nothing; ... stands as written." -> each listed.
  The side kept the wording, so restating it is no contradiction. The form is real: stored debates hold "I withdraw nothing further." (grep of inputs/*_Final_Output.json).
  Cause: `cdrDrop=/\bI\s+(?:now\s+|also\s+|therefore\s+)?(?:drop|withdraw|retract|give\s+up|abandon)\b/i` matches the verb with no check of what follows.
  Proposed fix: add a negative look-ahead after the verb: `(?!\s+(?:nothing|none|no\b|neither|not\b))`.
  Cost of the fault: a listing alone breaks nothing (DeepSeek answers it), but it puts a false contradiction candidate in front of the enforcer whose CONFIRMED breaks a link.
