-- LOCAL scratch Postgres 16 only. Stubs: debate_results (the columns the guard reads), audit_log, debate_judgments stub for dash_odv1_judges,
-- the LIVE text of debate_results_write_guard and dash_odv1_by_id (read 2026-11-02 by SELECT pg_get_functiondef), and a stub
-- record_integrity_scan holding check 2's live anchor line. Then: migration, an insert with a truncated close round, the dashboard read, undo.
CREATE TABLE public.debate_results (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), topic text, variant text, engine text, framework_verdict text, data_class text, quarantine_reason text,
 claude_r1 text, engine_r1 text, claude_r2 text, engine_r2 text, engine_r3 text, challenger_r3 text, synthesis text, independent_verdict_raw text,
 created_at timestamptz DEFAULT now(), run_token text, defender_engine text, defender_profile text, defender_model text, challenger_engine text, challenger_profile text, challenger_model text,
 judge_model text, outcome text, panel_verdict text, panel_split text, judged_by text[], defense_standing text, challenge_standing text, conceded_links int, challenger_conceded_links int, review_notes text);
CREATE TABLE public.audit_log (session_date date, session_title text, engine text, notes text);
CREATE FUNCTION public.dash_odv1_judges(p_id uuid) RETURNS jsonb LANGUAGE sql AS $$ select '[]'::jsonb $$;
CREATE OR REPLACE FUNCTION public.debate_results_write_guard()
 RETURNS trigger LANGUAGE plpgsql AS $function$
DECLARE
  v_blob text;
  v_seats text := '';
BEGIN
  IF NEW.topic IS NOT NULL AND NEW.topic ~* '(^__|SELFTEST|smoke test|VERIFY RPC|WRITE PATH|delete me|wiring test)' THEN
    NEW.data_class := 'test';
  END IF;
  v_blob := COALESCE(NEW.claude_r1,'')||' '||COALESCE(NEW.engine_r1,'')||' '||COALESCE(NEW.claude_r2,'')||' '||
            COALESCE(NEW.engine_r2,'')||' '||COALESCE(NEW.engine_r3,'')||' '||COALESCE(NEW.challenger_r3,'')||' '||
            COALESCE(NEW.synthesis,'')||' '||COALESCE(NEW.independent_verdict_raw,'');
  IF v_blob ~ 'TRUNCAT' THEN
    IF NEW.claude_r1  ~ 'TRUNCAT' THEN v_seats := v_seats || 'claude_r1 '; END IF;
    IF NEW.engine_r1  ~ 'TRUNCAT' THEN v_seats := v_seats || 'engine_r1 '; END IF;
    IF NEW.claude_r2  ~ 'TRUNCAT' THEN v_seats := v_seats || 'claude_r2 '; END IF;
    IF NEW.engine_r2  ~ 'TRUNCAT' THEN v_seats := v_seats || 'engine_r2 '; END IF;
    IF NEW.engine_r3  ~ 'TRUNCAT' THEN v_seats := v_seats || 'engine_r3 '; END IF;
    IF NEW.challenger_r3 ~ 'TRUNCAT' THEN v_seats := v_seats || 'challenger_r3 '; END IF;
    IF NEW.synthesis  ~ 'TRUNCAT' THEN v_seats := v_seats || 'synthesis '; END IF;
    IF NEW.independent_verdict_raw ~ 'TRUNCAT' THEN v_seats := v_seats || 'independent_verdict_raw '; END IF;
    NEW.quarantine_reason := COALESCE(NEW.quarantine_reason || ' | ', '')
      || 'AUTO-QUARANTINE at write: truncation marker present in [' || trim(v_seats) || ']. (rest of the live message)';
    INSERT INTO audit_log (session_date, session_title, engine, notes) VALUES (current_date, 'GUARD: debate_results row QUARANTINED at write (truncation)', 'db-trigger', 'seats=[' || trim(v_seats) || ']');
  END IF;
  RETURN NEW;
END;
$function$;
CREATE TRIGGER trg_debate_results_write_guard BEFORE INSERT ON public.debate_results FOR EACH ROW EXECUTE FUNCTION public.debate_results_write_guard();
CREATE OR REPLACE FUNCTION public.dash_odv1_by_id(p_id uuid)
 RETURNS jsonb LANGUAGE sql SECURITY DEFINER SET search_path TO 'public' AS $function$
  select to_jsonb(x) from (
    select id, topic, created_at, run_token,
           defender_engine, defender_profile, defender_model,
           challenger_engine, challenger_profile, challenger_model,
           claude_r1 as def_r1, engine_r1 as cha_r1, claude_r2 as def_r2, engine_r2 as cha_r2,
           engine_r3 as def_r3, challenger_r3 as cha_r3,
           synthesis, independent_verdict_raw, judge_model, framework_verdict, outcome, panel_verdict, panel_split,
           judged_by, defense_standing, challenge_standing, conceded_links, challenger_conceded_links,
           review_notes,
           dash_odv1_judges(id) as judges
    from debate_results where id=p_id and variant='ORACLE_DEBATE_V1') x;
$function$;
CREATE OR REPLACE FUNCTION public.record_integrity_scan() RETURNS jsonb LANGUAGE plpgsql STABLE AS $function$
DECLARE n int;
BEGIN
  SELECT count(*) INTO n FROM debate_results
   WHERE quarantine_reason IS NULL
     AND (COALESCE(claude_r1,'')||COALESCE(engine_r1,'')||COALESCE(claude_r2,'')||COALESCE(engine_r2,'')||
          COALESCE(engine_r3,'')||COALESCE(challenger_r3,'')||COALESCE(synthesis,'')||COALESCE(independent_verdict_raw,'')) ~ 'TRUNCAT';
  RETURN jsonb_build_object('unquarantined_truncated_rows', n);
END;
$function$;
\echo == migration
\i sql/b4_close_rounds.sql
\echo == insert: a truncated defender close round, and a clean row
INSERT INTO debate_results (topic,variant,run_token,claude_r1,defender_r4,challenger_r4) VALUES ('t1','ORACLE_DEBATE_V1','ODV1-T1','r1','close text\n\n[TRUNCATED: the provider reported the token limit -- raise max_tokens]','c4 text');
INSERT INTO debate_results (topic,variant,run_token,claude_r1,defender_r4,challenger_r4) VALUES ('t2','ORACLE_DEBATE_V1','ODV1-T2','r1','close','c4 [TRUNCATED: x]');
SELECT run_token, quarantine_reason FROM debate_results ORDER BY run_token;
SELECT notes FROM audit_log;
\echo == an update that slips past the insert guard is found by the scan
UPDATE debate_results SET quarantine_reason=NULL WHERE run_token='ODV1-T1';
SELECT record_integrity_scan();
\echo == dashboard read
SELECT dash_odv1_by_id(id)->>'def_r4' AS def_r4, dash_odv1_by_id(id)->>'cha_r4' AS cha_r4 FROM debate_results WHERE run_token='ODV1-T2';
\echo == migration again (columns exist; the function anchors are gone, so it must refuse and roll back)
\i sql/b4_close_rounds.sql
ROLLBACK;
\echo == undo
\i sql/undo_b4_close_rounds.sql
SELECT position('defender_r4' in pg_get_functiondef('public.debate_results_write_guard()'::regprocedure)) AS guard_after_undo, position('def_r4' in pg_get_functiondef('public.dash_odv1_by_id(uuid)'::regprocedure)) AS dash_after_undo, position('defender_r4' in pg_get_functiondef('public.record_integrity_scan()'::regprocedure)) AS scan_after_undo;
