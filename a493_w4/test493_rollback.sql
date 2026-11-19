SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
SET LOCAL truth.card='TEST 493 rolled back';
CREATE TABLE public.ask_aar_snapshots (
  id bigserial PRIMARY KEY,
  ask int NOT NULL,
  rev text NOT NULL,
  title text NOT NULL,
  objective text NOT NULL,
  objective_met text NOT NULL CHECK (objective_met IN ('yes','in part','no','not yet')),
  objective_met_reason text NOT NULL,
  objective_source text NOT NULL,
  aar_at timestamptz NOT NULL DEFAULT now(),
  written_by text NOT NULL,
  prior_row bigint REFERENCES public.ask_aar_snapshots(id),
  operator_words jsonb,
  card jsonb,
  owner_seat text,
  plan jsonb,
  build_files jsonb,
  revert jsonb,
  grades jsonb,
  md5_written text[],
  md5_match boolean,
  audit_ids jsonb,
  objects jsonb,
  tests jsonb,
  readbacks jsonb,
  run_evidence jsonb,
  manuals jsonb,
  status text NOT NULL CHECK (status IN ('planned','graded','carded','written','read back','proven by run','reverted','dropped')),
  sources jsonb NOT NULL CHECK (jsonb_typeof(sources) = 'array' AND jsonb_array_length(sources) >= 1)
);
ALTER TABLE public.ask_aar_snapshots ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.ask_aar_snapshots FROM PUBLIC, anon, authenticated, berean_ro;
REVOKE ALL ON SEQUENCE public.ask_aar_snapshots_id_seq FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.ask_aar_snapshots FROM service_role, lab_seat;
GRANT SELECT ON TABLE public.ask_aar_snapshots TO service_role, lab_seat;

CREATE FUNCTION public.ask_aar_snapshots_before_insert() RETURNS trigger LANGUAGE plpgsql AS $f$
DECLARE v_sid text := nullif(current_setting('truth.session_id', true), ''); g jsonb; m text; ok boolean; e jsonb;
BEGIN
  IF v_sid IS NULL THEN RAISE EXCEPTION 'ask_aar_snapshots: truth.session_id is not set'; END IF;
  IF md_notes_caller_seat() IS DISTINCT FROM 36 THEN RAISE EXCEPTION 'ask_aar_snapshots: only the coordinator seat (36) inserts rows'; END IF;
  IF NEW.written_by IS DISTINCT FROM v_sid THEN RAISE EXCEPTION 'ask_aar_snapshots: written_by must equal truth.session_id'; END IF;
  IF NEW.grades IS NOT NULL THEN
    IF jsonb_typeof(NEW.grades) <> 'array' THEN RAISE EXCEPTION 'ask_aar_snapshots: grades must be an array'; END IF;
    FOR g IN SELECT * FROM jsonb_array_elements(NEW.grades) LOOP
      IF coalesce(g->>'verdict_norm','') NOT IN ('PASS','FAIL','FAIL ON FORM') THEN
        RAISE EXCEPTION 'ask_aar_snapshots: every grades element needs verdict_norm PASS, FAIL or FAIL ON FORM';
      END IF;
    END LOOP;
  END IF;
  IF NEW.md5_written IS NULL OR cardinality(NEW.md5_written) = 0 THEN
    NEW.md5_match := NULL;
  ELSE
    ok := true;
    FOREACH m IN ARRAY NEW.md5_written LOOP
      IF EXISTS (SELECT 1 FROM jsonb_array_elements(coalesce(NEW.grades,'[]'::jsonb)) x
                 WHERE x->>'md5_graded' = m AND x->>'verdict_norm' IN ('FAIL','FAIL ON FORM')) THEN ok := false; EXIT; END IF;
      IF EXISTS (SELECT 1 FROM jsonb_array_elements(coalesce(NEW.grades,'[]'::jsonb)) x
                 WHERE x->>'md5_graded' = m AND x->>'verdict_norm' = 'PASS' AND x->'equal_to' IS NULL) THEN CONTINUE; END IF;
      IF EXISTS (SELECT 1 FROM jsonb_array_elements(coalesce(NEW.grades,'[]'::jsonb)) x
                 WHERE x->>'md5_graded' = m AND x->>'verdict_norm' = 'PASS' AND x->'equal_to' IS NOT NULL
                   AND EXISTS (SELECT 1 FROM jsonb_array_elements(NEW.grades) y
                               WHERE y->>'md5_graded' = x->'equal_to'->>'md5' AND y->>'verdict_norm' = 'PASS')
                   AND NOT EXISTS (SELECT 1 FROM jsonb_array_elements(NEW.grades) y
                               WHERE y->>'md5_graded' = x->'equal_to'->>'md5' AND y->>'verdict_norm' IN ('FAIL','FAIL ON FORM'))) THEN CONTINUE; END IF;
      ok := false; EXIT;
    END LOOP;
    NEW.md5_match := ok;
  END IF;
  RETURN NEW;
