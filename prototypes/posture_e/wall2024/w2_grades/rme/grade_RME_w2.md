# W2 grade: pkgRME (W4, Wall 5659). 00:32 CST 11-13. PASS.
File /mnt/project-files/w4/rme/parent_s177_RME.json, sha256 4c409847c0ec8b68 (matches). Base: live s177 (fetchback_live_s177.json).
1. Diff (MEASURED): 443 nodes both; connections identical; only Init Seats (-16) and Accept Build (-8) change; code -24, prompt 0. Each change removes 'ember' from ORDER0 and __ALT (Init Seats) and ORDER (Accept Build); nothing else.
2. Both changed nodes parse. Shared Library unchanged, so the library stubs are unaffected (packing unchanged).
3. Sim (pkgMUS/sim2.cjs, Init Seats then Resolve Seats, live vs RME), sim_out.txt: ember is gone from every alt_order; claude v opus alt_order hydrogen, gemini, grok, argon, haiku, spark; refusals unchanged (R5, R7, R8).
4. Side effect to note: the reserve moves from ember to hydrogen (first free alternate). Pre-existing, not new: odv1_record_panel_substitution's reserve list has no hydrogen (nor had it ember), so the reserve path's record step stands as before.
5. Remaining 'ember' text is inert: family and provider maps, the low-effort pattern in the __orc copies, the Accept Build seat map. The ember model_config row stays active; the operator's word removes it from the list, and no code path seats it now (sim).
