-- ASK 479 revert: the two DeepSeek rows active again.
BEGIN;
UPDATE public.model_config
   SET active = true,
       notes = notes || E'\nASK 479 reverted: active false -> true.'
 WHERE seat IN ('deepseek','deepseek_debate') AND NOT active;
INSERT INTO public.audit_log (session_date, session_title, engine, notes, performed_by)
VALUES ((now() AT TIME ZONE 'America/Chicago')::date, 'ASK 479 REVERT: DeepSeek model_config rows active again', 'W4_2026_11_06',
        'card=' || coalesce(nullif(current_setting('truth.card', true), ''), 'NONE') || ' | session=' || coalesce(nullif(current_setting('truth.session_id', true), ''), 'NONE')
        || ' | deepseek active false -> true | deepseek_debate active false -> true', 'W4_2026_11_06|ask479-revert');
DO $c$ BEGIN IF (SELECT count(*) FROM public.model_config WHERE seat IN ('deepseek','deepseek_debate') AND active) <> 2 THEN RAISE EXCEPTION 'ASK 479 revert: expected 2 active DeepSeek rows'; END IF; END $c$;
COMMIT;
