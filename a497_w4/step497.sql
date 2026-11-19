-- ASK 497 step (W4, build of plan rev 4 18f99111; W1 F1 and N1 at 9915): read-only check ask_aar_snapshots_check(). Run only on a card pressed in W4's thread, in one call with SET LOCAL truth.session_id and truth.card.
CREATE FUNCTION public.ask_aar_snapshots_check()
RETURNS TABLE(check_code text, row_id bigint, row_md5 text, detail text)
LANGUAGE plpgsql STABLE SECURITY INVOKER
SET "TimeZone" TO 'UTC' SET "DateStyle" TO 'ISO, MDY'
AS $f$
#variable_conflict use_column
DECLARE
  re text := '\m(ask_aar_snapshots|ask_aar_snapshots_id_seq|ask_aar_snapshots_(bi|ai|nochange|notruncate)|ask_aar_snapshots_(before_insert|after_insert|no_change))\M';
  b493 bigint; b497 bigint; n497 bigint; s497 bigint; t text; e text;
BEGIN
  IF to_regclass('public.ask_aar_snapshots') IS NULL THEN
    RETURN QUERY SELECT 'b'::text, NULL::bigint, NULL::text, 'table public.ask_aar_snapshots is missing'::text;
  ELSE
    RETURN QUERY SELECT 'd'::text, s.id, md5(s::text), 'row: compare with the coordinator line'::text
      FROM public.ask_aar_snapshots s ORDER BY s.id;
    RETURN QUERY SELECT 'a'::text, s.id, md5(s::text), ('written_by is not a session registered to seat 36 at or before aar_at: ' || s.written_by)::text
      FROM public.ask_aar_snapshots s
      WHERE NOT EXISTS (SELECT 1 FROM public.seat_addresses a WHERE a.seat_id = 36 AND a.session_id = s.written_by AND a.first_seen <= s.aar_at)
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
  b493 := 38890;
  IF NOT EXISTS (SELECT 1 FROM public.audit_log l WHERE l.id = 38890
                 AND l.session_title = 'ASK 493: ask_aar_snapshots table created (insert-only, seat 36 only, audit on insert)') THEN
    RETURN QUERY SELECT 'c'::text, NULL::bigint, NULL::text, 'audit row 38890 is not the ASK 493 build row'::text;
  END IF;
  SELECT min(l.id), count(*) INTO b497, n497 FROM public.audit_log l
   WHERE l.session_title = 'ASK 497: ask_aar_snapshots_check created (read-only check)';
  IF n497 > 1 THEN
    RETURN QUERY SELECT 'c'::text, l.id::bigint, NULL::text, ('a second ASK 497 build row: ' || l.engine || ' at ' || l.created_at::text)::text
      FROM public.audit_log l WHERE l.session_title = 'ASK 497: ask_aar_snapshots_check created (read-only check)' AND l.id > b497 ORDER BY l.id;
  END IF;
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
