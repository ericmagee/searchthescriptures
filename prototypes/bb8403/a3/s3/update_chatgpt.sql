-- BB-8403 step 3 (Worker_E's act, opens on the advisor's row): model_config chatgpt to OpenRouter.
-- Guards in the one statement: the row as read (md5 f2a10630, BB-8452, re-read at my seat 14:2x CDT; row read by SQL in the step 1 turn) and the board head the act names (<HEAD>, replace before running).
-- Run in one execute_sql with: SET LOCAL truth.session_id = '<the acting seat id>';
-- Expect exactly one row back; zero rows = a guard refused: STOP (tandem 4(b)), never a retry with the guard removed.
UPDATE model_config t
   SET provider   = 'openrouter',
       api_model  = 'openai/gpt-6.1-terra',
       endpoint   = 'https://openrouter.ai/api/v1/chat/completions',
       updated_at = now()
 WHERE t.seat = 'chatgpt'
   AND md5(t::text) = 'f2a1063053fc231a2079139e5d6b8aca'
   AND NOT EXISTS (SELECT 1 FROM blackboard WHERE id > <HEAD>)
RETURNING md5(t::text) AS new_row_md5, t.provider, t.api_model, t.endpoint, t.family, t.max_tokens, t.recommended_model, md5(t.notes) AS notes_md5;
-- UNDO (BB-8414, 8444 (4)): provider 'openai', api_model 'gpt-6.1-terra', endpoint 'https://api.openai.com/v1/chat/completions', guarded on new_row_md5.
