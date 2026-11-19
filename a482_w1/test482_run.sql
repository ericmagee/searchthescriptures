-- ASK 482 rolled-back test (C1, C2). Applies the build inside a transaction, checks, then ROLLS BACK. A pg_net request made in a rolled-back transaction is never sent (W4 9619 K3); the odv1_launches rows are rolled back too.
BEGIN;
-- ASK 482 (i): the engines a debate may seat. A MIRROR of the engine's Init Seats ENG (workflow moMxiV4Irg1uRBZN, version e0a61271) less the refused engines (deepseek; any minimax). The engine list lives in engine code; the ASK 417 registry check for 482 (C6) compares the two at every engine readback and run start. The version is read live from model_config, never typed here.
CREATE OR REPLACE FUNCTION public.dash_debaters()
 RETURNS TABLE(ord integer, key text, name text, mc_seat text, api_model text, active boolean)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select l.ord, l.key, l.name, l.mc_seat, m.api_model, coalesce(m.active, false)
  from (values
    (1,'claude','Claude','claude_synthesis'),
    (2,'chatgpt','ChatGPT','chatgpt'),
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
$function$;
REVOKE ALL ON FUNCTION public.dash_debaters() FROM PUBLIC, anon, authenticated;
-- dash_launch_odv1: the build's one-line change, applied to the live body
DO $t$ DECLARE d text := pg_get_functiondef('public.dash_launch_odv1'::regproc); n text; BEGIN
  n := replace(d, $o$v_eng text[] := array['claude','chatgpt','gemini','grok','mimo','glm','qwen'];$o$, $o$v_eng text[] := array(select key from dash_debaters());$o$);
  IF n = d THEN RAISE EXCEPTION 'v_eng line not found'; END IF; EXECUTE n; END $t$;

WITH t AS (SELECT 'ASK 482 rolled-back acceptance test of the launch list'::text AS topic),
acc AS (
  SELECT d.key AS eng, 'accept' AS want,
         (dash_launch_odv1((SELECT topic FROM t), d.key, 'plain', 'chatgpt', 'plain'))->>'status' AS def_side,
         (dash_launch_odv1((SELECT topic FROM t), 'chatgpt', 'plain', d.key, 'plain'))->>'status' AS ch_side
  FROM dash_debaters() d),
ref AS (
  SELECT e AS eng, 'refuse' AS want,
         (dash_launch_odv1((SELECT topic FROM t), e, 'plain', 'chatgpt', 'plain'))->>'status' AS def_side,
         (dash_launch_odv1((SELECT topic FROM t), 'chatgpt', 'plain', e, 'plain'))->>'status' AS ch_side
  FROM unnest(array['deepseek','minimax','qwen','outsider','']) e),
c1 AS (
  SELECT count(*) AS n,
         count(*) FILTER (WHERE d.api_model IS NOT DISTINCT FROM m.api_model) AS version_match,
         string_agg(d.key||'='||coalesce(d.api_model,'NULL'), ', ' ORDER BY d.ord) AS list
  FROM dash_debaters() d LEFT JOIN model_config m ON m.seat = d.mc_seat)
SELECT (SELECT debate_topic_fence((SELECT topic FROM t))) AS fence,
       (SELECT row_to_json(c1) FROM c1) AS c1,
       (SELECT json_agg(x) FROM (SELECT * FROM acc UNION ALL SELECT * FROM ref) x) AS c2,
       (SELECT count(*) FROM (SELECT * FROM acc UNION ALL SELECT * FROM ref) x
         WHERE (want='accept' AND def_side='fired' AND ch_side='fired') OR (want='refuse' AND def_side='error' AND ch_side='error')) AS c2_pass_of_15,
       (SELECT coalesce(jsonb_agg(to_jsonb(d) ORDER BY d.ord), '[]'::jsonb) FROM dash_debaters() d) AS odv1_engines_payload;
ROLLBACK;