END $f$;

CREATE FUNCTION public.ask_aar_snapshots_after_insert() RETURNS trigger LANGUAGE plpgsql AS $f$
BEGIN
  INSERT INTO audit_log(session_title, engine, notes)
  VALUES ('ASK AAR snapshot: ASK ' || NEW.ask || ' rev ' || NEW.rev, NEW.written_by,
          'id=' || NEW.id || ' | status=' || NEW.status || ' | md5_match=' || coalesce(NEW.md5_match::text,'null'));
  RETURN NULL;
END $f$;

CREATE FUNCTION public.ask_aar_snapshots_no_change() RETURNS trigger LANGUAGE plpgsql AS $f$
BEGIN
  RAISE EXCEPTION 'ask_aar_snapshots: rows are never edited or deleted; insert a new row with prior_row';
END $f$;

REVOKE ALL ON FUNCTION public.ask_aar_snapshots_before_insert() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ask_aar_snapshots_after_insert() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ask_aar_snapshots_no_change() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER ask_aar_snapshots_bi BEFORE INSERT ON public.ask_aar_snapshots FOR EACH ROW EXECUTE FUNCTION public.ask_aar_snapshots_before_insert();
CREATE TRIGGER ask_aar_snapshots_ai AFTER INSERT ON public.ask_aar_snapshots FOR EACH ROW EXECUTE FUNCTION public.ask_aar_snapshots_after_insert();
CREATE TRIGGER ask_aar_snapshots_nochange BEFORE UPDATE OR DELETE ON public.ask_aar_snapshots FOR EACH ROW EXECUTE FUNCTION public.ask_aar_snapshots_no_change();
CREATE TRIGGER ask_aar_snapshots_notruncate BEFORE TRUNCATE ON public.ask_aar_snapshots FOR EACH STATEMENT EXECUTE FUNCTION public.ask_aar_snapshots_no_change();

INSERT INTO audit_log(session_title, engine, notes)
VALUES ('ASK 493: ask_aar_snapshots table created (insert-only, seat 36 only, audit on insert)', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE')
 || ' | table, RLS no policy, SELECT to service_role and lab_seat only, triggers bi/ai/nochange/notruncate');

DO $c$ BEGIN
  IF to_regclass('public.ask_aar_snapshots') IS NULL THEN RAISE EXCEPTION 'ASK 493 step: table missing'; END IF;
  IF has_table_privilege('anon','public.ask_aar_snapshots','insert') OR has_table_privilege('anon','public.ask_aar_snapshots','select')
     OR has_table_privilege('authenticated','public.ask_aar_snapshots','insert') OR has_table_privilege('authenticated','public.ask_aar_snapshots','select')
     OR has_table_privilege('berean_ro','public.ask_aar_snapshots','select') THEN
    RAISE EXCEPTION 'ASK 493 step: anon, authenticated or berean_ro has access'; END IF;
  IF (SELECT count(*) FROM pg_trigger WHERE tgrelid='public.ask_aar_snapshots'::regclass AND NOT tgisinternal) <> 4 THEN RAISE EXCEPTION 'ASK 493 step: trigger count is not 4'; END IF;
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid='public.ask_aar_snapshots'::regclass) THEN RAISE EXCEPTION 'ASK 493 step: RLS off'; END IF;
END $c$;
-- ===== tests (all rolled back at the end) =====
CREATE TEMP TABLE t493(k text, v text) ON COMMIT DROP;
CREATE FUNCTION pg_temp.t493_ins(p_sid text, p_md5 text[], p_grades jsonb, p_sources jsonb) RETURNS bigint LANGUAGE plpgsql AS $t$
DECLARE v bigint;
BEGIN
  PERFORM set_config('truth.session_id', p_sid, true);
  INSERT INTO public.ask_aar_snapshots(ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, grades, md5_written, status, sources)
  VALUES (999, 'rev T', 'test row', 'test', 'not yet', 'test', 'test', p_sid, p_grades, p_md5, 'written', p_sources) RETURNING id INTO v;
  RETURN v;
