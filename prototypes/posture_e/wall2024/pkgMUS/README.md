# pkgMUS: meta/muse-ember and meta/muse-spark-1.3 as alternates (operator 20:34 CST 2026-11-12)

Operator's words (W3 thread): "add meta/muse-spark-1.3 and meta/muse-ember to alternate list. make muse-ember the first alternate, then hydrogen".

- Parent: fetchback_live_s173.json (live s173). Output: /mnt/project-files/wall2024/parent_s173_MUS.json (sha256 eee32906e5b13f1a); library sha 53638914bfb0a6c0.
- Seats: ember (meta/muse-ember), spark (meta/muse-spark-1.3), family meta.
- Order (ORDER0 in Init Seats and ORDER in Accept Build govern; __ALT is membership only): ember, hydrogen, grok, argon, haiku, spark.
  Spark's place is NOT in the operator's words; last is a proposal for his confirmation.
- Reasoning: every __orc copy (14 plain nodes + Shared Library line 3272) sends reasoning effort low for both models, unless the body sets reasoning (the hydrogen regex widened).
- SIZE (MEASURED): code +826 over s173 (Init Seats +96, Resolve Seats +38, Accept Build +44, __orc copies and Shared Library the rest); prompt text 0.

## OpenRouter pages (read 20:4x CST 11-12, model pages and /api/v1/models/<id>/endpoints)
- meta/muse-ember: context 1,048,576. Providers Google Vertex (max output 524,288) and Meta (943,718). 0.10 USD in / 0.50 USD out per million. Supported: reasoning, include_reasoning, reasoning_effort, max_tokens, response_format, structured_outputs, tools. Effort levels and default: not stated.
- meta/muse-spark-1.3: context 1,048,576. Provider Meta (max output 943,718). 1.25 USD in / 4.25 USD out per million. Same reasoning parameters. Effort levels and default: not stated.
- Effort low is a choice made because the default is not stated (hydrogen's unset default failed). Not measured on either model.

## Database rows (W4 writes, on the operator's word; rows must be active BEFORE the code, as pkgHYD)
insert into model_config (seat, provider, role, api_model, endpoint, max_tokens, active, family, recommended_model, needs_upgrade, notes) values
('ember','openrouter','engine','meta/muse-ember','https://openrouter.ai/api/v1/chat/completions',64000,true,'meta','meta/muse-ember',false,'pkgMUS (built by W2); first alternate, on the operator''s instruction 20:34 CST 2026-11-12.'),
('spark','openrouter','engine','meta/muse-spark-1.3','https://openrouter.ai/api/v1/chat/completions',64000,true,'meta','meta/muse-spark-1.3',false,'pkgMUS (built by W2); alternate, on the operator''s instruction 20:34 CST 2026-11-12.');

## Proof
- test.cjs: 15 __orc copies, 164 of 164 on the candidate (test_out.txt); live s173 fails the 30 muse cases (test_live_s173_out.txt).
- sim.cjs (Init Seats then Resolve Seats; rows = pkgHYD/rows.json + hydrogen + the two planned rows): sim_out.txt.
  claude v opus: alt_order ember, hydrogen, grok, argon, haiku, spark; reserve ember. Google debater: hydrogen and argon skipped as before. Grok debater: grok skipped.
  Rows missing: ember and spark drop out of alternates and the reserve becomes null (live: grok). Accept Build throws on a seat with no row. So the rows go first.
- Packing: 43 stubs, only Alternate Build and Early Alternate Build throw (mapcheck_out.txt).
- Not checked: a paid call to either model (W4 check owed, as for hydrogen). ember and spark are alternates only; they are not debater engines.

## Rev 2 (operator 21:08 CST 11-12, W4 thread: "add gemini 3.8 flash as an alternate before grok"; spark last per ASK 164)
- build2.cjs on s173. Output /mnt/project-files/wall2024/parent_s173_MUS2.json (sha256 1bb81519a28b4679); library sha 5d6ceab43ac76e87.
- Order: ember, hydrogen, gemini, grok, argon, haiku, spark. Seat gemini (google/gemini-3.8-flash) and its row are already live; no new row for it.
- OpenRouter (endpoints listing): 7 Google endpoints, context 1,048,576, max completion 65,536 on every endpoint; 0.75 USD in / 3.75 USD out per million (standard), reasoning billed as output. Supports reasoning and reasoning_effort; the page states no default. W4 reports: reasoning mandatory, efforts high/medium/low, default medium (W4's reading, not on the pages I read).
- Effort: gemini gets effort low ONLY when the request key does not end ":defender" or ":challenger", so debater turns by gemini are unchanged; panel, reserve, alternate and acceptance calls get low. A body that sets reasoning keeps it.
- SIZE (MEASURED): code +2,985 over s173 (+2,159 over rev 1; Init Seats +114, Resolve Seats +38, Accept Build +53, the rest the 15 finisher copies); prompt text 0.
- test2.cjs: 15 copies, 269 of 269 (rev 1 fails 45, the gemini judge-side cases; live s173 fails 75). sim2.cjs: sim2_out.txt. Packing: 43 stubs, 2 throwing (mapcheck_rev2_out.txt).
- Rows: the ember and spark rows above only, active BEFORE the code.
- W4 (21:11 CST): source of the gemini defaults is the OpenRouter models API (/api/v1/models), entry google/gemini-3.8-flash: reasoning mandatory, default_enabled true, supported_efforts high/medium/low, default_effort medium, max_completion_tokens 65536. Check calls at effort low passed: ember (execution 36162), spark 1.3 (36163) under ASK 163; gemini 3.8 flash (36173) under ASK 173, 0.0555 USD.

## Rev 3 (W3 NOT PASSED rev 2: odv1_record_panel_alternates refuses the gemini seat by name)
- n8n code: unchanged from rev 2 (parent_s173_MUS2.json, sha 1bb81519a28b4679).
- Database: fn_alternates_rev3.sql replaces odv1_record_panel_alternates. One change: the WHERE clause drops "AND v_alt <> 'gemini'"; comment extended. All other guards unchanged (active, role engine, provider, family, MiniMax, G1 family, G2, G3).
  SIZE (MEASURED): function body 5,822 -> 5,870 chars (+48); new prosrc md5 91f71cb1cd1e51a7d26016f54716a3a7, equal to replace() on the live body computed in SQL (read only). Revert: fn_alternates_live_s173.sql (md5 2f4b916cae710fca0ac8283f966229cd = live).
- THE OPERATOR'S BAR THIS LIFTS: pkgJGR (Wall 3406, 11-08) recorded his ruling as "gemini and grok judge no more" (Eric 21:08Z/21:10Z 11-08, W3 thread); the function comment reads "pkgJGR: gemini judges no more (operator 21:10Z 11-08)". Grok was lifted by pkgAGK (operator 02:50Z 11-11). His 21:08 CST 11-12 words "add gemini 3.8 flash as an alternate before grok" are read here as lifting it for gemini as an alternate; that reading is his to confirm on the write card. His verbatim 11-08 words were not re-read by me.
- Other database code naming gemini (prosrc search, read only): odv1_record_panel_substitution (reserve seats list has no gemini; it also has no grok, hydrogen, argon, ember or spark: see below), dash_odv1_judges and dash_odv1_debates (display order only), dash_launch_debate, dash_launch_cc, dash_launch_odv1, fire_debate_workflow (debater engines), record_debate_result (legacy column names), get_load_briefing_core (text). None but the two odv1_record_panel_* functions judge an alternate seat.
- Not changed, observation: odv1_record_panel_substitution accepts a reserve only from ['deepseek','chatgpt','mimo','qwen','alt_minimax31','sol','qwen_flash','luna','haiku']. Live s173's reserve (grok) is not in it, nor is rev 3's (ember). Whether the flow ever calls it with the reserve seat is not checked by me (a guess until read).
- Write order: ember and spark rows active; the function; then the code.
- RESERVE PATH (answer to W4): yes, it calls odv1_record_panel_substitution. Panel Check (FALLBACK_ON=true) builds sub with the reserve (Resolve Seats .reserve) when one panel judge fails; Record Substitution posts it. v_seats lacks grok, so on live s173 that path raises today (pre-existing). Under rev 2/3 the reserve is ember, also absent.
- OPTIONAL (operator's choice, not needed for the alternate step): fn_substitution_rev3_option.sql adds grok, hydrogen, argon, ember, gemini, spark to v_seats. Body 3,733 -> 3,873 chars (+140, MEASURED); md5 aa1de555eb0be94e88c6e789501f0b53 = replace() on live (SQL, read only). Revert fn_substitution_live_s173.sql (md5 edb79b39c7da0ca5deafba228fb2cb8d = live). Its comment also carries the 11-08 "gemini and grok judge no more".
