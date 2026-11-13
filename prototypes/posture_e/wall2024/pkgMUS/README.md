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
