# Engine manual section: pkgPCS (CONCEDED LINKS reader: clauses joined by ", and premise"; the Cure Check copy's negation rule)

Node: Shared Library only (lines 1381 and 1643; MAP lengths recomputed; 42 stubs rebuild and compile). Built on s141 (ff40f39f). Prompt: none.

## What it does
1. psGrades reads a CONCEDED LINKS line clause by clause and gives each clause's FIRST grade word to every premise number in it. A clause
   was cut only at ";" and ".". It is now also cut before ", and premise(s) <n>", ", but premise(s) <n>", ", while ..." and ", whereas ...".
   A comma part with no grade word of its own is joined to the next part, so "premises 1 and 6, and premises 2 to 5, are spared" reads as before.
   Both copies: line 1381 (Gate Build, Gate Record, Send Back Record, Alternate Merge Seat, Alternate Merge 1 and their Alt and R2 clones)
   and line 1643 (Cure Check, Panel Cure Check).
2. Line 1643 (Cure Check, Panel Cure Check) now carries the negation rule line 1381 already had: "not/never counted, void, unexhibited,
   conceded" and "uncounted" read as SPARED. Before, the cure readers read "Premises 1-6 are not counted as conceded" as all COUNTED,
   and "premise 4 is not counted UNEXHIBITED" as COUNTED. (A gap left by pkgNVR, W1, and by the earlier "not counted" rule.)

## Effect (measured, 12 stored exports, 1,764 distinct CONCEDED LINKS strings)
- Part 1: 2 lines change in each copy, both now right: 35173 sol ("premises 1 and 6 remain VOID ..., and premises 2 through 5 remain
  spared": 2 to 5 were VOID, now SPARED) and 33149 ("premises 3 is spared, and premises 1, 4 and 6 remain VOID": 1, 4, 6 were SPARED, now VOID).
- Part 2: 7 more strings change in the Cure Check copy only (33490, 34626, 35173), each a "not counted" read as COUNTED, now SPARED.
- No other string changes.

## Limits
- No comma, no split: "premise 1 is VOID and premise 2 is spared" still reads both VOID.
- Only "and", "but", "while", "whereas" before "premise(s) <n>" start a new clause.

## Size
+579 code characters (measured: part 1 +204 on each of two lines, part 2 +171); prompt 0.
