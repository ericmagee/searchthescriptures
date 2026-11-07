# pkgKSP (W1, 11-07): E-KSC counts only the keystone LINK itself, never a premise charged against it (W3 grade_33411 Fault 3; W2 2924 agrees)

33411: all four judges had KEYSTONE D6 STANDS with the defender's premise 2 of LINK 6 counted CONCEDED ([CR3] "LINK 6 [premise 2]: CONCEDED"; [CR4] "D6: KEPT").
Only sol was raised, because its line "Premise 2, charged against D6: CONCEDED (stated) ... not a withdrawal of the whole declared D6." put "D6" before the tag,
and the parse read it as LINK 6 CONCEDED. pkgKSC refuses every KEEP, so sol was removed (false removal; outcome unchanged).
Change (KSC block only; CLR untouched): counts() takes the CONCEDED body; a PREMISE entry never counts (the [DR2]-list and own-label mapping of a premise to its link
is dropped, per W3's ruling "a premise conceded under a link is not the link withdrawn"); a LINK entry counts only when, outside quotes, the line names
"LINK n" or "Dn" directly followed by UNEXHIBITED, CONCEDED or WITHDRAWN, and not as a premise's link ("Premise 2, LINK 6", "Premise 2 (LINK 6)",
"charged against D6", "under/of LINK 6").
DESIGN CHANGE TO NOTE: W3 2671 (1) mapped a counted premise to the link its label names (33149: premise 6 = LINK 4 raised the item). pkgKSP drops that path.
| Node | base | patched |
|---|---|---|
| Send Back Build (live s46) | b0a7604f6217 | e1fe8c8ffa1f |
| Send Back Record (live s46) | 31f9ac2c4181 | b12f058586ab |
| Alt Send Back Build (live s46) | bd7c5109d7d1 | 6d66aed20f69 |
| Alt Send Back Record (live s46) | 6b1cf152b6f4 | 5a943485d797 |
| Extract Independent Verdict (pkgV18 = LIB v4/v5 source; library node) | 8517637eafc3 | f10d445ca36b |
Tests: test_KSP.txt 16 OK (the 4 seats of 33411, sol's full line, 33175 LINK 6 UNEXHIBITED still raised, D6 CONCEDED / LINK 6 WITHDRAWN raised, cures).
replay_KSP.txt: 13 runs (33218-33411) x 5 nodes = 65, 64 identical; the 1 change is 33411 Send Back Build, where sol's E-KSC item (S12) is no longer sent.
EIV is a library node: pkgLIB_v6 = v5 + this EIV (library json_sha unchanged fd303ea5b877bffa; only the EIV stub differs). v6 tests: test_LIB 11 OK,
SRCDIR 11 OK, test_recent 286/286. If KSP is graded for the same gap as v5, write v6 instead of v5.
