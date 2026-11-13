# pkgHYD: google/gemini-4-hydrogen as an alternate after grok (operator 17:36 CST 2026-11-12)

- Parent: fetchback_live_s166.json (live s166). Output: /mnt/project-files/wall2024/parent_s166_HYD.json.
- Same shape as pkgALT. Nodes: Init Seats (ORDER0, FAM_PANEL hydrogen:'google', __ALT, JFAM_I hydrogen:'openrouter'), Resolve Seats (JFAM hydrogen:'openrouter'), Accept Build (seat map, ORDER). Alternate order: grok, hydrogen, argon, haiku.
- Size, MEASURED: code +115 (Init Seats +62, Resolve Seats +22, Accept Build +31); prompt 0.
- Database row needed (W4 writes, on the operator's word), as the argon row:
  insert into model_config (seat, provider, role, api_model, endpoint, max_tokens, active, family, recommended_model, needs_upgrade, notes)
  values ('hydrogen','openrouter','engine','google/gemini-4-hydrogen','https://openrouter.ai/api/v1/chat/completions',64000,true,'google','google/gemini-4-hydrogen',false,
  'pkgHYD (built by W2); alternate only, order grok, hydrogen, argon, haiku, on the operator''s instruction 17:36 CST 2026-11-12.');
- model_prices: no row is needed by the flow; it holds only claude-opus-5-5, claude-sonnet-5-5 and deepseek-flash (argon and grok have none).
- Proof: sim.cjs (Init Seats then Resolve Seats, live model_config rows plus the hydrogen row), sim_out.txt; mapcheck_out.txt; packing check 43 stubs, 2 throwing.
- Effects: hydrogen is skipped when a debater is of the google family (same as argon); with a grok debater, hydrogen becomes the first alternate and the reserve (live: argon); with the row missing, Init Seats and Resolve Seats leave hydrogen out, but Accept Build refuses every run (W3, Wall 5490): the model_config row must be live BEFORE the code.

## Rev 2 (ASK 149 option 1; W4 Wall 5513: hydrogen passed its check only at reasoning effort low)
- build2.cjs = rev 1 + every request-body finisher `__orc` (14 plain nodes + Shared Library line 3272) inserts, right after
  `const o={...b,session_id:...};`, `if(/^google\/gemini-4-hydrogen$/.test(String(model))&&!o.reasoning)o.reasoning={effort:'low'};`.
  max_tokens unchanged (64,000 from the row). Other models untouched. A body that already sets reasoning keeps it.
- Output /mnt/project-files/wall2024/parent_s167_HYD2.json (sha256 b33aaf2e9006e6e3); library sha 02a0f05dce3dbeaa.
- SIZE (measured): code +1,526 over s167 (rev 1 +115, effort +1,411); prompt text 0.
- test2.cjs: 15 copies, 89 of 89 (live s167: 15 fail, the hydrogen cases). sim_out_rev2.txt equals rev 1 sim except run tokens.
- Packing: 43 stubs, only Alternate Build and Early Alternate Build throw (mapcheck_rev2_out.txt).
- Write order unchanged: the hydrogen row is set active before the code, in the same step.
