# pkgSGA3: a no-label "Premise N" send-back change is appended to its CONCEDED LINKS line (W2, 11-08)

Approved: Eric "approved" ASK 2 (13:47 CST 11-08). Class: the repeating E-APPLY no-label refusal (33798 gemini S5-S8, terra S13; 33490 sol S4-S6).

## Cause
A judge answers a send-back with `CHANGE TO: Premise N: VOID -- <reason>`. The target is a CONCEDED LINKS line that has no sentence of its own
for premise N. sbApply2024 refused it ("the change has no line label and would replace the whole ... line"), so a correct ruling never landed.

## Change
`sga3Append2024(cur, N, to)` in the 10 sbApply2024 nodes (Gate Build, Alt Gate Build, R2 Alt Gate Build, the 3 Gate Record nodes, the 4 Merge nodes).
It appends the change to the line as premise N's own clause (` -- ` after a bare count, else `; `). Four guards; if any fails, the old refusal stands:
1. the change starts with "Premise N" for the premise the item names;
2. the line's side and count number stay the same (psGrades before and after);
3. premise N is graded afterwards and is not COUNTED (a counted premise would leave the count stale; pkgSGA2's refusal still fires);
4. no other premise's grade changes. When N already sits in one joint sentence ("Premises 1, 3 and N are spared"), N is taken out of that
   sentence first; two or more such sentences: refused.

Known limit: prose in the old line is kept as written. 33490 sol keeps "none is VOID" before the appended VOID clauses; psGrades reads the
grades correctly.

## Tests (base pkgLIB/strip_RTB3 = s67, new pkgLIB/strip_SGA3)
- Combined replay, all saved runs: 1200 node runs, 1196 identical; the 4 that differ are Gate Build and Alternate Merge Seat on 33490 and 33798.
  (replay_RTB3_vs_SGA3.txt)
- Item diff, 10 nodes x 40 runs: changes only on 33490 and 33798, 0 items added (items_all_runs.txt, items_gate_build.txt).
  - 33798 gemini S5-S8 and G1-G4 gone: line becomes `0 -- Premise 1: VOID -- ...; Premise 2: VOID ...; Premise 5 ...; Premise 6 ...`.
  - 33798 terra S13 gone ("Premises 1 and 3 are spared" -> "Premise 3 is spared; Premise 1: VOID ..."). S14 (4 UNEXHIBITED -> SPARED,
    count change) is still refused by design; its gate item moves from G2 to G1.
  - 33490 sol S4-S6 and G1-G3 gone ("Premises 1, 2, 3, 4, 5 and 6 are spared" -> "Premises 1, 3 and 4 are spared ...; Premise 2 ... VOID ...").
- Case test (test_SGA3_cases.cjs, runs the patched function): the two real sequences apply; count change, counted premise, wrong premise
  number, and two joint sentences are all refused (test_SGA3_cases.txt).

## Pack
pkgLIB_SGA3: Shared Library 658df45cacb7 (LIB_N=30). E4 rebase on s67c/target_s67.json: Alternate Build a2a1c52d8658, Early Alternate Build
0202b79a7a3a; both rebuild to __N=310344; lines 9+ equal the RTB3 E4 tails.

## Stacking
Built on strip_RTB3 (s67). pkgGDS (W1) and v36 RI567 (W1) are also on strip_RTB3. build_SGA3.cjs applied to strip_GDS patches all 10 nodes
(checked); whichever lands second re-runs its build on the other's strip and re-packs.
Build: node pkgSGA3/build_SGA3.cjs [base strip] [dest strip].
