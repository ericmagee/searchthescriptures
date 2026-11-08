# pkgGLX (W2, 2026-11-08 CST): glm flash out (Wall 3061, operator order 01:32 CST "remove GLM flash")

Where glm_flash lives today (checked 01:45 CST):
- model_config seat glm_flash (z-ai/glm-5.3-flash), active = true.
- odv1_record_panel_substitution seat list (pkgPNL part 2), live md5 fcca52b1. The only function that names it.
- odv1_record_panel_alternates does not name it; it accepts any ACTIVE openrouter engine row, so active = false refuses it.
- Live n8n s54 (05d52f80, PNL reverted to s52): no node names glm_flash or glm-5.3-flash. Fetch Models and Accept Models read model_config_jfl with
  active=eq.true, so an inactive row never reaches Init Seats, Accept Build or the alternate pool.

Change (fix_GLX.sql, one DO block, all or nothing, guarded on the live md5):
1. odv1_record_panel_substitution: 'glm_flash' leaves the seat list (fcca52b1 -> d7477482, anchor asserted once; md5 after asserted).
2. model_config glm_flash: active false, note appended (exactly 1 row asserted).
Not touched: old seat glm (z-ai/glm-5.3); qwen_flash (on probation, Wall 3061 item 2).
Repo packages that still name glm_flash and must drop it if ever rebuilt: pkgPNL (live parts reverted), pkgPNL2, pkgFRC, pkgPNL3 (withdrawn).
Revert: revert_GLX.sql.

Test: test_GLX.sql, one DO block ending in RAISE (all rolled back), same method as pkgPNL/test_PNL.sql. Not yet run: run 33575 is going and the rule
(W3 2653) is no test transactions during a run. The anchor and the new md5 were checked with a read-only SELECT (anchor count 1; result d7477482).
Expected: glm_flash refused as alternate (T1) and as substitute (T5); mimo, grok, sol accepted (T2, T3, T6, T7); no active glm_flash row (T8).
