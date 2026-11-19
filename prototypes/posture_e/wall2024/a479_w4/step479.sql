-- ASK 479 (W4 build): mark the two DeepSeek rows of model_config inactive (operator 09:04 CST 11-19, "Turn them off"). NOT APPLIED.
BEGIN;
UPDATE public.model_config
   SET active = false,
       notes = notes || E'\n2026-11-19 (W4 seat 35, ASK 479): active true -> false on the operator''s word "Turn them off" (09:04 CST). Undo: active true.'
 WHERE seat IN ('deepseek','deepseek_debate') AND active;
DO $c$ BEGIN IF (SELECT count(*) FROM public.model_config WHERE seat IN ('deepseek','deepseek_debate') AND NOT active) <> 2 THEN RAISE EXCEPTION 'ASK 479: expected 2 inactive DeepSeek rows'; END IF; END $c$;
COMMIT;
