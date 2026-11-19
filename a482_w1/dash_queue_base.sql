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
$function$
