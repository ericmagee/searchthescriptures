CREATE OR REPLACE FUNCTION public.d5_selftest()
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'pg_catalog'
AS $function$
  WITH cases(fv, expected) AS (VALUES
    ('HELD',       'DEFENDER PREVAILS'),
    ('BROKEN',     'CHALLENGER PREVAILS'),
    ('PARTIAL',    'DEFENDER PREVAILS, WEAKENED'),
    ('UNKNOWN',    E'UNGRADED — REVIEW'),
    ('CONTESTED',  E'UNGRADED — REVIEW'),
    ('  held  ',   'DEFENDER PREVAILS'),          -- trim and case folding
    ('Broken',     'CHALLENGER PREVAILS'),
    (NULL,         NULL),                          -- fail closed, three ways
    ('',           NULL),
    ('NONSENSE',   NULL)
  ), r AS (
    SELECT fv, expected, public.d5_outcome_for(fv) AS got FROM cases
  ), agg AS (
    SELECT count(*)::int AS total,
           count(*) FILTER (WHERE got IS DISTINCT FROM expected)::int AS failed,
           count(DISTINCT got) FILTER (WHERE got IS NOT NULL)::int AS distinct_outcomes,
           count(*) FILTER (WHERE got IS NULL)::int AS refusals,
           COALESCE(jsonb_agg(jsonb_build_object('input', fv, 'expected', expected, 'got', got))
                    FILTER (WHERE got IS DISTINCT FROM expected), '[]'::jsonb) AS failures
    FROM r
  )
  SELECT jsonb_build_object(
    'total',             total,
    'failed',            failed,
    'distinct_outcomes', distinct_outcomes,
    'refusals',          refusals,
    'failures',          failures,
    'variation_ok',      distinct_outcomes = 4,
    'refusal_ok',        refusals = 3,
    'pass',              failed = 0 AND distinct_outcomes = 4 AND refusals = 3,
    'semantic', 'Guards the D5 map ONLY. It does NOT verify derive_debate_outcome, aggregate_debate_panel, or any fence -- those have no standing check and W-D has no graded history to re-derive against.'
  ) FROM agg;
$function$;
