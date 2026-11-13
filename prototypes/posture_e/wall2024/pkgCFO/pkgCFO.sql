-- pkgCFO (W1; ASK 167 "Both forfeit, after 2 confirmations", ASK 178 "Neither: UNDERDETERMINED"), part B of ASK 167.
-- A confirmed closing contradiction forfeits the debate for the side that made it, in the outcome W-D writes:
--   both sides: UNDERDETERMINED; the challenger alone: DEFENDER PREVAILS; the defender alone: as now (BROKEN, CHALLENGER PREVAILS).
-- A review outcome (UNGRADED -- REVIEW) is left as it is. Only debates created at or after the write time (v_cfo_from) are read,
-- so stored debates keep their outcome on any later re-derive. "Confirmed" is the pkgDFL reading (dfl_counted): close enforcer and
-- judge-found rows of the debate's own run token whose cure_reason begins CONFIRMED (pkgTWC's "CONFIRMED (second check)" and
-- "NOT CONFIRMED (one check of two)" do not count, so a link counts once and only after two confirmations on the close path).
-- Database only: n8n code 0, prompt 0. Needs pkgDFL (dfl_counted), live in s175. One transaction. Revert: pkgCFO_revert.sql.
BEGIN;
CREATE OR REPLACE FUNCTION public.cfo_sides(p_debate_id uuid)
 RETURNS text[] LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $f$
 SELECT coalesce(array_agg(DISTINCT s ORDER BY s), ARRAY[]::text[]) FROM (
   SELECT (regexp_match(l.item, '^(?:[XJ]\d+|NEW) (DEFENDER|CHALLENGER) LINK'))[1] AS s
     FROM public.debate_enforcer_log l JOIN public.debate_results r ON r.id = l.debate_id AND r.run_token = l.run_token
    WHERE l.debate_id = p_debate_id AND public.dfl_counted(l.kind, l.rule, l.run_token, l.item, l.cure_reason)) q
  WHERE s IS NOT NULL $f$;
REVOKE ALL ON FUNCTION public.cfo_sides(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cfo_sides(uuid) TO lab_seat, service_role, berean_ro;

DO $do$
DECLARE d text := pg_get_functiondef('public.derive_debate_outcome'::regproc);
 a1 text := E'  v_ds_m boolean; v_cl_m boolean; v_cs_m boolean; v_ccl_m boolean; v_snote text;\nBEGIN\n';
 a2 text := E'  -- CITATION RULE (BB-6795 J2;';
 a3 text := E'    ''citation_block'',             v_block,\n';
 t0 text := to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') || '+00';
BEGIN
 IF md5(d) <> 'f9f1c6127c02223a00b931a4c05d49a0' THEN RAISE EXCEPTION 'pkgCFO: derive_debate_outcome is not the graded base (md5 %)', md5(d); END IF;
 IF (length(d) - length(replace(d, a1, ''))) / length(a1) <> 1 OR (length(d) - length(replace(d, a2, ''))) / length(a2) <> 1
    OR (length(d) - length(replace(d, a3, ''))) / length(a3) <> 1 THEN RAISE EXCEPTION 'pkgCFO: an anchor is not found exactly once'; END IF;
 d := replace(d, a1, E'  v_ds_m boolean; v_cl_m boolean; v_cs_m boolean; v_ccl_m boolean; v_snote text;\n'
   || E'  -- pkgCFO: debates created at or after this time read confirmed closing contradictions into the outcome (the write time).\n'
   || E'  v_cfo_from constant timestamptz := ''' || t0 || E''';\n  v_cfo text[];\nBEGIN\n');
 d := replace(d, a2, E'  -- pkgCFO (ASK 167, ASK 178): a confirmed closing contradiction forfeits the debate for the side that made it.\n'
   || E'  -- Both sides: UNDERDETERMINED. The challenger alone: DEFENDER PREVAILS. A review outcome stays. Read before the citation rule.\n'
   || E'  IF v_created >= v_cfo_from AND v_outcome IS NOT NULL AND v_outcome <> v_review THEN\n'
   || E'    v_cfo := cfo_sides(p_debate_id);\n'
   || E'    IF v_cfo @> ARRAY[''DEFENDER'',''CHALLENGER''] THEN v_outcome := ''UNDERDETERMINED'';\n'
   || E'    ELSIF v_cfo @> ARRAY[''CHALLENGER''] THEN v_outcome := ''DEFENDER PREVAILS'';\n'
   || E'    END IF;\n  END IF;\n\n' || a2);
 d := replace(d, a3, a3 || E'    ''close_forfeit'',              v_cfo,\n');
 EXECUTE d;
END $do$;
COMMIT;
