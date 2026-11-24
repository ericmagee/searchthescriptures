SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
-- ASK 593 (W4): Haiku out of the debate engine in full (operator 01:15 and 01:16 CST 2026-11-24, ruling rows 518, 519). Database part.
-- 1. The dashboard's debater list (and so dash_launch_odv1, which takes its keys from it): the haiku row leaves.
CREATE OR REPLACE FUNCTION public.dash_debaters()
 RETURNS TABLE(ord integer, key text, name text, mc_seat text, api_model text, active boolean)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select l.ord, l.key, l.name, l.mc_seat, m.api_model, coalesce(m.active, false)
  from (values
    (1,'claude','Claude','claude_synthesis'),
    (2,'chatgpt','OpenAI','chatgpt'),
    (3,'gemini','Gemini','gemini'),
    (4,'grok','Grok','grok'),
    (5,'mimo','MiMo','mimo'),
    (7,'opus','Opus','opus'),
    (8,'glm','GLM','glm'),
    (9,'qwen4max','Qwen 4 Max','qwen4max'),
    (10,'spark','Spark','spark'),
    (11,'sol62','Sol 6.2','sol62')
  ) as l(ord, key, name, mc_seat)
  left join model_config m on m.seat = l.mc_seat
  order by l.ord;
$function$;
-- 2. The reserve recorder's seat list: haiku leaves (only that word of the function changes).
DO $m$
DECLARE d text; a text := $q$'luna','haiku','hydrogen'$q$;
BEGIN
  d := pg_get_functiondef('public.odv1_record_panel_substitution(uuid,jsonb)'::regprocedure);
  IF (length(d) - length(replace(d, a, ''))) / length(a) <> 1 THEN RAISE EXCEPTION 'ASK 593: the seat list anchor does not occur once'; END IF;
  EXECUTE replace(d, a, $q$'luna','hydrogen'$q$);
END
$m$;
-- 3. The model_config row stays (history), inactive. Undo: active true.
UPDATE model_config SET active = false,
  notes = coalesce(notes,'') || E'\n2026-11-24 (W4 seat 35, ASK 593): active true -> false on the operator''s word "remove Haiku from lineup" and "remove from debate engine in full" (01:15 and 01:16 CST). Undo: active true.'
WHERE seat = 'haiku' AND active = true;
