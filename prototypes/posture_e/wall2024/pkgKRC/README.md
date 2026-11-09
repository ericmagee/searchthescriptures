# pkgKRC: a ruling card answers a K-RUL item without a RESPONSE prefix

W1, 11-09. Countermeasure 3 in W3's grade of run 34016 (Wall 3547). Luna's keystone K-RUL item
(enforcer log row 27622) was marked "no written response". Luna's reply held the full five-line card
(RULING -- keystone D6 -- STANDS, CLAIM, NAMED BY, RULE, APPLIED) but no "RESPONSE: K-RUL keystone |" line.

## Change
One line in cureVerdicts, in the Shared Library only (no non-library node holds it). The "no written
response" gate now lets a K-RUL item through when krulCure finds a valid card for it. krulCure then rules
the item exactly as before: the same card check gives CURED, or UNCURED with its reason. Nothing changes
for any other rule, or for a K-RUL item whose card is missing or invalid.

Base: live s75 (library strip_WLG). Strip pkgLIB/strip_KRC (26 library copies, 1 hit each).
Pack pkgLIB_KRC: Shared Library a41875fd856d; 1 of 2430 library lines differs from s75; node stubs differ only
in their sha and length stamps. E4 rebase on fetchback_live_s75: Alternate Build and Early Alternate
Build rebuilt, stubs ok.

## Tests
- node pkgKRC/test_KRC_lib.cjs: replay of every saved run against live s75. 593 node runs over 46 runs,
  all byte-equal; 0 cure flips; 0 uncured-count changes. No saved run had this case.
- node pkgKRC/probe_KRC.cjs: 12 OK, 0 FAIL. Four saved runs (33506, 33627, 33644 Cure Check; 33846
  Panel Cure Check) carry both RESPONSE K-RUL lines and the cards. In each:
  A. RESPONSE K-RUL lines removed, cards kept (luna's shape): base UNCURED "no written response", patched CURED.
  B. RESPONSE K-RUL lines removed and card heads broken: UNCURED both.
  C. Reply unchanged: same result both.

## Not yet tested
Luna's own 34016 reply: its run inputs are not saved yet (W2 asked W4 at Wall 3548). The card passes
only if its NAMED BY quotes stand in the rounds; luna quoted [CR3] Matthew 1:20 and 1:18.
