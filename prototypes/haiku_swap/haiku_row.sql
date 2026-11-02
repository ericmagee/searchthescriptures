-- haiku_swap: model row for the Haiku 5.5 challenger option (operator ruling 380: "if mimo fails again ... swap with Haiku 5.5"). Applied only on that event.
INSERT INTO public.model_config (seat, provider, role, api_model, endpoint, max_tokens, active, family, notes)
VALUES ('haiku', 'openrouter', 'engine', 'anthropic/claude-haiku-5.5', 'https://openrouter.ai/api/v1/chat/completions', 64000, true, 'anthropic',
 'Challenger engine option Haiku 5.5 (operator ruling 380, Worker_A3 thread 2026-11-02). api_model anthropic/claude-haiku-5.5 from GET https://openrouter.ai/api/v1/models (provider maximum 128000 on every endpoint); max_tokens 64000 per the operator''s "set all to 64k". Route as claude_synthesis (OpenRouter, Anthropic BYOK). No reasoning or effort field. Undo: DELETE FROM model_config WHERE seat = ''haiku''.')
ON CONFLICT DO NOTHING;
