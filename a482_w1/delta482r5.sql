-- ASK 482 rev 5 DELTA (W1, 11-19). Applies ON TOP OF live rev 4 (written 17:1xZ, W4 Wall 9719). Adds: odv1_model_name, odv1_side_label (revoked from PUBLIC, anon, authenticated); odv1_eng_label ChatGPT -> OpenAI; dash_queue names each side by its model. Bodies are byte-identical to build482.sql rev 5 (99a1a73a).
BEGIN;
DO $pre$ BEGIN
  IF (SELECT md5(prosrc) FROM pg_proc WHERE proname='dash_queue') IS DISTINCT FROM '9ccd12955a42ac550e30fce615790530' THEN RAISE EXCEPTION 'ASK 482 rev 5 delta: dash_queue is not the rev 4 live body'; END IF;
  IF (SELECT md5(prosrc) FROM pg_proc WHERE proname='odv1_eng_label') IS DISTINCT FROM '9d25f4a0ff6fd660f9e9bb6a48ccf744' THEN RAISE EXCEPTION 'ASK 482 rev 5 delta: odv1_eng_label is not the rev 4 live body'; END IF;
  IF (SELECT md5(prosrc) FROM pg_proc WHERE proname='dash_odv1_debates') IS DISTINCT FROM '1fc8bc68b230c4ff3becc787e222c63f' THEN RAISE EXCEPTION 'ASK 482 rev 5 delta: rev 4 is not live'; END IF;
