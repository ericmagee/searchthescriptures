# pkgRI5 part A: reader phase 2 item 5, label reads (W1, 11-08)
W3 order item 5 (tracker RP2-5). Reader first; where the reader reads no form (or a RESTATED line, for labels) the old regex decides (pkgSBR rule).
- lab (superseded-line audit, 26 library nodes): the line label (pair, KEYSTONE, CONCEDED LINKS, CHALLENGER CONCEDED LINKS, DEFENSE/CHALLENGE STANDING, CLAUSE, RESULT).
- krulRestated (30 nodes): the pair of a RESTATED collision line in the cure reply. The reader also reads "RESTATED: C1 vs D5" (pair swapped to D5 vs C1); K-RUL is TRIAL, recorded only.
- Not sbLabel0: it is only sbLabel's fallback, and sbLabel already asks the reader first (pkgSBR); a reader call there hit 0 of 1,500+ times.
- Reader path is live: on 5 runs, lab took the reader label 16-25 times per Alternate Merge Seat run; krulRestated took a reader pair 6 times in 33627 Panel Cure Check.
Base: pkgLIB/strip_RI4 (v29, graded W2 3265, W3 3268). Out: pkgLIB/strip_RI5, packed pkgLIB_v30_RI5A, Shared Library fa9f7e4ad67d, 30/30 stubs unpack.
E4 rebase: pkgLIB_v30_RI5A/e4_rebase (v30 stub head lines 1-8 + live s64 lines 9+): Alternate Build b72191e9375f, Early Alternate Build 573084d2ba2b; both rebuild to 305327 bytes = strip_RI5 Alternate_Build.js.
Test (test_strip_RI5.txt): 584 node runs over 41 runs, 0 changed outputs, 0 flips, 0 uncured changes, 0 NOT APPLIED changes; TOTAL 32 OK, 0 FAIL.
Part B (next): sbApply2024 field reads (RESULT, RETRACTED, FORCED pair, KEYSTONE, counts), kcmtGrade2024, cureRecompute.

## Part B (sbApply2024 reads, 26 nodes): LIB v31_RI5B
Build: node pkgRI5/build_RI5B.cjs (strip_RI5 -> strip_RI5B) && LIB_N=30 node pkgLIB/pack.cjs pkgLIB/strip_RI5B. Shared Library d1a772cee340.
Swaps to reader-first: RESULT test, RETRACTED pair (x2), FORCED pairs __fo/__pf, CHAIN MARK ct/co, pOf, FR test (ri4IsF2024), KEYSTONE keyChecks/km, RESULT rw, res0.
Test test_RI5B.cjs: 505 node runs over 41 runs, 0 changed outputs, 0 cure flips, 32 OK 0 FAIL.
E4 rebase: pkgLIB_v31_RI5B/e4_rebase (v31 stub head lines 1-8 + live s64 lines 9+): Alternate Build a8511bffa17b, Early Alternate Build c3f8c072baf5; both rebuild to 306698 bytes = strip_RI5B Alternate_Build.js.
Stacks on v30 (part A). Write order: v29 (s65), v30, v31; or v31 alone, which carries v29 and v30.

## Part C (kcmtGrade2024 + rest of cureRecompute) and reader items 6, 7 (pkgRI6): LIB v34_RI567
Stack: strip_RCD (v32) -> strip_KWQ (v33, pkgKWQ) -> strip_RI5C (part C) -> strip_RI6 (items 6 and 7). Packed from strip_RI6 as pkgLIB_v34_RI567, Shared Library 6d10f9716036.
Part C (build_RI5C.cjs): kcmtGrade2024's ANSWER CHECK grade comes from the reader where the reader finds an ANSWER field (a line with no ANSWER field stays ungraded, as before;
the first build read UNPROVEN there and added 17 K-CMTL rows in 33682, so it was narrowed). cureRecompute: RESULT word x3, STANDING L/word/c, KEYSTONE WITHDRAWN, CLAUSE N/W, CONCEDED count.
Also fixes part B's ri5Res2024: with no fallback regex it ran String(l).match(null), which matches the text "null"; now it returns null.
Items 6+7 (pkgRI6/build_RI6.cjs): sbBrokenWord2024 CLAUSE N/W and KEYSTONE WITHDRAWN; kkLines KEYSTONE line; krulRulings KEYSTONE link, graded collision, RESTATED pair; netLines CHAIN MARK FOOTED.
k2Marks and postureBlock name CHAIN MARK only in section-end label lists, not as line reads; left as they are.
Tests: test_RI5C (KWQ vs RI5C) and test_RI6 (RI5C vs RI6): each 605 node runs over 42 runs, 0 changed outputs, 0 flips, 32 OK 0 FAIL.
E4 rebase (v34 head + live s65 lines 9+): Alternate Build 436fc53275da, Early Alternate Build 699d75c6ee71; both rebuild to 309526 bytes = strip_RI6 Alternate_Build.js.
