SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
SET LOCAL truth.card='TEST 497 rolled back';
CREATE FUNCTION public.ask_aar_snapshots_check()
RETURNS TABLE(check_code text, row_id bigint, row_md5 text, detail text)
LANGUAGE plpgsql STABLE SECURITY INVOKER
SET "TimeZone" TO 'UTC' SET "DateStyle" TO 'ISO, MDY'
AS $f$
#variable_conflict use_column
DECLARE
  re text := '\m(ask_aar_snapshots|ask_aar_snapshots_id_seq|ask_aar_snapshots_(bi|ai|nochange|notruncate)|ask_aar_snapshots_(before_insert|after_insert|no_change))\M';
  b493 bigint; b497 bigint; s497 bigint; t text; e text;
BEGIN
  IF to_regclass('public.ask_aar_snapshots') IS NULL THEN
    RETURN QUERY SELECT 'b'::text, NULL::bigint, NULL::text, 'table public.ask_aar_snapshots is missing'::text;
  ELSE
    RETURN QUERY SELECT 'd'::text, s.id, md5(s::text), 'row: compare with the coordinator line'::text
      FROM public.ask_aar_snapshots s ORDER BY s.id;
    RETURN QUERY SELECT 'a'::text, s.id, md5(s::text), ('written_by is not a session registered to seat 36: ' || s.written_by)::text
      FROM public.ask_aar_snapshots s
      WHERE NOT EXISTS (SELECT 1 FROM public.seat_addresses a WHERE a.seat_id = 36 AND a.session_id = s.written_by)
      ORDER BY s.id;
    FOREACH t IN ARRAY ARRAY['ask_aar_snapshots_bi','ask_aar_snapshots_ai','ask_aar_snapshots_nochange','ask_aar_snapshots_notruncate'] LOOP
      SELECT tg.tgenabled::text INTO e FROM pg_trigger tg
       WHERE tg.tgrelid = to_regclass('public.ask_aar_snapshots') AND tg.tgname = t AND NOT tg.tgisinternal;
      IF e IS NULL THEN
        RETURN QUERY SELECT 'b'::text, NULL::bigint, NULL::text, ('trigger ' || t || ' is missing')::text;
      ELSIF e <> 'O' THEN
        RETURN QUERY SELECT 'b'::text, NULL::bigint, NULL::text, ('trigger ' || t || ' has tgenabled ' || e)::text;
      END IF;
    END LOOP;
  END IF;
  SELECT max(l.id) INTO b493 FROM public.audit_log l
   WHERE l.session_title = 'ASK 493: ask_aar_snapshots table created (insert-only, seat 36 only, audit on insert)';
  IF b493 IS NULL THEN
    RETURN QUERY SELECT 'c'::text, NULL::bigint, NULL::text, 'the ASK 493 build audit row is missing'::text;
    b493 := 0;
  END IF;
  SELECT max(l.id) INTO b497 FROM public.audit_log l
   WHERE l.session_title = 'ASK 497: ask_aar_snapshots_check created (read-only check)';
  IF b497 IS NOT NULL THEN
    SELECT min(l.id) INTO s497 FROM public.audit_log l
     WHERE l.created_at = (SELECT l2.created_at FROM public.audit_log l2 WHERE l2.id = b497);
  END IF;
  RETURN QUERY SELECT 'c'::text, l.id::bigint, NULL::text, (l.engine || ': ' || l.session_title || ' at ' || l.created_at::text)::text
    FROM public.audit_log l
    WHERE l.id > b493
      AND NOT (b497 IS NOT NULL AND l.id BETWEEN s497 AND b497)
      AND ((l.engine IN ('ddl_event_trigger','drop_event_trigger') AND l.session_title ~ re)
        OR (l.engine = 'event-trigger priv_change_audit' AND l.notes ~ re))
    ORDER BY l.id;
  FOREACH t IN ARRAY ARRAY['ddl_audit_trigger','drop_audit_trigger','priv_audit_trigger'] LOOP
    SELECT et.evtenabled::text INTO e FROM pg_event_trigger et WHERE et.evtname = t;
    IF e IS NULL THEN
      RETURN QUERY SELECT 'e'::text, NULL::bigint, NULL::text, ('event trigger ' || t || ' is missing')::text;
    ELSIF e <> 'O' THEN
      RETURN QUERY SELECT 'e'::text, NULL::bigint, NULL::text, ('event trigger ' || t || ' has evtenabled ' || e)::text;
    END IF;
  END LOOP;
