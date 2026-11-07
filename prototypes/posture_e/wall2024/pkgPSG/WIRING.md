# pkgPSG: gate premise scope (W3 2726 item 3)

Gap: a gate CHANGE over a count line, which answers a NOT APPLIED item whose refused send-back change was an E-PREM change, was not held to
the pkgPS scope test. pkgPS applied only to changes with rule E-PREM, and gate changes carry rule E-GATE. W3's control on 33222 showed it:
grok's G4 rewritten to regrade the unnamed premise 1 was applied and CURED.

Fix (6 gate-library nodes; base pkgGSL/patched, which is live s16 + pkgGSL):
1. gateCure2024: each gate change carries psrc, the sid of the send-back change its gate item refused. K re-read items have no sid and get no psrc.
2. sbApply2024: a gate change whose psrc is an E-PREM change takes the pkgPS test (side, moved premises, count jump), using the premises named
   by the E-PREM items on that change's line. Every other gate change is applied as before.

Shas (on pkgGSL/patched): Gate Build a25cb2ea -> 487db2d8; Gate Record c1c69125 -> 82d6817e; Alt Gate Build ed2a1141 -> db22df7c;
Alt Gate Record 9f3752b2 -> 69f658b1; Alternate Merge Seat 53579cf5 -> cd3cfe32; Alternate Merge 8044cd3f -> 55ecac41.
Write order: pkgGSL, then pkgPSG (or pkgPSG's patched files alone, which carry both).

Tests (test_PSG.txt, 7 OK, real nodes on the saved inputs):
- 33222 Alt Gate Record, 33222 Gate Record and 33218 Gate Record: equal to base except for the added psrc field on gate change records (sb_items).
- Control (W3 2726 a): G4 rewritten to "CONCEDED LINKS: 5 -- premise 1 UNEXHIBITED ...". Base applies it and CURES G4. pkgPSG refuses it
  ("the change regrades premise 1, which its item does not name (named: 3, 4, 5, 6 ...)") and G4 is UNCURED.
- Negative control: G4 that spares the named premise 4 with count 3 is applied and CURED.
Revert: base/*.js (= pkgGSL/patched).
