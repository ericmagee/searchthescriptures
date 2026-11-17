-- Panel change rev 3, model_config rows (operator 13:55 and 14:08 CST 11-17). Run BEFORE the code write: Accept Build fails closed on a listed seat with no active row.
INSERT INTO model_config (seat, provider, role, api_model, endpoint, max_tokens, recommended_model, needs_upgrade, active, family, updated_at) VALUES
 ('ernie','openrouter','engine','baidu/ernie-5.5-flash-preview:free','https://openrouter.ai/api/v1/chat/completions',64000,'baidu/ernie-5.5-flash-preview:free',false,true,'baidu',now()),
 ('sonnet','openrouter','engine','anthropic/claude-sonnet-5.5','https://openrouter.ai/api/v1/chat/completions',64000,'anthropic/claude-sonnet-5.5',false,true,'anthropic',now());
UPDATE model_config SET active=true, updated_at=now() WHERE seat='ember' AND api_model='meta/muse-ember' AND active=false;
UPDATE model_config SET active=false, updated_at=now() WHERE seat='alt_minimax31' AND active=true;
