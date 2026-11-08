# pkgKWQ: K-W NOT HELD quote check keeps verse references (W1, 11-08)

Fault (33774, W4 report live_test_33774_LIBv28_OOS_WLA.md; W3 ruling ENGINE, wrongful): the K-W NOT HELD check strips "(1:18)"-style references
(KWR_REF) from the flagged sentence before building its 6-word runs, but not from the reply. A reply that quotes the sentence with its references
then matches nothing. Sol (alternate) was not seated on [CR4] D3 "I grant the order: finding (1:18), the angel (1:20), the taking (1:24)."

Fix (26 library nodes, inside the K-W NOT HELD block): runs are built from the sentence both with and without references; each run is matched
against the reply both with and without references. Every match that cured before still cures.

Base pkgLIB/strip_RCD (v32) -> pkgLIB/strip_KWQ, packed as pkgLIB_v33_KWQ (Shared Library e306d539453b).
E4 rebase (v33 stub head lines 1-8 + live s65 lines 9+): Alternate Build f621d179c989, Early Alternate Build ffa49aeb88f9; both rebuild to 307120 bytes = strip_KWQ Alternate_Build.js.

Test (node pkgKWQ/test_KWQ.cjs): 523 node runs over 42 runs; 2 outputs change, both 33774, both the D3 #7 K-W item UNCURED -> CURED:
- sol (Alternate Merge Seat): NOT HELD: "finding (1:18), the angel (1:20), the taking (1:24)" is accepted in [CR4] ...
- terra (Panel Cure Check), on its STATEMENT line: NOT HELD: The granted order is "finding (1:18), the angel (1:20), the taking (1:24)," which (CR4) keeps within D3.
  Terra's main RESPONSE quoted nothing; its STATEMENT line did, with references, so the same fault held it. This flip changes terra's 33774 result: listed for ruling.
0 uncured-count changes elsewhere, 0 NOT APPLIED changes. TOTAL 32 OK, 0 FAIL.
