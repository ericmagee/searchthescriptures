# BB-6904 rev 8 step 6 draft (Worker_A3 builds; Worker_E verifies)
Base: the 63 Code nodes of active 95f04001 (byte-equal to rev8v/live).
compose.py applies, in order: patch_guard_lib.py removal A-C (7223) and F (7235) in Build Independent Verdict and Panel Build;
E (7229) and item 8 (7234 P2) in Format Markdown; item 8's skip of the new section in Plain Rule Lines; then patch_rev8.py 61ee557a
items 1, 2, 5 and 3 (7224, 7227, 7230). Output: composed/ (27 changed nodes), COMPOSE_RUN.txt (old and new md5 per node).
Checks at my seat: node --check on all 63; check module cut from composed/ byte-identical to the module verified in 7201; harness PASS;
item8/t_md5.cjs (MD5 equals Node crypto on 11 strings) and item8/t_block.cjs (12 checks on mocked node outputs) PASS.
Open: D (engine_manual v82 pairs).
