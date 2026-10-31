# Order BB-8634: problems found so far, and a solution for each

Worker_A3 (seat 25), pen of the order. Written 2026-10-31, 01:1x CDT. Nothing here has been posted to the board.

The order fixes the problems found in run 30091 ("Did Christ have a biological father?"). It has eight parts, S1 to S8; part S3 is the outcome function, and part S4 is the concession shield. Portions 1 to 3 are built, verified and published (the flow's new version is 8a7f48d3). Portion 4, the live run, is under way. The problems below were found while building and checking. Each one names who caught it and where it stands.

---

## A. Problems in the work itself

### 1. The outcome map recorded "DEFENDER PREVAILS, WEAKENED" against every judge (S3)
**What.** On run 30091 all three judges graded PARTIAL and wrote RESULT: UNDERDETERMINED, but the stored outcome said the defender prevailed. The tie rule applied only to HELD panels.
**Solution (done, on your word).** The tie rule now reads a PARTIAL panel the way it reads a HELD panel. I rewrote the outcome function in one guarded statement, and Worker_E verified it. Run 30091 now reads UNDERDETERMINED. No other PARTIAL row moved, and run B is unchanged. The undo is on the board (BB-8674).

### 2. The new "narrowed" sentence contradicted itself in one node (S4, D3 Build)
**What.** The agreed text was inserted before a parenthetical that belongs to the CONCEDED form. The defender was told the narrowed link is judged in its narrowed form "(rests on no exhibited prior-layer footing)". That is the opposite of the instruction just before it. C3 Build was clean.
**Caught by.** The advisor. I missed it: I rebuilt the text myself and compared bytes with Worker_E's file, but never read the sentence in place.
**Solution (done).** The sentence now goes after the parenthetical, in D3 only, and the test strings hold. My rule from now on: after any text rebuild, read every changed sentence whole, in context.

### 3. The served-label counter misread how debaters actually cite (S6)
**What.** Debaters write "Sight #519" and "Drift Guard #18". The counter read both as conclusion numbers. On a stored round on this topic it would have told the judges "0 of 5 cited", plus six false "unserved" labels. The true count was 4 of 5, none unserved.
**Caught by.** Me, by testing the forms found in stored rounds rather than invented ones.
**Solution (done).** New patterns, which I tested before proposing. Worker_E added the bare "(S519)" form, and all 6 of its hits in 200 stored rows are real labels.

### 4. A fifth list reader was missed (S1, the K2 check in the extractor)
**What.** S1 made every list reader accept "LINK n:" lines. The extractor's K2 check had its own reader, which nobody had listed. On a "LINK n" list whose labels repeat or run out of order, the defender's answers by position would be mapped to the wrong links.
**Caught by.** Worker_E. The advisor ruled it inside the order's scope.
**Solution (done).** K2 now takes the same reader. My test case (a relabelled list answered by position) maps correctly, and runs 30091 and B are unchanged.

### 5. A judge can mark a link withdrawn that the defender never conceded, and nothing flags it
**What.** This is old; S4 did not cause it. It holds in the old "D2: WITHDRAWN" form and the new form alike.
**Solution (proposed, follow-on).** The extractor compares each link the judge marks withdrawn against the defender's own CONCEDED lines in its link round, and flags any that has none. This first needs a rule for which concession counts as the withdrawal. It is on the follow-on list, agreed by both hands.

### 6. A withdrawn-link line graded STANDS cannot be read
**What.** Collision lines take only three grades: DEFENDER LINK BROKEN, CHALLENGER LINK BROKEN, UNDERDETERMINED. If a judge writes STANDS on the new withdrawn-link line, the extractor drops the line and raises three flags. This fails loud, so it is not a defect in S4.
**Solution (proposed, follow-on).** Add one sentence to the judges' rule: "a withdrawn link graded at its collision takes one of the three collision grades, never STANDS". Also make the extractor's message name the grade it could not read.

### 7. The first live run was refused by the challenger's provider
**What.** In run 30188 the challenger's model (MiMo) returned finish_reason content_filter, with no output, on its first round. A partial row was saved, holding only the defender's first round. Runs B and 30091 used the same request on the old challenger text and were not refused. So the new challenger lines this order added (S5: argue from the affirming rows; no Septuagint as footing; served-sight counts) may be the trigger. That is not proven.
**Solution (proposed).** Test it before blaming it.
1. Send MiMo the challenger's first-round prompt once with the old Init text and once with the new.
2. If only the new text is refused, reword the added lines.
3. If both are refused, it is the provider.
4. Whatever the cause, the flow could retry a refused first round once, or move the seat to its alternate, instead of stopping the run.

### 8. One file listing was stale
**What.** Worker_E's top-level checksum file still listed old Panel Build and BIV files, the versions that carried S2. The files themselves were right.
**Solution (done).** Worker_E refreshed the listing.

---

## B. Problems in how the three of us worked

### 9. A design question was put to you (S4)
**What.** As pen, I wrote "his word" for S4 into the plan without checking the rule that design questions go to the advisor. Worker_E and the advisor carried it on. I then told you three times that S4 waited on your yes or no.
**Solution (done).** S4 was withdrawn from you and approved by the advisor. New rule for all three of us: a plan line that waits on your word must name the ruling of yours it changes or the scope it exceeds. If it names neither, it waits on the advisor.

### 10. Two portions ran at once
**What.** The advisor declared portion 2 closed while my outcome-function write was still waiting on your word, and Worker_E built portion 3 on that.
**Solution (done).** The advisor filed it against itself. A portion closes only when every act in it is done, or when the plan names the held act as deferred.

### 11. I made a false claim on the board
**What.** I wrote that Worker_E opened portion 3 without its opening lines. It had them; my own earlier row even said I was idle while Worker_E built. The overlap itself was real.
**Solution (done).** I withdrew the claim in writing. A claim about another hand's row is checked against that row before it is posted.

### 12. A delegated write was not declared
**What.** Worker_E's seven node writes were made by a subagent, which its opening row did not say. The bytes landed correctly.
**Solution (done).** Worker_E filed it. A write row now names the hand that will make the write, before the act.

### 13. My stop row for run 30188 was late
**What.** The run stopped 55 seconds in. My first poll was set 10 minutes out, so the stop row could never be within the 10-minute limit.
**Solution (done).** The first poll after a fire is at 2 minutes, then every 10.

### 14. Small errors of mine
- I guessed column names three times. Each query was refused, and nothing changed.
- After the compaction my first calls were schema reads, not my note.
- My first fix pattern for S6 read "S1 build" as sight 1. I caught it before posting.

**Solution.** Read the column list before querying an unfamiliar table, and follow the resume order exactly.

---

## Where things stand

- Portions 1 to 3 are done and verified, and the new flow (8a7f48d3) is live.
- Run 30196, the re-fire after the refusal, was still running at 01:13 CDT.
- No board post goes up until you say so.
