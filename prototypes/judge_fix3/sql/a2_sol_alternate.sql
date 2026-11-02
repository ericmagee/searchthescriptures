-- judge_fix3 A2: the replacement alternate judge. NOT APPLIED. Apply before the flow package (Init Seats names seat 'sol' in its ORDER).
-- Operator, 2026-11-02 (via the coordinator): "You are authorized to add any model needed during this fix"; ranking given, "don't use kimi".
-- Chosen: GPT-6.1 Sol (rank 3, 47 + 41 = 88), the highest-ranked eligible model:
--   ranks 1, 2 (Claude Opus 5.5, Claude Fable 5.1): family anthropic; "Claude never judges" (Init Seats, Resolve Seats 6995) and Claude defends;
--   rank 4 (Kimi K3.1 Pro): excluded by the operator; rank 5 (GPT-6.1 Terra): already the chatgpt seat (odv1_record_panel_alternates G2/G3 refuse the
--   same model); rank 6: the defender; 7: qwen, removed by the 900 s rule; 8, 9: GLM and DeepSeek are panel seats.
-- Guards read: Resolve Seats drops an alternate whose model_config.family debates (BB-6993); odv1_record_panel_alternates takes an ACTIVE row of
-- provider openrouter and role engine, refuses a debating family (G1), the removed seat's own model (G2) and a model already on the panel (G3, by
-- model). Family openai beside the chatgpt seat (openai/gpt-6.1-terra) is therefore allowed; Sol is dropped in a debate where ChatGPT debates.
-- The flow builds its body as for every openai/ alternate: {model, max_tokens, messages} with no reasoning or effort field (standing ruling).
INSERT INTO public.model_config (seat, provider, role, api_model, endpoint, max_tokens, active, family, notes)
VALUES ('sol', 'openrouter', 'engine', 'openai/gpt-6.1-sol', 'https://openrouter.ai/api/v1/chat/completions', 128000, true, 'openai',
 'Added by judge_fix3 A2 (session_015ZiVmTarESui8ub4mf2Dcr, 2026-11-02) as the replacement ALTERNATE judge after qwen was removed under the operator''s 900 s rule '
 || '(qwen alternate calls 981.7 s in 32228, 1,194.6 s and 985.2 s in 32255). Operator authorization: "You are authorized to add any model needed during this fix"; '
 || 'chosen from the operator''s ranking (rank 3, GPT-6.1 Sol, Std, Phil 47, Law 41, total 88; Kimi excluded by the operator; Claude models out because Claude never judges; '
 || 'GPT-6.1 Terra is already the chatgpt seat). SOURCES: api_model openai/gpt-6.1-sol and name "OpenAI: GPT-6.1 Sol" from GET https://openrouter.ai/api/v1/models '
 || '(2026-11-02); max_tokens 128000 = the provider maximum max_completion_tokens on every endpoint of GET https://openrouter.ai/api/v1/models/openai/gpt-6.1-sol/endpoints '
 || '(2026-11-02; OpenAI, Azure, Amazon Bedrock), under the 131,072 cap used for GLM; context 1,050,000 from the same listing; price 2.00/10.00 USD per million input/output '
 || 'tokens on the standard OpenAI endpoint (flex tier 1.00/5.00; above 272,000 prompt tokens 4.00/15.00), same listing; family openai as the chatgpt row; provider and '
 || 'endpoint as the other OpenRouter rows (n8n credential OpenRouter); role engine because odv1_record_panel_alternates reads ACTIVE rows of provider openrouter and role engine. '
 || 'No reasoning or effort field is sent (standing operator ruling). Serves only as an alternate: Init Seats places it last in ORDER, so it is never a panel judge, the single judge or the reserve.')
ON CONFLICT DO NOTHING;
-- Undo: DELETE FROM public.model_config WHERE seat = 'sol' AND api_model = 'openai/gpt-6.1-sol';
