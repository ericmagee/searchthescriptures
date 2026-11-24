# W1 READ-ONLY CHECK: ASK 598 plan rev 2 (da921912) and ASK 597 plan rev 1 (29319130) against live engine 6834c21b / child ecdc6218
Coordinator's task, 09:54 CST 11-24. Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Scripts: scratchpad scan598.cjs, scan597.cjs (my own fetches of 6834c21b and ecdc6218).

## ASK 598
HOLDS:
- Engine 423 nodes (Judge Order Read added by 591); unreached 29 = the same 28 + Shared Library; none of the 28 became reached. Child 156; only Shared Library unreached.
- $() readers of the 28: the same set as plan s2 item 4 (Anticheat Record: Build Save Body, Panel Build; Extract Independent Verdict: Failure Salvage, Assume Check Record, Judge Contradiction Build, library; Cure Check: Failure Salvage, Alternate Merge Seat, Alternate Pass Call, library; Verdict/Diagnostic Normalizer, Cure Call: Build Save Body; Extract Diagnostic: Failure Salvage; the five Call nodes: Panel Tokens; library map names). Pass-back list: 38 engine nodes, 4 child HTTP nodes, unchanged (Judge Order Read does not carry it).
DRIFT / NEW HITS:
- D1 (LIVE USE OF THE SINGLE-JUDGE SEAT, not in the plan): Init Seats still computes `single_judge`, and three REACHED nodes use it: Build Synthesis picks the synthesis model from the single_judge seat and throws "Build Synthesis refused: single_judge ... has no family map / no ACTIVE model_config row"; Resolve Seats fails the run ("single judge seat ... is of family ..., which debates in this debate") when that seat's family debates; Format Markdown reads `$('Init Seats').first().json.single_judge`. So the seat field is live: it is the synthesis judge. Stage B must not remove Init Seats' single_judge (W4's fix 1 note left it "for ASK 598"); the plan should say the field stays (or is renamed to what it now is, the synthesis seat) and list these three readers as NOT dead.
- D2: Build Save Body holds three single-judge texts in its RVW review-note rewrite ("SINGLE JUDGE (second opinion)", "KEPT IN THE SINGLE JUDGE'S TEXT", "CURED by the single judge's cure reply"); my fix 1 grade (Wall 11555) assigned them to 598. Add to stage B's Build Save Body list.
- D3: ASK 586 J3 (live 09:16) added the J3 paragraph to Build Independent Verdict; the J3 manual entry (08.0 v299) and the 591 entry (10.0 v302) name it; plan s4 item 5 covers J2/J3 texts but the manual parts to edit after stage B now include 08.0 v299's "Build Independent Verdict holds the same paragraph" line.
- D4: size: the 28 are 174,594 chars of a 3,278,167-char compact file by my measure (plan 175,615 of 6,576,380 pretty-printed); not material.
- D5: fix 1 removed single_judge from dash_judge_lineup and the review line; plan s6 item 2 (readers of the single-judge columns) should note the page and the JUDGE ORDER line no longer name it.

## ASK 597
HOLDS: no substr/substring form; the K1-K6 design is untouched by the writes.
DRIFT (the plan's table is of d819ff4c; my strict count on that file reproduces it, 151):
| Cut at | plan (lib/other) | live 6834c21b (lib/other) |
| 1,500 | 19/5 | 17/5 |
| 700 | 24/3 | 24/3 |
| 600 | 31/11 | 31/11 |
| 500 | 1/9 | 1/1 |
| 400 | 27/21 | 25/21 |
| all | 102/49 = 151 | 98/41 = 139 |
- Child: plan 105 at the five lengths; live ecdc6218 101 (98 in its library copy).
- Other lengths: engine 686 (plan 689; 2,000 now 0, was 3); child 269 (same).
- s2 item 4 is STALE: the ASK 590 reversed-close cuts (500 in the judges' block, 400 in the send-back) were removed by the ASK 595 follow-on (live 07:57); the 500-row drop (9 to 1) is that. The 1,500 and 400 library drops are the 595 follow-on's E-REVCLOSE and question-round DROPPED fixes.
- New code since (J2, J3, 591, fix 1) adds no cut at the five lengths (counts fell only).
- The inventory (S1) must be taken on the live version at build time, not on d819ff4c.
