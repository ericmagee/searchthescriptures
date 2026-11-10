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

# Regrade: pkgCDR rev 2 (W1, commit 20ab4133): PASS, not for write until the operator answers
- Rebuild on fetchback_live_s103.json byte-equal to parent_s103_CDR.json; three nodes as in rev 1.
- cdrDrop now carries (?!\s+(?:nothing|none|no\b|neither|not\b)) after the verb.
- My cases on rev 2 (run_rev2.txt): 19 of 20. W3, W14, W15, W16 (refused drops) now not listed. W17-W20 added before the run (commit 8117a217):
  - W18 "I withdraw nothing further; I drop the wording ..." listed (second verb read). W19 "I withdraw now the wording ..." listed. W20 "... nothing else." listed.
  - MISS W17 "I drop not only the bare statement but the wording "..."" is not listed. Safe direction (a real drop missed, nothing falsely listed); the cost of the look-ahead I proposed. DeepSeek still reads the rounds.
- W1's cases rerun on rev 2 (w1_run_cases_rev2.txt): 14 OK, 1 MISS (C9, W1's stated label error). 34108 P1, P2 and 34299 J1, J2 as in rev 1.
- Corpus rerun (corpus_rev2.txt): 39 debates, 2 listings, both on 34108.
- Log rows unchanged from rev 1; my rev 1 rolled-back insert (5 rows, 0 remain) covers the shape.

## Correction to my rev 2 PASS (W3 FAIL 3981 stands)
My rev 2 PASS was wrong. My cases planted only the "verb then nothing/none" class and did not plant other sentences that name a drop verb without dropping the wording. Rev 2 against my extended cases (W21-W33, labeled before any rev 3 run, commit 69212f72; run_rev2_33.txt): 24 of 33; 8 false listings (W21-W27, W33) plus the W17 safe-direction miss.

# Grade: pkgCDR rev 3 (W1, commit 218d7a94): FAIL on tails after the wording (agrees with W3 3987)
- Rebuild on s103 byte-equal; three nodes as before.
- My 40 cases (W34-W40 labeled before the run, commit 2ba3b373; run_rev3.txt): 35 of 40.
  - All 8 rev 2 false listings (W21-W27, W33) gone; my own non-drops (W28-W30) not listed; true drops after a label (W31) and a list mark (W32) listed; true drops with a tail after the wording ("for now", ", as the challenger asked.", "because ...") listed.
  - MISS, false listing (4): W34 "I withdraw the wording "..." if the challenger shows a row against it; he has shown none." / W35 "I drop the wording "..."? No." / W36 "... unless the rows bear it, and they do." / W37 "..., provided the challenger proves the gap; he has not."
  - MISS W17 (safe direction), as in rev 2.
- W1's cases rerun: 22 OK, 1 MISS (C9, W1's label error). 34108 P2 = the D6 pair; 34299 J2 = "ordinary means".
- Corpus: 39 debates, 2 listings, both on 34108.
- Fix: a drop sentence that ends in "?" or holds if / unless / provided (that) after the drop verb is not a drop. "because" / "as" / time words stay a drop (W38-W40 must stay listed).
- Owed before any write (not a code fault, W3's point): DeepSeek has not answered a prompt with P and J candidates listed.

# Regrade: pkgCDR rev 4 (W1, commit 97a9a504): FAIL on three more conditional forms
- Rebuild on s103 byte-equal. W1's cases: 32 OK, 1 MISS (C9). 34108 P2 = D6 pair; 34299 J2 = "ordinary means". Corpus: 39 debates, 2 listings, both on 34108.
- My 48 cases (W41-W48 labeled before the run, commit 79cb4765; run_rev4.txt): 42 of 48.
  - Fixed since rev 3: W34 (if), W35 (? No.), W36 (unless), W37 (provided), and the new W43 ("Do I drop ...? No."), W44 ("...? Never.").
  - False listings (3), same conditional family: W41 "... in case the rows fail; they do not." / W42 "... on condition that the challenger shows the gap; he has not." / W45 "... should the rows fail, and they stand."
  - Safe misses (3): W17; W46 "I drop the wording "..."; if the challenger objects, so be it." and W47 "..., even if it costs LINK 6." (true drops not listed: the conditional test reaches past the drop clause and "even if"). Cost only, not a fault.
- Fix: add "in case", "on condition (that)", "should <subject>", "supposing", "assuming" to the conditional words; read them only in the clause that holds the drop (up to ";"), and do not count "even if".

# Grade: pkgCDR rev 5 (W1, commit 8e7c85fd): PASS for the listing code. Not for write until the operator answers ASK 1.
- Rebuild on s103 byte-equal. W1's cases: 78 OK, 1 MISS (C9, W1's label error). 34108 P2 = D6 pair; 34299 J2 = "ordinary means". Corpus: 39 debates, 2 listings, both on 34108.
- My 60 cases (W49-W60 new, labeled before the run, commit b31b74ca; run_rev5.txt): 58 of 60.
  - Rev 4's three false listings (in case, on condition that, should) gone; rev 4's safe misses W46 ("; if ... so be it") and W47 ("even if") now listed.
  - New condition forms not listed, as labeled: supposing, assuming, in the event that, so long as, only when, but only if, inverted "were ... to".
  - New true drops listed: "whether or not", "even though", "as though", condition in the next clause.
  - Safe misses (2): W17 ("drop not only ... but"), W56 ", if only to narrow LINK 6." (idiom read as a condition). Nothing falsely listed.
- Owed before any write (not a code fault): DeepSeek has not answered a prompt with P and J candidates listed.

## Correction to my rev 5 PASS (W3 FAIL 4003 stands)
I called a missed true drop "safe direction". It is not: this package exists to feed a drop and reclaim to the enforcer, so a missed true drop is the fault it was built to remove. My rev 5 grade also did not plant arguendo drops or true drops that hold condition words.

# Grade: pkgCDR rev 6 (W1, commit 9722fe97): FAIL, true drops missed on the connector and time words
- Rebuild on s103 byte-equal. Corpus: 39 debates, 2 listings, both on 34108.
- My 73 cases (W61-W73 new, labeled before the run, commit 074c2dd0; run_rev6.txt): 68 of 73.
  - Right: condition before the drop (W67), arguendo before the drop (W69) and between verb and wording (W68), "if need be" (W73) not listed; true drops with "now that", ", but only the wording", condition after ";", "provisionally, pending", dash then "if" listed; W56 ", if only" now listed.
  - TRUE DROPS NOT LISTED (5): W17 "drop not only ... but"; W62 ", and if the challenger objects, I answer in round 4." (", and" starts a new clause); W64 "... when I narrow LINK 6 in this round." (present act); W65 "... once and for all."; W72 ", the day it was challenged." (past).
- Fix proposed: (1) drop "and" from the optional connectors before a condition word (", and if" opens a new clause; keep "but" / "only" / "except"); (2) "once and for all" is not "once"; (3) "when" / "once" / "the day" count only when what follows is not the speaker's own act ("when I ...") and not past ("was", "were", "had").
- Still owed before any write: the DeepSeek replay (which direction costs more depends on how the enforcer answers a listed conditional drop).
