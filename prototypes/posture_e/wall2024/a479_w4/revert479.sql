-- ASK 479 revert: the two DeepSeek rows active again.
BEGIN;
UPDATE public.model_config
   SET active = true,
       notes = notes || E'\nASK 479 reverted: active false -> true.'
 WHERE seat IN ('deepseek','deepseek_debate') AND NOT active;
COMMIT;
