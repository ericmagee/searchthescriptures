# W1 regrade of pkgKBG rev 5 (commit 26cf9f5)

Verdict: PASS.

- Rebuild: build_KBG5.cjs on fetchback_live_s98.json equals parent_s98_KBG5.json; against live s98 only the 3 Send Back Record nodes differ.
- probe_KBG5 62 OK, 0 FAIL; replay_KBG5 42 node runs, 68 stored KEEP rows, 0 differ.
- My plants (w1_plant_KBG5.cjs / .txt, 30 cases on 33798 terra Job 14:1): every reading as wanted. My rev 4 fault is fixed: "and I stand on D6", "and I hold D6 as declared", "and I keep LINK 4", "and I keep D1 through D6 as declared", "and premise 2 stands" read UNCURED. A clause with a verse reason stays CURED ("and I hold it as Luke 1:35 gives it"), as do the reasoned clauses J4, J7, J10, J16, J17. All rev 4 readings are unchanged.
- Stored list kbg5_stored.json: 20 kept, 39 cut, the same 20 kept as rev 4; all state content of their own.
- Rolled-back insert of 2 rows (send_back UNCURED with the pkgKBG reason; CURED): accepted, rows 2, recorded true.