END $t$;
DO $t$ DECLARE c text := 'session_01H1X3APzb2DidJoZ9Avizjn'; s34 text := 'session_01H1X3ANxr57MZvsu7fHB9kh'; id1 bigint; a0 bigint; a1 bigint; r text; mm boolean;
  gp jsonb := '[{"seat":"W1","verdict":"PASS","verdict_norm":"PASS","md5_graded":"aaa","wall_id":1}]';
BEGIN
  -- T1
  SELECT max(id) INTO a0 FROM audit_log;
  id1 := pg_temp.t493_ins(c, ARRAY['aaa'], gp, '[1]');
  SELECT count(*) INTO a1 FROM audit_log WHERE id > a0 AND session_title = 'ASK AAR snapshot: ASK 999 rev rev T';
  SELECT md5_match INTO mm FROM public.ask_aar_snapshots WHERE id = id1;
  INSERT INTO t493 VALUES ('T1 accepted, audit rows, md5_match', 'id ' || id1 || ', audit ' || a1 || ', ' || coalesce(mm::text,'null'));
  -- T2
  BEGIN PERFORM set_config('truth.session_id', '', true);
    INSERT INTO public.ask_aar_snapshots(ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, status, sources)
    VALUES (999,'rev T','t','t','not yet','t','t','x','written','[1]'); r := 'ACCEPTED (bad)';
  EXCEPTION WHEN OTHERS THEN r := 'refused: ' || left(SQLERRM, 60); END;
  INSERT INTO t493 VALUES ('T2 no session', r);
  -- T3
  PERFORM set_config('truth.session_id', c, true);
  BEGIN UPDATE public.ask_aar_snapshots SET title = 'x' WHERE id = id1; r := 'ACCEPTED (bad)'; EXCEPTION WHEN OTHERS THEN r := 'refused: ' || left(SQLERRM, 50); END;
  INSERT INTO t493 VALUES ('T3 update', r);
  BEGIN DELETE FROM public.ask_aar_snapshots WHERE id = id1; r := 'ACCEPTED (bad)'; EXCEPTION WHEN OTHERS THEN r := 'refused: ' || left(SQLERRM, 50); END;
  INSERT INTO t493 VALUES ('T3 delete', r);
  BEGIN TRUNCATE public.ask_aar_snapshots; r := 'ACCEPTED (bad)'; EXCEPTION WHEN OTHERS THEN r := 'refused: ' || left(SQLERRM, 50); END;
  INSERT INTO t493 VALUES ('T3 truncate', r);
  -- T4
  BEGIN PERFORM set_config('role', 'anon', true);
    INSERT INTO public.ask_aar_snapshots(ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, status, sources)
    VALUES (999,'rev T','t','t','not yet','t','t',c,'written','[1]'); r := 'ACCEPTED (bad)';
  EXCEPTION WHEN OTHERS THEN r := SQLSTATE || ' ' || left(SQLERRM, 50); END;
  PERFORM set_config('role', 'none', true); INSERT INTO t493 VALUES ('T4 anon insert', r);
  BEGIN PERFORM set_config('role', 'anon', true); PERFORM count(*) FROM public.ask_aar_snapshots; r := 'ACCEPTED (bad)';
  EXCEPTION WHEN OTHERS THEN r := SQLSTATE || ' ' || left(SQLERRM, 50); END;
  PERFORM set_config('role', 'none', true); INSERT INTO t493 VALUES ('T4 anon select', r);
  BEGIN PERFORM set_config('role', 'authenticated', true);
    INSERT INTO public.ask_aar_snapshots(ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, status, sources)
    VALUES (999,'rev T','t','t','not yet','t','t',c,'written','[1]'); r := 'ACCEPTED (bad)';
  EXCEPTION WHEN OTHERS THEN r := SQLSTATE || ' ' || left(SQLERRM, 50); END;
  PERFORM set_config('role', 'none', true); INSERT INTO t493 VALUES ('T4 authenticated insert', r);
  BEGIN PERFORM set_config('role', 'authenticated', true); PERFORM count(*) FROM public.ask_aar_snapshots; r := 'ACCEPTED (bad)';
  EXCEPTION WHEN OTHERS THEN r := SQLSTATE || ' ' || left(SQLERRM, 50); END;
  PERFORM set_config('role', 'none', true); INSERT INTO t493 VALUES ('T4 authenticated select', r);
  -- T5, T5a, T5b
  id1 := pg_temp.t493_ins(c, ARRAY['bbb'], gp, '[1]');
  INSERT INTO t493 SELECT 'T5 written md5 not graded', coalesce(md5_match::text,'null') FROM public.ask_aar_snapshots WHERE id = id1;
  id1 := pg_temp.t493_ins(c, ARRAY['aaa'], '[{"seat":"W1","verdict":"PASS WITH C-1","verdict_norm":"PASS","md5_graded":"aaa","wall_id":1}]', '[1]');
  INSERT INTO t493 SELECT 'T5a PASS WITH C-1', coalesce(md5_match::text,'null') FROM public.ask_aar_snapshots WHERE id = id1;
  id1 := pg_temp.t493_ins(c, ARRAY['aaa'], '[{"seat":"W1","verdict":"PASS WITH C-1","verdict_norm":"PASS","md5_graded":"aaa","wall_id":1},{"seat":"W2","verdict":"FAIL ON FORM","verdict_norm":"FAIL ON FORM","md5_graded":"aaa","wall_id":2}]', '[1]');
  INSERT INTO t493 SELECT 'T5b plus FAIL ON FORM', coalesce(md5_match::text,'null') FROM public.ask_aar_snapshots WHERE id = id1;
  id1 := pg_temp.t493_ins(c, ARRAY['f1','f2'], '[{"seat":"W1","verdict":"PASS","verdict_norm":"PASS","md5_graded":"f1","wall_id":1},{"seat":"W1","verdict":"PASS","verdict_norm":"PASS","md5_graded":"f2","wall_id":1}]', '[1]');
  INSERT INTO t493 SELECT 'T5a2 one grade over two files (one element per file md5)', coalesce(md5_match::text,'null') FROM public.ask_aar_snapshots WHERE id = id1;
  id1 := pg_temp.t493_ins(c, ARRAY['f1','f2'], '[{"seat":"W1","verdict":"PASS","verdict_norm":"PASS","md5_graded":"f1","wall_id":1}]', '[1]');
  INSERT INTO t493 SELECT 'T5a3 two files written, only one graded', coalesce(md5_match::text,'null') FROM public.ask_aar_snapshots WHERE id = id1;
  -- T5c
  id1 := pg_temp.t493_ins(c, ARRAY['new'], '[{"seat":"W1","verdict":"PASS","verdict_norm":"PASS","md5_graded":"old","wall_id":1},{"seat":"W2","verdict":"PASS","verdict_norm":"PASS","md5_graded":"new","wall_id":2,"equal_to":{"md5":"old","wall_id":2}}]', '[1]');
  INSERT INTO t493 SELECT 'T5c equal_to with PASS', coalesce(md5_match::text,'null') FROM public.ask_aar_snapshots WHERE id = id1;
  id1 := pg_temp.t493_ins(c, ARRAY['new'], '[{"seat":"W2","verdict":"PASS","verdict_norm":"PASS","md5_graded":"new","wall_id":2,"equal_to":{"md5":"old","wall_id":2}}]', '[1]');
  INSERT INTO t493 SELECT 'T5c equal_to without PASS', coalesce(md5_match::text,'null') FROM public.ask_aar_snapshots WHERE id = id1;
  id1 := pg_temp.t493_ins(c, ARRAY['new'], '[{"seat":"W1","verdict":"PASS","verdict_norm":"PASS","md5_graded":"old","wall_id":1},{"seat":"W3","verdict":"FAIL","verdict_norm":"FAIL","md5_graded":"old","wall_id":3},{"seat":"W2","verdict":"PASS","verdict_norm":"PASS","md5_graded":"new","wall_id":2,"equal_to":{"md5":"old","wall_id":2}}]', '[1]');
  INSERT INTO t493 SELECT 'T5c equal_to target also FAIL', coalesce(md5_match::text,'null') FROM public.ask_aar_snapshots WHERE id = id1;
  -- T6
  BEGIN id1 := pg_temp.t493_ins(c, ARRAY['aaa'], gp, '[]'); r := 'ACCEPTED (bad)'; EXCEPTION WHEN OTHERS THEN r := 'refused: ' || left(SQLERRM, 50); END;
  INSERT INTO t493 VALUES ('T6 empty sources', r);
  -- T7
  BEGIN id1 := pg_temp.t493_ins(s34, ARRAY['aaa'], gp, '[1]'); r := 'ACCEPTED (bad)'; EXCEPTION WHEN OTHERS THEN r := 'refused: ' || left(SQLERRM, 60); END;
  INSERT INTO t493 VALUES ('T7 seat 34 session', r);
  BEGIN PERFORM set_config('truth.session_id', c, true);
    INSERT INTO public.ask_aar_snapshots(ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, status, sources)
    VALUES (999,'rev T','t','t','not yet','t','t',s34,'written','[1]'); r := 'ACCEPTED (bad)';
  EXCEPTION WHEN OTHERS THEN r := 'refused: ' || left(SQLERRM, 60); END;
  INSERT INTO t493 VALUES ('T7b written_by not the session', r);
  -- T8
  BEGIN id1 := pg_temp.t493_ins(c, ARRAY['aaa'], '[{"seat":"W1","verdict":"PASS","md5_graded":"aaa","wall_id":1}]', '[1]'); r := 'ACCEPTED (bad)'; EXCEPTION WHEN OTHERS THEN r := 'refused: ' || left(SQLERRM, 60); END;
  INSERT INTO t493 VALUES ('T8 no verdict_norm', r);