END $pre$;
CREATE OR REPLACE FUNCTION public.odv1_model_name(m text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  -- ASK 482 rev 5: a model's display name from its id; the same rule as odv1.js odMName (openai/gpt-6.1-terra reads Terra 6.1).
  SELECT CASE
    WHEN s = '' THEN NULL
    WHEN s ~ '^gpt-[0-9.]+-[a-z]+$' THEN initcap(substring(s from '^gpt-[0-9.]+-([a-z]+)$')) || ' ' || substring(s from '^gpt-([0-9.]+)-')
    ELSE (SELECT string_agg(CASE t WHEN 'glm' THEN 'GLM' WHEN 'mimo' THEN 'MiMo' WHEN 'gpt' THEN 'GPT' WHEN 'deepseek' THEN 'DeepSeek' WHEN 'minimax' THEN 'MiniMax'
                 ELSE CASE WHEN t ~ '^[a-z]' AND t !~ '^v[0-9]' THEN upper(left(t,1)) || substr(t,2) ELSE t END END, ' ' ORDER BY o)
          FROM unnest(string_to_array(s,'-')) WITH ORDINALITY u(t,o)) END
  FROM (SELECT regexp_replace(coalesce(m,''), '^.*/', '') AS s) x
$function$;
CREATE OR REPLACE FUNCTION public.odv1_side_label(e text, m text)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  -- ASK 482 rev 5: the model's name when the model is known; otherwise the engine label.
  SELECT coalesce(odv1_model_name(m), odv1_eng_label(e))
$function$;
REVOKE ALL ON FUNCTION public.odv1_model_name(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.odv1_side_label(text, text) FROM PUBLIC, anon, authenticated;
CREATE OR REPLACE FUNCTION public.odv1_eng_label(e text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  SELECT CASE lower(coalesce(e,'')) WHEN 'chatgpt' THEN 'OpenAI' WHEN 'deepseek' THEN 'DeepSeek' WHEN 'mimo' THEN 'MiMo' WHEN 'glm' THEN 'GLM' WHEN '' THEN '?' ELSE initcap(e) END
$function$;
CREATE OR REPLACE FUNCTION public.dash_queue()
 RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- ASK 482 rev 5: each side is named by its model (the run's own model; a launch not yet run shows the engine's model now).
  -- Queue tab: current Any vs Any (ORACLE_DEBATE_V1) debates. The old debate_queue is obsolete (operator fix 2026-10-17).
  WITH l AS (SELECT * FROM odv1_launches ORDER BY launched_at DESC LIMIT 40),
  lm AS (
    SELECT l.*,
      (SELECT r.id FROM debate_results r WHERE r.variant='ORACLE_DEBATE_V1' AND lower(trim(r.topic))=lower(trim(l.topic))
         AND r.defender_engine=l.def_engine AND r.challenger_engine=l.ch_engine AND r.created_at>=l.launched_at
       ORDER BY r.created_at LIMIT 1) AS rid,
      (SELECT h.status_code FROM net._http_response h WHERE h.id=l.request_id) AS http,
      EXISTS (SELECT 1 FROM net._http_response h WHERE h.id=l.request_id) AS answered
    FROM l),
  rows AS (
    SELECT lm.launched_at AS sort_key, lm.topic,
      odv1_side_label(lm.def_engine, coalesce((SELECT r.defender_model FROM debate_results r WHERE r.id=lm.rid), (SELECT d.api_model FROM dash_debaters() d WHERE d.key=lm.def_engine)))||CASE WHEN lm.def_profile='oracle' THEN ' as The Oracle' ELSE '' END||' defends · '||
      odv1_side_label(lm.ch_engine, coalesce((SELECT r.challenger_model FROM debate_results r WHERE r.id=lm.rid), (SELECT d.api_model FROM dash_debaters() d WHERE d.key=lm.ch_engine)))||CASE WHEN lm.ch_profile='oracle' THEN ' as The Oracle' ELSE '' END||' challenges' AS sides,
      CASE WHEN lm.rid IS NOT NULL THEN 'complete'
           WHEN lm.answered AND (lm.http IS NULL OR lm.http NOT BETWEEN 200 AND 299) THEN 'refused'
           WHEN now()-lm.launched_at > interval '30 minutes' THEN 'failed'
           ELSE 'running' END AS status,
      lm.rid AS result_id
    FROM lm
    UNION ALL
    SELECT * FROM (
      SELECT r.created_at, r.topic,
        odv1_side_label(r.defender_engine, r.defender_model)||CASE WHEN r.defender_profile='oracle' THEN ' as The Oracle' ELSE '' END||' defends · '||
        odv1_side_label(r.challenger_engine, r.challenger_model)||CASE WHEN r.challenger_profile='oracle' THEN ' as The Oracle' ELSE '' END||' challenges',
        'complete', r.id
      FROM debate_results r
      WHERE r.variant='ORACLE_DEBATE_V1' AND r.id NOT IN (SELECT rid FROM lm WHERE rid IS NOT NULL)
      ORDER BY r.created_at DESC LIMIT 40) x
  ),
  top AS (SELECT * FROM rows ORDER BY sort_key DESC LIMIT 40)
  SELECT jsonb_build_object(
    'running', (SELECT count(*) FROM top WHERE status='running'),
    'finished_24h', (SELECT count(*) FROM debate_results WHERE variant='ORACLE_DEBATE_V1' AND created_at > now()-interval '24 hours'),
    'depth', (SELECT count(*) FROM top WHERE status='running'),
    'rows', COALESCE((SELECT jsonb_agg(jsonb_build_object(
        'topic', t.topic, 'sides', t.sides, 'engine', t.sides, 'status', t.status, 'result_id', t.result_id,
        'verdict', (SELECT r.panel_verdict FROM debate_results r WHERE r.id=t.result_id),
        'submitted_at', to_char(t.sort_key AT TIME ZONE 'America/Chicago','YYYY-MM-DD HH24:MI'), 'rounds', 3)
      ORDER BY t.sort_key DESC) FROM top t), '[]'::jsonb));
$function$;
DO $chk$ BEGIN
  IF position('odv1_side_label' in (SELECT prosrc FROM pg_proc WHERE proname='dash_queue')) = 0 THEN RAISE EXCEPTION 'ASK 482 check: dash_queue does not name models'; END IF;
  IF odv1_model_name('openai/gpt-6.1-terra') IS DISTINCT FROM 'Terra 6.1' THEN RAISE EXCEPTION 'ASK 482 check: odv1_model_name rule'; END IF;
  IF odv1_model_name('deepseek/deepseek-v4') IS DISTINCT FROM 'DeepSeek v4' THEN RAISE EXCEPTION 'ASK 482 check: odv1_model_name casing'; END IF;
  IF position('ChatGPT' in (SELECT prosrc FROM pg_proc WHERE proname='odv1_eng_label')) > 0 THEN RAISE EXCEPTION 'ASK 482 check: odv1_eng_label still says ChatGPT'; END IF;
END $chk$;
COMMIT;
