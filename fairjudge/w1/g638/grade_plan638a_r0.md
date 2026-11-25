# W1 GRADE: ASK 638 A plan rev 0 (ask638/w4/plan638a.md d2c7954d, commit 69b0a32c)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Builder: W4.

GRADE: PASS WITH N1.

Checked against live engine ee4e389d:
- The four makers of "takes the premise out of the count" and the one reader (rctOut) are as section 3 states.
- pkgB6 cpAdd exists and has no matching drop. The three guards (drop equals cut; every dropped premise in the array; no overlap with add) are sound, and they leave E-ASM fact numbers alone.

N1 (must be in the build; a note, not a fail). Section 1 and the header say nothing here touches a count or what a judge is sent. The array is not inert:
- counted_premises is read in 4 nodes of ee4e389d: Build Save Body (1), Panel Build (3; the prompt), Format Markdown (1) and Shared Library (24).
- K-G8 is LIVE in ENF_STATUS. Its text is "your counted_premises array for a side lists a different number of premises than that side's count". It cures by kCount ("no other cure"). It is also in the cureSet list and in the "CORRECTED COUNT NOT WRITTEN" nc list (items not CURED).
- So dropping a premise from the array can change whether K-G8 fires or cures for that side. That can move drv_uncured and so seating.
The build must:
- name these readers and K-G8 in section 3;
- in C1 (sol on 42528) and C3, report K-G8 status and drv_uncured before and after, and show whether any outcome changes (as in 634's N1);
- state in the report whether the Panel Build prompt text for a later round can differ.
If any outcome changes, that is reported for the operator on the card, not hidden as record-only.

STANDARD (ASK 599): tagged ASK 638; build to show no dead code and no new catch.
NOT CHECKED: 42373 (the plan's own NOT SEARCHED); the build.
