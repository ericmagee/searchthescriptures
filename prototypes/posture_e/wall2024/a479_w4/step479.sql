-- ASK 479 (W4 build): mark the two DeepSeek rows of model_config inactive (operator 09:04 CST 11-19, "Turn them off"). NOT APPLIED.
BEGIN;
UPDATE public.model_config
   SET active = false,
       notes = notes || E'\n2026-11-19 (W4 seat 35, ASK 479): active true -> false on the operator''s word "Turn them off" (09:04 CST). Undo: active true.'
 WHERE seat IN ('deepseek','deepseek_debate') AND active;
INSERT INTO public.audit_log (session_date, session_title, engine, notes, performed_by)
VALUES ((now() AT TIME ZONE 'America/Chicago')::date, 'ASK 479: DeepSeek model_config rows inactive', 'W4_2026_11_06',
        'card=' || coalesce(nullif(current_setting('truth.card', true), ''), 'NONE') || ' | session=' || coalesce(nullif(current_setting('truth.session_id', true), ''), 'NONE')
        || ' | deepseek active true -> false | deepseek_debate active true -> false | revert: revert479.sql', 'W4_2026_11_06|ask479');
DO $c$ BEGIN IF (SELECT count(*) FROM public.model_config WHERE seat IN ('deepseek','deepseek_debate') AND NOT active) <> 2 THEN RAISE EXCEPTION 'ASK 479: expected 2 inactive DeepSeek rows'; END IF; END $c$;
COMMIT;
