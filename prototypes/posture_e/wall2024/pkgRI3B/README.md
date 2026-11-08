# pkgRI3 part B (reader phase 2 item 3; W1, 11-08)

Reader phase 2 was approved by Eric on 11-07; W3 set the order. This is an engine reader layer, not a DeepSeek fix.

## Change
The library's remaining CONCEDED LINKS and STANDING form reads now ask the shared reader (__RL) first. When the reader reads no such form, or reads it RESTATED, the old regex decides as before (the pkgSBR/pkgSBX rule).
- psGrades (19 library nodes): the count-line head (side and count) comes from the reader, ri3Head2024. The grade clauses after it keep their own parse. The reader's CONCEDED entries read only "premise N STATE" and would drop the prose grades psGrades reads, such as "Premises 3, 4 and 5 are spared" or "2-4 counted".
- drvCountLine (3: Extract Independent Verdict, Panel Payloads, Alternate Payloads): the side's count line, read line by line, reader first. This is the same rule as part A's lineOf.
- drvBroken (3): DEFENSE and CHALLENGE STANDING "L = n" come from the reader's STANDING form first (ri3StandL2024).
- gateCure2024 (6): the K-G1 test "CHALLENGER CONCEDED LINKS >= 1" and the count it prints.

## Moved to part C
- block in Extract Independent Verdict and Alternate Merge. It sits in the pkgCSP wrapper (__CSP), outside the scope that holds __RL and ri3Count2024. A first build failed there with "ri3Count2024 is not defined", which blanked conceded_split on every Alternate Merge run and flipped 33490 E-COL D4 vs C6. That build was withdrawn before any commit. Part C has to bring the reader into that scope first.
- charges and the block copies in the 4 Send Back nodes, which are outside the library.

## Test (pkgRI3/test_RI3.cjs, base strip_RI3 = live v25, patched strip_RI3B): test_RI3B.txt
- 24 OK, 0 FAIL.
- 573 node runs over 39 runs (33705 included).
- 0 outputs change: 0 cure flips, 0 uncured changes, 0 NOT APPLIED changes.

## Pack
- On A2R (the next LIB in the queue): pkgLIB/strip_A2R -> pkgLIB/strip_A2R_RI3B -> pkgLIB_v27_RI3B.
  - 30 nodes, Shared Library f6c9f8e96979. 30/30 stubs unpack to their sources.
  - The R2 clones get the same patches.
  - The two packages commute: build_A2R on strip_RI3B gives a strip byte-equal to RI3B applied to strip_A2R.
- Build note (W2 3234): give the plan path when stacking (node pkgRI3B/build_RI3B.cjs pkgLIB/strip_A2R pkgLIB/strip_A2R_RI3B pkgRI3B/plan_RI3B_on_A2R.json). The default plan path once overwrote plan_RI3B.json with the 30-node A2R plan, which has Alternate_Merge_1.js and no Alternate_Merge.js. test_RI3 then reads 23 OK, 1 FAIL over 546 node runs. Since then the build names the plan after the destination, unless the destination is strip_RI3B.
- If v27 is written instead of v26, E4's Alternate Build must be built on the v27 stub: `node pkgE4/build_E4.cjs fetchback_live_s62.json pkgLIB_v27_RI3B/patched/Alternate_Build.js`.
- Alone on v25 (22 nodes): `node pkgRI3B/build_RI3B.cjs pkgLIB/strip_RI3 pkgLIB/strip_RI3B`, then pack.
