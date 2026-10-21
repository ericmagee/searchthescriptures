# BB-6904 rev 8 step 6 draft (Worker_A3 builds; Worker_E verifies)
Base: the 63 Code nodes of active 95f04001 (fetched 14:3xZ 21 Oct, byte-equal to rev8v/live).
compose.py applies, in order: patch_guard.py (7223 A-C: the GUARD-INADMISSIBLE block with its glue, the TERMS sentence, the KEYSTONE clause;
Build Independent Verdict and Panel Build only), then patch_rev8.py 61ee557a with item 3's two anchors (refused round, 11 and 12) held.
Output: composed/ (the 20 changed nodes), COMPOSE_RUN.txt (old and new md5 per node). Not yet written to n8n.
Checks at my seat: node --check on all 63; the check module cut from composed/ is byte-identical to rev8w mod_new.js (verified 7201);
harness_rev8.cjs ac96665a: HARNESS (with item 5) PASS.
Open: D (engine_manual pairs), E (Format Markdown rules summary still quotes the who-belongs rule), item 8 (Worker_E's measure, then shape).
