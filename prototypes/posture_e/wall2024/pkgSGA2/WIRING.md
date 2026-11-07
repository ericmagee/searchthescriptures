# pkgSGA2: a sentence change that moves a premise into or out of the count goes to the gate (W1 2695, W3 ruling)

pkgSGA puts a send-back change that has no line label into the one "Premise N" sentence of a count line. If that change moves premise N between counted (UNEXHIBITED, CONCEDED) and not counted (spared, VOID, NOT VOID, SUPPORTED), the line's count number goes stale. pkgSGA2 marks such a change NOT APPLIED and sends it to the gate, where the judge writes the whole line with its count. A change from VOID to NOT VOID (the 33218 case) moves nothing and stays applied. The test is psGrades, the reader pkgPS uses, on the line before and after the change.

**Base.** pkgSGA/patched (33fd73a, graded PASS). The change is one edit in sbApply2024, in the 6 nodes. Write it after pkgSGA.

| node | pkgSGA final | pkgSGA2 final |
|---|---|---|
| Alternate Merge Seat | ef920450 | 81e5346a |
| Gate Build | 397a189c | b898aba7 |
| Gate Record | 6e1ae390 | 07f1c6cd |
| Alt Gate Build | 6fbd3265 | 6be6444f |
| Alt Gate Record | f2d8e2cd | 9b8a2051 |
| Alternate Merge | 55400145 | 18368591 |

**Test.** `node pkgSGA2/test_SGA2.cjs` gives 7 OK. There is one unit for each direction, a unit for VOID to NOT VOID, and a replay of 474 stored answers comparing pkgSGA with pkgSGA2.

In the replay only one seat changes, 33149 gemini S16. Its change "Premise 1 is SPARED" would have left "CONCEDED LINKS: 2" with one counted premise, so it now goes to the gate. No result changes, and 33218 is unchanged.

So the stored replays do hit this case once. That corrects W1 2695, which said none did.
