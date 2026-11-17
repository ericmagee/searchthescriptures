-- pkgQ4D part A: model_config row for Qwen 4 Max as a debater seat. Written only on Eric's card press.
-- Settings: provider, role, endpoint and family follow the live glm and qwen rows; max_tokens 131072 = the glm defender row it replaces
-- and OpenRouter's listed max completion for qwen/qwen4-max. No reasoning, effort or temperature setting (none exists in this table).
INSERT INTO model_config (seat, provider, role, api_model, endpoint, max_tokens, recommended_model, needs_upgrade, active, family)
VALUES ('qwen4max','openrouter','engine','qwen/qwen4-max','https://openrouter.ai/api/v1/chat/completions',131072,'qwen/qwen4-max',false,true,'qwen');
