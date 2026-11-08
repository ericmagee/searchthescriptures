# pkgPNL (W2): Eric's panel change, 18:45 CST 2026-11-07 (W3 thread)

Eric: "replace 6.1 sol with qwen/qwen3.8-flash replace grok with z-ai/glm-5.3-flash as the first alternate make mimo the 2rd alternate make gork the last alternate".
Not a DeepSeek fix; it rides beside the gap's DeepSeek fix.

## Result (all saved runs 33218 on, claude v opus)
- Panel: gemini, chatgpt, sol -> gemini, chatgpt, **qwen_flash** (qwen/qwen3.8-flash).
- Reserve: grok -> **glm_flash** (z-ai/glm-5.3-flash).
- Alternates, in order: grok -> **glm_flash, mimo, grok**. Alternate Build offers glm_flash first; with glm_flash taken, mimo (thinking off); with both taken, grok.
- Single judge, synthesis and diagnostic: gemini, unchanged.
- sol is in no seat list; its model_config row is left untouched and is never seated.

## Seat names
New seats `qwen_flash` and `glm_flash`, apart from the old `qwen` (qwen3.8-max-0902) and `glm` (glm-5.3) rows, as W3 asked: old enforcer_log rows do not mix,
and the old seats' special bodies (qwen JSON output, glm) do not apply to the flash models. The flash models get the default OpenRouter body; the call
nodes add provider order z-ai for z-ai/ models and prompt caching for qwen/ models by model id, as for every seat. The judge fault ledger keys on api_model.

## Write order (W4)
1. `../pkgMIM2/fix_MIM2.sql` (graded PASS 11-07, NOT live: odv1_record_panel_alternates md5 is still f7340949...). Without it the first run that seats mimo errors at Record Alternates.
2. `fix_PNL.sql`: inserts the two model_config rows (64000, "set all to 64k"); adds qwen_flash and glm_flash to odv1_record_panel_substitution's seat list (live md5 06081e8a..., anchored, asserted once). Without part 2 a reserve substitution naming either seat raises.
3. n8n, base live s52, `patched/` (plan `patched.plan.json`):

| Node | base | patched | change |
|---|---|---|---|
| Init Seats | 717ed6aebedc | 04a6ee5beecd | ORDER0; ALT_ORDER no longer drops mimo (pkgMIM part 1, never written); JFAM_I |
| Resolve Seats | 1b7062041862 | 500b11c5e8ed | JFAM |
| Accept Build | 5ceca4888e8e | 6cb75177dc8b | ENG_SEAT, ORDER; mimo posture body thinking off (pkgMIM part 2, never written) |
| Build Synthesis | 6be782556e0e | f27786682ed4 | single-judge family map |
| Build Independent Verdict | 4b43139b589e | b72901a0dff2 | single-judge family map |
| Build Diagnostic Prompt | 8121ab566149 | 2706c9181e34 | single-judge family map |

Alternate Build (LIB v12 already holds pkgMIM's thinking-off mimo body), Panel Build and Reserve Build are unchanged.

Revert: n8n nodes first, then `revert_PNL.sql`, then `../pkgMIM2/revert_MIM2.sql`.

## Tests
- `test_PNL.cjs` / `test_PNL.txt`: 123 OK, 0 FAIL. Includes a control: live Resolve Seats cannot serve the new seats (judge fam null), so the node edits are needed.
  One case (33497, glm_flash and mimo taken) shows grok refused by G3 because 33497's SAVED panel seated grok; under pkgPNL grok is not on the panel.
- `test_PNL.sql` / `test_PNL_db.txt`: rolled back by its closing RAISE. With MIM2: glm_flash and mimo pass the alternates guard, grok still passes,
  a seat already on the panel and a wrong model are refused. Live substitution refuses qwen_flash (T6); fixed accepts it (T7, T8).

## Not covered
- A live call of either flash model as a judge (W4 probed both at 18:45 CST: HTTP 200).
- When chatgpt debates, mimo becomes the reserve; Reserve Build's xiaomi body has no thinking-off flag (only Alternate Build and Accept Build carry it). Not reached with claude v opus.
- Display maps (Format Markdown, Failure Salvage) show the seat names qwen_flash and glm_flash as written.
