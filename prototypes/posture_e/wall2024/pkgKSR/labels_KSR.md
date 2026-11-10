# Labels for pkgKSR (KEYSTONE follows a confirmed closing break) and pkgECB (engine break lines not sent back). W1, 12:15 CST 11-10.
MY MISTAKE: the first test run (12:10 CST) ran before these labels were committed. Its result: K0, K3, E0 OK; K1, K2, E1 FAIL (K1/K2 counted audit text; E1 found companion items). These labels fix what each check means; the run after this commit is the one that counts.
Data: execution 34626 (dry regrade of 34108 on s110). Base = live sources (pkgLIB/strip_R1/patched, equal to s110 by pkgCMS M3).
K0 Panel Cure Check, base source rerun on 34626 equals the stored output (harness check).
K1 Panel Cure Check, candidate: in chatgpt's and sol's verdict text (lines outside [AUDIT ...]) the KEYSTONE line reads "D6 -- BROKEN -- LINK 6 BROKEN BY A CONFIRMED CLOSING CONTRADICTION"; luna's own "D6 -- BROKEN" line unchanged.
K2 Panel Cure Check: outputs equal to the base apart from the KEYSTONE line, its trigger, and audit lines naming it (record-only K-RECHK K-CMT rows, recorded, as for the engine's collision lines).
K3 Gate Build, Gate Record, Alternate Merge Seat: no "D6 -- STANDS -- derived by the engine" line (base: 2 in Alternate Merge Seat).
E0 Send Back Build, base rerun equals the stored output.
E1 Send Back Build, candidate: no item (direct or companion) whose line carries "BROKEN BY A CONFIRMED CLOSING CONTRADICTION"; each one left out is in not_sent with the reason. Other items keep their text (renumbered).

## Rev 2 labels (after W2 4224 and W3 4225), committed before any rev 2 run. Method: chain replay pkgKSR/chain.cjs from Panel Cure Check to Replay Rows with stored model replies (base chain equals the stored Replay Rows exactly).
K4 Written rows (Replay Rows p_rows), pkgKSR alone and with pkgECB: every judge's KEYSTONE line reads "D6 -- BROKEN" (luna her own line; terra and sol the engine's line).
K5 Written rows: every field but verdict_raw equal to the base (drv_uncured included); verdict_raw differs only in the KEYSTONE line, its trigger and the audits naming it, and in send-back/gate lines that concern the D6 break lines.
K6 No E-GATE D38 KEY item ("your RULING card grades KEYSTONE ... but your KEYSTONE line now reads ...") on any seat.
E4 pkgECB withholds only (a) a collision line of link n carrying "[AUDIT: LINK n BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- <side>" where that side and link are confirmed, and (b) the FORCED line of a pair whose collision line is so withheld. Plants on Send Back Build: luna's own line quoting the eight words on D2 vs C1 is sent; sol's KEYSTONE line quoting them is sent; a collision line with the mark for a link not in the confirmed list is sent.
E5 Written rows with pkgECB (stored send-back replies with the withheld items' lines removed and the rest renumbered): luna's KEYSTONE reads BROKEN; no seat's drv_uncured rises above the base.
Limit: stored replies; new items have no answer.
