BEGIN;
CREATE FUNCTION public.framework_probe_flow(p_query text, p_passages text[] DEFAULT NULL::text[], p_sight_limit integer DEFAULT 15)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  v_tokens   text[];
  v_guards   jsonb;
  v_concl    jsonb;
  v_sights   jsonb;
  v_tag      text;
  v_stop     text[] := ARRAY['the','and','was','are','for','not','who','did','his','her','she','him','they','them','that','this','with','from','what','when','where','which','about','marry','married','pre','post'];
BEGIN
  -- Flow-only copy of framework_probe for the Oracle Hardening Test: identical tokens, guards,
  -- conclusions and directive; the sight list is cut to the p_sight_limit the flow uses.
  SELECT value::jsonb #>> '{}' INTO v_tag FROM app_state WHERE key='protocol_guard_tag';

  SELECT array_agg(t) INTO v_tokens
  FROM (SELECT DISTINCT lower(tok) AS t
        FROM regexp_split_to_table(COALESCE(p_query,''), '[\s/\-]+') AS tok
        WHERE length(tok) >= 3 AND lower(tok) <> ALL(v_stop)) s;

  IF (v_tokens IS NULL OR array_length(v_tokens,1) IS NULL) AND p_passages IS NULL THEN
    RETURN jsonb_build_object('guard_open', v_tag)
        || jsonb_build_object('success', false, 'error', 'Give a subject query (e.g. ''Cain wife incest'') and/or p_passages (e.g. ARRAY[''Genesis 4'',''Leviticus 18'']).')
        || jsonb_build_object('guard_close', v_tag);
  END IF;

  SELECT jsonb_agg(jsonb_build_object('rule_num',rule_num,'priority',priority,'subject',subject,'anchors',anchor_verses) ORDER BY rule_num)
  INTO v_guards
  FROM drift_guards g
  WHERE v_tokens IS NOT NULL AND EXISTS (
    SELECT 1 FROM unnest(v_tokens) t WHERE g.subject ILIKE '%'||t||'%' OR COALESCE(g.anchor_verses,'') ILIKE '%'||t||'%');

  SELECT jsonb_agg(jsonb_build_object(
           'id',id,'layer',layer,'status',status,'passage',passage_anchor,
           'flag', CASE WHEN status ILIKE 'SUPERSEDED%' THEN 'SUPERSEDED — do not answer from this; see successor' ELSE NULL END,
           'text', left(conclusion_text,400))
         ORDER BY (CASE status WHEN 'SEALED' THEN 0 WHEN 'SUBSTANTIALLY_SUPPORTED' THEN 1 WHEN 'SUPERSEDED' THEN 9 ELSE 5 END), id)
  INTO v_concl
  FROM kb_conclusions c
  WHERE (v_tokens IS NOT NULL AND EXISTS (
            SELECT 1 FROM unnest(v_tokens) t WHERE c.conclusion_text ILIKE '%'||t||'%' OR COALESCE(c.passage_anchor,'') ILIKE '%'||t||'%'))
     OR (p_passages IS NOT NULL AND EXISTS (
            SELECT 1 FROM unnest(p_passages) pp WHERE COALESCE(c.passage_anchor,'') ILIKE '%'||pp||'%'));

  SELECT jsonb_agg(x.o ORDER BY x.rk, x.sn)
  INTO v_sights
  FROM (SELECT jsonb_build_object('sight',sight_number,'title',title,'layer',layer_status,'status',status,'passage',primary_passage) AS o,
               (CASE status WHEN 'SEALED' THEN 0 WHEN 'SUBSTANTIALLY_SUPPORTED' THEN 1 ELSE 5 END) AS rk,
               sight_number AS sn
        FROM kb_sights s
        WHERE (v_tokens IS NOT NULL AND EXISTS (
                  SELECT 1 FROM unnest(v_tokens) t
                  WHERE s.title ILIKE '%'||t||'%' OR COALESCE(s.topic,'') ILIKE '%'||t||'%'
                     OR COALESCE(s.summary,'') ILIKE '%'||t||'%' OR COALESCE(s.primary_passage,'') ILIKE '%'||t||'%'))
           OR (p_passages IS NOT NULL AND EXISTS (
                  SELECT 1 FROM unnest(p_passages) pp WHERE COALESCE(s.primary_passage,'') ILIKE '%'||pp||'%'))
        ORDER BY 2, 3
        LIMIT p_sight_limit) x;

  RETURN jsonb_build_object('guard_open', v_tag)
      || jsonb_build_object(
           'success', true,
           'query', p_query,
           'tokens', v_tokens,
           'governing_guards', COALESCE(v_guards,'[]'::jsonb),
           'held_conclusions', COALESCE(v_concl,'[]'::jsonb),
           'held_sights', COALESCE(v_sights,'[]'::jsonb),
           'directive', 'CORPUS SPEAKS FIRST. Before composing, read the held conclusions/sights above and pull the L1 anchor verses listed on the governing guards from kjv_verses. A SUPERSEDED conclusion is NOT a live position — answer from its successor. Where a conclusion is SEALED/SUBSTANTIALLY_SUPPORTED, it overrides training recall; do not re-open or hedge it into a maybe. This is keyword+passage matching, NOT a comprehension guarantee and NOT exhaustive — also run coverage_scan(passages) for the passage-overlap fence (the net that catches what keyword scan misses).')
      || jsonb_build_object('guard_close', v_tag);
END;
$function$;
DO $t$
DECLARE r text := ''; q text; a jsonb; b jsonb; t0 timestamptz; d1 interval; d2 interval;
BEGIN
  SET LOCAL ROLE anon;
  FOREACH q IN ARRAY ARRAY[$q$Who was Jesus's biological father?$q$,$q$Who were the Gentiles Paul was writing to?$q$,$q$Who were the lost sheep Jesus said he was sent to?$q$,$q$Doesn't John 3:16 prove God loves the whole world and salvation is for everyone equally?$q$] LOOP
    t0 := clock_timestamp(); a := framework_probe(q, ARRAY[]::text[]); d1 := clock_timestamp()-t0;
    t0 := clock_timestamp(); b := framework_probe_flow(q, ARRAY[]::text[]); d2 := clock_timestamp()-t0;
    r := r || format(E'\n[%s] concl_eq=%s directive_eq=%s guards_eq=%s tokens_eq=%s tag_eq=%s sights15_eq=%s old_n=%s new_n=%s old_len=%s new_len=%s old_ms=%s new_ms=%s',
      left(q,20),
      a->'held_conclusions' = b->'held_conclusions', a->>'directive' = b->>'directive', a->'governing_guards' = b->'governing_guards',
      a->'tokens' = b->'tokens', (a->>'guard_open' = b->>'guard_open' AND a->>'guard_close' = b->>'guard_close'),
      (SELECT COALESCE(jsonb_agg(e ORDER BY o),'[]'::jsonb) FROM jsonb_array_elements(a->'held_sights') WITH ORDINALITY x(e,o) WHERE o<=15) = b->'held_sights',
      jsonb_array_length(a->'held_sights'), jsonb_array_length(b->'held_sights'), length(a::text), length(b::text),
      round(extract(epoch from d1)*1000), round(extract(epoch from d2)*1000));
  END LOOP;
  RAISE EXCEPTION 'PROBE RESULT (rolled back):%', r;
END $t$;