END $f$;
REVOKE ALL ON FUNCTION public.ask_aar_snapshots_check() FROM PUBLIC, anon, authenticated;

INSERT INTO audit_log(session_title, engine, notes)
VALUES ('ASK 497: ask_aar_snapshots_check created (read-only check)', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE')
 || ' | function ask_aar_snapshots_check(), SECURITY INVOKER, STABLE, TimeZone UTC, no EXECUTE for PUBLIC, anon, authenticated');

DO $c$ BEGIN
  IF to_regprocedure('public.ask_aar_snapshots_check()') IS NULL THEN RAISE EXCEPTION 'ASK 497 step: function missing'; END IF;
  IF has_function_privilege('anon','public.ask_aar_snapshots_check()','execute') OR has_function_privilege('authenticated','public.ask_aar_snapshots_check()','execute') THEN
    RAISE EXCEPTION 'ASK 497 step: anon or authenticated can execute'; END IF;
  IF (SELECT prosecdef OR provolatile <> 's' FROM pg_proc WHERE oid = 'public.ask_aar_snapshots_check()'::regprocedure) THEN
    RAISE EXCEPTION 'ASK 497 step: not SECURITY INVOKER and STABLE'; END IF;
  IF EXISTS (SELECT 1 FROM public.ask_aar_snapshots_check() WHERE check_code <> 'd') THEN
    RAISE EXCEPTION 'ASK 497 step: the check returns a finding at build time'; END IF;
END $c$;
-- ===== tests (all rolled back at the end) =====
CREATE TEMP TABLE t497(k text, v text) ON COMMIT DROP;
DO $t$ DECLARE c text := 'session_01H1X3APzb2DidJoZ9Avizjn'; s34 text := 'session_01H1X3ANxr57MZvsu7fHB9kh';
  id1 bigint; id2 bigint; m1 text; m2 text; m3 text; n int; r text;
