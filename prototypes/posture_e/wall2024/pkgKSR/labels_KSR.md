# Labels for pkgKSR (KEYSTONE follows a confirmed closing break) and pkgECB (engine break lines not sent back). W1, 12:15 CST 11-10.
MY MISTAKE: the first test run (12:10 CST) ran before these labels were committed. Its result: K0, K3, E0 OK; K1, K2, E1 FAIL (K1/K2 counted audit text; E1 found companion items). These labels fix what each check means; the run after this commit is the one that counts.
Data: execution 34626 (dry regrade of 34108 on s110). Base = live sources (pkgLIB/strip_R1/patched, equal to s110 by pkgCMS M3).
K0 Panel Cure Check, base source rerun on 34626 equals the stored output (harness check).
K1 Panel Cure Check, candidate: in chatgpt's and sol's verdict text (lines outside [AUDIT ...]) the KEYSTONE line reads "D6 -- BROKEN -- LINK 6 BROKEN BY A CONFIRMED CLOSING CONTRADICTION"; luna's own "D6 -- BROKEN" line unchanged.
K2 Panel Cure Check: outputs equal to the base apart from the KEYSTONE line, its trigger, and audit lines naming it (record-only K-RECHK K-CMT rows, recorded, as for the engine's collision lines).
K3 Gate Build, Gate Record, Alternate Merge Seat: no "D6 -- STANDS -- derived by the engine" line (base: 2 in Alternate Merge Seat).
E0 Send Back Build, base rerun equals the stored output.
E1 Send Back Build, candidate: no item (direct or companion) whose line carries "BROKEN BY A CONFIRMED CLOSING CONTRADICTION"; each one left out is in not_sent with the reason. Other items keep their text (renumbered).
