-- judge_fix2 FIX 7 (DRAFT, NOT APPLIED). The panel word CONTESTED is set in the database, not in the flow: aggregate_debate_panel returns
-- framework_verdict 'CONTESTED' when fewer than 2 seats are clean or the top two tags tie, and derive_debate_outcome stamps it into
-- panel_verdict (first stamp only) and maps it through d5_outcome_for to 'UNGRADED — REVIEW'. Read live 2026-11-02 with pg_get_functiondef.
-- This draft writes 'UNGRADED' when NO seat is counted (v_clean = 0), as asked; one counted seat, or a tie, stays 'CONTESTED' (a ruling is
-- needed on those). Rows already stamped keep their value: panel_verdict is written at the first stamp only (10 rows hold CONTESTED today).
-- Readers checked: dash_odv1_debates, dash_odv1_by_id and dash_queue pass panel_verdict through as text; Format Markdown prints it as text;
-- no reader compares it with 'CONTESTED'. d5_selftest tests only its own listed cases; the UNGRADED case is added there so the new value is guarded.

-- 1) aggregate_debate_panel: only the verdict block changes (the rest of the function as it stands live).
--    Replace:
--      IF v_clean < 2 OR v_top = v_second THEN
--        v_fv := 'CONTESTED';
--    with:
--      IF v_clean = 0 THEN
--        v_fv := 'UNGRADED';      -- no seat counted (runs 32212: 0-0, 3 not counted)
--      ELSIF v_clean < 2 OR v_top = v_second THEN
--        v_fv := 'CONTESTED';
--    (Applied by CREATE OR REPLACE of the whole function body as read live, with only these lines changed.)

-- 2) d5_outcome_for: map the new word to the same review outcome.
CREATE OR REPLACE FUNCTION public.d5_outcome_for(p_framework_verdict text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public', 'pg_catalog'
AS $function$
  SELECT CASE upper(btrim(COALESCE(p_framework_verdict,'')))
           WHEN 'HELD'      THEN 'DEFENDER PREVAILS'
           WHEN 'BROKEN'    THEN 'CHALLENGER PREVAILS'
           WHEN 'PARTIAL'   THEN 'DEFENDER PREVAILS, WEAKENED'
           WHEN 'UNKNOWN'   THEN E'UNGRADED — REVIEW'
           WHEN 'CONTESTED' THEN E'UNGRADED — REVIEW'
           WHEN 'UNGRADED'  THEN E'UNGRADED — REVIEW'
           ELSE NULL
         END;
$function$;

-- 3) d5_selftest: add the case ('UNGRADED', E'UNGRADED — REVIEW') to its VALUES list; distinct_outcomes stays 4 and refusals 3.
