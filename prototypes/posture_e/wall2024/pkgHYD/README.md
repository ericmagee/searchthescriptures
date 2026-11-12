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
