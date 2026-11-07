# pkgGRA2: the database guard lets grok sit as an alternate (33249 ERROR)

**Failure.** Run 33249 errored at Record Alternates at 22:33 CST. pkgGRA (Eric 00:03Z 11-07) lets Init Seats put grok in the alternate pool, and in 33249 grok was seated for the removed chatgpt. odv1_record_panel_alternates then refused grok: "grok is not an active openrouter reserve seat with a family". Its seat guard requires `mc.provider = 'openrouter'`, and grok's model_config row says provider 'xai'. pkgGRA changed the picker but not this guard. That was my miss when I built pkgGRA.

**Why the row stays.** Grok's provider 'xai' is true: every panel, debate, cure and reserve call for grok goes to api.x.ai. As an alternate, grok goes through the openrouter Alternate Call with its row's api_model 'x-ai/grok-4.7', an openrouter slug. In 33249 that call returned, grok was seated, and its verdict is in the bodies. The flow never reads model_config.provider. The only other function that mentions a provider, record_debate_result, writes a different column.

**Fix (fix_GRA2.sql).** The guard's seat lookup becomes `mc.role = 'engine' AND (mc.provider = 'openrouter' OR (mc.provider = 'xai' AND mc.api_model LIKE 'x-ai/%'))`, and the refusal text says so. Nothing else changes: role engine, MiniMax never, G1 family, G2 replaced model, G3 panel model, and the payload model match all stand.

The fix is two anchored replaces, each asserted once, on the live definition, with the base md5 (a3f6ab00dd33d323b084ffd89fa13b0f) checked first. revert_GRA2.sql reverses them and checks that the result md5 equals the base.

**Test (test_GRA2.sql, test_GRA2.txt).** pg_temp copies of the live and fixed functions were called on the 33249 Record Alternates body. Every call ran in a rolled-back sub-block, and the block raised its results, so nothing persisted.
- T1: the live function refuses grok (the 33249 error).
- T2: the fixed function accepts it; panel_expected becomes [gemini, grok, sol].
- T3 to T8: still refused. These are kimi (moonshot), mimo (xiaomi), grok with a wrong model, gemini already on the panel, alt_minimax31, and opus (G1).
- The removed-ruling body was cut to seat, api_model and verdict_tag, because the function reads only its seat.
- After the test, 33249's row was unchanged and the live md5 was unchanged.

**Writing it.** It is a CREATE OR REPLACE of one function, with no table change. Write it at a gap with no run live, then run the md5 check. 33249 itself stays an ERROR row with no judgments. This fix does not re-record it.
