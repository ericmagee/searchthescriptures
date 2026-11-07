# pkgLIB v5 (W1, 18:35Z 11-07) = v4 + pkgCRW (cureRewrite whole-line replace). Supersedes v4 if v4 is not yet written; on live v4 it is one LIB rewrite.

- pack.cjs pkgLIB/strip_s45 pkgLIB/strip_L1Q pkgLIB/strip_TRM pkgLIB/strip_DEC pkgLIB/strip_V18 pkgLIB/strip_CRW. Library json_sha fd303ea5b877bffa, 2,081 lines, 384,377 bytes;
  22 nodes 528,482 bytes with the library. orig_stack/patched now also holds the pkgCRW full sources.
- Tests: test_LIB 11 OK 0 FAIL; SRCDIR=orig_stack 11 OK 0 FAIL; test_recent ORIG=orig_stack 13 runs (33218-33411) x 22 = 286/286 identical.
  (v4 plan for reference: json_sha 97e42280c4f50763.) pkgCRW's own replay (v4 vs CRW): 246/247 identical, the one change is the 33411 fix.

# pkgLIB v4 (W1, 17:35Z 11-07): ONE package for the gap = s45 + pkgL1Q + pkgTRM + pkgDEC (TRM base) + pkgV18, comment strip. Supersedes v3 and pkgLIB_v31.

- pack.cjs pkgLIB/strip_s45 pkgLIB/strip_L1Q pkgLIB/strip_TRM pkgLIB/strip_DEC pkgLIB/strip_V18. Library json_sha 97e42280c4f50763, 2,080 lines, 383,887 bytes.
  22 nodes 6,099,881 bytes (stripped) -> 527,992 (library included); live 8.0 MB -> 0.53 MB.
- Library nodes changed vs v3: Gate Record + Alt Gate Record (pkgTRM), Extract Independent Verdict (pkgV18). AMS = pkgDEC on L1Q (unchanged vs v3).
- orig_stack/patched = UNSTRIPPED base_s45 overlaid by pkgL1Q, pkgTRM, pkgDEC, pkgV18.
- Tests: test_LIB_out.txt 11 OK 0 FAIL; test_LIB_vs_original_out.txt (SRCDIR=orig_stack) 11 OK 0 FAIL; test_recent_out.txt (ORIG=orig_stack) 264/264 identical, 233 real output.
- Write order at the gap: pkgL1Q Send Back Builds; pkgTRM Send Back Build + Alt; pkgDEC Send Back Record + Alt (they contain TRM); then this LIB v4 (Shared Library node + 22 stubs).

# pkgLIB v3 (W1, 11-07): repack on live s45 + pkgL1Q + pkgDEC, with comment strip (Eric approved the efficiency items 11:06 CST)

- Sources: pkgLIB/base_s45 (the 22 library nodes of live d813c20d, from fetchback_live_s45) overlaid by pkgL1Q/patched (W3 PASS) and pkgDEC/patched.
- strip.cjs removes comments using acorn's comment ranges (strings, regexes and templates untouched; a block comment spanning a line break becomes a newline):
  live 22 nodes 8,013,306 -> 6,092,331 bytes (24%).
- pack.cjs pkgLIB/strip_s45 pkgLIB/strip_L1Q pkgLIB/strip_DEC: one unwired "Shared Library" node (383,755 bytes, 2,079 lines) + 22 stubs.
  The 22 nodes go from 8.0 MB of code (live) to 0.53 MB, library included.
- Tests:
  - test_LIB_out.txt (stub vs stripped source): stubs rebuild 22/22 byte for byte; corpus 264/264 identical; 33040 all-saved 22/22; v1 fault caught; +2 ms per node run.
  - test_LIB_vs_original_out.txt (SRCDIR=pkgLIB/orig_stack: the UNSTRIPPED live + L1Q + DEC sources vs the stubs): 264/264 identical, 33040 22/22.
  - test_recent_out.txt (ORIG=orig_stack; 12 recent runs 33218-33389, harness with live feeders): 264/264 identical, 233 with real output.
  - The one FAIL is the refs cross-check against pkgLIB_stub_refs.json (W4's list from 11-06 19:29 live). Every difference is a node ADDED since then
    (pkgPTA literal names, the mimo/deepseek panel nodes); the stubs carry every literal ref of the current sources (the check above it passes).
- Write order: pkgL1Q and pkgDEC are inside the stubs, so this package REPLACES them on the 22 library nodes; W4 writes pkgDEC's Send Back Record and Alt
  (not library nodes) at the same gap. Any later full-source change to a library node (e.g. pkgRMR on Alternate Merge Seat) must be re-packed.
- Live probe PROBE.md (v1 + v2) passed earlier (pkgLIB v2 ran live); same stub form.
