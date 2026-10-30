-- Order BB-8510 S2 (P2D BB-8511): model_config gemini to OpenRouter. Runs only after the listing is read (8511) and the build PASSes.
-- Guards in the one statement: the row as read (md5 d399754e, read 16:2x CDT) and the board head the act names (<HEAD>, replace before running).
-- Run in one execute_sql with SET LOCAL truth.session_id = '<the acting seat id>'. Expect ONE row back; zero rows = a guard refused: STOP.
UPDATE model_config t
   SET provider   = 'openrouter',
       api_model  = 'google/gemini-3.8-flash',
       endpoint   = 'https://openrouter.ai/api/v1/chat/completions',
       updated_at = now()
 WHERE t.seat = 'gemini'
   AND md5(t::text) = 'd399754e9c716decdd9e6ebf3f7f5bef'
   AND NOT EXISTS (SELECT 1 FROM blackboard WHERE id > <HEAD>)
RETURNING md5(t::text) AS new_row_md5, t.provider, t.api_model, t.endpoint, t.family, t.max_tokens;
-- UNDO: provider 'google', api_model 'gemini-3.1-pro-preview', endpoint 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent', guarded on new_row_md5; and republish the prior version.
