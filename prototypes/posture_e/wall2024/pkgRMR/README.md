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
