# pkgKBL: the K-B layer reader misread grok's line in 33846 (W1, 11-09; Eric approved 01:19 CST)

Ruling: W3 Wall 3441, ENGINE (wrongful removal), class kb_layer_reader_inner_quote_g_number. Not a DeepSeek change.

## Fault
grok's D2 vs C2 line showed [L1] Matthew 1:18 quoted, [L2] synerchomai (G4905, cohabit conjugally), [L3] Matthew 1:20 quoted. The live reader (lbFoot) read only L1:
1. the prose word "of" in double quotes (under 4 letters, never a quotation) took the opening mark of the next real quotation as its partner, so both verse quotations were lost but one;
2. word (G4905, meaning): the meaning class excludes digits, so the Strong's number hid the meaning.
grok's RESTATED cure was then logged "no written response": the K-B ask asks for one RESTATED or RETRACTED line, never a RESPONSE line, but the generic gate required a RESPONSE line first.

## Change (kbl_subs.cjs; one text in every copy of lbFoot)
1. lb.short: a 1-3 letter word in double quotes is shown with single marks before quotes are paired (same length, so every index is unchanged).
2. lb.bar: a double-quoted span never runs across a | mark (GROUND segments).
3. lb.strong: [L2] read in the forms word (G1234, meaning) and word (meaning, H1234).
4. cure.kb: a K-B item answered with a RESTATED (or RETRACTED) line goes to the K-B cure branch, which still checks the grade and the two kinds.

Nodes: the 30 library full sources (base pkgLIB/strip_KWI = live s70 Shared Library 40d6f920ab83) and 12 nodes with their own lbFoot (base fetchback_live_s70; lb.* only).
- Pack: pkgLIB_KBL_s70 (Shared Library c277aee01799; every stub rebuilds its strip_KBL source byte for byte). E4: pkgLIB_KBL_s70/e4_rebase, Alternate Build dde2d8ed8bcd, Early Alternate Build 16658c6e8630 (new stub head + live s70 lines 9+; both rebuild to strip_KBL Alternate_Build).
- Non-library: pkgKBL/patched (shas in plan_KBL.json; Send Back Build/Record x3 are on GRT2 = live s70).
- Stack with pkgWLD: WLD also changes Panel Build and Build Independent Verdict. If WLD is written first, use pkgKBL/on_WLD (the same subs on pkgWLD/on_KWI: Panel Build 179b18436edb, BIV 2047b6cc87c0) instead of pkgKBL/patched for those two.

## Tests
- test_KBL.cjs (33846): 4 OK. Panel Payloads base raises K-B D2 vs C2 kinds [L1], patched raises none; Panel Cure Check base logs grok UNCURED "no written response", patched CURED from grok's RESTATED line (L1, L3).
- test_KBL_lib.cjs: 928 node runs over 46 runs, 919 byte-equal, 9 changed (diff_KBL.txt):
  - 33846 Panel Payloads / Panel Cure Check: the grok false K-B gone; its cure CURED.
  - 33705 Panel Payloads: K-B D3 vs C6 gone. Same fault: "how" in double quotes; the line shows [L1] Luke 1:35, [L2] eperchomai (G1904, ...), [L3] Luke 1:34. The row is then read by K-F (it has a FORCED line).
  - 33461 Alt Gate Record: grok G2 UNCURED -> CURED. The gate change had "raised a new K-B D5 vs C6"; that line shows [L1] Matthew 1:25, [L2] ginosko (G1097, to know), [L3] Matthew 1:18, so the new item was false.
  - 33345 Cure Check, 33442 BIV and Panel Payloads, 33497 and 33682 Panel Cure Check: report text only, KINDS L1, L3 -> L1, L2, L3 (a G-number word now read); no status change.
  - New K-B items: 0. Uncured-count changes: 0.
