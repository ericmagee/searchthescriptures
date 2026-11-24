# W1 grade: ASK 596 core build rev 0 (Wall 11495)

GRADE: FAIL, F1 and F2; one ruling. standing/notes596.md bdc31b0c, commit 618f6aa0, /mnt/project-files/standing/.
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: plan596.md rev 1 (8d4ca45e), sections 3 and 4, and my rev 1 confirmation (Wall 11478: flagged_line is a hard FAIL from the first day); ruling 512; ASK 599 rules 1 and 3; build rule.
OBJECTIVE MET: NO. S3 (a) passes live while live stores a judge's line cut to 400 in flagged_line (F2).
STANDARD (ASK 599): files only; no engine change.

## W1's own runs (run.cjs)
- Live 04273989 / c9acb53a: 28 PASS, 0 FAIL (5.2 s).
- d819ff4c / 31329164: 27 PASS, 3 FAIL, all three S3 at rev590Hits (Send Back Build, R2 Alt Send Back Build, and the count). Matches proof 1.
- The 595 follow-on target: 28 PASS.
- prewrite_eng587 / prewrite_child587: 11 PASS, 67 FAIL. Matches proof 3.
- out/proof5_7.txt read: 7a, 7b and 7c each FAIL and name the new place.

## F1. A missing marker stops the run
Proof 5 reads "19 PASS, 1 FAIL (0.4 s)", which is 20 tests of 28. The throw "marker not found" ends the run, and 8 tests never run. A build that renames one marker and breaks something else shows one FAIL, not two.
Fix: catch the throw per test, mark that test FAIL "marker not found", run every other test, and print the number of tests run. Proof 5 then shows 27 PASS and 1 FAIL.

## F2. A judge's line cut in flagged_line passes S3 (a)
The scan follows a producer only inside one source. Three library setters build an item's `line` with a cut, and their items are stored as flagged_line by untraced places (for example "Alternate Merge Seat :: String(x.line||'')"):
- K-CMTL: `line:'"'+l.slice(0,400)+'" -- this contested grade line names no commitment ...'`. This is a judge's line cut to 400. Stored rows: 1,095 in debate_enforcer_log (rule K-CMTL; longest flagged_line 802).
- K-ML: `q.slice(0,400)` (a debater's MEANS quotation) and `U.text.slice(0,900)` (a verse). 3 rows.
- K-LB: `b.head.slice(0,160)` (a debater's line head). 20 rows.
S3 (a) is a hard FAIL "from the first day", so the scan must see these.
Fix: add a setter scan across all sources. Any object setter of a property that an untraced place reads (line, flagged_line, detail, to, row, and the rest of the 75) whose value holds a cut FAILS, unless it is named on the baseline list with its kind and its ASK. Today that list holds K-CMTL (the judge's own line, a defect for ASK 597 stage 1 or 3), K-ML and K-LB (debaters' words, ASK 597 K4), and K-KJV. Run proofs 1, 2, 3 and 7 again, and add proof 7d: a new cut setter in another node, read by an existing untraced place, FAILS.

## Ruling asked: K-KJV
Yes, it goes on the named baseline list for ASK 597. It is a code report, but it quotes judges' lines, so ASK 597 S1 classes it (K5, or mixed text listed alone, under plan section 6 item 3). The count may only go down.

## What is sound
- The markers find code by text, not by line number.
- The 587 A to E behaviour tests.
- The (b) baseline of 3 holds.
- About 5 seconds a run.
- The ESLint answers.
