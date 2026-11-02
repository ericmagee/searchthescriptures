CREATE OR REPLACE FUNCTION public.aggregate_debate_panel(p_debate_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
DECLARE
  v_total int; v_clean int; v_unreadable int;
  v_counts int[]; v_top_tag text; v_top int; v_second int;
  v_unrecognised jsonb; v_seats jsonb; v_drv int;
  v_fv text; v_split text;
BEGIN
  IF p_debate_id IS NULL THEN
    RAISE EXCEPTION 'aggregate_debate_panel: p_debate_id required';
  END IF;

  WITH r AS (
    SELECT j.judge_seat,
           j.verdict_tag,
           j.drv_uncured,
           COALESCE(
             j.truncated = false
             AND j.verdict_tag IN ('HELD','PARTIAL','BROKEN')
             AND j.defense_standing   IN ('SELF-SUPPORTED','PROP-DEPENDENT','COLLAPSED')
             AND j.challenge_standing IN ('SELF-SUPPORTED','PROP-DEPENDENT','COLLAPSED')
             AND COALESCE(j.drv_uncured, 0) = 0
           , false) AS is_clean,
           -- Option 2 (BB-6965, design B fail-closed BB-6969): readable in every other respect, but the seat carries uncured
           -- DEBATE RULE VIOLATION items (K-B, K-G1, K-G3). Not counted; named apart from unreadable rows. NULL (rows before 5B) = 0.
           COALESCE(
             j.truncated = false
             AND j.verdict_tag IN ('HELD','PARTIAL','BROKEN')
             AND j.defense_standing   IN ('SELF-SUPPORTED','PROP-DEPENDENT','COLLAPSED')
             AND j.challenge_standing IN ('SELF-SUPPORTED','PROP-DEPENDENT','COLLAPSED')
             AND COALESCE(j.drv_uncured, 0) > 0
           , false) AS drv_out,
           COALESCE(
             j.truncated = false
             AND j.verdict_tag IS NOT NULL
             AND btrim(j.verdict_tag) <> ''
             AND j.verdict_tag NOT IN ('HELD','PARTIAL','BROKEN','UNKNOWN')
           , false) AS tag_unrecognised
    FROM debate_judgments j
    WHERE j.debate_id = p_debate_id
  ),
  tally AS (
    SELECT verdict_tag, count(*)::int AS n FROM r WHERE is_clean GROUP BY verdict_tag
  )
  SELECT (SELECT count(*)::int FROM r),
         (SELECT count(*)::int FROM r WHERE is_clean),
         (SELECT COALESCE(array_agg(n ORDER BY n DESC), ARRAY[]::int[]) FROM tally),
         (SELECT verdict_tag FROM tally ORDER BY n DESC, verdict_tag LIMIT 1),
         (SELECT COALESCE(jsonb_agg(DISTINCT verdict_tag), '[]'::jsonb) FROM r WHERE tag_unrecognised),
         (SELECT COALESCE(jsonb_agg(jsonb_build_object(
                    'judge_seat', judge_seat, 'verdict_tag', verdict_tag, 'clean', is_clean, 'drv_uncured', drv_uncured)
                  ORDER BY judge_seat), '[]'::jsonb) FROM r),
         (SELECT count(*)::int FROM r WHERE drv_out)
    INTO v_total, v_clean, v_counts, v_top_tag, v_unrecognised, v_seats, v_drv;

  v_unreadable := v_total - v_clean - v_drv;
  v_top    := COALESCE(v_counts[1], 0);
  v_second := COALESCE(v_counts[2], 0);

  v_split := array_to_string(
               CASE WHEN COALESCE(array_length(v_counts,1),0) = 0 THEN ARRAY[0,0]
                    WHEN array_length(v_counts,1) = 1             THEN v_counts || ARRAY[0]
                    ELSE v_counts END, '-');
  IF v_unreadable > 0 THEN
    v_split := v_split || ' (' || v_unreadable || ' unreadable)';
  END IF;
  IF v_drv > 0 THEN
    v_split := v_split || ' (' || v_drv || ' not counted: debate rule)';
  END IF;

  -- D1: quorum is the ELIGIBILITY FLOOR, not the decision (Ruling 4, BB-0674).
  -- Fewer than 2 clean rows, or no majority among the clean rows, is CONTESTED.
  IF v_clean < 2 OR v_top = v_second THEN
    v_fv := 'CONTESTED';
  ELSE
    v_fv := v_top_tag;
  END IF;

  RETURN jsonb_build_object(
    'debate_id', p_debate_id,
    'framework_verdict', v_fv,
    'panel_split', v_split,
    'rows_total', v_total,
    'rows_clean', v_clean,
    'rows_unreadable', v_unreadable,
    'rows_not_counted_debate_rule', v_drv,
    'quorum_met', (v_clean >= 2),
    'unrecognised_verdict_tags', v_unrecognised,
    'seats', v_seats
  );
END;
$function$;
