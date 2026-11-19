# ASK 479 live check (W4, 11-19 09:1x CST)
Rows: model_config seats deepseek (judge row, deepseek-flash, provider deepseek) and deepseek_debate (debater row). Both active today.
model_config_jfl is a view over model_config; it follows the change.

## Who reads them (live, fetched 11-19)
ODV1 engine e0a61271 (Fetch Models: model_config_jfl active=eq.true):
- Resolve Seats: `const enf=need('luna');const ds=M['deepseek']||enf;` -> with the row off, ds = luna. ds feeds Resolve Seats.deepseek.
- Build Synthesis and Build Diagnostic Prompt put mc.api_model into requestBody, then ALWAYS overwrite requestBody with the single-judge row's model (const __bf='requestBody' ... __out[__bf]=__orc(...)). Runs 38226-39266: Resolve Seats.deepseek = deepseek-flash, Synthesis Call sent openai/gpt-6.1-terra. No DeepSeek call is made today; none after.
- Build Independent Verdict reads it but has no incoming connection (dead node).
- Init Seats refuses any DeepSeek debater ("DeepSeek never debates", operator 21:24 CST 11-18); NOT_PANEL holds deepseek.
Child MqQHRl7mQQ0z8QdT 4982c042: enforcer is RS.enforcer (luna); no read of the deepseek rows.
Cure Call c7366RPLb8vdMQg6, Panel Judge Call Y1VIsNB6KBrs1znP: no model_config read of these rows (route by provider name only).
DB: odv1_record_panel_substitution does not read model_config (v_seats is a fixed list); odv1_record_panel_alternates joins deepseek_debate only for a deepseek debater, with no active filter. jfl_model: no active filter.

## Rolled-back test on live (09:1x CST; nothing kept)
Both rows set inactive inside one transaction that raised at the end. Test debate rows (spark vs gemini, panel chatgpt/haiku/sol62):
- substitution chatgpt->sol: ok before and after.
- alternates haiku->glm_legal: ok before and after.
- model_config_jfl active rows 26 -> 24; luna stays active.

## Not changed by 479 (finding for the operator)
Eleven active W-series workflows call api.deepseek.com directly, e.g. DS-W2, DS-W3, DS-W4, DS-W5, W7 x2, W14, W16, Group W2 Dialog,
Independent Synthesis, Challenger. Those that read model_config fall back to a hardcoded 'deepseek-chat' when the row is missing,
and DS-W4 reads model_config without an active filter. Turning the rows off does not stop DeepSeek calls from those workflows.
