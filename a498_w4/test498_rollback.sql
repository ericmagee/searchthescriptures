SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
SET LOCAL truth.card='TEST 498 rolled back';
CREATE TABLE public.ask_aar_builders (
  id bigserial PRIMARY KEY,
  snapshot_id bigint NOT NULL,
  prior_row bigint REFERENCES public.ask_aar_builders(id),
  builder_seats text[] NOT NULL CHECK (cardinality(builder_seats) >= 1),
  sources jsonb NOT NULL CHECK (jsonb_typeof(sources) = 'array' AND jsonb_array_length(sources) >= 1),
  written_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ask_aar_builders ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.ask_aar_builders FROM PUBLIC, anon, authenticated, berean_ro, service_role, lab_seat;
REVOKE ALL ON SEQUENCE public.ask_aar_builders_id_seq FROM PUBLIC, anon, authenticated, berean_ro, service_role, lab_seat;
GRANT SELECT ON TABLE public.ask_aar_builders TO service_role, lab_seat;

CREATE FUNCTION public.ask_aar_builders_before_insert() RETURNS trigger LANGUAGE plpgsql AS $f$
DECLARE v_sid text := nullif(current_setting('truth.session_id', true), ''); v_prior bigint;
BEGIN
  IF v_sid IS NULL THEN RAISE EXCEPTION 'ask_aar_builders: truth.session_id is not set'; END IF;
  IF md_notes_caller_seat() IS DISTINCT FROM 36 THEN RAISE EXCEPTION 'ask_aar_builders: only the coordinator seat (36) inserts rows'; END IF;
  IF NEW.written_by IS DISTINCT FROM v_sid THEN RAISE EXCEPTION 'ask_aar_builders: written_by must equal truth.session_id'; END IF;
  IF NEW.prior_row IS NOT NULL THEN
    SELECT p.snapshot_id INTO v_prior FROM public.ask_aar_builders p WHERE p.id = NEW.prior_row;
    IF v_prior IS DISTINCT FROM NEW.snapshot_id THEN RAISE EXCEPTION 'ask_aar_builders: prior_row must name a row for the same snapshot_id'; END IF;
  END IF;
  RETURN NEW;
END $f$;

CREATE FUNCTION public.ask_aar_builders_after_insert() RETURNS trigger LANGUAGE plpgsql AS $f$
BEGIN
  INSERT INTO audit_log(session_title, engine, notes)
  VALUES ('ASK AAR builders: snapshot ' || NEW.snapshot_id, NEW.written_by,
          'id=' || NEW.id || ' | builder_seats=' || array_to_string(NEW.builder_seats, ',') || ' | prior_row=' || coalesce(NEW.prior_row::text, 'null'));
  RETURN NULL;
END $f$;

CREATE FUNCTION public.ask_aar_builders_no_change() RETURNS trigger LANGUAGE plpgsql AS $f$
BEGIN
  RAISE EXCEPTION 'ask_aar_builders: rows are never edited or deleted; insert a new row with prior_row';
END $f$;

CREATE TRIGGER ask_aar_builders_bi BEFORE INSERT ON public.ask_aar_builders FOR EACH ROW EXECUTE FUNCTION public.ask_aar_builders_before_insert();
CREATE TRIGGER ask_aar_builders_ai AFTER INSERT ON public.ask_aar_builders FOR EACH ROW EXECUTE FUNCTION public.ask_aar_builders_after_insert();
CREATE TRIGGER ask_aar_builders_nochange BEFORE UPDATE OR DELETE ON public.ask_aar_builders FOR EACH ROW EXECUTE FUNCTION public.ask_aar_builders_no_change();
CREATE TRIGGER ask_aar_builders_notruncate BEFORE TRUNCATE ON public.ask_aar_builders FOR EACH STATEMENT EXECUTE FUNCTION public.ask_aar_builders_no_change();

CREATE FUNCTION public.ask_aar_grades_check()
RETURNS TABLE(snapshot_id bigint, md5 text, pass_seats text[], proof_seats text[], n int, ok boolean, detail text)
LANGUAGE plpgsql STABLE SECURITY INVOKER
SET "TimeZone" TO 'UTC' SET "DateStyle" TO 'ISO, MDY'
AS $f$
#variable_conflict use_column
DECLARE
  v_snap text := 'public.' || quote_ident('ask_aar_' || 'snapshots');
  s record; m text; t text; e text; bs text[]; g jsonb;
  direct text[]; via text[]; proofs text[]; allp text[]; bad boolean; targets text[];
BEGIN
  IF to_regclass('public.ask_aar_builders') IS NULL THEN
    RETURN QUERY SELECT NULL::bigint, NULL::text, NULL::text[], NULL::text[], NULL::int, false, 'finding: table ask_aar_builders is missing'::text;
    RETURN;
  END IF;
  FOREACH t IN ARRAY ARRAY['ask_aar_builders_bi','ask_aar_builders_ai','ask_aar_builders_nochange','ask_aar_builders_notruncate'] LOOP
    SELECT tg.tgenabled::text INTO e FROM pg_trigger tg
     WHERE tg.tgrelid = to_regclass('public.ask_aar_builders') AND tg.tgname = t AND NOT tg.tgisinternal;
    IF e IS NULL THEN
      RETURN QUERY SELECT NULL::bigint, NULL::text, NULL::text[], NULL::text[], NULL::int, false, ('finding: trigger ' || t || ' is missing')::text;
    ELSIF e <> 'O' THEN
      RETURN QUERY SELECT NULL::bigint, NULL::text, NULL::text[], NULL::text[], NULL::int, false, ('finding: trigger ' || t || ' has tgenabled ' || e)::text;
    END IF;
  END LOOP;
  RETURN QUERY EXECUTE format(
    'SELECT b.snapshot_id::bigint, NULL::text, NULL::text[], NULL::text[], NULL::int, false, (''finding: builder row '' || b.id || '' names snapshot_id '' || b.snapshot_id || '', which has no snapshot row'')::text
       FROM public.ask_aar_builders b WHERE NOT EXISTS (SELECT 1 FROM %s x WHERE x.id = b.snapshot_id) ORDER BY b.id', v_snap);
  FOR s IN EXECUTE format('SELECT x.id::bigint AS id, x.md5_written, coalesce(x.grades, ''[]''::jsonb) AS grades FROM %s x ORDER BY x.id', v_snap) LOOP
    SELECT b.builder_seats INTO bs FROM public.ask_aar_builders b WHERE b.snapshot_id = s.id ORDER BY b.id DESC LIMIT 1;
    IF s.md5_written IS NULL OR cardinality(s.md5_written) = 0 THEN
      RETURN QUERY SELECT s.id, NULL::text, NULL::text[], NULL::text[], NULL::int, NULL::boolean, 'no md5_written'::text;
      CONTINUE;
    END IF;
    FOREACH m IN ARRAY s.md5_written LOOP
      IF bs IS NULL THEN
        RETURN QUERY SELECT s.id, m, NULL::text[], NULL::text[], NULL::int, NULL::boolean, 'no builder row'::text;
        CONTINUE;
      END IF;
      SELECT coalesce(array_agg(DISTINCT x->>'seat'), '{}') INTO direct FROM jsonb_array_elements(s.grades) x
       WHERE x->>'md5_graded' = m AND x->>'verdict_norm' = 'PASS' AND x->'equal_to' IS NULL AND NOT ((x->>'seat') = ANY (bs));
      SELECT coalesce(array_agg(DISTINCT x->>'seat'), '{}'), coalesce(array_agg(DISTINCT x->'equal_to'->>'md5'), '{}') INTO proofs, targets FROM jsonb_array_elements(s.grades) x
       WHERE x->>'md5_graded' = m AND x->>'verdict_norm' = 'PASS' AND x->'equal_to' IS NOT NULL AND NOT ((x->>'seat') = ANY (bs));
      SELECT coalesce(array_agg(DISTINCT x->>'seat'), '{}') INTO via FROM jsonb_array_elements(s.grades) x
       WHERE (x->>'md5_graded') = ANY (targets) AND x->>'verdict_norm' = 'PASS' AND x->'equal_to' IS NULL AND NOT ((x->>'seat') = ANY (bs));
      SELECT coalesce(array_agg(DISTINCT y ORDER BY y), '{}') INTO allp FROM unnest(direct || via) y;
      SELECT EXISTS (SELECT 1 FROM jsonb_array_elements(s.grades) x
                      WHERE ((x->>'md5_graded') = m OR (x->>'md5_graded') = ANY (targets)) AND x->>'verdict_norm' IN ('FAIL','FAIL ON FORM')) INTO bad;
      RETURN QUERY SELECT s.id, m, allp, proofs, cardinality(allp),
        (cardinality(allp) >= 2 AND NOT bad AND (cardinality(via) = 0 OR cardinality(proofs) >= 1)),
        (CASE WHEN bad THEN 'a FAIL or FAIL ON FORM element on this md5 or its target' WHEN cardinality(allp) < 2 THEN 'fewer than two non-builder PASS seats' ELSE '' END
         || CASE WHEN cardinality(proofs) = 1 THEN ' | one-seat proof: ' || proofs[1] ELSE '' END)::text;
    END LOOP;
  END LOOP;
END $f$;

REVOKE ALL ON FUNCTION public.ask_aar_builders_before_insert() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ask_aar_builders_after_insert() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ask_aar_builders_no_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ask_aar_grades_check() FROM PUBLIC, anon, authenticated;

INSERT INTO audit_log(session_title, engine, notes)
VALUES ('ASK 498: ask_aar_builders and ask_aar_grades_check created', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE')
 || ' | table ask_aar_builders (RLS no policy, SELECT to service_role and lab_seat only, triggers bi/ai/nochange/notruncate); function ask_aar_grades_check() INVOKER STABLE UTC');

DO $c$ BEGIN
  IF to_regclass('public.ask_aar_builders') IS NULL THEN RAISE EXCEPTION 'ASK 498 step: table missing'; END IF;
  IF EXISTS (SELECT 1 FROM unnest(ARRAY['anon','authenticated','berean_ro']) r
             WHERE has_table_privilege(r,'public.ask_aar_builders','select') OR has_table_privilege(r,'public.ask_aar_builders','insert')) THEN
    RAISE EXCEPTION 'ASK 498 step: anon, authenticated or berean_ro has table access'; END IF;
  IF EXISTS (SELECT 1 FROM unnest(ARRAY['service_role','lab_seat']) r
             WHERE has_table_privilege(r,'public.ask_aar_builders','insert,update,delete,truncate')) THEN
    RAISE EXCEPTION 'ASK 498 step: service_role or lab_seat has more than SELECT'; END IF;
  IF EXISTS (SELECT 1 FROM unnest(ARRAY['anon','authenticated','berean_ro','service_role','lab_seat']) r
             WHERE has_sequence_privilege(r,'public.ask_aar_builders_id_seq','USAGE,SELECT,UPDATE')) THEN
    RAISE EXCEPTION 'ASK 498 step: a non-owner role has the id sequence'; END IF;
  IF (SELECT count(*) FROM pg_trigger WHERE tgrelid='public.ask_aar_builders'::regclass AND NOT tgisinternal) <> 4 THEN RAISE EXCEPTION 'ASK 498 step: trigger count is not 4'; END IF;
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid='public.ask_aar_builders'::regclass) THEN RAISE EXCEPTION 'ASK 498 step: RLS off'; END IF;
  IF has_function_privilege('anon','public.ask_aar_grades_check()','execute') OR has_function_privilege('authenticated','public.ask_aar_grades_check()','execute') THEN
    RAISE EXCEPTION 'ASK 498 step: anon or authenticated can execute the check'; END IF;
  IF (SELECT prosecdef OR provolatile <> 's' FROM pg_proc WHERE oid = 'public.ask_aar_grades_check()'::regprocedure) THEN
    RAISE EXCEPTION 'ASK 498 step: check not SECURITY INVOKER and STABLE'; END IF;
  IF EXISTS (SELECT 1 FROM public.ask_aar_grades_check() WHERE detail LIKE 'finding:%') THEN
    RAISE EXCEPTION 'ASK 498 step: the check returns a finding at build time'; END IF;
END $c$;
-- ===== tests (all rolled back at the end); the snapshot table is reached only by dynamic SQL =====
CREATE TEMP TABLE t498(k text, v text) ON COMMIT DROP;
CREATE FUNCTION pg_temp.snap_ins(p_sid text, p_md5 text[], p_grades jsonb) RETURNS bigint LANGUAGE plpgsql AS $t$
DECLARE v bigint;
BEGIN
  PERFORM set_config('truth.session_id', p_sid, true);
  EXECUTE format('INSERT INTO public.%I(ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, grades, md5_written, status, sources) VALUES (998, ''rev T'', ''test row'', ''test'', ''not yet'', ''test'', ''test'', $1, $2, $3, ''written'', ''[1]'') RETURNING id', 'ask_aar_' || 'snapshots')
    INTO v USING p_sid, p_grades, p_md5;
  RETURN v;
END $t$;
CREATE FUNCTION pg_temp.b_ins(p_sid text, p_snap bigint, p_seats text[], p_prior bigint) RETURNS bigint LANGUAGE plpgsql AS $t$
DECLARE v bigint;
BEGIN
  PERFORM set_config('truth.session_id', p_sid, true);
  INSERT INTO public.ask_aar_builders(snapshot_id, prior_row, builder_seats, sources, written_by)
  VALUES (p_snap, p_prior, p_seats, '[1]', p_sid) RETURNING id INTO v;
  RETURN v;
END $t$;
DO $t$ DECLARE c text := 'session_01H1X3APzb2DidJoZ9Avizjn'; s34 text := 'session_01H1X3ANxr57MZvsu7fHB9kh';
  v_snap text := 'public.' || quote_ident('ask_aar_' || 'snapshots');
  b1 bigint; b2 bigint; sx bigint; a0 bigint; a1 bigint; r text; h0 text; h1 text; maxid bigint;
BEGIN
  EXECUTE format('SELECT max(id), md5(string_agg(md5(x::text), '','' ORDER BY id)) FROM %s x', v_snap) INTO maxid, h0;
  -- T1
  SELECT max(id) INTO a0 FROM audit_log;
  b1 := pg_temp.b_ins(c, 12, ARRAY['W2'], NULL);
  SELECT count(*) INTO a1 FROM audit_log WHERE id > a0 AND session_title = 'ASK AAR builders: snapshot 12';
  INSERT INTO t498 VALUES ('T1 builder row accepted, audit rows', 'id ' || b1 || ', audit ' || a1);
  -- T2
  BEGIN PERFORM set_config('truth.session_id', '', true);
    INSERT INTO public.ask_aar_builders(snapshot_id, builder_seats, sources, written_by) VALUES (12, ARRAY['W2'], '[1]', 'x'); r := 'ACCEPTED (bad)';
  EXCEPTION WHEN OTHERS THEN r := 'refused: ' || left(SQLERRM, 60); END;
  INSERT INTO t498 VALUES ('T2 no session', r);
  BEGIN PERFORM pg_temp.b_ins(s34, 12, ARRAY['W2'], NULL); r := 'ACCEPTED (bad)';
  EXCEPTION WHEN OTHERS THEN r := 'refused: ' || left(SQLERRM, 60); END;
  INSERT INTO t498 VALUES ('T2 seat 34 session', r);
  -- T3
  PERFORM set_config('truth.session_id', c, true);
  BEGIN UPDATE public.ask_aar_builders SET builder_seats = ARRAY['W9'] WHERE id = b1; r := 'ACCEPTED (bad)'; EXCEPTION WHEN OTHERS THEN r := 'refused: ' || left(SQLERRM, 50); END;
  INSERT INTO t498 VALUES ('T3 update', r);
  BEGIN DELETE FROM public.ask_aar_builders WHERE id = b1; r := 'ACCEPTED (bad)'; EXCEPTION WHEN OTHERS THEN r := 'refused: ' || left(SQLERRM, 50); END;
  INSERT INTO t498 VALUES ('T3 delete', r);
  BEGIN TRUNCATE public.ask_aar_builders; r := 'ACCEPTED (bad)'; EXCEPTION WHEN OTHERS THEN r := 'refused: ' || left(SQLERRM, 50); END;
  INSERT INTO t498 VALUES ('T3 truncate', r);
  -- T4
  FOREACH r IN ARRAY ARRAY['anon','authenticated'] LOOP
    DECLARE q text; o text; BEGIN
      FOREACH q IN ARRAY ARRAY['insert','select','execute'] LOOP
        BEGIN
          PERFORM set_config('role', r, true);
          IF q = 'insert' THEN INSERT INTO public.ask_aar_builders(snapshot_id, builder_seats, sources, written_by) VALUES (12, ARRAY['W2'], '[1]', c);
          ELSIF q = 'select' THEN PERFORM count(*) FROM public.ask_aar_builders;
          ELSE PERFORM count(*) FROM public.ask_aar_grades_check(); END IF;
          o := 'ACCEPTED (bad)';
        EXCEPTION WHEN OTHERS THEN o := SQLSTATE || ' ' || left(SQLERRM, 50); END;
        PERFORM set_config('role', 'none', true);
        INSERT INTO t498 VALUES ('T4 ' || r || ' ' || q, o);
      END LOOP;
    END;
  END LOOP;
  -- T5 row 12 with builder {W2}
  SELECT string_agg(md5 || ' n ' || n || ' ok ' || coalesce(ok::text,'null') || ' pass ' || array_to_string(pass_seats, ','), '; ') INTO r FROM public.ask_aar_grades_check() WHERE snapshot_id = 12;
  INSERT INTO t498 VALUES ('T5 row 12 (expect n 1, ok false)', coalesce(r, 'NONE'));
  -- T5 two non-builder PASS seats
  sx := pg_temp.snap_ins(c, ARRAY['tt1'], '[{"seat":"W1","verdict":"PASS","verdict_norm":"PASS","md5_graded":"tt1","wall_id":1},{"seat":"W2","verdict":"PASS","verdict_norm":"PASS","md5_graded":"tt1","wall_id":2}]');
  PERFORM pg_temp.b_ins(c, sx, ARRAY['W4'], NULL);
  SELECT string_agg('n ' || n || ' ok ' || coalesce(ok::text,'null'), '; ') INTO r FROM public.ask_aar_grades_check() WHERE snapshot_id = sx;
  INSERT INTO t498 VALUES ('T5 two non-builder PASS (expect n 2, ok true)', coalesce(r, 'NONE'));
  sx := pg_temp.snap_ins(c, ARRAY['tt1'], '[{"seat":"W1","verdict":"PASS","verdict_norm":"PASS","md5_graded":"tt1","wall_id":1},{"seat":"W2","verdict":"PASS","verdict_norm":"PASS","md5_graded":"tt1","wall_id":2},{"seat":"W3","verdict":"FAIL","verdict_norm":"FAIL","md5_graded":"tt1","wall_id":3}]');
  PERFORM pg_temp.b_ins(c, sx, ARRAY['W4'], NULL);
  SELECT string_agg('n ' || n || ' ok ' || coalesce(ok::text,'null') || ' ' || detail, '; ') INTO r FROM public.ask_aar_grades_check() WHERE snapshot_id = sx;
  INSERT INTO t498 VALUES ('T5 plus a FAIL element (expect ok false)', coalesce(r, 'NONE'));
  -- T5 row 4 with builder {W4}
  PERFORM pg_temp.b_ins(c, 4, ARRAY['W4'], NULL);
  SELECT string_agg(md5 || ' n ' || n || ' ok ' || coalesce(ok::text,'null') || ' pass ' || array_to_string(pass_seats, ',') || ' proof ' || array_to_string(proof_seats, ','), '; ') INTO r FROM public.ask_aar_grades_check() WHERE snapshot_id = 4;
  INSERT INTO t498 VALUES ('T5 row 4 (expect proof W1, pass W1,W2)', coalesce(r, 'NONE'));
  -- T5a a seat with only an equal_to element
  sx := pg_temp.snap_ins(c, ARRAY['pp1'], '[{"seat":"W3","verdict":"equal","verdict_norm":"PASS","md5_graded":"pp1","wall_id":3,"equal_to":{"md5":"tg1","wall_id":3}},{"seat":"W1","verdict":"PASS","verdict_norm":"PASS","md5_graded":"tg1","wall_id":1},{"seat":"W2","verdict":"PASS","verdict_norm":"PASS","md5_graded":"tg1","wall_id":2}]');
  PERFORM pg_temp.b_ins(c, sx, ARRAY['W4'], NULL);
  SELECT string_agg('pass ' || array_to_string(pass_seats, ',') || ' proof ' || array_to_string(proof_seats, ',') || ' ok ' || coalesce(ok::text,'null'), '; ') INTO r FROM public.ask_aar_grades_check() WHERE snapshot_id = sx;
  INSERT INTO t498 VALUES ('T5a proof-only seat (expect W3 in proof, not in pass)', coalesce(r, 'NONE'));
  -- T5b a newer builder row for row 12
  b2 := pg_temp.b_ins(c, 12, ARRAY['W1'], b1);
  SELECT string_agg('n ' || n || ' ok ' || coalesce(ok::text,'null') || ' pass ' || array_to_string(pass_seats, ','), '; ') INTO r FROM public.ask_aar_grades_check() WHERE snapshot_id = 12;
  INSERT INTO t498 VALUES ('T5b newer builder row {W1} for row 12 (expect n 0)', coalesce(r, 'NONE'));
  BEGIN PERFORM pg_temp.b_ins(c, 4, ARRAY['W1'], b1); r := 'ACCEPTED (bad)'; EXCEPTION WHEN OTHERS THEN r := 'refused: ' || left(SQLERRM, 60); END;
  INSERT INTO t498 VALUES ('T5c prior_row of another snapshot', r);
  -- T9 orphan builder row
  PERFORM pg_temp.b_ins(c, 999999, ARRAY['W4'], NULL);
  SELECT string_agg(detail, '; ') INTO r FROM public.ask_aar_grades_check() WHERE detail LIKE 'finding: builder row%';
  INSERT INTO t498 VALUES ('T9 orphan builder row: finding', coalesce(r, 'NONE (bad)'));
  -- T8 one trigger disabled
  ALTER TABLE public.ask_aar_builders DISABLE TRIGGER ask_aar_builders_notruncate;
  SELECT string_agg(detail, '; ') INTO r FROM public.ask_aar_grades_check() WHERE detail LIKE 'finding: trigger%';
  INSERT INTO t498 VALUES ('T8 trigger disabled: finding', coalesce(r, 'NONE (bad)'));
  ALTER TABLE public.ask_aar_builders ENABLE TRIGGER ask_aar_builders_notruncate;
  -- T6 earlier snapshot rows unchanged
  EXECUTE format('SELECT md5(string_agg(md5(x::text), '','' ORDER BY id)) FROM %s x WHERE x.id <= $1', v_snap) INTO h1 USING maxid;
  INSERT INTO t498 VALUES ('T6 snapshot rows up to id ' || maxid || ' unchanged', (h0 = h1)::text);
  -- T7 the ASK 497 check, if live
  IF to_regprocedure('public.ask_aar_snapshots_check()') IS NULL THEN
    INSERT INTO t498 VALUES ('T7 ASK 497 check', 'not live; not run');
  ELSE
    EXECUTE 'SELECT string_agg(check_code || '' '' || detail, ''; '') FROM public.ask_aar_snapshots_check() WHERE check_code IN (''b'',''c'',''e'')' INTO r;
    INSERT INTO t498 VALUES ('T7 ASK 497 check b, c, e findings', coalesce(r, 'none'));
  END IF;
END $t$;
-- R1: revert needs an empty table, so the test rows are removed first with the no-change trigger disabled (inside this rolled-back test only)
ALTER TABLE public.ask_aar_builders DISABLE TRIGGER ask_aar_builders_nochange;
DELETE FROM public.ask_aar_builders;
ALTER TABLE public.ask_aar_builders ENABLE TRIGGER ask_aar_builders_nochange;
SELECT set_config('truth.session_id', 'session_01H1X3AP1fjeQaEbxPP9UEZH', true);
DO $p$ BEGIN
  IF EXISTS (SELECT 1 FROM public.ask_aar_builders) THEN RAISE EXCEPTION 'ASK 498 revert: the table holds rows; do not drop it'; END IF;
END $p$;
DROP FUNCTION public.ask_aar_grades_check();
DROP TABLE public.ask_aar_builders;
DROP FUNCTION public.ask_aar_builders_before_insert();
DROP FUNCTION public.ask_aar_builders_after_insert();
DROP FUNCTION public.ask_aar_builders_no_change();
INSERT INTO audit_log(session_title, engine, notes)
VALUES ('ASK 498 revert: ask_aar_builders and ask_aar_grades_check dropped (empty)', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE'));
DO $c$ BEGIN
  IF to_regclass('public.ask_aar_builders') IS NOT NULL THEN RAISE EXCEPTION 'ASK 498 revert: table still present'; END IF;
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname LIKE 'ask_aar_builders%' OR proname = 'ask_aar_grades_check') THEN RAISE EXCEPTION 'ASK 498 revert: a function is still present'; END IF;
END $c$;
DO $t$ DECLARE s text; BEGIN
  INSERT INTO t498 VALUES ('R1 table and functions gone', (to_regclass('public.ask_aar_builders') IS NULL AND NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname LIKE 'ask_aar_builders%' OR proname = 'ask_aar_grades_check'))::text);
  SELECT string_agg(k || ' = ' || v, E'\n' ORDER BY k) INTO s FROM t498;
  RAISE EXCEPTION E'ROLLBACK TEST 498 (nothing kept):\n%', s;
END $t$;
