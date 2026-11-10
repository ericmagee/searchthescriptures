# W2 grade: pkgKSR and pkgECB (W1, Wall 4219, commit 62588cc0), offline on live s110, execution 34626. Labels a83bd195 (before the build).
Script w2_ksr_ecb.cjs, output w2_ksr_ecb_out.txt: 15 OK, 0 FAIL. Sources rebuilt from each write file's Shared Library (not from W1's patched files).
Size (measured): only the Shared Library changes (418 nodes, connections equal). KSR +418, ECB +462, ALL +880. No prompt text.
pkgKSR: PASS. P2.1 chatgpt and sol KEYSTONE D6 STANDS -> BROKEN (engine line), luna unchanged; RESULT, CLAUSE, DEFENSE STANDING unchanged.
  P2.2 break planted on D3: no KEYSTONE change, output equal to s110. P2.3 no closing break: equal to s110. KSR leaves Send Back Build unchanged.
pkgECB: PASS. P1.1 items 30 -> 24; the 6 removed are all on closing-break lines; the other 24 equal s110 (S numbers aside); not_sent lists 8 rows
  (pkgECB reason). P1.2 the same D6 lines without the engine AUDIT text: all 30 sent, output equal to s110. ECB leaves Panel Cure Check unchanged.
  Alt Send Back Build on 34626: 0 items, equal. All three rebuilt sources +462.
Both together: ALL = KSR on Panel Cure Check and ALL = ECB on Send Back Build.
Not tested: P1.3 (judge copying the AUDIT text into its own line) not run; P2.4 luna's send-back derivation cannot be replayed offline (as W1 says);
  P2.5 (1042, 1049, 1076) not replayed: those runs have no closing break, the case P2.3 covers; Alt and R2 Alt copies not reached with items.

## ADDITION (12:2x CST): pkgKSR PASS WITHDRAWN, now FAIL. pkgECB stays PASS, with one finding.
- pkgKSR: w2_ksr_chain.cjs (output w2_ksr_chain_out.txt) runs the chain Panel Cure Check -> Send Back Build -> Send Back Record -> Reread ->
  Gate -> Alternate Merge Seat on 34626's stored replies. The s110 chain reproduces the stored outputs. Under pkgKSR the engine's
  "KEYSTONE: D6 -- BROKEN -- LINK 6 BROKEN BY A CONFIRMED CLOSING CONTRADICTION" is in Panel Cure Check, but at Send Back Record chatgpt and sol
  carry only "KEYSTONE: D6 -- STANDS" again (their send-back replies are whole verdicts), and Alternate Merge Seat, which feeds the written rows,
  reads STANDS for both. So rows 345 and 346 would still read STANDS: label P2.1 FAILS. My first grade and W1's K1 tested Panel Cure Check only.
- pkgECB, luna (P2.4), by a planted second reply instead of a replay (w2_luna_plant.cjs): each seat's stored send-back reply with the lines for
  the items pkgECB no longer sends removed and the rest renumbered to pkgECB's S numbers. Through Alternate Merge Seat: s110 luna
  "STANDS (derived)"; pkgECB and ALL: no derived line, luna's KEYSTONE reads BROKEN. Limit: the replies are planted, not new model replies.
- pkgECB P1.3 (w2_ecb_add.cjs): a judge's own E-ANS line (luna S1) planted with the words "Link 6 is BROKEN BY A CONFIRMED CLOSING
  CONTRADICTION": s110 sends it; pkgECB withholds it and lists it in sb_not_sent with the reason "the engine's closing-contradiction break".
  Not silent, so not a FAIL under my label, but the match is on the phrase, not on the engine's "[AUDIT: LINK n" mark. Finding for W1.
- Alt and R2 Alt copies: the inserted code (2,151 characters) is identical to the main copy's. Fed the main Judge Enforcer Record in place of
  the Alt one, Alt Send Back Build still produced 0 items under both s110 and pkgECB (it builds only for seated alternates), so the Alt copies
  remain NOT REACHED with items.
