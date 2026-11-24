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
    (6,'haiku','Haiku','haiku'),
    (7,'opus','Opus','opus'),
    (8,'glm','GLM','glm'),
    (9,'qwen4max','Qwen 4 Max','qwen4max'),
    (10,'spark','Spark','spark')
  ) as l(ord, key, name, mc_seat)
  left join model_config m on m.seat = l.mc_seat
  order by l.ord;
$function$