BEGIN
  -- T1 clean table, after the function exists (W1 C1): no findings
  SELECT count(*) INTO n FROM public.ask_aar_snapshots_check() WHERE check_code <> 'd';
  INSERT INTO t497 VALUES ('T1 clean: findings', n::text || coalesce(' | ' || (SELECT string_agg(check_code || ' ' || detail, '; ') FROM public.ask_aar_snapshots_check() WHERE check_code <> 'd'), ''));
  -- T5 anon calls the function
  BEGIN PERFORM set_config('role', 'anon', true); PERFORM count(*) FROM public.ask_aar_snapshots_check(); r := 'ACCEPTED (bad)';
  EXCEPTION WHEN OTHERS THEN r := SQLSTATE || ' ' || left(SQLERRM, 60); END;
  PERFORM set_config('role', 'none', true); INSERT INTO t497 VALUES ('T5 anon call', r);
  -- T8 a valid coordinator row; md5 the same under session TimeZone UTC and America/Chicago
  PERFORM set_config('truth.session_id', c, true);
  INSERT INTO public.ask_aar_snapshots(ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, status, sources)
  VALUES (999, 'rev T', 'test row', 'test', 'not yet', 'test', 'test', c, 'written', '[1]') RETURNING id INTO id1;
  PERFORM set_config('TimeZone', 'America/Chicago', true);
  SELECT row_md5 INTO m1 FROM public.ask_aar_snapshots_check() WHERE check_code = 'd' AND row_id = id1;
  SELECT md5(s::text) INTO m3 FROM public.ask_aar_snapshots s WHERE s.id = id1;
  PERFORM set_config('TimeZone', 'UTC', true);
  SELECT row_md5 INTO m2 FROM public.ask_aar_snapshots_check() WHERE check_code = 'd' AND row_id = id1;
  INSERT INTO t497 VALUES ('T8 md5 Chicago = md5 UTC (function)', (m1 = m2)::text || ' | direct md5 under Chicago differs: ' || (m3 <> m2)::text);
  SELECT count(*) INTO n FROM public.ask_aar_snapshots_check() WHERE check_code <> 'd';
  INSERT INTO t497 VALUES ('T1b findings after a valid coordinator row', n::text);
  -- T4 a COMMENT on the table: finding (c)
  COMMENT ON TABLE public.ask_aar_snapshots IS 'T4 test';
  SELECT string_agg(detail, '; ') INTO r FROM public.ask_aar_snapshots_check() WHERE check_code = 'c';
  INSERT INTO t497 VALUES ('T4 comment: finding c', coalesce(r, 'NONE (bad)'));
  -- T3 one trigger disabled: finding (b)
  ALTER TABLE public.ask_aar_snapshots DISABLE TRIGGER ask_aar_snapshots_notruncate;
  SELECT string_agg(detail, '; ') INTO r FROM public.ask_aar_snapshots_check() WHERE check_code = 'b';
  INSERT INTO t497 VALUES ('T3 trigger disabled: finding b', coalesce(r, 'NONE (bad)'));
  ALTER TABLE public.ask_aar_snapshots ENABLE TRIGGER ask_aar_snapshots_notruncate;
  SELECT count(*) INTO n FROM public.ask_aar_snapshots_check() WHERE check_code = 'b';
  INSERT INTO t497 VALUES ('T3b re-enabled: b findings', n::text);
  -- T6 a row edited with triggers disabled: new md5
  ALTER TABLE public.ask_aar_snapshots DISABLE TRIGGER ask_aar_snapshots_nochange;
  UPDATE public.ask_aar_snapshots SET title = 'edited' WHERE id = id1;
  ALTER TABLE public.ask_aar_snapshots ENABLE TRIGGER ask_aar_snapshots_nochange;
  SELECT row_md5 INTO m3 FROM public.ask_aar_snapshots_check() WHERE check_code = 'd' AND row_id = id1;
  INSERT INTO t497 VALUES ('T6 edited row md5 differs', (m3 <> m2)::text);
  -- T2 a row with a seat-34 session as written_by, insert trigger disabled: finding (a)
  ALTER TABLE public.ask_aar_snapshots DISABLE TRIGGER ask_aar_snapshots_bi;
  INSERT INTO public.ask_aar_snapshots(ask, rev, title, objective, objective_met, objective_met_reason, objective_source, written_by, status, sources)
  VALUES (999, 'rev T', 'poser row', 'test', 'not yet', 'test', 'test', s34, 'written', '[1]') RETURNING id INTO id2;
  ALTER TABLE public.ask_aar_snapshots ENABLE TRIGGER ask_aar_snapshots_bi;
  SELECT string_agg(row_id::text || ' ' || detail, '; ') INTO r FROM public.ask_aar_snapshots_check() WHERE check_code = 'a';
  INSERT INTO t497 VALUES ('T2 seat-34 row id ' || id2 || ': finding a', coalesce(r, 'NONE (bad)'));
  -- T7 an audit event trigger disabled: finding (e), or postgres cannot disable it
  BEGIN
    ALTER EVENT TRIGGER priv_audit_trigger DISABLE;
    SELECT string_agg(detail, '; ') INTO r FROM public.ask_aar_snapshots_check() WHERE check_code = 'e';
    r := 'disabled; finding e: ' || coalesce(r, 'NONE (bad)');
    ALTER EVENT TRIGGER priv_audit_trigger ENABLE;
  EXCEPTION WHEN OTHERS THEN r := 'postgres cannot disable it: ' || SQLSTATE || ' ' || left(SQLERRM, 60); END;
  INSERT INTO t497 VALUES ('T7 event trigger disabled', r);
END $t$;
-- R1 the revert
SELECT set_config('truth.session_id', 'session_01H1X3AP1fjeQaEbxPP9UEZH', true);
DROP FUNCTION public.ask_aar_snapshots_check();
INSERT INTO audit_log(session_title, engine, notes)
VALUES ('ASK 497 revert: ask_aar_snapshots_check dropped', 'W4_2026_11_06',
 'card=' || coalesce(current_setting('truth.card', true),'NONE') || ' | session=' || coalesce(current_setting('truth.session_id', true),'NONE'));
DO $c$ BEGIN
  IF to_regprocedure('public.ask_aar_snapshots_check()') IS NOT NULL THEN RAISE EXCEPTION 'ASK 497 revert: function still present'; END IF;
END $c$;
DO $t$ DECLARE s text; BEGIN
  INSERT INTO t497 VALUES ('R1 function gone', (to_regprocedure('public.ask_aar_snapshots_check()') IS NULL)::text);
  SELECT string_agg(k || ' = ' || v, E'\n' ORDER BY k) INTO s FROM t497;
  RAISE EXCEPTION E'ROLLBACK TEST 497 (nothing kept):\n%', s;
END $t$;
