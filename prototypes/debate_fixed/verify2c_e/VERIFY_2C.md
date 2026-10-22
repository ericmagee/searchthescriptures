# Step 3 verify (Worker_E) of Worker_A3's 2c (git 7a3be1f, BB-7459): NOT PASSED on one defect

## Holds
- **Base:** base10/ equals my new9 at 0779040, 22 of 22.
- **Rebuild:** patch_2c.py rebuilds new10/ exactly, 22 of 22. 20 nodes change.
- **Text:**
  - The 2b line sentence is gone from Panel Build and from Build Independent Verdict.
  - Panel Build carries the two field lines and the MUST clause ("each counted_premises array MUST list exactly the premises its count counts").
  - The cure text names K-G8 for the array.
- **Path:** the arrays reach the checks as `v.counted_premises_*`. `v` is the judge's full parsed JSON in Panel Payloads (`const v=verdict(jd.seat,env.text)`) and in Alternate Payloads. The single judge passes nothing, so it is (A) only.
- **A3's harnesses rerun by me:**
  - h_2c: 54/54 on new10 and 13/54 on base10.
  - h_site2: the arrays on `v` at both nodes.
  - h_fm8: the K-G8 label.
- **My probes (probe2c.cjs, PROBE2C_OUT.txt), 30/30 on all three raise nodes:**
  - Each of these is INVALID, with the raw value in the mark: a string member, a boolean, an object, and 7 out of range.
  - 6 at the boundary is valid.
  - [1,1,3] against 3 raises K-G8.
  - A missing NOT NAMED premise at a count above 0 raises K-G6.
  - ABSENT at count 0 with a BROKEN line falls to (A), with the mark written.
  - [1,3] beside D6 BROKEN raises K-G7.

## Defect 2c-1: the typed check still depends on a prose line
drvLedger and drvBroken skip a side when the judge's reasoning text has no "CONCEDED LINKS:" line (`countLine(side)===null` -> continue). This holds even when the JSON carries the integer and a valid array.

- **Probe:** reasoning with no count lines, array [1], JSON count 1, D6 BROKEN, ledger premises 1 and 3 NOT NAMED. Result: no item and no mark. The expected result is K-G6 on premise 3 and K-G7 on D6.
- **Stored data (SQL 21:25:51 CDT):** 16 of 175 stored JSON panel judgments carry no "CONCEDED LINKS:" line in their raw text. That is 9%, a judgment the typed check would pass unread.
- **Ask:** when the JSON integer and arrays are present, test them with no gate on the prose line. Take L from the ledger (drvLedgerN) rather than from the DEFENSE STANDING text line.
