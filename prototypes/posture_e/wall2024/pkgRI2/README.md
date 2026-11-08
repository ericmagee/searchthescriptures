# pkgRI2: reader item 2, Extract Independent Verdict reads its verdict lines through the shared reader

Reader phase 2 item 2 (W3 order; assigned in W3 3168 and 3171). This is a library-layer change on pkgLIB/strip_GDA19 (LIB v19_GDA, staged s61). Stub: Extract Independent Verdict b65d40fc4426 -> 030fcb5118d9. It is not a DeepSeek fix, so it rides with that gap's DeepSeek fix.

## Change (Extract Independent Verdict only; the other 21 library nodes and the Shared Library are byte-identical)
The shared reader reads each of these first, and the old regex runs only where the reader reads no line of that form:
- KEYSTONE: the top-level KSM and KSC.keystone.
- CONCEDED LINKS and CHALLENGER CONCEDED LINKS counts.
- Each COLLISION POINTS entry (colMap, and so colState). This uses the reader's COLLISION and LINK STATE forms, but only for the grades the old read knew. A bare "BROKEN" still goes to the old read.
- DEFENDER and CHALLENGER CHAIN MARK.

OUT-OF-ROUND is unchanged. Its old test is the prefix "<SIDE> |", and the reader's form is stricter, so reading with the reader first and falling back to the old test changes nothing.

## Behaviour (test_RI2.txt, 4 OK)
- Replay: 27 saved runs and 83 verdict texts (the independent verdict, each panel judge and each alternate), old v19 compared with RI2.
- 5 texts change, and all 5 changes are the same kind. They are 33218 panel 1, 33490 independent, 33490 panel 1, 33592 panel 1 and 33605 independent.
  - What changed: the old read of a "D<i> vs C<j> (verse): STANDS -- ..." collision line looked only for DEFENDER LINK BROKEN, CHALLENGER LINK BROKEN, UNDERDETERMINED or DEFENDER LINK STANDS. So it refused the spec's own STANDS grade, logged "ENTRY NOT READ" and "CARRIES NO ENTRY FOR D<i>", and left colState null for those links.
  - The reader reads them as STANDS. 18 false "not read" flags and 18 false "no entry" flags go away, and the collision map now lists every link.
- No stored verdict field other than audit_flags changes on any text: verdict, standings, conceded counts, keystone, chain marks, out-of-round, VOID counts and debate_rule_violations are all unchanged.
  - data_class changes on no text.

## Files
- build_RI2.cjs takes pkgLIB/strip_GDA19 and writes pkgLIB/strip_RI2/patched. test_RI2.cjs and test_RI2.txt hold the replay.
- ../pkgLIB_v20_RI2/ is what W4 writes: v19_GDA plus strip_RI2. All 22 stubs rebuild byte for byte, and only the Extract Independent Verdict stub changes.
- Revert: pkgLIB_v19_GDA/patched.