END $t$;
-- R1: revert needs an empty table, so the test rows are removed first with the no-change trigger disabled (inside this rolled-back test only)
ALTER TABLE public.ask_aar_snapshots DISABLE TRIGGER ask_aar_snapshots_nochange;
DELETE FROM public.ask_aar_snapshots;
ALTER TABLE public.ask_aar_snapshots ENABLE TRIGGER ask_aar_snapshots_nochange;
SELECT set_config('truth.session_id', 'session_01H1X3AP1fjeQaEbxPP9UEZH', true);
DO $p$ BEGIN
  IF EXISTS (SELECT 1 FROM public.ask_aar_snapshots) THEN RAISE EXCEPTION 'ASK 493 revert: the table holds rows; do not drop it'; END IF;
END $p$;
DROP TABLE public.ask_aar_snapshots;
DROP FUNCTION public.ask_aar_snapshots_before_insert();
DROP FUNCTION public.ask_aar_snapshots_after_insert();
DROP FUNCTION public.ask_aar_snapshots_no_change();
INSERT INTO audit_log(session_title, engine, notes)
VALUES ('ASK 493 revert: ask_aar_snapshots dropped (empty)', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE'));
DO $c$ BEGIN
  IF to_regclass('public.ask_aar_snapshots') IS NOT NULL THEN RAISE EXCEPTION 'ASK 493 revert: table still present'; END IF;
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname LIKE 'ask_aar_snapshots%') THEN RAISE EXCEPTION 'ASK 493 revert: a function is still present'; END IF;
END $c$;
DO $t$ DECLARE s text; BEGIN
  INSERT INTO t493 VALUES ('R1 table and functions gone', (to_regclass('public.ask_aar_snapshots') IS NULL AND NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname LIKE 'ask_aar_snapshots%'))::text);
  SELECT string_agg(k || ' = ' || v, E'\n' ORDER BY k) INTO s FROM t493;
  RAISE EXCEPTION E'ROLLBACK TEST 493 (nothing kept):\n%', s;
END $t$;
