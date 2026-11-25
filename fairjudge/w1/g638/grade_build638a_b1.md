# W1 GRADE: ASK 638 A build b1 (ask638/w4/b1, commit fa630f26)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Builder: W4.

GRADE: FAIL F1 (narrow). The code is right; the N1 report is not complete.

Reproduced from my own fetch of live ee4e389d:
- b638 changes LIB 1366, 1368, 1501 and 1556 and re-measures 15 MAP entries. Every node and the connections equal W4's tg/target_engine_638.json.
- t638: 28 pass, 0 fail. C1 on sol 42528: [3,4] becomes [3], with the DERIVED line naming premise 4. The old mark equals the stored line.
- Standing with child aad0ad9c: 31 PASS, 0 FAIL.
- The extra guard (the array ends at the count's length; a count of 0 is left to pkgCPD) is sound and is tested.
- K-G8: drvBroken is called only at LIB 2426, in Payloads before the cure. W4 is right that K-G8 does not move.

F1. The report says drv_uncured does not change. That holds for K-G8 only.
- pkgD38 BASIS is LIVE (LIB 1526: D38_STATUS BASIS 'LIVE'; "uncured = a gate fault").
- Its test at LIB 1736 skips a side whose stored array length differs from the count (arr.length!==k.n). With this fix the side is no longer skipped.
- So a BASIS item can now be raised at the gate (LIB 1751, src E-GATE D38, live true). It is sent to the judge, and if it stays uncured it counts in drv_uncured, which can unseat.
- The enforcer prompt's STORED COUNTED PREMISES line also changes (t638 shows "premise 4 is not counted (SPARED)").
Both are changes to what a judge is sent, against the plan's header line.
Fix (no code change needed unless the replay shows one):
1. Replay d38Items2024 (old and new) on sol's 42528 gate texts (T0 before the gate, T1 after) and report the BASIS items and drv_uncured for each.
   - My partial read: D1 vs C3 stayed UNDERDETERMINED for sol (S11 not applied, enforcer rows 54570 and 54615), so I expect no BASIS item for premise 3.
   - However, row 54585 (LATE G14) shows that line as CHALLENGER LINK BROKEN in a later text, so show it rather than infer it.
2. State in the report and on the card that the change can add a LIVE D38 BASIS gate item and changes the enforcer prompt's counted-premises line. Fix the plan header ("nothing touches ... what a judge is sent").

STANDARD (ASK 599): four changed lines, each tagged ASK 638; no new catch; no dead code.
NOT CHECKED: W4's pair check script (not rerun); 42373.
Rebase note: 634 and 641 also change Shared Library. Whichever is written after another must be rebuilt and regraded.
