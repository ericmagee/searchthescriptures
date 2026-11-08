# pkgRMR (W1): name the removal rule in drv_removed

W3 rulings 2026-11-07 item 10 (outside review D7, problem 6). Eric 16:42Z: no judge issue is low priority. Record only; not a DeepSeek-enforcer fix.

- 1 node: Alternate Merge Seat. Base = live s44 (fc61c6e4faaf, equal to pkgMEM/patched_on_pkgDPT_patched) -> patched 46df07a90e21.
  Stack on W2's pkgL1Q: pkgL1Q/patched 03ac3562370c -> patched_on_pkgL1Q 8b53cf1d0a1d.
- Each drv_removed entry gains removed_rules (e.g. "K-W (cure) x4"), removed_rules_total, removed_rules_match (total = drv_uncured).
- Every ALTERNATE TRIED audit line gains "; REMOVED FOR: drv_uncured N: ...", so an uncounted seat with no alternate seated shows its rule too.
- Read from the seat's own stored lines (rmr_lib.js): v21 cure report rows UNCURED on a LIVE rule, and every AUDIT line marked "counted in drv_uncured"
  (E-GATE one per line; send-back tags by top-level item count). A count that does not add up is shown "(read N, count differs)".
- Tests: test_lib 6 OK; test_RMR (harness, every saved run) 23 OK, nothing else in the node output changes; 7/7 removed or uncounted seats read exactly
  their drv_uncured. 33345: chatgpt "K-W (cure) x4"; sol "E-GATE RULE K-S3 x1". 33371: chatgpt "K-G4 (cure) x1; COLLISION GRADE UNCURED x5".

## v2 (11-08, W3 2897 FAIL fixed; W3 3174 "fix it or close it today")
- Fault: on a SEATED line, which has no WHY, "; REMOVED FOR: ..." broke Format Markdown's ALTERNATE TRIED reader, so seated alternates would drop out of the run report.
- Fix: with no WHY, the tail is written "; WHY: REMOVED FOR: ...". With a WHY it stays "; REMOVED FOR: ..." inside the WHY capture.
- Rebased onto the current library chain. Alternate Merge Seat is a library node now. Base pkgLIB/strip_PSQ (v23_PSQ) -> pkgLIB/strip_RMR -> pkgLIB_v24_RMR. Alternate_Merge_Seat 2e5575242846 -> 58e631f8e91d (plan_RMR_v24.json). All 22 stubs rebuild byte for byte.
  Build: node pkgRMR/build_RMR.cjs --base pkgLIB/strip_PSQ/patched --out pkgLIB/strip_RMR/patched (after copying strip_PSQ to strip_RMR).
- test_RMR (test_RMR_v2.txt): 79 OK, 0 FAIL on 23 runs.
  - Nothing else in the node output changes.
  - Every removed seat's rules add up to its drv_uncured.
  - Every ALTERNATE TRIED line names REMOVED FOR.
  - NEW: Format Markdown's live s60 reader parses every ALTERNATE TRIED line, patched and base. That covers 17 runs with lines, SEATED lines included.
