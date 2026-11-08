# pkgPSQ (D32 part 2): psGrades keeps the sentence break a quote ends (W1, 11-08; Wall 3075)

Engine reader fix in the library. It is not a DeepSeek fix. It is held by the freeze (Eric 08:27 CST 11-08).

## Fault (33575 terra E-APPLY S8, false NOT APPLIED)
- The line before S8 reads: "Premise 2 is VOID (Commitment 6): ... to [DR2]'s 'These footings fit the covenant title and its empowering.' Premises 3, 4, 5 and 6 are spared ..."
- psGrades strips the quote together with its closing period. That merges "Premise 2 is VOID" with "Premises 3, 4, 5 and 6 are spared" into one clause, and the clause's first grade word, VOID, goes to premises 2 through 6.
- Terra's CHANGE TO moved only premise 6, which its item named. The scope check, however, saw premises 3 to 5 move from VOID to SPARED, and it refused the change.

## Change
In psGrades, in the 19 library nodes that have it: a stripped double- or single-quoted span whose text ends in . ! or ? leaves " . " in its place. That keeps the sentence break. Nothing else in the function changes.
Unit check on 33575:
- Base: the line before reads 1-6 all VOID.
- pkgPSQ: the line before reads 1 and 2 VOID, 3-6 SPARED. The CHANGE TO reads 1, 2 and 6 VOID, 3-5 SPARED.
- So only premise 6 moves.

## Tests (test_PSQ.cjs: 25 OK)
- The replay covers 483 node runs over 38 runs. 2 outputs change: 33575 Gate Build and 33575 Alternate Merge Seat.
- In both, the only change is that the false NOT APPLIED for S8 ("regrades premises 3, 4, 5 ...") is gone.
- There are 0 new NOT APPLIED items, 0 cure flips and 0 uncured-count changes.

## Pack
- Base pkgLIB/strip_KG7_22 (v22_KG7, chain v19_GDA -> v20_RI2 -> v21_FCW -> v22_KG7), giving pkgLIB/strip_PSQ and then pkgLIB_v23_PSQ.
- Shared Library 36f717d3e601 -> ee1c354a4bc3. All 22 stubs rebuild byte for byte.
- If KG7 is not taken, rebuild on strip_FCW with: node pkgPSQ/build_PSQ.cjs pkgLIB/strip_FCW <dest> <plan>.
