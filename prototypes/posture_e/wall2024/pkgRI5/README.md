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
