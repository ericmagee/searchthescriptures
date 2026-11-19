-- ASK 482 rev 5 DELTA REVERT (W1, 11-19). Returns to live rev 4: dash_queue 9ccd1295 and odv1_eng_label 9d25f4a0 bodies, drops odv1_side_label and odv1_model_name. Leaves rev 4 in place.
BEGIN;
CREATE OR REPLACE FUNCTION public.dash_queue()
 RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
      odv1_eng_label(lm.def_engine)||CASE WHEN lm.def_profile='oracle' THEN ' as The Oracle' ELSE '' END||' defends · '||
      odv1_eng_label(lm.ch_engine)||CASE WHEN lm.ch_profile='oracle' THEN ' as The Oracle' ELSE '' END||' challenges' AS sides,
      CASE WHEN lm.rid IS NOT NULL THEN 'complete'
           WHEN lm.answered AND (lm.http IS NULL OR lm.http NOT BETWEEN 200 AND 299) THEN 'refused'
           WHEN now()-lm.launched_at > interval '30 minutes' THEN 'failed'
           ELSE 'running' END AS status,
      lm.rid AS result_id
    FROM lm
    UNION ALL
    SELECT * FROM (
      SELECT r.created_at, r.topic,
        odv1_eng_label(r.defender_engine)||CASE WHEN r.defender_profile='oracle' THEN ' as The Oracle' ELSE '' END||' defends · '||
        odv1_eng_label(r.challenger_engine)||CASE WHEN r.challenger_profile='oracle' THEN ' as The Oracle' ELSE '' END||' challenges',
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
CREATE OR REPLACE FUNCTION public.odv1_eng_label(e text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  SELECT CASE lower(coalesce(e,'')) WHEN 'chatgpt' THEN 'ChatGPT' WHEN 'deepseek' THEN 'DeepSeek' WHEN 'mimo' THEN 'MiMo' WHEN 'glm' THEN 'GLM' WHEN '' THEN '?' ELSE initcap(e) END
$function$;
DROP FUNCTION IF EXISTS public.odv1_side_label(text, text);
DROP FUNCTION IF EXISTS public.odv1_model_name(text);
DO $chk$ BEGIN
  IF (SELECT md5(prosrc) FROM pg_proc WHERE proname='dash_queue') IS DISTINCT FROM '9ccd12955a42ac550e30fce615790530' THEN RAISE EXCEPTION 'revert check: dash_queue'; END IF;
  IF (SELECT md5(prosrc) FROM pg_proc WHERE proname='odv1_eng_label') IS DISTINCT FROM '9d25f4a0ff6fd660f9e9bb6a48ccf744' THEN RAISE EXCEPTION 'revert check: odv1_eng_label'; END IF;
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname IN ('odv1_side_label','odv1_model_name')) THEN RAISE EXCEPTION 'revert check: helpers still present'; END IF;
END $chk$;
COMMIT;
